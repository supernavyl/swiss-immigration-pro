from __future__ import annotations


def generate_pdf(html: str) -> bytes:
    try:
        from weasyprint import HTML
        return HTML(string=html).write_pdf()
    except ImportError:
        raise RuntimeError(
            "weasyprint is not installed. "
            "Install system deps (pango, cairo) then `pip install weasyprint`."
        )
