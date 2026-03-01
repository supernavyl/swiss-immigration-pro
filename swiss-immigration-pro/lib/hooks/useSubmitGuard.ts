'use client'

import { useState, useCallback, useRef } from 'react'

/**
 * Prevents double-submissions on forms.
 * Wraps an async handler so concurrent calls are ignored while one is in-flight.
 */
export function useSubmitGuard() {
  const [submitting, setSubmitting] = useState(false)
  const lockRef = useRef(false)

  const guard = useCallback(async (fn: () => Promise<void>) => {
    if (lockRef.current) return
    lockRef.current = true
    setSubmitting(true)
    try {
      await fn()
    } finally {
      lockRef.current = false
      setSubmitting(false)
    }
  }, [])

  return { submitting, guard } as const
}
