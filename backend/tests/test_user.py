"""Tests for the user router -- profile, layer preferences, limits."""

from __future__ import annotations

import uuid

import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import Profile


@pytest.fixture
async def test_profile(db_session: AsyncSession) -> Profile:
    """Create a test user profile matching the auth_headers fixture (user_id='1')."""
    profile = Profile(
        id=uuid.UUID("00000000-0000-0000-0000-000000000001"),
        email="test@example.com",
        full_name="Test User",
        password_hash="$2b$12$fakehash",
        pack_id="free",
    )
    db_session.add(profile)
    await db_session.flush()
    return profile


@pytest.mark.asyncio
async def test_get_profile_requires_auth(client: AsyncClient):
    resp = await client.get("/api/user/profile")
    assert resp.status_code in (401, 403)


@pytest.mark.asyncio
async def test_get_profile_success(client: AsyncClient, auth_headers, test_profile):
    resp = await client.get("/api/user/profile", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["email"] == "test@example.com"
    assert data["fullName"] == "Test User"
    assert data["packId"] == "free"


@pytest.mark.asyncio
async def test_update_profile(client: AsyncClient, auth_headers, test_profile):
    resp = await client.put(
        "/api/user/profile",
        json={"fullName": "Updated Name"},
        headers=auth_headers,
    )
    assert resp.status_code == 200
    assert resp.json()["success"] is True


@pytest.mark.asyncio
async def test_save_layer_valid(client: AsyncClient, auth_headers, test_profile):
    resp = await client.post(
        "/api/user/save-layer",
        json={"layer": "eu"},
        headers=auth_headers,
    )
    assert resp.status_code == 200
    assert resp.json()["layer"] == "eu"


@pytest.mark.asyncio
async def test_save_layer_invalid(client: AsyncClient, auth_headers, test_profile):
    resp = await client.post(
        "/api/user/save-layer",
        json={"layer": "invalid"},
        headers=auth_headers,
    )
    assert resp.status_code == 400


@pytest.mark.asyncio
async def test_get_messages_empty(client: AsyncClient, auth_headers, test_profile):
    resp = await client.get("/api/user/messages", headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json() == []


@pytest.mark.asyncio
async def test_get_limits(client: AsyncClient, auth_headers, test_profile):
    resp = await client.get("/api/user/limits", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert data["packId"] == "free"
    assert data["messagesToday"] == 0
