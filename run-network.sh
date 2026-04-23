#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT_DIR"

# Detect LAN IP on macOS (Wi-Fi first, then fallback to first non-loopback).
LAN_IP="$(ipconfig getifaddr en0 2>/dev/null || true)"
if [ -z "${LAN_IP}" ]; then
  LAN_IP="$(ipconfig getifaddr en1 2>/dev/null || true)"
fi
if [ -z "${LAN_IP}" ]; then
  LAN_IP="$(ifconfig | awk '/inet / && $2 != "127.0.0.1" {print $2; exit}')"
fi

if [ -z "${LAN_IP}" ]; then
  echo "Could not detect LAN IP."
  echo "Start manually:"
  echo "  cd blood_donation_api && python3 -m uvicorn main:app --host 0.0.0.0 --port 8000"
  echo "  npm run dev:network"
  exit 1
fi

echo "Using LAN IP: ${LAN_IP}"
echo "Frontend: http://${LAN_IP}:5173"
echo "Backend:  http://${LAN_IP}:8000 (also on localhost:8000)"
echo

# Write VITE_API_URL for vite.config.js proxy target (the proxy calls backend at this URL server-side).
# The *browser* uses relative /api/* paths, so geolocation works on plain HTTP LAN.
echo "VITE_API_URL=http://localhost:8000" > "${ROOT_DIR}/.env"
echo "Set proxy target to http://localhost:8000"

# Update CORS in the backend .env so the LAN frontend origin is accepted.
BACKEND_ENV="${ROOT_DIR}/blood_donation_api/.env"
if [ -f "$BACKEND_ENV" ]; then
  grep -v '^FRONTEND_URL=' "$BACKEND_ENV" > "${BACKEND_ENV}.tmp" && mv "${BACKEND_ENV}.tmp" "$BACKEND_ENV"
fi
echo "FRONTEND_URL=http://${LAN_IP}:5173" >> "$BACKEND_ENV"
echo "Updated FRONTEND_URL=http://${LAN_IP}:5173 in backend .env"
echo

cleanup() {
  echo
  echo "Stopping backend and frontend..."
  kill "${API_PID:-0}" "${WEB_PID:-0}" 2>/dev/null || true
  wait "${API_PID:-0}" "${WEB_PID:-0}" 2>/dev/null || true
}
trap cleanup INT TERM EXIT

# Start backend on all interfaces
(cd "$ROOT_DIR/blood_donation_api" && python3 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000) &
API_PID=$!

# Give backend 2 seconds to start
sleep 2

# Start frontend — Vite proxy handles /api/* → localhost:8000 automatically
(cd "$ROOT_DIR" && npm run dev:network) &
WEB_PID=$!

echo "Backend PID:  $API_PID"
echo "Frontend PID: $WEB_PID"
echo "Press Ctrl+C to stop both."
echo
echo "==================================="
echo "  Open on your phone:"
echo "  http://${LAN_IP}:5173"
echo "==================================="
echo

wait "$API_PID" "$WEB_PID"
