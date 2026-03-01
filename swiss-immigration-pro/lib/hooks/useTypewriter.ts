'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

// ---------------------------------------------------------------------------
// useTypewriter — gradually reveals text character by character
// ---------------------------------------------------------------------------
//
// For **streaming** messages the content grows externally (new tokens arrive).
// The hook buffers that growth and releases characters at a steady cadence so
// the visual typing speed stays smooth even when tokens arrive in bursts.
//
// For **static** messages (welcome, error, history) you can set `enabled` to
// trigger a one-shot typewriter reveal.
// ---------------------------------------------------------------------------

export interface UseTypewriterOptions {
  /** The full (or growing) text to reveal */
  text: string
  /** Characters per tick (default 1) */
  charsPerTick?: number
  /** Milliseconds between ticks (default 16 ≈ 60 fps) */
  speed?: number
  /** Whether the source is still streaming (more text may arrive) */
  isStreaming?: boolean
  /** Set false to display all text immediately (e.g. old messages) */
  enabled?: boolean
}

export interface UseTypewriterReturn {
  /** The portion of text revealed so far */
  displayedText: string
  /** True while characters are still being revealed */
  isTyping: boolean
  /** Jump to fully revealed */
  skipToEnd: () => void
}

export function useTypewriter({
  text,
  charsPerTick = 1,
  speed = 16,
  isStreaming = false,
  enabled = true,
}: UseTypewriterOptions): UseTypewriterReturn {
  // Index of how many characters have been "typed" so far
  const [cursor, setCursor] = useState(enabled ? 0 : text.length)
  const targetRef = useRef(text)
  const rafRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Keep target up to date so the interval always sees the latest text
  targetRef.current = text

  // Start / continue the typing interval whenever there's un-revealed text
  useEffect(() => {
    if (!enabled) {
      setCursor(text.length)
      return
    }

    // Nothing left to type and stream is done → stop
    if (cursor >= text.length && !isStreaming) {
      if (rafRef.current) {
        clearInterval(rafRef.current)
        rafRef.current = null
      }
      return
    }

    // Already running
    if (rafRef.current) return

    rafRef.current = setInterval(() => {
      setCursor((prev) => {
        const target = targetRef.current.length
        if (prev >= target) {
          // Caught up — pause but don't clear if still streaming
          return prev
        }
        // Type a batch of characters per tick
        return Math.min(prev + charsPerTick, target)
      })
    }, speed)

    return () => {
      if (rafRef.current) {
        clearInterval(rafRef.current)
        rafRef.current = null
      }
    }
    // Re-run when text grows (new streaming tokens) or streaming ends
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text.length, isStreaming, enabled, speed, charsPerTick])

  // If text shrinks (e.g. chat cleared), reset cursor
  useEffect(() => {
    if (text.length < cursor) {
      setCursor(enabled ? 0 : text.length)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])

  const skipToEnd = useCallback(() => {
    if (rafRef.current) {
      clearInterval(rafRef.current)
      rafRef.current = null
    }
    setCursor(targetRef.current.length)
  }, [])

  const displayedText = text.slice(0, cursor)
  const isTyping = cursor < text.length || isStreaming

  return { displayedText, isTyping, skipToEnd }
}
