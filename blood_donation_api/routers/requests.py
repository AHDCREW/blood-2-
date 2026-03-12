"""Blood request endpoints: create, SOS, nearby, get, fulfill."""
from datetime import datetime, timezone

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query, Request

from firebase_config import get_db
from models.donor import LocationSchema
from models.request import (
    BloodRequestCreate,
    RequestResponse,
    SOSRequest,
)
from services.email_service import notify_donors_background, send_admin_sos_alert
from services.fcm_service import send_bulk_push
from services.geo_service import get_donors_within_radius, get_requests_within_radius
from utils.auth_middleware import get_current_user
from utils.rate_limiter import RATE_LIMIT_SOS, RATE_LIMIT_REQUEST_CREATE, limiter
from utils.serializers import firestore_ts_to_iso

router = APIRouter(prefix="/api/requests", tags=["requests"])


def _request_to_dict(req: BloodRequestCreate | SOSRequest, is_sos: bool) -> dict:
    """Build Firestore request dict from create/sos body."""
    if is_sos:
        return {
            "patient_name": "",
            "blood_group": req.blood_group,
            "hospital": "",
            "city": "",
            "location": {"lat": req.location.lat, "lng": req.location.lng},
            "contact": req.contact,
            "urgency": "critical",
            "requester_email": req.requester_email or "",
            "status": "active",
            "notified_donor_uids": [],
            "notified_count": 0,
            "is_sos": True,
        }
    return {
        "patient_name": req.patient_name,
        "blood_group": req.blood_group,
        "hospital": req.hospital,
        "city": req.city,
        "location": {"lat": req.location.lat, "lng": req.location.lng},
        "contact": req.contact,
        "urgency": req.urgency,
        "requester_email": req.requester_email,
        "notes": getattr(req, "notes", None),
        "status": "active",
        "notified_donor_uids": [],
        "notified_count": 0,
        "is_sos": False,
    }


def _doc_to_request_response(doc) -> RequestResponse:
    data = doc.to_dict()
    data["id"] = doc.id
    loc = data.get("location") or {}
    return RequestResponse(
        id=data.get("id", doc.id),
        patient_name=data.get("patient_name", ""),
        blood_group=data.get("blood_group", ""),
        hospital=data.get("hospital", ""),
        city=data.get("city", ""),
        location=LocationSchema(**loc) if loc else LocationSchema(lat=0, lng=0),
        contact=data.get("contact", ""),
        urgency=data.get("urgency", "normal"),
        status=data.get("status", "active"),
        notified_count=data.get("notified_count", 0),
        is_sos=data.get("is_sos", False),
        created_at=firestore_ts_to_iso(data.get("created_at")),
    )


async def _notify_and_update(
    request_id: str,
    request_dict: dict,
    donors: list[dict],
    is_sos: bool,
) -> None:
    """Background: send emails, FCM, create notification docs, update request."""
    db = get_db()
    uids = []
    fcm_tokens = []
    for d in donors:
        uid = d.get("uid")
        if uid:
            uids.append(uid)
        if d.get("fcm_token"):
            fcm_tokens.append(d["fcm_token"])

    await notify_donors_background(request_id, request_dict, donors, is_sos)

    title = "SOS: Blood needed NOW" if is_sos else "Blood needed nearby"
    body = f"{request_dict.get('blood_group', '')} at {request_dict.get('hospital', request_dict.get('city', ''))}"
    await send_bulk_push(
        fcm_tokens,
        title,
        body,
        data={"request_id": request_id, "type": "sos" if is_sos else "blood_request"},
    )

    for uid in uids:
        db.collection("notifications").add(
            {
                "recipient_uid": uid,
                "type": "sos" if is_sos else "blood_request",
                "title": title,
                "message": body,
                "request_id": request_id,
                "read": False,
                "created_at": datetime.now(timezone.utc),
            }
        )

    db.collection("blood_requests").document(request_id).update(
        {"notified_donor_uids": uids, "notified_count": len(uids)}
    )


