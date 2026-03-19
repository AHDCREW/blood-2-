"""Donor Pydantic models."""
from datetime import date
from typing import Literal

from pydantic import BaseModel, Field

BLOOD_GROUPS = Literal["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]


class LocationSchema(BaseModel):
    """Lat/lng location."""

    lat: float
    lng: float


class DonorCreate(BaseModel):
    """Payload for donor registration."""

    blood_group: BLOOD_GROUPS
    city: str = Field(..., min_length=1)
    location: LocationSchema
    available: bool = True
    last_donated: date | None = None
    fcm_token: str | None = None


class DonorResponse(BaseModel):
    """Donor profile (no email/phone)."""

    uid: str
    name: str
    blood_group: str
    city: str
    location: LocationSchema
    available: bool
    last_donated: date | None
    created_at: str
    updated_at: str

    model_config = {"from_attributes": True}


class DonorUpdate(BaseModel):
    """Partial update for donor."""

    available: bool | None = None
    last_donated: date | None = None


class DonorNearbyResponse(BaseModel):
    """Donor in nearby list (masked name)."""

    masked_name: str
    blood_group: str
    distance_km: float
    last_active: str
    available: bool
