from __future__ import annotations

import os
import uuid

from fastapi import APIRouter, Header, HTTPException

from models.cv_data import CVData, SaveCVRequest
from storage import save_cv, load_cv, list_cvs, delete_cv

router = APIRouter()


_SECRET_KEY = os.environ.get("SECRET_KEY", "")


def _extract_user_id(authorization: str | None) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "Authentication required")
    if not _SECRET_KEY:
        raise HTTPException(500, "Server misconfigured: SECRET_KEY not set")
    from jose import jwt, JWTError
    token = authorization.removeprefix("Bearer ")
    try:
        payload = jwt.decode(token, _SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("sub") or payload.get("id") or payload.get("user_id")
        if not user_id:
            raise HTTPException(401, "Invalid token payload")
        return str(user_id)
    except JWTError:
        raise HTTPException(401, "Invalid token")


@router.post("/save")
async def save(body: SaveCVRequest, authorization: str | None = Header(None)):
    user_id = _extract_user_id(authorization)
    cv_id = body.cv_id or str(uuid.uuid4())
    data = {
        "name": body.name,
        "template_id": body.template_id,
        "cv_data": body.cv_data.model_dump(),
    }
    result = save_cv(user_id, cv_id, data)
    return {"success": True, "cv": result}


@router.get("/list")
async def list_user_cvs(authorization: str | None = Header(None)):
    user_id = _extract_user_id(authorization)
    return {"cvs": list_cvs(user_id)}


@router.get("/{cv_id}")
async def get_cv(cv_id: str, authorization: str | None = Header(None)):
    user_id = _extract_user_id(authorization)
    cv = load_cv(user_id, cv_id)
    if not cv:
        raise HTTPException(404, "CV not found")
    return {"cv": cv}


@router.delete("/{cv_id}")
async def remove_cv(cv_id: str, authorization: str | None = Header(None)):
    user_id = _extract_user_id(authorization)
    if not delete_cv(user_id, cv_id):
        raise HTTPException(404, "CV not found")
    return {"success": True}
