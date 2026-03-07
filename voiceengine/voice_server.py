"""SIP Voice WebSocket server.

Runs on port 8421. Provides real-time voice conversations for the
Virtual Lawyer and Chatbot using Groq STT + SIP backend LLM + Edge TTS.

Endpoints:
  ws://voiceengine:8421/ws/voice/{mode}?token=JWT&lang=en
    mode = "lawyer" | "chatbot"

Protocol (binary + text mixed WebSocket):

  Client -> Server:
    binary frame  = Float32LE PCM audio @ 16 kHz mono (mic recording)
    text frame    = {"type": "end_of_speech"}    <- triggers STT -> LLM -> TTS
    text frame    = {"type": "interrupt"}         <- barge-in: stop current TTS
    text frame    = {"type": "hangup"}            <- end call cleanly

  Server -> Client:
    text frame    = {"type": "ready", "voice": "...", "mode": "..."}
    text frame    = {"type": "transcription", "text": "..."}
    text frame    = {"type": "speaking_start", "text": "..."}
    binary frame  = Int16LE PCM audio @ 24 kHz mono chunks (TTS audio)
    text frame    = {"type": "speaking_end"}
    text frame    = {"type": "metadata", ...}
    text frame    = {"type": "error", "message": "..."}
"""

from __future__ import annotations

import asyncio
import contextlib
import json
import logging
import sys
from pathlib import Path
from typing import Any

import numpy as np
from fastapi import FastAPI, Query, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from starlette.websockets import WebSocketState

# Make src importable
sys.path.insert(0, str(Path(__file__).resolve().parent))

from src.voice_engine.config import VoiceEngineConfig  # noqa: E402
from src.voice_engine.processing.sentence_collector import SentenceCollector  # noqa: E402
from src.voice_engine.providers.base import STTProvider, TTSProvider  # noqa: E402
from src.voice_engine.providers.factory import ProviderFactory  # noqa: E402
from src.voice_engine.providers.llm.sip_llm import SipLLM  # noqa: E402

logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
config = VoiceEngineConfig()

MIC_SAMPLE_RATE = 16_000     # Hz — what browser sends
EDGE_TTS_SAMPLE_RATE = 24_000  # Hz — Edge TTS output
CHUNK_BYTES = 8_192           # int16 bytes per TTS chunk (~170ms @ 24kHz)

# Edge TTS voice candidates by mode and language (first working voice wins)
VOICE_CANDIDATES: dict[str, dict[str, list[str]]] = {
    "lawyer": {
        "en": ["en-US-AvaNeural", "en-US-AriaNeural", "en-US-JennyNeural"],
        "fr": [
            "fr-FR-VivienneMultilingualNeural",
            "fr-FR-DeniseNeural",
            "fr-FR-EloiseNeural",
        ],
        "de": ["de-DE-KatjaNeural", "de-DE-AmalaNeural"],
        "it": ["it-IT-IsabellaNeural", "it-IT-ElsaNeural"],
    },
    "chatbot": {
        "en": ["en-US-JennyNeural", "en-US-AvaNeural"],
        "fr": ["fr-FR-EloiseNeural", "fr-FR-DeniseNeural"],
        "de": ["de-DE-AmalaNeural", "de-DE-KatjaNeural"],
        "it": ["it-IT-ElsaNeural", "it-IT-IsabellaNeural"],
    },
}

