#!/usr/bin/env bash
# Run the Blood Donation API from project root.
# Usage: ./run-api.sh   or   bash run-api.sh
cd "$(dirname "$0")/blood_donation_api" && python3 -m uvicorn main:app --reload --port 8000
