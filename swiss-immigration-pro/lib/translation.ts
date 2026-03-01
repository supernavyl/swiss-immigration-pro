/**
 * Translation utilities for Google Translate integration
 */

/**
 * Force Google Translate to re-translate the entire page
 */
export function forceRetranslate(): void {
  if (typeof window === 'undefined') return

  const preferredLanguage = localStorage.getItem('preferredLanguage')
  if (!preferredLanguage || preferredLanguage === 'en') return

  const select = document.querySelector('.goog-te-combo') as HTMLSelectElement
  if (select) {
    // Trigger change event to force re-translation
    select.dispatchEvent(new Event('change', { bubbles: true }))
  }
}

/**
 * Wait for Google Translate to be ready, then trigger translation
 */
export function waitForGoogleTranslate(callback: () => void, maxAttempts = 20): void {
  if (typeof window === 'undefined') return

  let attempts = 0
  const checkInterval = setInterval(() => {
    attempts++
    if (window.google?.translate?.TranslateElement || attempts >= maxAttempts) {
      clearInterval(checkInterval)
      if (attempts < maxAttempts) {
        callback()
      }
    }
  }, 100)
}

/**
 * Ensure content is translatable by Google Translate
 * Adds data attributes that help Google Translate detect content
 */
export function markAsTranslatable(element: HTMLElement): void {
  if (!element) return
  
  // Add data attribute to help Google Translate
  element.setAttribute('data-translate', 'yes')
  
  // Ensure text nodes are accessible
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    null
  )
  
  let node
  while (node = walker.nextNode()) {
    if (node.textContent && node.textContent.trim().length > 0) {
      // Text nodes are automatically handled by Google Translate
      // But we can ensure parent elements are marked
      if (node.parentElement) {
        node.parentElement.setAttribute('data-translate', 'yes')
      }
    }
  }
}







