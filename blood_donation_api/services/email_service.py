"""Gmail SMTP email sending and templates."""
import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Any

from dotenv import load_dotenv

load_dotenv()

GMAIL_USER = os.getenv("GMAIL_USER", "")
GMAIL_APP_PASSWORD = os.getenv("GMAIL_APP_PASSWORD", "")
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")


def _send_email(to: str, subject: str, html_body: str) -> bool:
    """Send a single HTML email via Gmail SMTP."""
    if not GMAIL_USER or not GMAIL_APP_PASSWORD:
        return False
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = GMAIL_USER
    msg["To"] = to
    msg.attach(MIMEText(html_body, "html"))
    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(GMAIL_USER, GMAIL_APP_PASSWORD)
            server.sendmail(GMAIL_USER, to, msg.as_string())
        return True
    except Exception:
        return False


def send_donor_notification_email(
    donor_email: str,
    donor_name: str,
    request: dict[str, Any],
) -> bool:
    """Subject: Blood Needed Nearby — [blood_group] at [hospital]. HTML with details and CTA."""
    subject = f"Blood Needed Nearby — {request.get('blood_group', '')} at {request.get('hospital', '')}"
    dist = request.get("distance_km", "")
    maps_link = ""
    loc = request.get("location") or {}
    if loc.get("lat") is not None and loc.get("lng") is not None:
        maps_link = f"https://maps.google.com/?q={loc['lat']},{loc['lng']}"
    request_url = f"{FRONTEND_URL}/request/{request.get('id', '')}"
    html = f"""
    <html><body style="font-family: sans-serif;">
    <p>Hi {donor_name},</p>
    <p>A patient needs <strong>{request.get('blood_group', '')}</strong> blood.</p>
    <ul>
        <li><strong>Hospital:</strong> {request.get('hospital', '')}, {request.get('city', '')}</li>
        <li><strong>Urgency:</strong> {request.get('urgency', 'normal')}</li>
        <li><strong>Contact:</strong> {request.get('contact', '')}</li>
        <li><strong>Distance:</strong> ~{dist} km from you</li>
    </ul>
    <p><a href="{maps_link}">View on Google Maps</a></p>
    <p><a href="{request_url}" style="background:#c00;color:#fff;padding:10px 20px;text-decoration:none;border-radius:6px;">I Can Help</a></p>
    </body></html>
    """
    return _send_email(donor_email, subject, html)


def send_sos_email(
    donor_email: str,
    donor_name: str,
    request: dict[str, Any],
) -> bool:
    """Subject: EMERGENCY: [blood_group] needed NOW — [city]. Urgent-styled HTML."""
    subject = f"EMERGENCY: {request.get('blood_group', '')} needed NOW — {request.get('city', '')}"
    loc = request.get("location") or {}
    maps_link = f"https://maps.google.com/?q={loc.get('lat', '')},{loc.get('lng', '')}" if loc.get("lat") is not None else "#"
    request_url = f"{FRONTEND_URL}/request/{request.get('id', '')}"
    html = f"""
    <html><body style="font-family: sans-serif;">
    <p style="color: #c00; font-weight: bold;">URGENT — Blood needed immediately</p>
    <p>Hi {donor_name},</p>
    <p><strong>Blood group needed: {request.get('blood_group', '')}</strong></p>
    <ul>
        <li><strong>City:</strong> {request.get('city', '')}</li>
        <li><strong>Contact:</strong> {request.get('contact', '')}</li>
    </ul>
    <p><a href="{maps_link}">View on Google Maps</a></p>
    <p><a href="{request_url}" style="background:#c00;color:#fff;padding:10px 20px;text-decoration:none;border-radius:6px;">I Can Help NOW</a></p>
    </body></html>
    """
    return _send_email(donor_email, subject, html)


def send_admin_sos_alert(request: dict[str, Any]) -> bool:
    """Send full SOS request details to ADMIN_EMAIL."""
    if not ADMIN_EMAIL:
        return False
    subject = f"SOS Blood Request — {request.get('blood_group', '')} in {request.get('city', '')}"
    html = f"""
    <html><body style="font-family: sans-serif;">
    <p><strong>SOS Blood Request</strong></p>
    <ul>
        <li>Blood group: {request.get('blood_group', '')}</li>
        <li>City: {request.get('city', '')}</li>
        <li>Contact: {request.get('contact', '')}</li>
        <li>Requester email: {request.get('requester_email', '')}</li>
    </ul>
    </body></html>
    """
    return _send_email(ADMIN_EMAIL, subject, html)


async def notify_donors_background(
    request_id: str,
    request: dict[str, Any],
    donors: list[dict[str, Any]],
    is_sos: bool,
) -> None:
    """Background task: send appropriate email to each donor. Does not update Firestore."""
    req = {**request, "id": request_id}
    for d in donors:
        email = d.get("email")
        name = d.get("name", "Donor")
        if not email:
            continue
        req_with_dist = {**req, "distance_km": d.get("distance_km")}
        if is_sos:
            send_sos_email(email, name, req_with_dist)
        else:
            send_donor_notification_email(email, name, req_with_dist)
