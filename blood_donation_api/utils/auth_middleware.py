"""Firebase ID token verification dependencies."""
import firebase_admin.auth
from fastapi import Header, HTTPException


async def get_current_user(authorization: str = Header(..., description="Bearer <firebase_id_token>")):
    """Verify Firebase ID token and return decoded claims. Raises 401 if invalid or missing."""
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")
    token = authorization[7:].strip()
    if not token:
        raise HTTPException(status_code=401, detail="Missing token")
    try:
        decoded = firebase_admin.auth.verify_id_token(token)
        return decoded
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")


async def get_optional_user(
    authorization: str | None = Header(None, description="Bearer <firebase_id_token>"),
):
    """Same as get_current_user but returns None when no token provided."""
    if not authorization or not authorization.startswith("Bearer "):
        return None
    token = authorization[7:].strip()
    if not token:
        return None
    try:
        decoded = firebase_admin.auth.verify_id_token(token)
        return decoded
    except Exception:
        return None
