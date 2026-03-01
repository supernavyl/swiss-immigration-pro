"""Tests for the payments router -- checkout sessions, product purchases."""

from __future__ import annotations

from unittest.mock import AsyncMock, patch

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_checkout_requires_auth(client: AsyncClient):
    resp = await client.post("/api/checkout", json={"packId": "immigration", "cycle": "monthly"})
    assert resp.status_code in (401, 403)


@pytest.mark.asyncio
@patch("app.routers.payments.create_checkout_session", new_callable=AsyncMock)
async def test_checkout_success(mock_stripe, client: AsyncClient, auth_headers):
    mock_stripe.return_value = {
        "checkout_url": "https://checkout.stripe.com/test_123",
        "session_id": "cs_test_123",
    }
    resp = await client.post(
        "/api/checkout",
        json={"packId": "immigration", "cycle": "monthly"},
        headers=auth_headers,
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "checkoutUrl" in data
    assert data["checkoutUrl"].startswith("https://checkout.stripe.com")
    assert data["sessionId"] == "cs_test_123"


@pytest.mark.asyncio
@patch("app.routers.payments.create_checkout_session", new_callable=AsyncMock)
async def test_checkout_stripe_error(mock_stripe, client: AsyncClient, auth_headers):
    mock_stripe.return_value = {"error": "Invalid price ID"}
    resp = await client.post(
        "/api/checkout",
        json={"packId": "nonexistent", "cycle": "monthly"},
        headers=auth_headers,
    )
    assert resp.status_code == 400
    assert "Invalid price ID" in resp.json()["detail"]


@pytest.mark.asyncio
@patch("app.routers.payments.create_checkout_session", new_callable=AsyncMock)
async def test_checkout_annual_cycle(mock_stripe, client: AsyncClient, auth_headers):
    mock_stripe.return_value = {
        "checkout_url": "https://checkout.stripe.com/annual",
        "session_id": "cs_annual_123",
    }
    resp = await client.post(
        "/api/checkout",
        json={"packId": "citizenship", "cycle": "annual"},
        headers=auth_headers,
    )
    assert resp.status_code == 200
    mock_stripe.assert_awaited_once()
    call_kwargs = mock_stripe.call_args.kwargs
    assert call_kwargs["cycle"] == "annual"


@pytest.mark.asyncio
async def test_product_checkout_requires_auth(client: AsyncClient):
    resp = await client.post("/api/products/checkout", json={"productId": "quick_consultation"})
    assert resp.status_code in (401, 403)


@pytest.mark.asyncio
@patch("app.routers.payments.create_checkout_session", new_callable=AsyncMock)
async def test_product_checkout_success(mock_stripe, client: AsyncClient, auth_headers):
    mock_stripe.return_value = {
        "checkout_url": "https://checkout.stripe.com/product_123",
        "session_id": "cs_prod_123",
    }
    resp = await client.post(
        "/api/products/checkout",
        json={"productId": "quick_consultation"},
        headers=auth_headers,
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "checkoutUrl" in data


@pytest.mark.asyncio
async def test_product_checkout_invalid_product(client: AsyncClient, auth_headers):
    resp = await client.post(
        "/api/products/checkout",
        json={"productId": "nonexistent_product"},
        headers=auth_headers,
    )
    assert resp.status_code == 404
    assert "not found" in resp.json()["detail"].lower()
