'use client'

import { useState, useEffect } from 'react'

/**
 * Hook for responsive design with media queries
 * @param query - CSS media query string (e.g., "(max-width: 768px)")
 * @returns boolean - true if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Only run on client
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia(query)
    
    // Set initial value
    setMatches(mediaQuery.matches)

    // Create event listener
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler)
      return () => mediaQuery.removeEventListener('change', handler)
    } else {
      // Legacy browsers (Safari < 14)
      mediaQuery.addListener(handler)
      return () => mediaQuery.removeListener(handler)
    }
  }, [query])

  // Return false during SSR to prevent hydration mismatch
  return mounted ? matches : false
}

/**
 * Predefined breakpoint hooks for common screen sizes
 */
export function useIsMobile() {
  return useMediaQuery('(max-width: 768px)')
}

export function useIsTablet() {
  return useMediaQuery('(min-width: 769px) and (max-width: 1024px)')
}

export function useIsDesktop() {
  return useMediaQuery('(min-width: 1025px)')
}

export function useIsSmallMobile() {
  return useMediaQuery('(max-width: 480px)')
}

export function useIsTouchDevice() {
  return useMediaQuery('(hover: none) and (pointer: coarse)')
}

export function usePrefersReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}
