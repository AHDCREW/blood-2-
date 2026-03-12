"""Firebase Cloud Messaging push notifications."""
import logging
import os
from typing import Any

import firebase_admin.messaging
from dotenv import load_dotenv

load_dotenv()

FCM_ENABLED = os.getenv("FCM_ENABLED", "true").lower() in ("true", "1", "yes")
logger = logging.getLogger(__name__)


async def send_push_notification(
    fcm_token: str,
    title: str,
    body: str,
    data: dict[str, str] | None = None,
) -> bool:
    """Send a single FCM notification. Returns False if disabled or invalid."""
    if not FCM_ENABLED or not fcm_token or not fcm_token.strip():
        return False
    try:
        message = firebase_admin.messaging.Message(
            notification=firebase_admin.messaging.Notification(title=title, body=body),
            data=data or {},
            token=fcm_token,
        )
        firebase_admin.messaging.send(message)
        return True
    except Exception as e:
        logger.warning("FCM send failed: %s", e)
        return False


async def send_bulk_push(
    tokens: list[str],
    title: str,
    body: str,
    data: dict[str, str] | None = None,
) -> None:
    """Send FCM to up to 500 tokens. Log failed tokens."""
    if not FCM_ENABLED or not tokens:
        return
    valid = [t for t in tokens if t and t.strip()]
    if not valid:
        return
    # Batch of 500 max
    for i in range(0, len(valid), 500):
        batch = valid[i : i + 500]
        try:
            msg = firebase_admin.messaging.MulticastMessage(
                notification=firebase_admin.messaging.Notification(title=title, body=body),
                data=data or {},
                tokens=batch,
            )
            resp = firebase_admin.messaging.send_each_for_multicast(msg)
            if resp.failure_count:
                for idx, send_resp in enumerate(resp.responses):
                    if not send_resp.success:
                        logger.warning("FCM failed for token index %s: %s", idx, send_resp.exception)
        except Exception as e:
            logger.warning("FCM bulk send failed: %s", e)
