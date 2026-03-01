'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, MapPin, Users, Globe } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { LayerType } from '@/lib/layerLogic'
import LawyerSuggestion from '@/components/marketplace/LawyerSuggestion'
import MainHeader from '@/components/layout/MainHeader'

interface QuizQuestion {
  id: string
  question: string
  type: 'select' | 'boolean'
  options: string[]
}

export default function QuizPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const questions: QuizQuestion[] = [
    {
      id: 'nationality',
      question: 'What is your nationality?',
      type: 'select',
      options: ['EU/EFTA Citizen', 'US/Canadian Citizen', 'Other Country']
    },
    {
      id: 'current-location',
      question: 'Where are you currently located?',
      type: 'select',
      options: ['Europe (EU/EFTA)', 'United States/Canada', 'Other Country']
    },
    {
      id: 'immigration-intent',
      question: 'What is your main reason for immigrating to Switzerland?',
      type: 'select',
      options: ['Work/Education', 'Family Reunification', 'Investment/Business', 'Other']
    }
  ]

  const currentQ = questions[currentQuestion]

  const handleAnswer = (answer: string) => {
    setAnswers(prev => ({ ...prev, [currentQ.id]: answer }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Determine layer based on answers
      const layer = determineLayer(answers)
      // Store the result
      localStorage.setItem('userLayer', layer)
      localStorage.setItem('quizCompleted', 'true')
      localStorage.setItem('quizAnswers', JSON.stringify(answers))
      // Redirect to layer page (map to static routes)
      const layerRoute = layer === 'europeans' ? '/eu' : layer === 'americans' ? '/us' : '/other'
      router.push(layerRoute)
    }
  }

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const determineLayer = (answers: Record<string, string>): LayerType => {
    const nationality = answers.nationality
    const location = answers['current-location']

    // EU/EFTA citizens
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

  const getLayerInfo = (layer: LayerType) => {
    switch (layer) {
      case 'europeans':
        return {
          title: 'European Pathway',
          description: 'EU/EFTA citizens have simplified access to Swiss residency',
          icon: Users,
          color: 'blue'
        }
      case 'americans':
        return {
          title: 'American Pathway',
          description: 'US and Canadian citizens follow work permit procedures',
          icon: MapPin,
          color: 'red'
        }
      case 'others':
        return {
          title: 'International Pathway',
          description: 'Global citizens navigate quotas and embassy procedures',
          icon: Globe,
          color: 'green'
        }
    }
  }

  const layer = determineLayer(answers)
  const layerInfo = getLayerInfo(layer)
  const showResult = Object.keys(answers).length === questions.length
  const result = layer === 'europeans' ? 'eu' : layer === 'americans' ? 'us' : 'other'

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <MainHeader />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Swiss Immigration Quiz
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Answer a few questions to get personalized immigration guidance
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-8"
        >
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                className="bg-blue-600 h-2 rounded-full"
              />
            </div>
          </div>

          {/* Question */}
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {currentQ.question}
            </h2>

            <div className="space-y-3">
              {currentQ.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    answers[currentQ.id] === option
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900'
                      : 'border-gray-300 dark:border-gray-700 hover:border-gray-400'
                  }`}
                >
                  <span className="text-gray-900 dark:text-white font-medium">{option}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={handleBack}
              disabled={currentQuestion === 0}
              className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Back
            </button>
            <button
              onClick={handleNext}
              disabled={!answers[currentQ.id]}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <span>{currentQuestion < questions.length - 1 ? 'Next' : 'Complete Quiz'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Preview of result */}
          {Object.keys(answers).length === questions.length && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center space-x-3 mb-2">
                <layerInfo.icon className={`w-6 h-6 text-${layerInfo.color}-600`} />
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {layerInfo.title}
                </h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {layerInfo.description}
              </p>
            </motion.div>
          )}

          {/* Marketplace lawyer suggestion after quiz completion */}
          {showResult && (
            <LawyerSuggestion
              source="quiz"
              specialization={result === 'eu' ? 'eu_citizens' : result === 'us' ? 'work_permits' : 'immigration'}
              message={`Quiz result: ${result}. User may need help with ${layerInfo?.title || 'immigration'}.`}
            />
          )}
        </motion.div>
      </div>
    </div>
  )
}










