/**
 * Performance optimization utilities
 */

/**
 * Lazy load images with Intersection Observer
 */
export function lazyLoadImage(img: HTMLImageElement, src: string) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          img.src = src
          img.classList.add('loaded')
          observer.unobserve(img)
        }
      })
    },
    { rootMargin: '50px' }
  )

  observer.observe(img)
  return () => observer.disconnect()
}

/**
 * Batch DOM updates for better performance
 */
export function batchDOMUpdates(updates: (() => void)[]) {
  // Use requestAnimationFrame to batch updates
  requestAnimationFrame(() => {
    updates.forEach((update) => update())
  })
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Optimize scroll performance
 */
export function optimizeScroll(element: HTMLElement) {
  // Use CSS containment for better scroll performance
  element.style.contain = 'layout style paint'
  
  // Enable hardware acceleration
  element.style.willChange = 'transform'
  element.style.transform = 'translateZ(0)'
}

/**
 * Create optimized animation frame loop
 */
export function createAnimationLoop(
  callback: (deltaTime: number) => void,
  targetFPS: number = 60
) {
  let animationId: number | null = null
  let lastTime = performance.now()
  const frameInterval = 1000 / targetFPS

  const loop = (currentTime: number) => {
    const deltaTime = currentTime - lastTime

    if (deltaTime >= frameInterval) {
      callback(deltaTime)
      lastTime = currentTime - (deltaTime % frameInterval)
    }

    animationId = requestAnimationFrame(loop)
  }

  const start = () => {
    lastTime = performance.now()
    animationId = requestAnimationFrame(loop)
  }

  const stop = () => {
    if (animationId !== null) {
      cancelAnimationFrame(animationId)
      animationId = null
    }
  }

  return { start, stop }
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Memoize expensive computations
 */
export function memoize<Args extends any[], Return>(
  fn: (...args: Args) => Return
): (...args: Args) => Return {
  const cache = new Map<string, Return>()

  return (...args: Args): Return => {
    const key = JSON.stringify(args)
    if (cache.has(key)) {
      return cache.get(key)!
    }
    const result = fn(...args)
    cache.set(key, result)
    return result
  }
}

/**
 * Preload critical resources
 */
export function preloadResource(href: string, as: 'script' | 'style' | 'image' | 'font') {
  const link = document.createElement('link')
  link.rel = 'preload'
  link.href = href
  link.as = as
  if (as === 'font') {
    link.crossOrigin = 'anonymous'
  }
  document.head.appendChild(link)
}

/**
 * Check if element is in viewport
 */
export function isInViewport(element: HTMLElement, threshold: number = 0): boolean {
  const rect = element.getBoundingClientRect()
  const windowHeight = window.innerHeight || document.documentElement.clientHeight
  const windowWidth = window.innerWidth || document.documentElement.clientWidth

  return (
    rect.top >= -threshold &&
    rect.left >= -threshold &&
    rect.bottom <= windowHeight + threshold &&
    rect.right <= windowWidth + threshold
  )
}






















