"""
RAG (Retrieval-Augmented Generation) service for Swiss immigration law documents.

Chunks legal documents, embeds them with sentence-transformers, and performs
hybrid semantic + keyword search for contextually relevant legal passages.
"""

from __future__ import annotations

import asyncio
import hashlib
import logging
import math
import os
import re
import time
from dataclasses import dataclass, field
from pathlib import Path

import numpy as np

from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

# ---------------------------------------------------------------------------
# Data structures
# ---------------------------------------------------------------------------

@dataclass
class DocumentChunk:
    text: str
    source_file: str
    article_ref: str
    chunk_index: int
    embedding: np.ndarray = field(default_factory=lambda: np.array([]))


@dataclass
class SearchResult:
    text: str
    source_file: str
    article_ref: str
    score: float


# ---------------------------------------------------------------------------
# Module-level state
# ---------------------------------------------------------------------------

_chunks: list[DocumentChunk] = []
_embeddings_matrix: np.ndarray | None = None
_model = None
_doc_hash: str = ""
_init_lock = asyncio.Lock()
_initialized = False

_DOCS_DIR_DOCKER = Path("/app/docs")
_DOCS_DIR_LOCAL = Path(__file__).resolve().parent.parent.parent.parent / "docs"

_DOC_FILES = [
    "weisungen-aug-f.md",
    "hb-bueg20-kap3-f.md",
    "hb-bueg20-kap4-f.md",
    "weisungen-aug-kap4-f.md",
]

CHUNK_SIZE = 500  # target tokens (approx chars / 4)
CHUNK_OVERLAP = 80
TOP_K = 8
SEMANTIC_WEIGHT = 0.70
KEYWORD_WEIGHT = 0.30


def _get_docs_dir() -> Path:
    if _DOCS_DIR_DOCKER.exists():
        return _DOCS_DIR_DOCKER
    return _DOCS_DIR_LOCAL


# ---------------------------------------------------------------------------
# Document chunking
# ---------------------------------------------------------------------------

_ARTICLE_SPLIT = re.compile(
    r"(?=^#{1,4}\s+(?:Art\.?\s*\d|Chapitre|Chapter|Section|\d+\.\d+))",
    re.MULTILINE,
)

_HEADING_RE = re.compile(r"^#{1,4}\s+(.*)", re.MULTILINE)


def _extract_article_ref(text: str) -> str:
    """Extract the first article or section reference from chunk text."""
    art_match = re.search(
        r"Art\.?\s*\d+[a-z]?\s*(?:(?:al|abs|cpv|let|lit)\.?\s*\d+)?",
        text,
        re.IGNORECASE,
    )
    if art_match:
        return art_match.group(0).strip()

    heading = _HEADING_RE.search(text)
    if heading:
        return heading.group(1).strip()[:80]

    return text[:60].strip().replace("\n", " ")


def _chunk_document(text: str, source_file: str) -> list[DocumentChunk]:
    """Split a document into semantically meaningful chunks."""
    sections = _ARTICLE_SPLIT.split(text)
    if len(sections) <= 1:
        sections = text.split("\n\n")

    chunks: list[DocumentChunk] = []
    current_text = ""
    chunk_idx = 0

    for section in sections:
        section = section.strip()
        if not section:
            continue

        if len(current_text) + len(section) > CHUNK_SIZE * 4:
            if current_text:
                chunks.append(DocumentChunk(
                    text=current_text.strip(),
                    source_file=source_file,
                    article_ref=_extract_article_ref(current_text),
                    chunk_index=chunk_idx,
                ))
                chunk_idx += 1
                overlap = current_text[-(CHUNK_OVERLAP * 4):] if len(current_text) > CHUNK_OVERLAP * 4 else ""
                current_text = overlap + "\n\n" + section
            else:
                paragraphs = section.split("\n\n")
                for para in paragraphs:
                    if len(current_text) + len(para) > CHUNK_SIZE * 4 and current_text:
                        chunks.append(DocumentChunk(
                            text=current_text.strip(),
                            source_file=source_file,
                            article_ref=_extract_article_ref(current_text),
                            chunk_index=chunk_idx,
                        ))
                        chunk_idx += 1
                        current_text = ""
                    current_text += "\n\n" + para
        else:
            current_text += "\n\n" + section

    if current_text.strip():
        chunks.append(DocumentChunk(
            text=current_text.strip(),
            source_file=source_file,
            article_ref=_extract_article_ref(current_text),
            chunk_index=chunk_idx,
        ))

    return chunks


# ---------------------------------------------------------------------------
# Embedding
# ---------------------------------------------------------------------------

def _load_model():
    """Load the sentence-transformers model (lazy, once)."""
    global _model
    if _model is not None:
        return _model

    try:
        from sentence_transformers import SentenceTransformer
        model_name = os.environ.get(
            "RAG_EMBEDDING_MODEL",
            "sentence-transformers/all-MiniLM-L6-v2",
        )
        _model = SentenceTransformer(model_name)
        logger.info("Loaded embedding model: %s", model_name)
    except ImportError:
        logger.warning(
            "sentence-transformers not installed; RAG will fall back to keyword search"
        )
        _model = None
    return _model


