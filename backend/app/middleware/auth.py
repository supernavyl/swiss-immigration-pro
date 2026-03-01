from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.services.auth_service import decode_token

security = HTTPBearer(auto_error=False)


class CurrentUser:
    def __init__(self, user_id: str, email: str, pack_id: str = "free", is_admin: bool = False):
        self.user_id = user_id
        self.email = email
        self.pack_id = pack_id
        self.is_admin = is_admin


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(security)],
) -> CurrentUser:
    if not credentials:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    payload = decode_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")

    return CurrentUser(
        user_id=payload["sub"],
        email=payload["email"],
        pack_id=payload.get("pack_id", "free"),
        is_admin=payload.get("is_admin", False),
    )


async def get_optional_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(security)],
) -> CurrentUser | None:
    if not credentials:
        return None
    payload = decode_token(credentials.credentials)
    if not payload:
        return None
    return CurrentUser(
        user_id=payload["sub"],
        email=payload["email"],
        pack_id=payload.get("pack_id", "free"),
        is_admin=payload.get("is_admin", False),
    )


async def require_admin(
    user: Annotated[CurrentUser, Depends(get_current_user)],
) -> CurrentUser:
    if not user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return user
