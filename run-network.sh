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
  echo "  ./run-api.sh"
  echo "  VITE_API_URL=http://<YOUR_LAN_IP>:8000 npm run dev:network"
  exit 1
fi

echo "Using LAN IP: ${LAN_IP}"
echo "Frontend: http://${LAN_IP}:5173"
echo "Backend:  http://${LAN_IP}:8000"
echo

cleanup() {
  echo
  echo "Stopping backend and frontend..."
  kill "${API_PID:-0}" "${WEB_PID:-0}" 2>/dev/null || true
  wait "${API_PID:-0}" "${WEB_PID:-0}" 2>/dev/null || true
}
trap cleanup INT TERM EXIT

# Start backend on network
(cd "$ROOT_DIR/blood_donation_api" && python3 -m uvicorn main:app --reload --host 0.0.0.0 --port 8000) &
API_PID=$!

# Start frontend on network with API URL set to LAN IP
(cd "$ROOT_DIR" && VITE_API_URL="http://${LAN_IP}:8000" npm run dev:network) &
WEB_PID=$!

echo "Backend PID:  $API_PID"
echo "Frontend PID: $WEB_PID"
echo "Press Ctrl+C to stop both."

wait "$API_PID" "$WEB_PID"
