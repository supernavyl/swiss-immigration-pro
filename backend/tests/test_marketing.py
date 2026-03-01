"""Tests for the marketing router — email capture, lead magnets."""

from __future__ import annotations

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_email_capture_success(client: AsyncClient):
    resp = await client.post(
        "/api/marketing/capture",
        json={"email": "lead@example.com", "source": "homepage"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data.get("success") is True


@pytest.mark.asyncio
async def test_email_capture_invalid_email(client: AsyncClient):
    resp = await client.post(
        "/api/marketing/capture",
        json={"email": "not-an-email", "source": "homepage"},
    )
    assert resp.status_code == 422  # Pydantic validation


@pytest.mark.asyncio
async def test_email_capture_missing_email(client: AsyncClient):
    resp = await client.post(
        "/api/marketing/capture",
        json={"source": "homepage"},
    )
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_duplicate_email_capture(client: AsyncClient):
    email = "duplicate@example.com"
    # First capture
    await client.post(
        "/api/marketing/capture",
        json={"email": email, "source": "homepage"},
    )
    # Second capture with same email — should not error
    resp = await client.post(
        "/api/marketing/capture",
        json={"email": email, "source": "footer"},
    )
    assert resp.status_code == 200
