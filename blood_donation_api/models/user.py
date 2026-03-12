"""User Pydantic models."""
from pydantic import BaseModel, Field


class UserCreate(BaseModel):
    """Payload for registration."""

    firebase_id_token: str = Field(..., description="Firebase ID token from client")
    name: str = Field(..., min_length=1)
    phone: str = Field(..., min_length=1)


class UserResponse(BaseModel):
    """User profile returned by API."""

    uid: str
    name: str
    email: str
    phone: str
    created_at: str

    model_config = {"from_attributes": True}
