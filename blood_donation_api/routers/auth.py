"""Auth endpoints: register, login, me."""
from datetime import datetime, timezone

import firebase_admin.auth
from fastapi import APIRouter, Depends, HTTPException

from firebase_config import get_db
from models.user import UserCreate, UserResponse
from utils.auth_middleware import get_current_user
from utils.serializers import firestore_ts_to_iso

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=UserResponse)
async def register(body: UserCreate):
    """Verify Firebase ID token, create or update user in Firestore."""
    try:
        decoded = firebase_admin.auth.verify_id_token(body.firebase_id_token)
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))
    uid = decoded.get("uid")
    email = decoded.get("email") or ""
    if not uid:
        raise HTTPException(status_code=401, detail="Invalid token")
    db = get_db()
    user_ref = db.collection("users").document(uid)
    user_data = {
        "uid": uid,
        "email": email,
        "name": body.name,
        "phone": body.phone,
        "blood_group": body.blood_group,
        "created_at": datetime.now(timezone.utc),
    }
    user_ref.set(user_data, merge=True)
    doc = user_ref.get()
    data = doc.to_dict()
    return UserResponse(
        uid=data.get("uid", uid),
        name=data.get("name", body.name),
        email=data.get("email", email),
        phone=data.get("phone", body.phone),
        blood_group=data.get("blood_group", body.blood_group),
        created_at=firestore_ts_to_iso(data.get("created_at")),
    )


@router.post("/login", response_model=UserResponse)
async def login(body: dict):
    """Verify token and return user profile."""
    token = body.get("firebase_id_token")
    if not token:
        raise HTTPException(status_code=400, detail="firebase_id_token required")
    try:
        decoded = firebase_admin.auth.verify_id_token(token)
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))
    uid = decoded.get("uid")
    if not uid:
        raise HTTPException(status_code=401, detail="Invalid token")
    db = get_db()
    doc = db.collection("users").document(uid).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="User not found. Register first.")
    data = doc.to_dict()
    return UserResponse(
        uid=data.get("uid", uid),
        name=data.get("name", ""),
        email=data.get("email", ""),
        phone=data.get("phone", ""),
        blood_group=data.get("blood_group", ""),
        created_at=firestore_ts_to_iso(data.get("created_at")),
    )


@router.get("/me", response_model=UserResponse)
async def me(current_user: dict = Depends(get_current_user)):
    """Return current user profile."""
    uid = current_user.get("uid")
    db = get_db()
    doc = db.collection("users").document(uid).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="User not found")
    data = doc.to_dict()
    return UserResponse(
        uid=data.get("uid", uid),
        name=data.get("name", ""),
        email=data.get("email", ""),
        phone=data.get("phone", ""),
        blood_group=data.get("blood_group", ""),
        created_at=firestore_ts_to_iso(data.get("created_at")),
    )
