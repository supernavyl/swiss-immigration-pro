"""Tests for the consultations router -- booking flow."""

from __future__ import annotations

from unittest.mock import AsyncMock, patch

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
@patch("app.routers.consultations.create_consultation_checkout", new_callable=AsyncMock)
async def test_book_consultation_success(mock_stripe, client: AsyncClient, auth_headers):
    mock_stripe.return_value = {
        "checkout_url": "https://checkout.stripe.com/consult_123",
    }
    resp = await client.post(
        "/api/consultations/book",
        json={
            "consultationType": "quick",
            "fullName": "Test User",
            "email": "test@example.com",
            "preferredDate": "2026-03-15T10:00:00",
            "timezone": "Europe/Zurich",
        },
        headers=auth_headers,
    )
    assert resp.status_code == 200
    data = resp.json()
    assert "checkoutUrl" in data
    assert "consultationId" in data


@pytest.mark.asyncio
async def test_book_invalid_consultation_type(client: AsyncClient, auth_headers):
    resp = await client.post(
        "/api/consultations/book",
        json={
            "consultationType": "nonexistent",
            "fullName": "Test User",
            "email": "test@example.com",
        },
        headers=auth_headers,
    )
    assert resp.status_code == 400
    assert "Invalid" in resp.json()["detail"]


@pytest.mark.asyncio
async def test_book_missing_required_fields(client: AsyncClient, auth_headers):
    resp = await client.post(
        "/api/consultations/book",
        json={"consultationType": "quick"},
        headers=auth_headers,
    )
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_book_invalid_email(client: AsyncClient, auth_headers):
    resp = await client.post(
        "/api/consultations/book",
        json={
            "consultationType": "quick",
            "fullName": "Test",
            "email": "not-an-email",
        },
        headers=auth_headers,
    )
    assert resp.status_code == 422


@pytest.mark.asyncio
@patch("app.routers.consultations.create_consultation_checkout", new_callable=AsyncMock)
async def test_book_anonymous_user(mock_stripe, client: AsyncClient):
    """Anonymous users can book consultations too."""
    mock_stripe.return_value = {
        "checkout_url": "https://checkout.stripe.com/anon_123",
    }
    resp = await client.post(
        "/api/consultations/book",
        json={
            "consultationType": "full",
            "fullName": "Anon User",
            "email": "anon@example.com",
        },
    )
    assert resp.status_code == 200
