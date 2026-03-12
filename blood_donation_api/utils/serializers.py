"""Firestore / response serialization helpers."""
from datetime import datetime, timezone


def firestore_ts_to_iso(ts) -> str:
    """Convert Firestore Timestamp or datetime to ISO string."""
    if ts is None:
        return ""
    if hasattr(ts, "timestamp"):
        return datetime.fromtimestamp(ts.timestamp(), tz=timezone.utc).isoformat()
    if hasattr(ts, "isoformat"):
        return ts.isoformat()
    return str(ts)
