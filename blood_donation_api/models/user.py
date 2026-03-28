"""User Pydantic models."""
from pydantic import BaseModel, Field


class UserCreate(BaseModel):
    """Payload for registration."""

    firebase_id_token: str = Field(..., description="Firebase ID token from client")
    name: str = Field(..., min_length=1)
    phone: str = Field(..., min_length=1)
    blood_group: str | None = None


class UserResponse(BaseModel):
    """User profile returned by API."""

    uid: str
    name: str
    email: str
    phone: str
    blood_group: str | None = None
    created_at: str

    model_config = {"from_attributes": True}
