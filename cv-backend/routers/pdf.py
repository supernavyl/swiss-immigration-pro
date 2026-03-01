from fastapi import APIRouter
from fastapi.responses import Response

from models.cv_data import ExportRequest
from services.pdf_generator import generate_pdf
from services.template_engine import render_cv_html

router = APIRouter()


@router.post("/pdf")
async def export_pdf(body: ExportRequest):
    html = render_cv_html(body.cv_data, body.template_id)
    pdf_bytes = generate_pdf(html)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": 'attachment; filename="cv.pdf"'},
    )


@router.post("/preview")
async def preview_html(body: ExportRequest):
    html = render_cv_html(body.cv_data, body.template_id)
    return Response(content=html, media_type="text/html")
