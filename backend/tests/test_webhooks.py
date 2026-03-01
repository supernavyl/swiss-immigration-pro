"""Tests for Stripe webhook handler."""

from __future__ import annotations

import json
from unittest.mock import AsyncMock, patch

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_webhook_rejects_missing_signature(client: AsyncClient):
    resp = await client.post("/api/webhooks/stripe", content=b"{}")
    assert resp.status_code == 400
    assert "stripe-signature" in resp.json()["detail"].lower()


@pytest.mark.asyncio
async def test_webhook_rejects_invalid_signature(client: AsyncClient):
    resp = await client.post(
        "/api/webhooks/stripe",
        content=b'{"type": "test"}',
        headers={"stripe-signature": "t=123,v1=fake"},
    )
    assert resp.status_code in (400, 500)


@pytest.mark.asyncio
async def test_abandoned_checkout_sends_recovery_email():
    """handle_checkout_expired should call send_abandoned_checkout_email."""
    from app.routers.webhooks import handle_checkout_expired

    session = {
        "customer_details": {"email": "test@example.com"},
        "metadata": {"pack_id": "advanced", "type": "subscription"},
    }

    with patch(
        "app.routers.webhooks.send_abandoned_checkout_email",
        new_callable=AsyncMock,
    ) as mock_email:
        await handle_checkout_expired(session)
        mock_email.assert_awaited_once_with("test@example.com", "Advanced Pack")


@pytest.mark.asyncio
async def test_abandoned_checkout_no_email_skips_send():
    """handle_checkout_expired should not crash when there is no customer email."""
    from app.routers.webhooks import handle_checkout_expired

    session: dict = {"customer_details": {}, "metadata": {}}

    with patch(
        "app.routers.webhooks.send_abandoned_checkout_email",
        new_callable=AsyncMock,
    ) as mock_email:
        await handle_checkout_expired(session)
        mock_email.assert_not_awaited()
