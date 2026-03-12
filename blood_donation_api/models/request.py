"""Blood request Pydantic models."""
from typing import Literal

from pydantic import BaseModel, Field

from models.donor import LocationSchema

BLOOD_GROUPS = Literal["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]
UrgencyLiteral = Literal["critical", "urgent", "normal"]
StatusLiteral = Literal["active", "fulfilled", "expired"]


class BloodRequestCreate(BaseModel):
    """Payload for creating a blood request."""

    patient_name: str = Field(..., min_length=1)
    blood_group: BLOOD_GROUPS
    hospital: str = Field(..., min_length=1)
    city: str = Field(..., min_length=1)
    location: LocationSchema
    contact: str = Field(..., min_length=1)
    urgency: UrgencyLiteral = "normal"
    requester_email: str = Field(..., min_length=1)
    notes: str | None = None


class SOSRequest(BaseModel):
    """Payload for SOS request."""

    blood_group: BLOOD_GROUPS
    location: LocationSchema
    contact: str = Field(..., min_length=1)
    requester_email: str | None = None


class RequestResponse(BaseModel):
    """Blood request as returned by API (no requester_email)."""

    id: str
    patient_name: str
    blood_group: str
    hospital: str
    city: str
    location: LocationSchema
    contact: str
    urgency: str
    status: str
    notified_count: int
    is_sos: bool
    created_at: str

    model_config = {"from_attributes": True}
