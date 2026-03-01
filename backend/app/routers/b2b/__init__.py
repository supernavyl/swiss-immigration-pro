"""B2B API routers package."""

from fastapi import APIRouter

from app.routers.b2b import billing, companies, compliance, employees, reports

b2b_router = APIRouter(prefix="/api/b2b", tags=["b2b"])

b2b_router.include_router(companies.router)
b2b_router.include_router(employees.router)
b2b_router.include_router(compliance.router)
b2b_router.include_router(reports.router)
b2b_router.include_router(billing.router)
