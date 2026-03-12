"""Geolocation and distance helpers using Haversine + Firestore."""
import math
from typing import Any

from firebase_config import get_db


def haversine_distance(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """Return distance in kilometers between two points (Haversine formula)."""
    R = 6371  # Earth radius in km
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lng2 - lng1)
    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c


async def get_donors_within_radius(
    lat: float,
    lng: float,
    radius_km: float,
    blood_group: str | None = None,
) -> list[dict[str, Any]]:
    """Fetch donors from Firestore with available=true, filter by distance and optional blood_group, sort by distance."""
    db = get_db()
    ref = db.collection("donors").where("available", "==", True)
    docs = ref.stream()
    result = []
    for doc in docs:
        data = doc.to_dict()
        data["uid"] = doc.id
        loc = data.get("location")
        if not loc or "lat" not in loc or "lng" not in loc:
            continue
        if blood_group is not None and data.get("blood_group") != blood_group:
            continue
        dist = haversine_distance(lat, lng, loc["lat"], loc["lng"])
        if dist <= radius_km:
            data["distance_km"] = round(dist, 2)
            result.append(data)
    result.sort(key=lambda x: x["distance_km"])
    return result


async def get_requests_within_radius(
    lat: float,
    lng: float,
    radius_km: float,
) -> list[dict[str, Any]]:
    """Fetch active blood_requests within radius, sort by urgency then created_at."""
    db = get_db()
    ref = db.collection("blood_requests").where("status", "==", "active")
    docs = ref.stream()
    urgency_order = {"critical": 0, "urgent": 1, "normal": 2}
    result = []
    for doc in docs:
        data = doc.to_dict()
        data["id"] = doc.id
        loc = data.get("location")
        if not loc or "lat" not in loc or "lng" not in loc:
            continue
        dist = haversine_distance(lat, lng, loc["lat"], loc["lng"])
        if dist <= radius_km:
            data["distance_km"] = round(dist, 2)
            result.append(data)
    result.sort(
        key=lambda x: (
            urgency_order.get(x.get("urgency"), 3),
            x.get("created_at") and getattr(x["created_at"], "timestamp", 0) or 0,
        )
    )
    return result
