"""
CLI utilities for bootstrapping the application.

Usage:
    python -m app.cli create-superadmin --email admin@example.com --password YourPass123
"""

import argparse
import asyncio
import os
import sys

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

# Ensure the app package is importable
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.config import get_settings
from app.models.user import Profile, User, UserLimit
from app.services.auth_service import hash_password


async def create_superadmin(email: str, password: str, full_name: str | None = None):
    settings = get_settings()

    # Require ADMIN_BOOTSTRAP_SECRET env var for safety
    bootstrap_secret = os.environ.get("ADMIN_BOOTSTRAP_SECRET", "")
    if not bootstrap_secret:
        print("ERROR: Set ADMIN_BOOTSTRAP_SECRET environment variable to use this command.")  # noqa: T201
        print("Example: ADMIN_BOOTSTRAP_SECRET=mysecret python -m app.cli create-superadmin ...")  # noqa: T201
        sys.exit(1)

    engine = create_async_engine(settings.database_url)
    session_factory = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with session_factory() as db:
        try:
            # Check if user exists
            result = await db.execute(select(User).where(User.email == email))
            existing = result.scalar_one_or_none()

            if existing:
                # Promote to admin
                result = await db.execute(select(Profile).where(Profile.id == existing.id))
                profile = result.scalar_one_or_none()
                if profile:
                    profile.is_admin = True
                    profile.pack_id = "citizenship"
                    if full_name:
                        profile.full_name = full_name
                await db.commit()
                print(f"SUCCESS: User {email} promoted to superadmin.")  # noqa: T201
            else:
                # Create new superadmin
                user = User(
                    email=email,
                    password_hash=hash_password(password),
                    email_verified=True,
                )
                db.add(user)
                await db.flush()

                profile = Profile(
                    id=user.id,
                    email=email,
                    full_name=full_name or "Superadmin",
                    pack_id="citizenship",
                    is_admin=True,
                )
                db.add(profile)

                limits = UserLimit(user_id=user.id, messages_today=0)
                db.add(limits)

                await db.commit()
                print(f"SUCCESS: Superadmin {email} created (ID: {user.id}).")  # noqa: T201

        except Exception as e:
            await db.rollback()
            print(f"ERROR: {e}")  # noqa: T201
            sys.exit(1)
        finally:
            await engine.dispose()


def main():
    parser = argparse.ArgumentParser(description="Swiss Immigration Pro CLI")
    subparsers = parser.add_subparsers(dest="command")

    # create-superadmin
    sp = subparsers.add_parser("create-superadmin", help="Create or promote a superadmin user")
    sp.add_argument("--email", required=True, help="Admin email address")
    sp.add_argument("--password", required=True, help="Admin password")
    sp.add_argument("--name", default=None, help="Admin full name")

    args = parser.parse_args()

    if args.command == "create-superadmin":
        asyncio.run(create_superadmin(args.email, args.password, args.name))
    else:
        parser.print_help()


if __name__ == "__main__":
    main()
