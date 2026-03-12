"""Donor endpoints: register, nearby, availability, profile, availability toggle."""
from datetime import date, datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query

from firebase_config import get_db
from models.donor import (
    DonorCreate,
    DonorNearbyResponse,
    DonorResponse,
    LocationSchema,
)
from services.geo_service import get_donors_within_radius
from utils.auth_middleware import get_current_user
from utils.serializers import firestore_ts_to_iso

router = APIRouter(prefix="/api/donors", tags=["donors"])


def _mask_name(name: str) -> str:
    """First name + last initial, e.g. 'John Doe' -> 'John D.'"""
    parts = (name or "").strip().split()
    if not parts:
        return "Donor"
    if len(parts) == 1:
        return parts[0]
    return f"{parts[0]} {parts[-1][0]}."


@router.post("/register", response_model=DonorResponse)
async def register_donor(body: DonorCreate, current_user: dict = Depends(get_current_user)):
    """Upsert donor profile for current user. Merges with user name/email/phone."""
    uid = current_user.get("uid")
    db = get_db()
    user_doc = db.collection("users").document(uid).get()
    user_data = user_doc.to_dict() if user_doc.exists else {}
    name = user_data.get("name", current_user.get("name", ""))
    email = user_data.get("email", current_user.get("email", ""))
    phone = user_data.get("phone", "")
    now = datetime.now(timezone.utc)
    donor_data = {
        "uid": uid,
        "name": name,
        "email": email,
        "phone": phone,
        "blood_group": body.blood_group,
        "city": body.city,
        "location": {"lat": body.location.lat, "lng": body.location.lng},
        "available": body.available,
        "last_donated": body.last_donated.isoformat() if body.last_donated else None,
        "fcm_token": body.fcm_token,
        "created_at": now,
        "updated_at": now,
    }
    db.collection("donors").document(uid).set(donor_data, merge=True)
    doc = db.collection("donors").document(uid).get()
    data = doc.to_dict()
    return DonorResponse(
        uid=data.get("uid", uid),
        name=data.get("name", name),
        blood_group=data.get("blood_group", body.blood_group),
        city=data.get("city", body.city),
        location=LocationSchema(**data.get("location", {"lat": 0, "lng": 0})),
        available=data.get("available", True),
        last_donated=date.fromisoformat(data["last_donated"]) if data.get("last_donated") else None,
        created_at=firestore_ts_to_iso(data.get("created_at")),
        updated_at=firestore_ts_to_iso(data.get("updated_at")),
    )


@router.get("/nearby", response_model=list[DonorNearbyResponse])
async def nearby_donors(
    lat: float = Query(...),
    lng: float = Query(...),
    blood_group: str | None = Query(None),
    radius: float = Query(5, ge=0.1, le=50),
):
    """List available donors within radius (km), optionally by blood group. Masked names."""
    donors = await get_donors_within_radius(lat, lng, radius, blood_group)
    out = []
    for d in donors:
        updated = d.get("updated_at")
        out.append(
            DonorNearbyResponse(
                masked_name=_mask_name(d.get("name", "")),
                blood_group=d.get("blood_group", ""),
                distance_km=d.get("distance_km", 0),
                last_active=firestore_ts_to_iso(updated) if updated else "",
                available=d.get("available", True),
            )
        )
    return out


@router.get("/blood-availability")
async def blood_availability():
    """Aggregate count of available donors by blood_group."""
    db = get_db()
    docs = db.collection("donors").where("available", "==", True).stream()
    counts = {}
    for doc in docs:
        bg = doc.to_dict().get("blood_group")
        if bg:
            counts[bg] = counts.get(bg, 0) + 1
    return counts


@router.get("/{uid}")
async def get_donor(uid: str):
    """Public donor profile (masked name, no email/phone)."""
    db = get_db()
    doc = db.collection("donors").document(uid).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Donor not found")
    data = doc.to_dict()
    loc = data.get("location") or {}
    return {
        "uid": uid,
        "masked_name": _mask_name(data.get("name", "")),
        "blood_group": data.get("blood_group", ""),
        "city": data.get("city", ""),
        "available": data.get("available", True),
    }


@router.put("/availability")
async def update_availability(
    body: dict,
    current_user: dict = Depends(get_current_user),
):
    """Update current donor's available flag."""
    uid = current_user.get("uid")
    available = body.get("available")
    if available is None:
        raise HTTPException(status_code=400, detail="available required")
    db = get_db()
    ref = db.collection("donors").document(uid)
    ref.update({"available": available, "updated_at": datetime.now(timezone.utc)})
    return {"ok": True}