@router.post("/create")
@limiter.limit(RATE_LIMIT_REQUEST_CREATE)
async def create_request(
    request: Request,
    body: BloodRequestCreate,
    background_tasks: BackgroundTasks,
):
    """Create blood request, notify donors within 5 km, return request_id and notified_count."""
    db = get_db()
    request_dict = _request_to_dict(body, is_sos=False)
    request_dict["created_at"] = datetime.now(timezone.utc)
    ref = db.collection("blood_requests").document()
    request_id = ref.id
    ref.set(request_dict)

    donors = await get_donors_within_radius(
        body.location.lat, body.location.lng, 5.0, body.blood_group
    )
    request_dict["id"] = request_id
    background_tasks.add_task(_notify_and_update, request_id, request_dict, donors, False)

    return {
        "request_id": request_id,
        "notified_count": len(donors),
        "message": f"Request created. {len(donors)} donor(s) notified.",
    }


@router.post("/sos")
@limiter.limit(RATE_LIMIT_SOS)
async def create_sos(
    request: Request,
    body: SOSRequest,
    background_tasks: BackgroundTasks,
):
    """Create SOS request (rate limited), 10 km radius, notify donors and admin."""
    db = get_db()
    request_dict = _request_to_dict(body, is_sos=True)
    request_dict["created_at"] = datetime.now(timezone.utc)
    request_dict["requester_email"] = body.requester_email or ""
    ref = db.collection("blood_requests").document()
    request_id = ref.id
    ref.set(request_dict)

    donors = await get_donors_within_radius(
        body.location.lat, body.location.lng, 10.0, body.blood_group
    )
    request_dict["id"] = request_id
    send_admin_sos_alert(request_dict)
    background_tasks.add_task(_notify_and_update, request_id, request_dict, donors, True)

    return {
        "request_id": request_id,
        "notified_count": len(donors),
        "message": f"SOS created. {len(donors)} donor(s) notified.",
    }


@router.get("/recent", response_model=list[RequestResponse])
async def recent_requests(
    limit: int = Query(20, ge=1, le=50),
):
    """List most recent active blood requests, sorted by created_at desc (no auth required)."""
    from firebase_admin import firestore

    db = get_db()
    docs = (
        db.collection("blood_requests")
        .where("status", "==", "active")
        .order_by("created_at", direction=firestore.Query.DESCENDING)
        .limit(limit)
        .stream()
    )
    return [_doc_to_request_response(doc) for doc in docs]


@router.get("/nearby", response_model=list[RequestResponse])
async def nearby_requests(
    lat: float = Query(...),
    lng: float = Query(...),
    radius: float = Query(10, ge=0.1, le=100),
):
    """List active blood requests within radius (km), sorted by urgency then created_at."""
    requests_list = await get_requests_within_radius(lat, lng, radius)
    out = []
    for r in requests_list:
        doc_id = r.get("id")
        if not doc_id:
            continue
        class Doc:
            def __init__(self, id, data):
                self.id = id
                self._data = data
            def to_dict(self):
                return self._data
        out.append(_doc_to_request_response(Doc(doc_id, r)))
    return out


@router.get("/{id}", response_model=RequestResponse)
async def get_request(id: str):
    """Get single request by id (requester_email not exposed)."""
    db = get_db()
    doc = db.collection("blood_requests").document(id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Request not found")
    return _doc_to_request_response(doc)


@router.put("/{id}/fulfill")
async def fulfill_request(
    id: str,
    current_user: dict = Depends(get_current_user),
):
    """Set request status to fulfilled. Allowed if current user is notified donor or requester."""
    uid = current_user.get("uid")
    db = get_db()
    ref = db.collection("blood_requests").document(id)
    doc = ref.get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Request not found")
    data = doc.to_dict()
    notified = data.get("notified_donor_uids") or []
    requester_email = data.get("requester_email", "")
    # Check if user is the requester (we don't have requester_uid, only email - so we allow any authenticated user who was notified, or we could check user email)
    user_email = current_user.get("email", "")
    allowed = uid in notified or user_email == requester_email
    if not allowed:
        raise HTTPException(status_code=403, detail="Not authorized to fulfill this request")
    ref.update({"status": "fulfilled"})
    return {"ok": True}