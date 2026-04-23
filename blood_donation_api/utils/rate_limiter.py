"""SlowAPI rate limiting setup."""
from starlette.requests import Request as StarletteRequest
from slowapi import Limiter
from slowapi.util import get_remote_address


def _key_func(request: StarletteRequest) -> str:
    """Skip rate-limiting for CORS preflight (OPTIONS) requests."""
    if request.method == "OPTIONS":
        return None  # slowapi skips limiting when key is None
    return get_remote_address(request)


limiter = Limiter(key_func=_key_func)

# Limit strings for use in route decorators
RATE_LIMIT_SOS = "5/hour"
RATE_LIMIT_REQUEST_CREATE = "10/hour"
RATE_LIMIT_GENERAL = "100/minute"
