'use client'

import { useCallback, useEffect, useState } from 'react'
import { triggerHaptic, type HapticPattern } from '@/lib/utils/haptics'

/**
 * Hook for haptic feedback with feature detection
 * @returns Object with haptic trigger function and support status
 */
export function useHaptic() {
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    setIsSupported('vibrate' in navigator)
  }, [])

  const haptic = useCallback(
    (pattern: HapticPattern = 'light') => {
      if (isSupported) {
        triggerHaptic(pattern)
      }
    },
    [isSupported]
  )

  return {
    haptic,
    isSupported,
  }
}

/**
 * Hook for haptic feedback on specific events
 */
export function useHapticFeedback(pattern: HapticPattern = 'light') {
  const { haptic } = useHaptic()

  const trigger = useCallback(() => {
    haptic(pattern)
  }, [haptic, pattern])

  return trigger
}
