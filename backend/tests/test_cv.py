"""Tests for the CV router — templates, save, list, delete."""

from __future__ import annotations

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_get_templates_is_public(client: AsyncClient):
    resp = await client.get("/api/cv/templates")
    assert resp.status_code == 200
    data = resp.json()
    assert "templates" in data
    assert len(data["templates"]) > 0


@pytest.mark.asyncio
async def test_save_cv_requires_auth(client: AsyncClient):
    resp = await client.post(
        "/api/cv/save",
        json={"templateId": "zurich-modern", "sections": {}},
    )
    assert resp.status_code in (401, 403)


@pytest.mark.asyncio
async def test_list_cvs_requires_auth(client: AsyncClient):
    resp = await client.get("/api/cv/list")
    assert resp.status_code in (401, 403)


@pytest.mark.asyncio
async def test_save_and_list_cv(client: AsyncClient, auth_headers):
    # Save a CV
    save_resp = await client.post(
        "/api/cv/save",
        json={
            "templateId": "zurich-modern",
            "title": "Test CV",
            "sections": {"personalInfo": {"name": "Test User"}},
        },
        headers=auth_headers,
    )
    assert save_resp.status_code == 200
    cv_id = save_resp.json().get("id")
    assert cv_id is not None

    # List should include the new CV
    list_resp = await client.get("/api/cv/list", headers=auth_headers)
    assert list_resp.status_code == 200
    cvs = list_resp.json()["cvs"]
    assert any(cv["id"] == cv_id for cv in cvs)


@pytest.mark.asyncio
async def test_delete_cv_requires_auth(client: AsyncClient):
    resp = await client.delete("/api/cv/some-id")
    assert resp.status_code in (401, 403)
