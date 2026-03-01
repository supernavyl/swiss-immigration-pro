from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from routers import cv, templates, ai, pdf
from storage import PDF_DIR


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


app = FastAPI(
    title="CV Builder API",
    version="1.0.0",
    lifespan=lifespan,
)

import os

_allowed_origins = os.environ.get(
    "CORS_ORIGINS", "http://localhost:3000,http://localhost:5050"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cv.router, prefix="/api/cv", tags=["cv"])
app.include_router(templates.router, prefix="/api/cv/templates", tags=["templates"])
app.include_router(ai.router, prefix="/api/cv/ai", tags=["ai"])
app.include_router(pdf.router, prefix="/api/cv/export", tags=["export"])

app.mount("/static/pdfs", StaticFiles(directory=str(PDF_DIR)), name="pdfs")


@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "cv-builder"}
