"""Tests for modules router — progress tracking and paywall enforcement."""

from __future__ import annotations

import pytest
from httpx import AsyncClient

from app.services.auth_service import create_access_token


def _headers(pack_id: str = "free", is_admin: bool = False) -> dict[str, str]:
    token = create_access_token(
        user_id="10",
        email="mod@test.com",
        pack_id=pack_id,
        is_admin=is_admin,
    )
    return {"Authorization": f"Bearer {token}"}


# ---------------------------------------------------------------------------
# Paywall enforcement (check_module_access) — no DB needed
# ---------------------------------------------------------------------------


@pytest.mark.asyncio
async def test_free_user_can_access_free_module(no_db_client: AsyncClient):
    resp = await no_db_client.get(
        "/api/modules/free-01/access",
        headers=_headers("free"),
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["allowed"] is True
    assert data["requiredPack"] == "free"


@pytest.mark.asyncio
async def test_free_user_blocked_from_immigration_module(no_db_client: AsyncClient):
    resp = await no_db_client.get(
        "/api/modules/imm-01/access",
        headers=_headers("free"),
    )
    assert resp.status_code == 403
    detail = resp.json()["detail"]
    assert detail["required_pack"] == "immigration"
    assert detail["current_pack"] == "free"
    assert "upgrade_url" in detail


@pytest.mark.asyncio
async def test_immigration_user_can_access_imm_module(no_db_client: AsyncClient):
    resp = await no_db_client.get(
        "/api/modules/imm-03/access",
        headers=_headers("immigration"),
    )
    assert resp.status_code == 200
    assert resp.json()["allowed"] is True


@pytest.mark.asyncio
async def test_immigration_user_blocked_from_advanced_module(no_db_client: AsyncClient):
    resp = await no_db_client.get(
        "/api/modules/adv-01/access",
        headers=_headers("immigration"),
    )
    assert resp.status_code == 403
    assert resp.json()["detail"]["required_pack"] == "advanced"


@pytest.mark.asyncio
async def test_advanced_user_can_access_immigration_module(no_db_client: AsyncClient):
    """Pack hierarchy: advanced > immigration, so advanced users get immigration content."""
    resp = await no_db_client.get(
        "/api/modules/imm-05/access",
        headers=_headers("advanced"),
    )
    assert resp.status_code == 200


@pytest.mark.asyncio
async def test_citizenship_user_can_access_all(no_db_client: AsyncClient):
    for module_id in ("free-01", "imm-01", "adv-01", "cit-01"):
        resp = await no_db_client.get(
            f"/api/modules/{module_id}/access",
            headers=_headers("citizenship"),
        )
        assert resp.status_code == 200, f"Citizenship user blocked from {module_id}"


@pytest.mark.asyncio
async def test_admin_bypasses_paywall(no_db_client: AsyncClient):
    resp = await no_db_client.get(
        "/api/modules/cit-10/access",
        headers=_headers("free", is_admin=True),
    )
    assert resp.status_code == 200


@pytest.mark.asyncio
async def test_access_check_requires_auth(no_db_client: AsyncClient):
    resp = await no_db_client.get("/api/modules/free-01/access")
    assert resp.status_code in (401, 403)


# ---------------------------------------------------------------------------
# Progress tracking — needs DB
# ---------------------------------------------------------------------------


@pytest.mark.asyncio
async def test_update_progress_creates_new_record(client: AsyncClient):
    resp = await client.post(
        "/api/modules/progress",
        json={"moduleId": "free-01", "sectionId": "overview", "completed": True},
        headers=_headers("free"),
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["success"] is True
    assert "overview" in data["sections"]


@pytest.mark.asyncio
async def test_get_progress_empty(client: AsyncClient):
    resp = await client.get(
        "/api/modules/progress",
        params={"moduleId": "free-02"},
        headers=_headers("free"),
    )
    assert resp.status_code == 200
    data = resp.json()
    assert data["progress"] == 0
    assert data["sections"] == []
    assert data["completed"] is False


@pytest.mark.asyncio
async def test_progress_requires_auth(no_db_client: AsyncClient):
    resp = await no_db_client.post(
        "/api/modules/progress",
        json={"moduleId": "free-01", "sectionId": "s1", "completed": True},
    )
    assert resp.status_code in (401, 403)


@pytest.mark.asyncio
async def test_progress_blocked_for_wrong_pack(no_db_client: AsyncClient):
    resp = await no_db_client.post(
        "/api/modules/progress",
        json={"moduleId": "adv-01", "sectionId": "s1", "completed": True},
        headers=_headers("free"),
    )
    assert resp.status_code == 403
