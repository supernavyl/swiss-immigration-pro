'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * Fluid typing animation hook.
 *
 * Reveals `content` character-by-character using requestAnimationFrame
 * for butter-smooth 60 fps rendering. Adapts speed automatically —
 * cruises at a natural pace but accelerates if the content buffer grows
 * faster than the reveal (common with SSE token bursts).
 *
 * When `isStreaming` flips to false the remaining buffer is flushed
 * smoothly rather than dumped all at once.
 */
export function useTypingEffect(
  content: string,
  isStreaming: boolean,
  /** Base characters-per-second. Default: 80 (fast enough to feel snappy). */
  baseCps: number = 80,
) {
  const [displayed, setDisplayed] = useState(() =>
    // If content is already present and not streaming, show it immediately
    // (e.g. loaded from localStorage / welcome message)
    isStreaming ? '' : content,
  )

  // Refs survive re-renders without triggering them
  const indexRef = useRef(isStreaming ? 0 : content.length)
  const targetRef = useRef(content)
  const streamingRef = useRef(isStreaming)
  const frameRef = useRef<number | null>(null)
  const prevTimeRef = useRef<number | null>(null)

  // Keep refs in sync
  targetRef.current = content
  streamingRef.current = isStreaming

  // ------------------------------------------------------------------
  // Animation loop
  // ------------------------------------------------------------------
  const tick = useCallback(
    (now: number) => {
      if (prevTimeRef.current === null) {
        prevTimeRef.current = now
      }

      const dt = (now - prevTimeRef.current) / 1000 // seconds elapsed
      prevTimeRef.current = now

      const target = targetRef.current
      const currentIndex = indexRef.current

      if (currentIndex < target.length) {
        // How far behind we are
        const backlog = target.length - currentIndex

        // Adaptive speed: cruising CPS when close, ramp up when falling behind
        let cps = baseCps
        if (backlog > 120) {
          // Way behind → snap quickly (happens after large token bursts)
          cps = baseCps * 6
        } else if (backlog > 60) {
          cps = baseCps * 3
        } else if (backlog > 20) {
          cps = baseCps * 1.5
        }

        // When streaming ended, flush remaining chars faster
        if (!streamingRef.current && backlog > 0) {
          cps = Math.max(cps, baseCps * 4)
        }

        const charsToReveal = Math.max(1, Math.round(cps * dt))
        const newIndex = Math.min(currentIndex + charsToReveal, target.length)
        indexRef.current = newIndex
        setDisplayed(target.slice(0, newIndex))
      }

      // Keep running if still catching up, or still streaming
      if (indexRef.current < targetRef.current.length || streamingRef.current) {
        frameRef.current = requestAnimationFrame(tick)
      } else {
        frameRef.current = null
        prevTimeRef.current = null
      }
    },
    [baseCps],
  )

  // ------------------------------------------------------------------
  // Start / restart animation when content grows or streaming starts
  // ------------------------------------------------------------------
  useEffect(() => {
    if (isStreaming || indexRef.current < content.length) {
      // Kick off the loop if it isn't already running
      if (frameRef.current === null) {
        prevTimeRef.current = null
        frameRef.current = requestAnimationFrame(tick)
      }
    }

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current)
        frameRef.current = null
      }
    }
  }, [content, isStreaming, tick])

  // ------------------------------------------------------------------
  // For non-streaming messages that arrive fully formed (e.g. welcome),
  // just show them immediately — no animation.
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!isStreaming && indexRef.current === 0 && content.length > 0) {
      indexRef.current = content.length
      setDisplayed(content)
    }
  }, [content, isStreaming])

  const isTyping = indexRef.current < targetRef.current.length || isStreaming

  return { displayed, isTyping }
}
