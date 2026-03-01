"""Tests for the auth router -- register, login, JWT, refresh."""

from __future__ import annotations

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_register_creates_user(client: AsyncClient):
    resp = await client.post(
        "/api/auth/register",
        json={"email": "new@example.com", "password": "TestPass1"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["success"] is True
    assert "token" in data
    assert "refreshToken" in data
    assert data["user"]["email"] == "new@example.com"


@pytest.mark.asyncio
async def test_register_rejects_weak_password(client: AsyncClient):
    resp = await client.post(
        "/api/auth/register",
        json={"email": "weak@example.com", "password": "short"},
    )
    assert resp.status_code == 400


@pytest.mark.asyncio
async def test_register_duplicate_email(client: AsyncClient):
    payload = {"email": "dup@example.com", "password": "TestPass1"}
    await client.post("/api/auth/register", json=payload)
    resp = await client.post("/api/auth/register", json=payload)
    assert resp.status_code == 400
    assert "already exists" in resp.json()["detail"]


@pytest.mark.asyncio
async def test_login_success(client: AsyncClient):
    await client.post(
        "/api/auth/register",
        json={"email": "login@example.com", "password": "TestPass1"},
    )
    resp = await client.post(
        "/api/auth/login",
        json={"email": "login@example.com", "password": "TestPass1"},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["success"] is True
    assert "token" in data


@pytest.mark.asyncio
async def test_login_wrong_password(client: AsyncClient):
    await client.post(
        "/api/auth/register",
        json={"email": "wrong@example.com", "password": "TestPass1"},
    )
    resp = await client.post(
        "/api/auth/login",
        json={"email": "wrong@example.com", "password": "WrongPass1"},
    )
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_login_nonexistent_user(client: AsyncClient):
    resp = await client.post(
        "/api/auth/login",
        json={"email": "nobody@example.com", "password": "TestPass1"},
    )
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_get_me_requires_auth(client: AsyncClient):
    resp = await client.get("/api/auth/me")
    assert resp.status_code in (401, 403)


@pytest.mark.asyncio
async def test_get_me_with_token(client: AsyncClient, auth_headers: dict):
    resp = await client.get("/api/auth/me", headers=auth_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "email" in data


@pytest.mark.asyncio
async def test_refresh_token_flow(client: AsyncClient):
    reg = await client.post(
        "/api/auth/register",
        json={"email": "refresh@example.com", "password": "TestPass1"},
    )
    refresh_token = reg.json()["refreshToken"]

    resp = await client.post(
        "/api/auth/refresh",
        json={"refreshToken": refresh_token},
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["success"] is True
    assert "token" in data


@pytest.mark.asyncio
async def test_refresh_token_invalid(client: AsyncClient):
    resp = await client.post(
        "/api/auth/refresh",
        json={"refreshToken": "invalid.token.here"},
    )
    assert resp.status_code == 401
