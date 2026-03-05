"use client";

import { useCallback, useRef, useState } from "react";

const TTS_SAMPLE_RATE = 24_000;

interface UseAudioPlaybackReturn {
  /** Queue an Int16LE audio chunk for playback */
  playChunk: (data: ArrayBuffer) => void;
  /** Stop all audio and clear the queue */
  stop: () => void;
  /** Whether audio is currently playing */
  isPlaying: boolean;
  /** Initialize the AudioContext (call on user gesture) */
  init: () => void;
  /** Cleanup resources */
  cleanup: () => void;
}

/**
 * Manages Web Audio API playback of Int16LE PCM chunks streamed from VoiceEngine.
 * Schedules chunks with precise timing to avoid gaps between buffers.
 */
export function useAudioPlayback(): UseAudioPlaybackReturn {
  const ctxRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const init = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext({ sampleRate: TTS_SAMPLE_RATE });
    }
    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume();
    }
  }, []);

  const playChunk = useCallback((data: ArrayBuffer) => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    // Decode Int16LE to Float32
    const int16 = new Int16Array(data);
    const float32 = new Float32Array(int16.length);
    for (let i = 0; i < int16.length; i++) {
      float32[i] = int16[i] / 32768;
    }

    // Create audio buffer
    const buffer = ctx.createBuffer(1, float32.length, TTS_SAMPLE_RATE);
    buffer.getChannelData(0).set(float32);

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);

    // Schedule with precise timing to avoid gaps
    const startTime = Math.max(ctx.currentTime, nextStartTimeRef.current);
    source.start(startTime);
    nextStartTimeRef.current = startTime + buffer.duration;

    sourcesRef.current.push(source);
    setIsPlaying(true);

    source.onended = () => {
      const idx = sourcesRef.current.indexOf(source);
      if (idx !== -1) sourcesRef.current.splice(idx, 1);
      if (sourcesRef.current.length === 0) {
        setIsPlaying(false);
      }
    };
  }, []);

  const stop = useCallback(() => {
    for (const source of sourcesRef.current) {
      try {
        source.stop();
        source.disconnect();
      } catch {
        // Already stopped
      }
    }
    sourcesRef.current = [];
    nextStartTimeRef.current = 0;
    setIsPlaying(false);
  }, []);

  const cleanup = useCallback(() => {
    stop();
    if (ctxRef.current) {
      ctxRef.current.close();
      ctxRef.current = null;
    }
  }, [stop]);

  return { playChunk, stop, isPlaying, init, cleanup };
}
