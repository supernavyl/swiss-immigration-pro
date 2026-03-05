"""Collects LLM tokens into complete sentences for natural TTS pacing."""

from __future__ import annotations

import logging
import re

logger = logging.getLogger(__name__)

# Matches sentence-ending punctuation followed by whitespace or end-of-string.
_SENTENCE_END_RE = re.compile(r'(?<=[.!?])\s+|(?<=\.\.\.)\s+')

# Maximum buffer length before we force a split on secondary delimiters.
_LONG_BUFFER_THRESHOLD = 80


class SentenceCollector:
    """Accumulates streaming tokens and extracts complete sentences.

    This class is designed to sit between the LLM token stream and TTS synthesis,
    ensuring that each TTS call receives a grammatically complete sentence for
    natural-sounding speech output.
    """

    def __init__(self, long_threshold: int = _LONG_BUFFER_THRESHOLD) -> None:
        self._buffer: str = ""
        self._long_threshold = long_threshold

    def feed(self, token: str) -> list[str]:
        """Feed a token into the collector.

        Returns a (possibly empty) list of complete sentences extracted from
        the buffer so far.
        """
        self._buffer += token
        sentences: list[str] = []

        while True:
            sentence = self._try_extract()
            if sentence is None:
                break
            sentences.append(sentence)

        return sentences

    def _try_extract(self) -> str | None:
        """Try to extract one complete sentence from the buffer."""
        # Look for sentence-ending punctuation followed by a space or end
        match = _SENTENCE_END_RE.search(self._buffer)
        if match:
            # Split at the match position — sentence ends just before the space
            split_pos = match.start()
            sentence = self._buffer[:split_pos].strip()
            self._buffer = self._buffer[match.end():]
            if sentence:
                logger.debug("Sentence extracted: %s", sentence[:60])
                return sentence
            return None

        # Check if the buffer ends with sentence-ending punctuation (no trailing space yet)
        # We don't extract yet because the next token might continue the sentence.
        # But if the buffer is very long, force a split on semicolons or colons.
        if len(self._buffer) > self._long_threshold:
            # Try splitting on ; or : for better TTS pacing
            for delimiter in ("; ", ": "):
                idx = self._buffer.find(delimiter)
                if idx > 0:
                    sentence = self._buffer[: idx + 1].strip()
                    self._buffer = self._buffer[idx + 2:]
                    if sentence:
                        logger.debug("Long-buffer split: %s", sentence[:60])
                        return sentence

        return None

    def flush(self) -> str | None:
        """Return any remaining buffered text, or None if empty."""
        remaining = self._buffer.strip()
        self._buffer = ""
        if remaining:
            logger.debug("Flushed remainder: %s", remaining[:60])
            return remaining
        return None

    def reset(self) -> None:
        """Clear the internal buffer."""
        self._buffer = ""
