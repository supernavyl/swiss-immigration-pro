"""
Document processing service for the Virtual Lawyer.

Extracts text from uploaded PDF, DOCX, TXT, and image files.
"""

from __future__ import annotations

import logging
import re
from pathlib import Path

logger = logging.getLogger(__name__)

ALLOWED_EXTENSIONS = {".pdf", ".docx", ".doc", ".txt", ".png", ".jpg", ".jpeg", ".webp"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB


def validate_file(filename: str, file_size: int) -> str | None:
    """Return an error message if the file is invalid, else None."""
    ext = Path(filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        return f"Unsupported file type: {ext}. Allowed: {', '.join(sorted(ALLOWED_EXTENSIONS))}"
    if file_size > MAX_FILE_SIZE:
        return f"File too large ({file_size / 1024 / 1024:.1f}MB). Maximum: 10MB"
    return None


def _clean_text(text: str) -> str:
    """Normalize whitespace and remove control characters."""
    text = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f]", "", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = re.sub(r"[ \t]+", " ", text)
    return text.strip()


async def extract_text(file_path: Path, file_type: str) -> str:
    """Extract text content from a file. Returns cleaned text."""
    import asyncio

    ext = file_type.lower()

    if ext == ".txt":
        return await asyncio.to_thread(_extract_txt, file_path)
    if ext == ".pdf":
        return await asyncio.to_thread(_extract_pdf, file_path)
    if ext in (".docx", ".doc"):
        return await asyncio.to_thread(_extract_docx, file_path)
    if ext in (".png", ".jpg", ".jpeg", ".webp"):
        return await asyncio.to_thread(_extract_image_ocr, file_path)
    return ""


def _extract_txt(file_path: Path) -> str:
    try:
        text = file_path.read_text("utf-8", errors="replace")
        return _clean_text(text)
    except Exception as exc:
        logger.error("TXT extraction failed for %s: %s", file_path, exc)
        return ""


def _extract_pdf(file_path: Path) -> str:
    try:
        import fitz  # PyMuPDF

        doc = fitz.open(str(file_path))
        pages: list[str] = []
        for page in doc:
            pages.append(page.get_text())
        doc.close()
        return _clean_text("\n\n".join(pages))
    except ImportError:
        logger.warning("PyMuPDF not installed; trying reportlab fallback")
        return _extract_pdf_fallback(file_path)
    except Exception as exc:
        logger.error("PDF extraction failed for %s: %s", file_path, exc)
        return ""


def _extract_pdf_fallback(file_path: Path) -> str:
    """Fallback PDF extraction without PyMuPDF."""
    try:
        with open(file_path, "rb") as f:
            content = f.read()
        text_parts: list[str] = []
        for part in content.split(b"stream"):
            if b"endstream" in part:
                stream_data = part.split(b"endstream")[0]
                try:
                    decoded = stream_data.decode("utf-8", errors="ignore")
                    cleaned = re.sub(r"[^\x20-\x7E\n]", "", decoded)
                    if len(cleaned) > 20:
                        text_parts.append(cleaned)
                except Exception:
                    logger.debug("Failed to decode PDF stream segment", exc_info=True)
        return _clean_text("\n".join(text_parts))
    except Exception as exc:
        logger.error("PDF fallback extraction failed: %s", exc)
        return ""


def _extract_docx(file_path: Path) -> str:
    try:
        from docx import Document

        doc = Document(str(file_path))
        paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
        return _clean_text("\n\n".join(paragraphs))
    except ImportError:
        logger.warning("python-docx not installed; cannot extract DOCX")
        return ""
    except Exception as exc:
        logger.error("DOCX extraction failed for %s: %s", file_path, exc)
        return ""


def _extract_image_ocr(file_path: Path) -> str:
    try:
        import pytesseract
        from PIL import Image

        img = Image.open(file_path)
        text = pytesseract.image_to_string(img, lang="fra+deu+eng")
        return _clean_text(text)
    except ImportError:
        logger.warning("pytesseract/Pillow not installed; cannot OCR images")
        return ""
    except Exception as exc:
        logger.error("OCR failed for %s: %s", file_path, exc)
        return ""
