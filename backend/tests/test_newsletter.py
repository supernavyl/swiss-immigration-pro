"""Tests for the newsletter endpoints."""

from __future__ import annotations

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_subscribe(client: AsyncClient):
    resp = await client.post(
        "/api/newsletter/subscribe",
        json={"email": "subscriber@example.com"},
    )
    assert resp.status_code == 200
    assert resp.json()["success"] is True


@pytest.mark.asyncio
async def test_unsubscribe_requires_valid_token(client: AsyncClient):
    resp = await client.get(
        "/api/newsletter/unsubscribe",
        params={"email": "victim@example.com", "token": "invalid"},
    )
    assert resp.status_code == 403


@pytest.mark.asyncio
async def test_unsubscribe_without_token_fails(client: AsyncClient):
    resp = await client.get(
        "/api/newsletter/unsubscribe",
        params={"email": "victim@example.com"},
    )
    assert resp.status_code == 422
