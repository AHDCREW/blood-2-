"""Notification endpoints: list, mark read, unread count, FCM token."""
from fastapi import APIRouter, Depends, HTTPException


from firebase_config import get_db
from models.notification import FCMTokenUpdate, NotificationResponse
from utils.auth_middleware import get_current_user
from utils.serializers import firestore_ts_to_iso

router = APIRouter(prefix="/api/notifications", tags=["notifications"])


@router.get("", response_model=list[NotificationResponse])
async def list_notifications(current_user: dict = Depends(get_current_user)):
    """List notifications for current user, newest first, limit 20."""
    uid = current_user.get("uid")
    db = get_db()
    docs = (
        db.collection("notifications")
        .where("recipient_uid", "==", uid)
        .order_by("created_at", direction="DESCENDING")
        .limit(20)
        .stream()
    )
    out = []
    for doc in docs:
        data = doc.to_dict()
        data["id"] = doc.id
        out.append(
            NotificationResponse(
                id=data.get("id", doc.id),
                type=data.get("type", ""),
                title=data.get("title", ""),
                message=data.get("message", ""),
                request_id=data.get("request_id"),
                read=data.get("read", False),
                created_at=firestore_ts_to_iso(data.get("created_at")),
            )
        )
    return out


@router.put("/{id}/read")
async def mark_read(id: str, current_user: dict = Depends(get_current_user)):
    """Mark notification as read. Only for current user's notifications."""
    uid = current_user.get("uid")
    db = get_db()
    ref = db.collection("notifications").document(id)
    doc = ref.get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Notification not found")
    if doc.to_dict().get("recipient_uid") != uid:
        raise HTTPException(status_code=403, detail="Not your notification")
    ref.update({"read": True})
    return {"ok": True}


@router.get("/unread-count")
async def unread_count(current_user: dict = Depends(get_current_user)):
    """Return count of unread notifications for current user."""
    uid = current_user.get("uid")
    db = get_db()
    docs = (
        db.collection("notifications")
        .where("recipient_uid", "==", uid)
        .where("read", "==", False)
        .stream()
    )
    count = sum(1 for _ in docs)
    return {"count": count}


@router.post("/fcm-token")
async def update_fcm_token(
    body: FCMTokenUpdate,
    current_user: dict = Depends(get_current_user),
):
    """Update FCM token for current user (donors/{uid}.fcm_token)."""
    uid = current_user.get("uid")
    db = get_db()
    db.collection("donors").document(uid).update({"fcm_token": body.fcm_token})
    return {"ok": True}
