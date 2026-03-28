from fastapi import APIRouter, Depends, HTTPException, status
from typing import Dict, Any, List
from firebase_admin import auth as firebase_auth
from firebase_config import get_db

router = APIRouter(prefix="/api/admin", tags=["admin"])

# Dummy admin dependency. In production, check token claims for 'admin: true'
def verify_admin(token: str = "dummy_token"):
    # For now, allow passthrough if secret admin token is somewhat present
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authorized config")
    return True

@router.get("/stats")
async def get_admin_stats(is_admin: bool = Depends(verify_admin)):
    """Fetch real-time comprehensive stats from Firestore for the admin dashboard"""
    db = get_db()
    
    # In a real heavy production app, you might use aggregation pipelines or cloud functions to track counters.
    donors_snap = db.collection("donors").stream()
    total_donors = 0
    blood_groups = {'A+': 0, 'A-': 0, 'B+': 0, 'B-': 0, 'O+': 0, 'O-': 0, 'AB+': 0, 'AB-': 0}
    
    for d in donors_snap:
        total_donors += 1
        bg = d.to_dict().get("bloodGroup")
        if bg in blood_groups:
            blood_groups[bg] += 1

    requests_snap = db.collection("blood_requests").stream()
    total_reqs = 0
    emergency = 0
    approved = 0

    for r in requests_snap:
        total_reqs += 1
        data = r.to_dict()
        if data.get("urgency") == "Critical":
            emergency += 1
        if data.get("status") == "approved":
            approved += 1

    return {
        "totalDonors": total_donors,
        "activeDonors": total_donors, # Assuming all registered are active for now
        "bloodRequests": total_reqs,
        "approvedRequests": approved,
        "emergencyRequests": emergency,
        "hospitalsRegistered": 0, # Stubbable collection "hospitals"
        "bloodGroupsCount": blood_groups
    }

@router.get("/donors")
async def admin_get_donors(is_admin: bool = Depends(verify_admin)):
    """Fetch all donors for the admin donors management page"""
    db = get_db()
    donors_snap = db.collection("donors").stream()
    return [d.to_dict() for d in donors_snap]

@router.get("/requests")
async def admin_get_requests(is_admin: bool = Depends(verify_admin)):
    """Fetch all requests for the admin requests management page"""
    db = get_db()
    reqs = db.collection("blood_requests").stream()
    return [r.to_dict() for r in reqs]

@router.post("/broadcast")
async def admin_broadcast_alert(payload: dict, is_admin: bool = Depends(verify_admin)):
    """Trigger an emergency broadcast (Push / SMS logic handler)"""
    # Logic to insert into an 'alerts' collection or trigger external Twilio/FCM APIs
    return {"status": "success", "message": "Broadcast sent", "data": payload}
