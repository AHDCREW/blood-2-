"""Notification Pydantic models."""
from typing import Literal

from pydantic import BaseModel, Field

NotificationTypeLiteral = Literal["blood_request", "sos", "system"]


class NotificationResponse(BaseModel):
    """Notification as returned by API."""

    id: str
    type: str
    title: str
    message: str
    request_id: str | None
    read: bool
    created_at: str

    model_config = {"from_attributes": True}


class FCMTokenUpdate(BaseModel):
    """Payload for updating FCM token."""

    fcm_token: str = Field(..., min_length=1)
