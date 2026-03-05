"""Groq Whisper API STT provider — fast cloud transcription."""

from __future__ import annotations

import asyncio
import io
import logging
from collections.abc import AsyncIterator

import numpy as np

from src.voice_engine.providers.base import STTProvider

logger = logging.getLogger(__name__)


class GroqSTT(STTProvider):
    """Transcription via Groq's Whisper API (whisper-large-v3-turbo)."""

    def __init__(
        self,
        api_key: str,
        model: str = "whisper-large-v3-turbo",
        language: str = "en",
    ) -> None:
        self._api_key = api_key
        self._model = model
        self._language = language
        self._client: object | None = None
        logger.info("GroqSTT configured: model=%s language=%s", model, language)

    def _get_client(self) -> object:
        """Lazy-load the Groq client."""
        if self._client is None:
            from groq import Groq  # type: ignore[import-untyped]

            self._client = Groq(api_key=self._api_key)
        return self._client

    @staticmethod
    def _audio_to_wav_bytes(audio: np.ndarray, sample_rate: int) -> bytes:
        """Convert a float32 numpy array to in-memory WAV bytes."""
        import soundfile as sf  # type: ignore[import-untyped]

        buf = io.BytesIO()
        audio_f32 = audio.astype(np.float32) if audio.dtype != np.float32 else audio
        sf.write(buf, audio_f32, sample_rate, format="WAV", subtype="FLOAT")
        buf.seek(0)
        return buf.read()

    async def transcribe(self, audio: np.ndarray, sample_rate: int) -> str:
        """Transcribe a complete audio buffer via Groq Whisper API."""
        client = self._get_client()
        wav_bytes = await asyncio.get_running_loop().run_in_executor(
            None, self._audio_to_wav_bytes, audio, sample_rate,
        )

        # Groq's SDK is synchronous — run in executor
        def _call_api() -> str:
            response = client.audio.transcriptions.create(  # type: ignore[union-attr]
                model=self._model,
                file=("audio.wav", wav_bytes),
                language=self._language,
                response_format="text",
            )
            return str(response).strip()

        transcript = await asyncio.get_running_loop().run_in_executor(None, _call_api)
        logger.info("Groq STT transcript: %s", transcript[:80] if transcript else "(empty)")
        return transcript

    async def transcribe_stream(
        self,
        audio_chunks: AsyncIterator[np.ndarray],
        sample_rate: int,
    ) -> AsyncIterator[str]:
        """Accumulate chunks then transcribe (Groq API is batch-only)."""
        collected: list[np.ndarray] = []
        async for chunk in audio_chunks:
            collected.append(chunk)

        if not collected:
            return

        full_audio = np.concatenate(collected)
        transcript = await self.transcribe(full_audio, sample_rate)
        if transcript:
            yield transcript
