'use client'

import { useState, useEffect } from 'react'
import { useMediaQuery, useIsMobile, useIsTouchDevice } from './useMediaQuery'

interface MobileInfo {
  isMobile: boolean
  isTouch: boolean
  isLandscape: boolean
  viewportWidth: number
  viewportHeight: number
  devicePixelRatio: number
}

/**
 * Comprehensive mobile detection hook
 * @returns MobileInfo object with device characteristics
 */
export function useMobile(): MobileInfo {
  const isMobile = useIsMobile()
  const isTouch = useIsTouchDevice()
  
  const [info, setInfo] = useState<MobileInfo>({
    isMobile: false,
    isTouch: false,
    isLandscape: false,
    viewportWidth: 0,
    viewportHeight: 0,
    devicePixelRatio: 1,
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateInfo = () => {
      setInfo({
        isMobile,
        isTouch,
        isLandscape: window.innerWidth > window.innerHeight,
        viewportWidth: window.visualViewport?.width || window.innerWidth,
        viewportHeight: window.visualViewport?.height || window.innerHeight,
        devicePixelRatio: window.devicePixelRatio || 1,
      })
    }

    updateInfo()

    // Listen for orientation changes
    window.addEventListener('resize', updateInfo)
    window.addEventListener('orientationchange', updateInfo)

    // Visual viewport API for better mobile support (keyboard handling)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateInfo)
    }

    return () => {
      window.removeEventListener('resize', updateInfo)
      window.removeEventListener('orientationchange', updateInfo)
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateInfo)
      }
    }
  }, [isMobile, isTouch])

  return info
}

/**
 * Detect if device is iOS
 */
export function useIsIOS(): boolean {
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const userAgent = window.navigator.userAgent.toLowerCase()
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent)
    setIsIOS(isIOSDevice)
  }, [])

  return isIOS
}

/**
 * Detect if device is Android
 */
export function useIsAndroid(): boolean {
  const [isAndroid, setIsAndroid] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const userAgent = window.navigator.userAgent.toLowerCase()
    const isAndroidDevice = /android/.test(userAgent)
    setIsAndroid(isAndroidDevice)
  }, [])

  return isAndroid
}

/**
 * Get safe area insets for notched devices
 */
export function useSafeArea() {
  const [insets, setInsets] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateInsets = () => {
      const computedStyle = getComputedStyle(document.documentElement)
      setInsets({
        top: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-top)') || '0'),
        right: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-right)') || '0'),
        bottom: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-bottom)') || '0'),
        left: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-left)') || '0'),
      })
    }

    updateInsets()
    window.addEventListener('resize', updateInsets)
    
    return () => window.removeEventListener('resize', updateInsets)
  }, [])

  return insets
}