CATHERINE_GREETING_BY_MODE: dict[str, dict[str, str]] = {
    "lawyer": {
        "en": (
            "Hello, I'm Catherine, your Swiss immigration AI legal assistant. "
            "I can help you with permits, visas, naturalization, and any Swiss "
            "immigration question. How can I assist you today?"
        ),
        "fr": (
            "Bonjour, je suis Catherine, votre assistante juridique IA "
            "spécialisée en immigration suisse. Je peux vous aider avec les "
            "permis, visas, naturalisation et toute question d'immigration. "
            "Comment puis-je vous aider aujourd'hui ?"
        ),
        "de": (
            "Hallo, ich bin Catherine, Ihre KI-Rechtsassistentin fuer die "
            "Schweizer Einwanderung. Ich kann Ihnen bei Bewilligungen, Visa, "
            "Einbuergerung und allen Einwanderungsfragen helfen. "
            "Wie kann ich Ihnen heute helfen?"
        ),
        "it": (
            "Ciao, sono Catherine, la tua assistente legale AI specializzata "
            "in immigrazione svizzera. Posso aiutarti con permessi, visti, "
            "naturalizzazione e qualsiasi domanda sull'immigrazione. "
            "Come posso aiutarti oggi?"
        ),
    },
    "chatbot": {
        "en": (
            "Hi, I'm Catherine! I'm here to help you navigate Swiss immigration. "
            "Ask me anything about permits, procedures, or life in Switzerland."
        ),
        "fr": (
            "Salut, je suis Catherine ! Je suis là pour vous guider dans "
            "l'immigration suisse. Posez-moi vos questions sur les permis, "
            "les procédures ou la vie en Suisse."
        ),
        "de": (
            "Hallo, ich bin Catherine! Ich bin hier, um Ihnen bei der "
            "Schweizer Einwanderung zu helfen. Fragen Sie mich alles ueber "
            "Bewilligungen, Verfahren oder das Leben in der Schweiz."
        ),
        "it": (
            "Ciao, sono Catherine! Sono qui per aiutarti con l'immigrazione "
            "svizzera. Chiedimi tutto su permessi, procedure o la vita in Svizzera."
        ),
    },
}

# ---------------------------------------------------------------------------
# Lazy singletons for STT (shared across sessions — stateless)
# ---------------------------------------------------------------------------
_stt: STTProvider | None = None
_tts_cache: dict[str, TTSProvider] = {}
_session_semaphore: asyncio.Semaphore | None = None


def get_stt() -> STTProvider:
    """Get or create the STT provider singleton."""
    global _stt
    if _stt is None:
        logger.info("Creating STT provider: %s", config.stt_provider)
        _stt = ProviderFactory.create_stt(config)
    return _stt


def get_tts(voice: str) -> TTSProvider:
    """Get or create a TTS provider for a specific voice (cached)."""
    if voice not in _tts_cache:
        logger.info("Creating Edge TTS for voice=%s", voice)
        from src.voice_engine.providers.tts.edge_tts_provider import EdgeTTSProvider

        _tts_cache[voice] = EdgeTTSProvider(voice=voice)
    return _tts_cache[voice]


def get_voice_candidates(mode: str, lang: str) -> list[str]:
    """Get ordered voice candidates for a mode/lang session."""
    safe_lang = (lang or "en").lower().strip()[:2]
    by_mode = VOICE_CANDIDATES.get(mode, VOICE_CANDIDATES["chatbot"])
    if safe_lang in by_mode:
        return by_mode[safe_lang]
    return by_mode.get("en", VOICE_CANDIDATES["chatbot"]["en"])


async def resolve_tts_with_fallback(mode: str, lang: str) -> tuple[TTSProvider | None, str | None]:
    """Pick the first compatible Edge voice by synthesizing a short probe."""
    candidates = get_voice_candidates(mode, lang)
    probe_text = "Bonjour." if (lang or "").lower().startswith("fr") else "Hello."

    for voice in candidates:
        tts = get_tts(voice)
        try:
            probe = await tts.synthesize(probe_text)
            if len(probe) > 0:
                return tts, voice
        except Exception:
            logger.warning("Voice candidate failed: %s", voice, exc_info=True)
            continue

    return None, None


def get_semaphore() -> asyncio.Semaphore:
    """Get session concurrency limiter."""
    global _session_semaphore
    if _session_semaphore is None:
        _session_semaphore = asyncio.Semaphore(config.max_sessions)
    return _session_semaphore


# ---------------------------------------------------------------------------
# TTS -> chunked Int16 binary frames
# ---------------------------------------------------------------------------
async def synthesize_and_send(
    ws: WebSocket,
    tts: TTSProvider,
    text: str,
    interrupted: asyncio.Event,
) -> None:
    """Synthesize text and stream Int16 audio chunks over the WebSocket."""
    if interrupted.is_set():
        return

    audio_f32: np.ndarray = await tts.synthesize(text)
    if len(audio_f32) == 0:
        return

    # Convert float32 [-1,1] -> int16
    audio_i16 = (audio_f32 * 32767.0).clip(-32768, 32767).astype(np.int16)
    raw_bytes = audio_i16.tobytes()

    # Send in chunks for progressive playback
    for offset in range(0, len(raw_bytes), CHUNK_BYTES):
        if interrupted.is_set():
            return
        chunk = raw_bytes[offset : offset + CHUNK_BYTES]
        if ws.client_state == WebSocketState.CONNECTED:
            await ws.send_bytes(chunk)
        await asyncio.sleep(0)  # yield to event loop


