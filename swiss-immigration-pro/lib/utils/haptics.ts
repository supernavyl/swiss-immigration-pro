'use client'

/**
 * Haptic feedback patterns for different interaction types
 */
export type HapticPattern = 
  | 'light'      // Quick tap (10ms)
  | 'medium'     // Standard tap (20ms)
  | 'heavy'      // Strong tap (30ms)
  | 'success'    // Success pattern [10, 50, 10]
  | 'warning'    // Warning pattern [20, 100, 20]
  | 'error'      // Error pattern [30, 100, 30, 100, 30]
  | 'selection'  // Selection change [5]
  | 'impact'     // Impact feedback [15]
  | 'double'     // Double tap [10, 50, 10]
  | 'triple'     // Triple tap [10, 50, 10, 50, 10]

/**
 * Vibration patterns mapped to haptic types
 */
const HAPTIC_PATTERNS: Record<HapticPattern, number | number[]> = {
  light: 10,
  medium: 20,
  heavy: 30,
  success: [10, 50, 10],
  warning: [20, 100, 20],
  error: [30, 100, 30, 100, 30],
  selection: 5,
  impact: 15,
  double: [10, 50, 10],
  triple: [10, 50, 10, 50, 10],
}

/**
 * Check if haptic feedback is supported
 */
export function isHapticSupported(): boolean {
  if (typeof window === 'undefined') return false
  return 'vibrate' in navigator
}

/**
 * Trigger haptic feedback
 * @param pattern - Haptic pattern type
 * @returns boolean - true if haptic was triggered successfully
 */
export function triggerHaptic(pattern: HapticPattern = 'light'): boolean {
  if (!isHapticSupported()) return false

  try {
    const vibrationPattern = HAPTIC_PATTERNS[pattern]
    return navigator.vibrate(vibrationPattern)
  } catch (error) {
    console.warn('Haptic feedback failed:', error)
    return false
  }
}

/**
 * Cancel any ongoing haptic feedback
 */
export function cancelHaptic(): boolean {
  if (!isHapticSupported()) return false

  try {
    return navigator.vibrate(0)
  } catch (error) {
    console.warn('Cancel haptic failed:', error)
    return false
  }
}

/**
 * Create a custom vibration pattern
 * @param pattern - Array of vibration durations in ms [vibrate, pause, vibrate, pause, ...]
 */
export function customHaptic(pattern: number[]): boolean {
  if (!isHapticSupported()) return false

  try {
    return navigator.vibrate(pattern)
  } catch (error) {
    console.warn('Custom haptic failed:', error)
    return false
  }
}

/**
 * Haptic feedback for common UI interactions
 */
export const haptics = {
  // Button press
  buttonPress: () => triggerHaptic('light'),
  
  // Toggle switch
  toggle: () => triggerHaptic('selection'),
  
  // Menu open/close
  menuOpen: () => triggerHaptic('medium'),
  menuClose: () => triggerHaptic('light'),
  
  // Navigation
  navigate: () => triggerHaptic('light'),
  
  // Form interactions
  formSuccess: () => triggerHaptic('success'),
  formError: () => triggerHaptic('error'),
  
  // Notifications
  notification: () => triggerHaptic('warning'),
  
  // Drag and drop
  pickUp: () => triggerHaptic('medium'),
  drop: () => triggerHaptic('light'),
  
  // Swipe actions
  swipe: () => triggerHaptic('light'),
  
  // Long press
  longPress: () => triggerHaptic('heavy'),
  
  // Impact
  impact: () => triggerHaptic('impact'),
  
  // Selection
  select: () => triggerHaptic('selection'),
}

export default haptics
