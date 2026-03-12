"""Firebase Admin SDK initialization and Firestore client."""
import os

import firebase_admin
from dotenv import load_dotenv
from firebase_admin import credentials, firestore

# Load .env from this package's directory so it works regardless of cwd
_this_dir = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(_this_dir, ".env"))

_db = None


def get_db():
    """Return Firestore client. Initializes Firebase app if needed."""
    global _db
    if _db is not None:
        return _db
    cred_path = os.getenv("FIREBASE_CREDENTIALS_PATH")
    if not cred_path:
        raise ValueError("FIREBASE_CREDENTIALS_PATH environment variable is required")
    # Resolve relative paths against this package's directory (blood_donation_api)
    if not os.path.isabs(cred_path):
        cred_path = os.path.join(_this_dir, cred_path.lstrip("./"))
    if not firebase_admin._apps:
        cred = credentials.Certificate(cred_path)
        firebase_admin.initialize_app(cred)
    _db = firestore.client()
    return _db