def _compute_doc_hash(docs_dir: Path) -> str:
    """Hash based on file sizes + mtimes to detect changes."""
    parts: list[str] = []
    for fname in _DOC_FILES:
        p = docs_dir / fname
        if p.exists():
            stat = p.stat()
            parts.append(f"{fname}:{stat.st_size}:{stat.st_mtime_ns}")
    return hashlib.sha256("|".join(parts).encode()).hexdigest()


async def initialize() -> None:
    """Load documents, chunk, and embed. Safe to call multiple times."""
    global _chunks, _embeddings_matrix, _doc_hash, _initialized

    async with _init_lock:
        docs_dir = _get_docs_dir()
        current_hash = _compute_doc_hash(docs_dir)

        if _initialized and current_hash == _doc_hash:
            return

        logger.info("Initializing RAG pipeline (docs_dir=%s)", docs_dir)
        start = time.monotonic()

        all_chunks: list[DocumentChunk] = []
        for fname in _DOC_FILES:
            fpath = docs_dir / fname
            if not fpath.exists():
                logger.warning("Doc file not found: %s", fpath)
                continue
            text = await asyncio.to_thread(fpath.read_text, "utf-8")
            doc_chunks = _chunk_document(text, fname)
            all_chunks.extend(doc_chunks)
            logger.info("Chunked %s -> %d chunks", fname, len(doc_chunks))

        _chunks = all_chunks
        logger.info("Total chunks: %d", len(_chunks))

        model = await asyncio.to_thread(_load_model)
        if model is not None and _chunks:
            texts = [c.text for c in _chunks]
            embeddings = await asyncio.to_thread(
                model.encode, texts, show_progress_bar=False, batch_size=64
            )
            emb_array = np.array(embeddings, dtype=np.float32)
            norms = np.linalg.norm(emb_array, axis=1, keepdims=True)
            norms[norms == 0] = 1
            _embeddings_matrix = emb_array / norms

            for i, chunk in enumerate(_chunks):
                chunk.embedding = _embeddings_matrix[i]
        else:
            _embeddings_matrix = None

        _doc_hash = current_hash
        _initialized = True
        elapsed = time.monotonic() - start
        logger.info("RAG initialization complete in %.2fs", elapsed)


# ---------------------------------------------------------------------------
# Search
# ---------------------------------------------------------------------------

def _bm25_score(query_tokens: list[str], text: str) -> float:
    """Simple BM25-inspired keyword relevance score."""
    text_lower = text.lower()
    doc_len = len(text_lower.split())
    avg_dl = 500
    k1 = 1.5
    b = 0.75

    score = 0.0
    for token in query_tokens:
        tf = text_lower.count(token)
        if tf == 0:
            continue
        idf = math.log(1 + (len(_chunks) - tf + 0.5) / (tf + 0.5))
        tf_norm = (tf * (k1 + 1)) / (tf + k1 * (1 - b + b * doc_len / avg_dl))
        score += idf * tf_norm
    return score


async def search(
    query: str,
    top_k: int = TOP_K,
    semantic_weight: float = SEMANTIC_WEIGHT,
    keyword_weight: float = KEYWORD_WEIGHT,
) -> list[SearchResult]:
    """Hybrid semantic + keyword search over law document chunks."""
    if not _initialized:
        await initialize()

    if not _chunks:
        return []

    query_tokens = [w.lower() for w in query.split() if len(w) > 2]

    keyword_scores = np.array(
        [_bm25_score(query_tokens, c.text) for c in _chunks],
        dtype=np.float32,
    )
    kw_max = keyword_scores.max()
    if kw_max > 0:
        keyword_scores /= kw_max

    model = _model
    if model is not None and _embeddings_matrix is not None:
        query_emb = await asyncio.to_thread(
            model.encode, [query], show_progress_bar=False
        )
        q = np.array(query_emb[0], dtype=np.float32)
        q /= np.linalg.norm(q) or 1
        semantic_scores = _embeddings_matrix @ q
    else:
        semantic_scores = np.zeros(len(_chunks), dtype=np.float32)
        semantic_weight = 0.0
        keyword_weight = 1.0

    combined = semantic_weight * semantic_scores + keyword_weight * keyword_scores

    top_indices = np.argsort(combined)[::-1][:top_k]

    results: list[SearchResult] = []
    for idx in top_indices:
        if combined[idx] <= 0:
            break
        chunk = _chunks[idx]
        results.append(SearchResult(
            text=chunk.text,
            source_file=chunk.source_file,
            article_ref=chunk.article_ref,
            score=float(combined[idx]),
        ))

    return results


async def search_with_context(
    query: str,
    max_chars: int = 12000,
    top_k: int = TOP_K,
) -> tuple[str, list[dict]]:
    """Search and return formatted context string + source metadata."""
    results = await search(query, top_k=top_k)

    context_parts: list[str] = []
    sources: list[dict] = []
    total_chars = 0

    for r in results:
        if total_chars + len(r.text) > max_chars:
            remaining = max_chars - total_chars
            if remaining > 200:
                context_parts.append(r.text[:remaining])
                sources.append({
                    "file": r.source_file,
                    "article": r.article_ref,
                    "score": round(r.score, 3),
                })
            break
        context_parts.append(r.text)
        sources.append({
            "file": r.source_file,
            "article": r.article_ref,
            "score": round(r.score, 3),
        })
        total_chars += len(r.text)

    context = "\n\n---\n\n".join(context_parts)
    return context, sources
