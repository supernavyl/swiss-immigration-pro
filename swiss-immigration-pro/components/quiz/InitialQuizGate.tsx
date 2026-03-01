'use client'

import { useCallback, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import type { QuizAnswers } from '@/lib/layerLogic'

const InitialQuizModal = dynamic(
  () => import('./InitialQuizModal'),
  {
    ssr: false,
    loading: () => null,
  }
)

declare global {
  interface Window {
    openInitialQuiz?: () => void
  }
}

export function InitialQuizGate() {
  const [isOpen, setIsOpen] = useState(false)

  const openQuiz = useCallback(() => {
    setIsOpen(true)
  }, [])

  const closeQuiz = useCallback(() => {
    setIsOpen(false)
  }, [])

  useEffect(() => {
    window.openInitialQuiz = openQuiz
    return () => {
      delete window.openInitialQuiz
    }
  }, [openQuiz])

  const handleComplete = useCallback((_answers: QuizAnswers, _layer: string) => {
    setIsOpen(false)
  }, [])

  if (!isOpen) return null

  return (
    <InitialQuizModal
      isOpen={isOpen}
      onClose={closeQuiz}
      onComplete={handleComplete}
    />
  )
}