async def send_session_greeting(
    ws: WebSocket,
    mode: str,
    lang: str,
    tts: TTSProvider,
    interrupted: asyncio.Event,
) -> None:
    """Send Catherine's spoken greeting when voice session starts."""
    safe_lang = (lang or "en").lower().strip()[:2]
    greetings_by_lang = CATHERINE_GREETING_BY_MODE.get(
        mode, CATHERINE_GREETING_BY_MODE["chatbot"],
    )
    greeting = greetings_by_lang.get(safe_lang, greetings_by_lang["en"])

    await ws.send_text(json.dumps({
        "type": "speaking_start",
        "text": greeting,
    }))
    await synthesize_and_send(ws, tts, greeting, interrupted)
    if ws.client_state == WebSocketState.CONNECTED and not interrupted.is_set():
        await ws.send_text(json.dumps({"type": "speaking_end"}))


# ---------------------------------------------------------------------------
# FastAPI app
# ---------------------------------------------------------------------------
app = FastAPI(title="SIP Voice Server", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health() -> dict[str, Any]:
    """Health check with provider readiness info."""
    return {
        "status": "ok",
        "stt_loaded": _stt is not None,
        "tts_voices_cached": len(_tts_cache),
        "stt_provider": config.stt_provider,
        "tts_provider": config.tts_provider,
    }


# ---------------------------------------------------------------------------
# Main voice WebSocket endpoint
# ---------------------------------------------------------------------------
@app.websocket("/ws/voice/{mode}")
async def voice_ws(
    ws: WebSocket,
    mode: str,
    token: str = Query(default=""),
    lang: str = Query(default="en"),
    conversation_id: str = Query(default=""),
) -> None:
    """Full voice conversation: STT -> LLM (SIP backend) -> TTS."""
    if mode not in ("lawyer", "chatbot"):
        await ws.close(code=4000, reason="Invalid mode. Use 'lawyer' or 'chatbot'.")
        return

    # Enforce concurrency limit
    sem = get_semaphore()
    if sem.locked():
        await ws.accept()
        await ws.send_text(json.dumps({
            "type": "error",
            "message": "Voice server is at capacity. Please try again shortly.",
        }))
        await ws.close(code=4003)
        return

    async with sem:
        await ws.accept()
        logger.info("Voice session started: mode=%s lang=%s", mode, lang)

        safe_lang = (lang or "en").lower().strip()[:2]

        # Resolve voice for this mode + language with fallback
        tts, voice = await resolve_tts_with_fallback(mode, safe_lang)
        if tts is None or voice is None:
            await ws.send_text(json.dumps({
                "type": "error",
                "message": f"No compatible TTS voice available for language '{safe_lang}'.",
            }))
            await ws.close(code=4002)
            return

        # Create per-session SipLLM
        llm = SipLLM(
            backend_url=config.llm_base_url,
            mode=mode,
            token=token,
            language=safe_lang,
            conversation_id=conversation_id,
        )

        # Tell client we're ready
        await ws.send_text(json.dumps({
            "type": "ready",
            "voice": voice,
            "mode": mode,
            "sample_rate": EDGE_TTS_SAMPLE_RATE,
        }))

        audio_buffer: list[np.ndarray] = []
        history: list[dict[str, str]] = []
        interrupted = asyncio.Event()
        speaking_task: asyncio.Task[None] | None = None

        # Catherine greeting on session start (both modes).
        try:
            await send_session_greeting(ws, mode, safe_lang, tts, interrupted)
        except Exception:
            logger.warning("Greeting failed for mode=%s lang=%s", mode, safe_lang, exc_info=True)

        try:
            while True:
                msg = await ws.receive()

                # --- Binary frame: raw Float32 mic audio ---
                if "bytes" in msg and msg["bytes"] is not None:
                    chunk = np.frombuffer(msg["bytes"], dtype=np.float32)
                    audio_buffer.append(chunk)

                # --- Text frame: JSON control message ---
                elif "text" in msg and msg["text"] is not None:
                    try:
                        payload: dict[str, Any] = json.loads(msg["text"])
                    except json.JSONDecodeError:
                        await ws.send_text(json.dumps({
                            "type": "error",
                            "message": "Invalid control message.",
                        }))
                        continue
                    msg_type = payload.get("type", "")

                    if msg_type == "hangup":
                        logger.info("Hangup received: mode=%s", mode)
                        break

                    if msg_type == "interrupt":
                        interrupted.set()
                        if speaking_task and not speaking_task.done():
                            speaking_task.cancel()
                            with contextlib.suppress(asyncio.CancelledError):
                                await speaking_task
                        if ws.client_state == WebSocketState.CONNECTED:
                            await ws.send_text(json.dumps({"type": "speaking_end"}))
                        interrupted.clear()
                        audio_buffer.clear()
                        continue

                    if msg_type == "end_of_speech":
                        if not audio_buffer:
                            continue

                        # --- STT ---
                        full_audio = np.concatenate(audio_buffer)
                        audio_buffer.clear()

                        stt = get_stt()
                        transcript = await stt.transcribe(full_audio, MIC_SAMPLE_RATE)
                        transcript = transcript.strip()

                        if not transcript:
                            await ws.send_text(json.dumps({
                                "type": "transcription",
                                "text": "",
                            }))
                            continue

                        await ws.send_text(json.dumps({
                            "type": "transcription",
                            "text": transcript,
                        }))

                        # --- LLM (streaming) + Sentence Collector + TTS ---
                        history.append({"role": "user", "content": transcript})
                        interrupted.clear()

                        speaking_task = asyncio.create_task(
                            _stream_response_and_speak(
                                ws, llm, tts, history, interrupted,
                            )
                        )
                        with contextlib.suppress(asyncio.CancelledError):
                            await speaking_task

        except WebSocketDisconnect:
            logger.info("Voice session disconnected: mode=%s", mode)
        except Exception:
            logger.exception("Voice session error: mode=%s", mode)
            try:
                if ws.client_state == WebSocketState.CONNECTED:
                    await ws.send_text(json.dumps({
                        "type": "error",
                        "message": "Internal server error",
                    }))
            except Exception:
                pass
        finally:
            interrupted.set()
            if speaking_task and not speaking_task.done():
                speaking_task.cancel()
            logger.info("Voice session ended: mode=%s", mode)


async def _stream_response_and_speak(
    ws: WebSocket,
    llm: SipLLM,
    tts: TTSProvider,
    history: list[dict[str, str]],
    interrupted: asyncio.Event,
) -> None:
    """Stream LLM tokens, collect into sentences, synthesize + send TTS audio."""
    collector = SentenceCollector()
    full_response_parts: list[str] = []
    first_sentence = True

    async for token in llm.stream_response(messages=history, system=""):
        if interrupted.is_set():
            break

        full_response_parts.append(token)
        sentences = collector.feed(token)

        for sentence in sentences:
            if interrupted.is_set():
                break

            if first_sentence:
                # Send speaking_start with the first sentence as preview
                await ws.send_text(json.dumps({
                    "type": "speaking_start",
                    "text": sentence,
                }))
                first_sentence = False

            await synthesize_and_send(ws, tts, sentence, interrupted)

    # Flush any remaining text in the collector
    if not interrupted.is_set():
        remainder = collector.flush()
        if remainder:
            if first_sentence:
                await ws.send_text(json.dumps({
                    "type": "speaking_start",
                    "text": remainder,
                }))
                first_sentence = False
            await synthesize_and_send(ws, tts, remainder, interrupted)

    # Finalize
    full_response = "".join(full_response_parts).strip()
    if full_response:
        history.append({"role": "assistant", "content": full_response})

    if not interrupted.is_set() and ws.client_state == WebSocketState.CONNECTED:
        await ws.send_text(json.dumps({"type": "speaking_end"}))

        # Send metadata from SipLLM if available
        if llm.last_metadata:
            await ws.send_text(json.dumps({
                "type": "metadata",
                **llm.last_metadata,
            }))
