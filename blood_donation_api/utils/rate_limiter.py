"""SlowAPI rate limiting setup."""
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

# Limit strings for use in route decorators
RATE_LIMIT_SOS = "5/hour"
RATE_LIMIT_REQUEST_CREATE = "10/hour"
RATE_LIMIT_GENERAL = "100/minute"
