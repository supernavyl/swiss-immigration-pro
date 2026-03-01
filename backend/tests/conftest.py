from __future__ import annotations

import asyncio
from collections.abc import AsyncGenerator

import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.config import Settings
from app.database import Base, get_db
from app.main import app


def get_test_settings() -> Settings:
    return Settings(
        db_host="localhost",
        db_port=5432,
        db_name="test_swiss_immigration",
        db_user="postgres",
        db_password="testpass",
        secret_key="test-secret-key-not-for-production",
        debug=True,
        redis_url="redis://localhost:6379",
        groq_api_key="",
        cors_origins=["http://testserver"],
    )


@pytest.fixture(scope="session")
def event_loop_policy():
    return asyncio.DefaultEventLoopPolicy()


@pytest.fixture(scope="session")
def test_settings() -> Settings:
    return get_test_settings()


@pytest.fixture(scope="session")
async def test_engine(test_settings: Settings):
    engine = create_async_engine(
        test_settings.database_url,
        echo=False,
        pool_size=5,
        max_overflow=0,
    )
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield engine
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await engine.dispose()


@pytest.fixture
async def db_session(test_engine) -> AsyncGenerator[AsyncSession, None]:
    session_factory = async_sessionmaker(
        test_engine,
        class_=AsyncSession,
        expire_on_commit=False,
    )
    async with session_factory() as session:
        async with session.begin():
            yield session
            await session.rollback()


@pytest.fixture
async def client(db_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    async def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as ac:
        yield ac

    app.dependency_overrides.clear()


@pytest.fixture
def auth_headers() -> dict[str, str]:
    """Generate a valid JWT for test requests."""
    from app.services.auth_service import create_access_token

    token = create_access_token(
        user_id="1",
        email="test@example.com",
        pack_id="free",
        is_admin=False,
    )
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def admin_headers() -> dict[str, str]:
    from app.services.auth_service import create_access_token

    token = create_access_token(
        user_id="99",
        email="admin@example.com",
        pack_id="free",
        is_admin=True,
    )
    return {"Authorization": f"Bearer {token}"}
