"""FastAPI app for Blood Donation & SOS API."""
import os
from datetime import datetime, timezone

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from firebase_config import get_db
from routers import auth, donors, notifications, requests
from utils.rate_limiter import limiter

load_dotenv()

app = FastAPI(title="Blood Donation & SOS API", version="1.0.0")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


# CORS: allow FRONTEND_URL and localhost
_frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
_origins = [
    _frontend_url,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(donors.router)
app.include_router(requests.router)
app.include_router(notifications.router)


@app.on_event("startup")
async def startup():
    """Initialize Firebase on startup. If credentials are missing, server still runs (auth/Firestore will fail until fixed)."""
    try:
        get_db()
    except (ValueError, FileNotFoundError) as e:
        import logging
        logging.warning("Firebase not initialized: %s. Add .env and firebase-service-account.json for auth/Firestore.", e)


@app.get("/health")
async def health():
    """Health check."""
    return {"status": "ok", "timestamp": datetime.now(timezone.utc).isoformat()}


@app.get("/api/stats")
async def stats():
    """Aggregate stats: total_donors, total_requests, lives_saved (fulfilled count)."""
    db = get_db()
    donors_snap = db.collection("donors").stream()
    total_donors = sum(1 for _ in donors_snap)
    requests_snap = db.collection("blood_requests").stream()
    total_requests = sum(1 for _ in requests_snap)
    fulfilled_snap = db.collection("blood_requests").where("status", "==", "fulfilled").stream()
    lives_saved = sum(1 for _ in fulfilled_snap)
    return {
        "total_donors": total_donors,
        "total_requests": total_requests,
        "lives_saved": lives_saved,
    }


@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc: HTTPException):
    """Consistent error format for HTTPException."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.detail if isinstance(exc.detail, str) else "Error",
            "detail": str(exc.detail),
            "status": exc.status_code,
        },
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request, exc: Exception):
    """Consistent error format for unhandled exceptions."""
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "detail": str(exc),
            "status": 500,
        },
    )
