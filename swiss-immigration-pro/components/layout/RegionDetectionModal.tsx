'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Users, Globe, ArrowRight, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { LayerType } from '@/lib/layerLogic'

interface RegionDetectionModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function RegionDetectionModal({ isOpen, onClose }: RegionDetectionModalProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isRedirecting, setIsRedirecting] = useState(false)

  const questions = [
    {
      id: 'nationality',
      question: 'What is your nationality?',
      options: ['EU/EFTA Citizen', 'US/Canadian Citizen', 'Other Country']
    },
    {
      id: 'current_location',
      question: 'Where are you currently located?',
      options: ['Europe (EU/EFTA)', 'United States/Canada', 'Other Country']
    },
    {
      id: 'immigration_goal',
      question: 'What brings you to Switzerland?',
      options: ['Work/Education', 'Family Reunification', 'Business/Investment', 'Other']
    }
  ]

  // Auto-redirect if quiz already completed
  useEffect(() => {
    if (isOpen) {
      const completed = localStorage.getItem('quizCompleted')
      const layer = localStorage.getItem('userLayer') as LayerType
      if (completed === 'true' && layer) {
        const layerRoute = layer === 'europeans' ? '/eu' : layer === 'americans' ? '/us' : '/other'
        router.push(layerRoute)
        return
      }
    }
  }, [isOpen, router])

  const determineLayer = (answers: Record<string, string>): LayerType => {
    const nationality = answers.nationality
    const location = answers.current_location

    // EU/EFTA citizens get priority
    if (nationality === 'EU/EFTA Citizen' || location === 'Europe (EU/EFTA)') {
      return 'europeans'
    }

    // US/Canadian citizens
    if (nationality === 'US/Canadian Citizen' || location === 'United States/Canada') {
      return 'americans'
    }

    // Everyone else
    return 'others'
  }

  const handleAnswer = (answer: string) => {
    const newAnswers = { ...answers, [questions[currentStep].id]: answer }
    setAnswers(newAnswers)

    // Auto-advance after selection
    setTimeout(() => {
      if (currentStep < questions.length - 1) {
        setCurrentStep(currentStep + 1)
      } else {
        // Complete the quiz
        const layer = determineLayer(newAnswers)
        setIsRedirecting(true)

        // Save to localStorage
        localStorage.setItem('userLayer', layer)
        localStorage.setItem('quizCompleted', 'true')
        localStorage.setItem('regionAnswers', JSON.stringify(newAnswers))

        // Redirect after a short delay (map to static routes)
        const layerRoute = layer === 'europeans' ? '/eu' : layer === 'americans' ? '/us' : '/other'
        setTimeout(() => {
          router.push(layerRoute)
        }, 1500)
      }
    }, 500)
  }

  const getLayerInfo = (layer: LayerType) => {
    switch (layer) {
      case 'europeans':
        return {
          title: 'European Pathway',
          description: 'EU/EFTA citizens enjoy simplified access to Swiss residency through freedom of movement rights.',
          icon: Users,
          color: 'blue'
        }
      case 'americans':
        return {
          title: 'American Pathway',
          description: 'US and Canadian citizens follow specialized work permit procedures with dedicated support.',
          icon: MapPin,
          color: 'red'
        }
      case 'others':
        return {
          title: 'International Pathway',
          description: 'Comprehensive guidance for citizens from other countries navigating Swiss immigration quotas.',
          icon: Globe,
          color: 'green'
        }
    }
  }

  const layer = determineLayer(answers)
  const layerInfo = getLayerInfo(layer)
  const progressPercent = Math.round(((currentStep + 1) / questions.length) * 100)

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingLeft: '1rem',
          paddingRight: '1rem',
          paddingTop: '1rem',
          paddingBottom: '1rem'
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-xl lg:max-w-2xl max-h-[60vh] overflow-y-auto modal-hide-scrollbar"
          onClick={(e) => e.stopPropagation()}
          style={{ 
            width: '100%',
            maxWidth: '42rem',
            position: 'relative'
          }}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Swiss Immigration Assessment
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress */}
          <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>Question {currentStep + 1} of {questions.length}</span>
              <span>{progressPercent}% complete</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              />
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            <AnimatePresence mode="wait">
              {isRedirecting ? (
                <motion.div
                  key="redirecting"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center space-y-4"
                >
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {layerInfo.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {layerInfo.description}
                    </p>
                    <div className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span>Preparing your personalized experience...</span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {questions[currentStep].question}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Help us personalize your Swiss immigration journey
                    </p>
                  </div>

                  <div className="space-y-3">
                    {questions[currentStep].options.map((option, index) => (
                      <motion.button
                        key={option}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => handleAnswer(option)}
                        className="w-full p-4 text-left border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-800 transition-all duration-200 group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-gray-900 dark:text-white font-medium">
                            {option}
                          </span>
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}



