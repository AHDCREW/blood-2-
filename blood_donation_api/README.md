# Blood Donation & SOS API

FastAPI backend for the Blood Donation and Emergency SOS platform. Handles donor registration, blood requests, geolocation-based matching, email notifications, and Firebase push notifications — all on free tiers.

## Python version

Use **Python 3.11 or 3.12**. Python 3.14 is not yet supported: `pydantic-core` (used by Pydantic) does not ship wheels for 3.14 and will fail to build.

**Option A — Homebrew (macOS):**

```bash
brew install python@3.12
```

Then run the app with 3.12 (use the path Homebrew gives you; Apple Silicon is often `/opt/homebrew`, Intel is `/usr/local`):

```bash
cd blood_donation_api
$(brew --prefix python@3.12)/bin/pip3 install -r requirements.txt
$(brew --prefix python@3.12)/bin/python3 -m uvicorn main:app --reload --port 8000
```

Or if `python3.12` is on your PATH after install:

```bash
cd blood_donation_api
pip3.12 install -r requirements.txt
python3.12 -m uvicorn main:app --reload --port 8000
```

**Option B — Installer from python.org:**

1. Go to [python.org/downloads](https://www.python.org/downloads/) and download **Python 3.12** for macOS.
2. Run the installer, then use the same shell commands as in "Run the API" but with `python3.12` and `pip3.12` (e.g. `pip3.12 install -r requirements.txt`, `python3.12 -m uvicorn main:app --reload --port 8000`).

## Tech Stack

- Python 3.11 or 3.12
- FastAPI + Uvicorn
- Firebase Admin SDK (Firestore + Auth verification)
- Gmail SMTP via smtplib (free, no third-party)
- Firebase Cloud Messaging for push notifications (free tier)
- Haversine for distance calculation
- SlowAPI for rate limiting
- Pydantic v2 for models
- python-dotenv for config

## Setup

### 1. Firebase Project (free tier)

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com).
2. Enable **Firestore** in **Native mode**.
3. Enable **Firebase Authentication** (Email/Password and Google sign-in).
4. Go to Project Settings → Service accounts → Generate new private key. Download the JSON.
5. Save the file as `firebase-service-account.json` in this directory (or set `FIREBASE_CREDENTIALS_PATH` to its path).
6. Enable **Firebase Cloud Messaging** (no extra config needed for basic use).

### 2. Gmail App Password

1. Enable **2-Step Verification** on your Google account.
2. Go to [Google Account → Security → App passwords](https://myaccount.google.com/apppasswords).
3. Generate a password for "Mail" (or "Other" and name it).
4. Use this 16-character password as `GMAIL_APP_PASSWORD` in `.env`.

### 3. Run the API

```bash
cd blood_donation_api
pip3 install -r requirements.txt
cp .env.example .env
```
Then edit `.env` and set all variables (Firebase path, Gmail, ADMIN_EMAIL, FRONTEND_URL, etc.).

```bash
uvicorn main:app --reload --port 8000
```

On some systems use `python3 -m pip install -r requirements.txt` if `pip3` is not found.

Or from the project root:

```bash
pip3 install -r blood_donation_api/requirements.txt
cd blood_donation_api && uvicorn main:app --reload --port 8000
```

API base URL: `http://localhost:8000`. Docs: `http://localhost:8000/docs`.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `FIREBASE_CREDENTIALS_PATH` | Path to Firebase service account JSON (e.g. `./firebase-service-account.json`) |
| `GMAIL_USER` | Gmail address used to send emails |
| `GMAIL_APP_PASSWORD` | Gmail App Password (from step 2 above) |
| `ADMIN_EMAIL` | Email that receives SOS alerts |
| `FRONTEND_URL` | Frontend origin for CORS and email links (e.g. `http://localhost:5173`) |
| `FCM_ENABLED` | Set to `true` to send push notifications |
| `RATE_LIMIT_SOS` | SlowAPI limit for SOS endpoint (e.g. `5/hour`) |

## Firestore Indexes

Create these composite indexes in the Firebase Console (Firestore → Indexes) for best performance:

- **donors**: `available` (Ascending), `blood_group` (Ascending)
- **blood_requests**: `status` (Ascending), `urgency` (Ascending), `created_at` (Descending)
- **notifications**: `recipient_uid` (Ascending), `created_at` (Descending)

## Firebase Free Tier Limits

- **Firestore**: 50k reads/day, 20k writes/day, 20k deletes/day
- **FCM**: Unlimited push notifications
- **Auth**: Unlimited users

## API Overview

- **Auth** (`/api/auth`): register, login, me
- **Donors** (`/api/donors`): register, nearby, blood-availability, profile, availability
- **Requests** (`/api/requests`): create, sos, nearby, get, fulfill
- **Notifications** (`/api/notifications`): list, mark read, unread-count, fcm-token

See interactive docs at `/docs` when the server is running.

## Troubleshooting

- **`ModuleNotFoundError: No module named 'slowapi'`** — Dependencies not installed. Run `pip3 install -r requirements.txt` from the `blood_donation_api` directory.
- **`Failed building wheel for pydantic-core`** / **Python 3.14 newer than PyO3's maximum** — Use Python 3.11 or 3.12: install via Homebrew (`brew install python@3.12`) or from [python.org](https://www.python.org/downloads/), then use that Python for install and run (see "Python version" above).
- **`pip: command not found`** — Use `pip3` or `python3 -m pip install -r requirements.txt`.
