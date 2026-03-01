'use client'

import { useEffect, useRef, RefObject } from 'react'

export type SwipeDirection = 'up' | 'down' | 'left' | 'right'

export interface SwipeConfig {
  onSwipe?: (direction: SwipeDirection) => void
  onSwipeStart?: (x: number, y: number) => void
  onSwipeEnd?: (x: number, y: number) => void
  threshold?: number // Minimum distance for swipe (px)
  velocityThreshold?: number // Minimum velocity for swipe (px/ms)
  preventDefaultTouchmoveEvent?: boolean
}

interface TouchInfo {
  startX: number
  startY: number
  startTime: number
  currentX: number
  currentY: number
  currentTime: number
}

/**
 * Hook for detecting swipe gestures on touch devices
 * @param config - Swipe configuration
 * @returns ref - Attach to the element you want to detect swipes on
 */
export function useSwipeGesture<T extends HTMLElement = HTMLElement>(
  config: SwipeConfig
): RefObject<T> {
  const elementRef = useRef<T>(null)
  const touchInfo = useRef<TouchInfo | null>(null)

  const {
    onSwipe,
    onSwipeStart,
    onSwipeEnd,
    threshold = 50,
    velocityThreshold = 0.3,
    preventDefaultTouchmoveEvent = false,
  } = config

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      touchInfo.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        startTime: Date.now(),
        currentX: touch.clientX,
        currentY: touch.clientY,
        currentTime: Date.now(),
      }

      onSwipeStart?.(touch.clientX, touch.clientY)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchInfo.current) return

      const touch = e.touches[0]
      touchInfo.current.currentX = touch.clientX
      touchInfo.current.currentY = touch.clientY
      touchInfo.current.currentTime = Date.now()

      if (preventDefaultTouchmoveEvent) {
        e.preventDefault()
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchInfo.current) return

      const { startX, startY, startTime, currentX, currentY, currentTime } = touchInfo.current

      const deltaX = currentX - startX
      const deltaY = currentY - startY
      const deltaTime = currentTime - startTime

      const absX = Math.abs(deltaX)
      const absY = Math.abs(deltaY)

      // Calculate velocity
      const velocityX = absX / deltaTime
      const velocityY = absY / deltaTime

      onSwipeEnd?.(currentX, currentY)

      // Determine swipe direction
      let direction: SwipeDirection | null = null

      // Check if movement exceeds threshold
      if (absX > threshold || absY > threshold) {
        // Check if velocity exceeds threshold
        if (velocityX > velocityThreshold || velocityY > velocityThreshold) {
          // Determine primary direction
          if (absX > absY) {
            // Horizontal swipe
            direction = deltaX > 0 ? 'right' : 'left'
          } else {
            // Vertical swipe
            direction = deltaY > 0 ? 'down' : 'up'
          }
        }
      }

      if (direction && onSwipe) {
        onSwipe(direction)
      }

      touchInfo.current = null
    }

    // Add event listeners
    element.addEventListener('touchstart', handleTouchStart, { passive: true })
    element.addEventListener('touchmove', handleTouchMove, { passive: !preventDefaultTouchmoveEvent })
    element.addEventListener('touchend', handleTouchEnd, { passive: true })
    element.addEventListener('touchcancel', handleTouchEnd, { passive: true })

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchmove', handleTouchMove)
      element.removeEventListener('touchend', handleTouchEnd)
      element.removeEventListener('touchcancel', handleTouchEnd)
    }
  }, [onSwipe, onSwipeStart, onSwipeEnd, threshold, velocityThreshold, preventDefaultTouchmoveEvent])

  return elementRef
}

/**
 * Simple swipe hook with direction callbacks
 */
export function useSwipe<T extends HTMLElement = HTMLElement>(handlers: {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  threshold?: number
  velocityThreshold?: number
}) {
  return useSwipeGesture<T>({
    onSwipe: (direction) => {
      switch (direction) {
        case 'left':
          handlers.onSwipeLeft?.()
          break
        case 'right':
          handlers.onSwipeRight?.()
          break
        case 'up':
          handlers.onSwipeUp?.()
          break
        case 'down':
          handlers.onSwipeDown?.()
          break
      }
    },
    threshold: handlers.threshold,
    velocityThreshold: handlers.velocityThreshold,
  })
}
