"""Tests for the admin endpoints."""

from __future__ import annotations

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_admin_stats_requires_admin(client: AsyncClient, auth_headers: dict):
    resp = await client.get("/api/admin/stats", headers=auth_headers)
    # Non-admin user should be rejected
    assert resp.status_code == 403


@pytest.mark.asyncio
async def test_admin_stats_with_admin(client: AsyncClient, admin_headers: dict):
    resp = await client.get("/api/admin/stats", headers=admin_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "totalUsers" in data


@pytest.mark.asyncio
async def test_admin_users_returns_paginated(client: AsyncClient, admin_headers: dict):
    resp = await client.get("/api/admin/users?page=1&per_page=10", headers=admin_headers)
    assert resp.status_code == 200
    data = resp.json()
    assert "items" in data
    assert "total" in data
    assert "page" in data


@pytest.mark.asyncio
async def test_admin_users_rejects_unauthenticated(client: AsyncClient):
    resp = await client.get("/api/admin/users")
    assert resp.status_code in (401, 403)
