"""
Paywall enforcement — reusable dependencies for pack-gated endpoints.

Module ID prefixes determine which pack is required:
  free-*  → free (everyone)
  imm-*   → immigration
  adv-*   → advanced
  cit-*   → citizenship

Pack hierarchy: free < immigration < advanced < citizenship
A user with 'advanced' can access 'immigration' and 'free' content.
"""

from fastapi import HTTPException, status

from app.middleware.auth import CurrentUser

PACK_HIERARCHY = ["free", "immigration", "advanced", "citizenship"]

MODULE_PREFIX_TO_PACK: dict[str, str] = {
    "free": "free",
    "imm": "immigration",
    "adv": "advanced",
    "cit": "citizenship",
}


def _pack_level(pack_id: str) -> int:
    try:
        return PACK_HIERARCHY.index(pack_id)
    except ValueError:
        return 0


def get_required_pack_for_module(module_id: str) -> str:
    """Derive the minimum pack required from a module ID prefix."""
    prefix = module_id.split("-")[0] if "-" in module_id else module_id
    return MODULE_PREFIX_TO_PACK.get(prefix, "free")


def check_module_access(user: CurrentUser, module_id: str) -> None:
    """Raise 403 if the user's pack is insufficient for the given module."""
    if user.is_admin:
        return

    required_pack = get_required_pack_for_module(module_id)
    user_level = _pack_level(user.pack_id)
    required_level = _pack_level(required_pack)

    if user_level < required_level:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "error": "Upgrade required",
                "required_pack": required_pack,
                "current_pack": user.pack_id,
                "upgrade_url": "/pricing",
            },
        )


def check_pack_access(user: CurrentUser, required_pack: str) -> None:
    """Raise 403 if the user's pack is below the required pack level."""
    if user.is_admin:
        return

    user_level = _pack_level(user.pack_id)
    required_level = _pack_level(required_pack)

    if user_level < required_level:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "error": "Upgrade required",
                "required_pack": required_pack,
                "current_pack": user.pack_id,
                "upgrade_url": "/pricing",
            },
        )
