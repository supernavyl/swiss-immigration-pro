'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, ArrowLeft, CheckCircle, Globe, Mail, Briefcase, User, Calendar, Languages } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { classifyLayer, getLayerRoute, type QuizAnswers, getAllCountries } from '@/lib/layerLogic'
import { analytics } from '@/lib/analytics'

// Memoize countries list (doesn't change)
const COUNTRIES_LIST = getAllCountries()

interface InitialQuizModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (answers: QuizAnswers, layer: 'europeans' | 'americans' | 'others') => void
}

const TOTAL_STEPS = 7

export default function InitialQuizModal({ isOpen, onClose, onComplete }: InitialQuizModalProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const countries = COUNTRIES_LIST // Use memoized list
  const scrollRef = useRef<HTMLDivElement>(null)

  // Reset on open
  useEffect(() => {
    if (!isOpen) {
      return
    }

    let frameId: number | null = null

    frameId = requestAnimationFrame(() => {
      setCurrentStep(1)
      setAnswers({})

      if (scrollRef.current) {
        scrollRef.current.scrollTop = 0
      }
    })

    return () => {
      if (frameId !== null) {
        cancelAnimationFrame(frameId)
      }
    }
  }, [isOpen])

  // Lock body scroll while modal is open
  useEffect(() => {
    if (!isOpen) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [isOpen])

  const handleNext = useCallback(() => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1)
    }
  }, [currentStep])

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }, [currentStep])

  const handleSubmit = useCallback(async () => {
    if (!answers.countryOfOrigin) return

    setIsSubmitting(true)
    analytics.quizCompleted(classifyLayer(answers.countryOfOrigin))

    const layer = classifyLayer(answers.countryOfOrigin)
    const completeAnswers: QuizAnswers = {
      countryOfOrigin: answers.countryOfOrigin,
      nationality: answers.nationality || answers.countryOfOrigin,
      immigrationReason: answers.immigrationReason || [],
      ageRange: answers.ageRange,
      hasJobOffer: answers.hasJobOffer ?? false,
      languageSkills: answers.languageSkills || {},
      email: answers.email,
    }

    // Save to localStorage & cookies for persistence
    localStorage.setItem('quizAnswers', JSON.stringify(completeAnswers))
    localStorage.setItem('userLayer', layer)
    localStorage.setItem('quizCompleted', 'true')

    const oneYear = 60 * 60 * 24 * 365
    document.cookie = `userLayer=${layer}; path=/; max-age=${oneYear}`
    document.cookie = `quizCompleted=true; path=/; max-age=${oneYear}`
    if (completeAnswers.countryOfOrigin) {
      document.cookie = `countryOfOrigin=${completeAnswers.countryOfOrigin}; path=/; max-age=${oneYear}`
    }

    // Capture email lead and save quiz answers
    if (completeAnswers.email) {
      const savePromises = [
        fetch('/api/newsletter/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: completeAnswers.email, source: 'quiz' }),
        }).catch((err: unknown) => {
          console.error('Failed to subscribe to newsletter:', err)
        }),
        fetch('/api/quiz/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...completeAnswers,
            layer,
            completedAt: new Date().toISOString(),
          }),
        }).catch((err: unknown) => {
          console.error('Failed to save quiz answers:', err)
        }),
      ]
      await Promise.allSettled(savePromises)
    }

    onComplete(completeAnswers, layer)

    // Redirect to personalized results page
    setTimeout(() => {
      router.push('/quiz/results')
      setIsSubmitting(false)
    }, 500)
  }, [answers, router, onComplete])

  const canProceed = useMemo(() => {
    switch (currentStep) {
      case 1:
        return !!answers.countryOfOrigin
      case 2:
        return answers.immigrationReason && answers.immigrationReason.length > 0
      case 3:
        return true
      case 4:
        return true
      case 5:
        return answers.hasJobOffer !== undefined
      case 6:
        return true
      case 7:
        return !!answers.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(answers.email)
      default:
        return false
    }
  }, [currentStep, answers.countryOfOrigin, answers.immigrationReason?.length, answers.hasJobOffer, answers.email])

  if (!isOpen) return null

  const progressPercent = Math.round((currentStep / TOTAL_STEPS) * 100)

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          ref={scrollRef}
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-6 py-6 border-b border-gray-200 flex items-start justify-between gap-6 sticky top-0 bg-white z-10">
            <div className="space-y-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                Personalized Swiss Assessment
              </span>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Build Your Swiss Immigration Pathway
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {progressPercent}% complete • Step {currentStep} of {TOTAL_STEPS}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-10">
            <div className="w-full space-y-8">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-3">
                  <span>Step {currentStep} of {TOTAL_STEPS}</span>
                  <span>{progressPercent}% complete</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <motion.div
                    key={currentStep}
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.4 }}
                    className="bg-blue-600 h-2"
                  />
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6 sm:p-8">
                <AnimatePresence mode="wait">
                {/* Step 1: Country of Origin */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-3 mb-6">
                      <Globe className="w-8 h-8 text-blue-600" />
                      <div>
                        <h3 className="text-2xl font-semibold text-gray-900">
                          Where are you from?
                        </h3>
                        <p className="text-sm text-gray-600">
                          This helps us personalize your immigration pathway
                        </p>
                      </div>
                    </div>
                    <select
                      value={answers.countryOfOrigin || ''}
                      onChange={(e) => setAnswers({ ...answers, countryOfOrigin: e.target.value })}
                      className="w-full px-4 py-4 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white text-lg"
                    >
                      <option value="">Select your country...</option>
                      {countries.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                    {answers.countryOfOrigin && (
                      <div className="mt-4 p-5 bg-blue-50 rounded-xl">
                        <p className="text-sm text-blue-900 leading-relaxed">
                          💡 Based on your selection, you&apos;ll be categorized into one of three personalized pathways:
                          <br />
                          <strong>EU/EFTA:</strong> Freedom of movement benefits
                          <br />
                          <strong>Americans:</strong> US/Canada specific guidance
                          <br />
                          <strong>Others:</strong> Third-country comprehensive support
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Step 2: Immigration Reason */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-3 mb-6">
                      <Briefcase className="w-8 h-8 text-blue-600" />
                      <div>
                        <h3 className="text-2xl font-semibold text-gray-900">
                          Why do you want to immigrate to Switzerland?
                        </h3>
                        <p className="text-sm text-gray-600">
                          Select all that apply (you can choose multiple)
                        </p>
                      </div>
                    </div>
                    {['Work', 'Study', 'Family', 'Investment', 'Other'].map((reason) => (
                      <label
                        key={reason}
                        className="flex items-center space-x-3 p-5 border-2 border-gray-300 dark:border-gray-700 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={answers.immigrationReason?.includes(reason) || false}
                          onChange={(e) => {
                            const current = answers.immigrationReason || []
                            if (e.target.checked) {
                              setAnswers({ ...answers, immigrationReason: [...current, reason] })
                            } else {
                              setAnswers({ ...answers, immigrationReason: current.filter((r) => r !== reason) })
                            }
                          }}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <span className="text-lg text-gray-900">{reason}</span>
                      </label>
                    ))}
                  </motion.div>
                )}

                {/* Step 3: Nationality */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-3 mb-6">
                      <User className="w-8 h-8 text-blue-600" />
                      <div>
                        <h3 className="text-2xl font-semibold text-gray-900">
                          Your nationality?
                        </h3>
                        <p className="text-sm text-gray-600">
                          (Optional - if different from country of origin)
                        </p>
                      </div>
                    </div>
                    <select
                      value={answers.nationality || answers.countryOfOrigin || ''}
                      onChange={(e) => setAnswers({ ...answers, nationality: e.target.value })}
                      className="w-full px-4 py-4 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white text-lg"
                    >
                      <option value="">Same as country of origin</option>
                      {countries.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </motion.div>
                )}

                {/* Step 4: Age Range */}
                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-3 mb-6">
                      <Calendar className="w-8 h-8 text-blue-600" />
                      <div>
                        <h3 className="text-2xl font-semibold text-gray-900">
                          Age range?
                        </h3>
                        <p className="text-sm text-gray-600">
                          (Optional - helps us tailor opportunities)
                        </p>
                      </div>
                    </div>
                    {(['18-25', '26-40', '41+'] as const).map((age) => (
                      <label
                        key={age}
                        className="flex items-center space-x-3 p-5 border-2 border-gray-300 dark:border-gray-700 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <input
                          type="radio"
                          name="ageRange"
                          value={age}
                          checked={answers.ageRange === age}
                          onChange={() => setAnswers({ ...answers, ageRange: age })}
                          className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-lg text-gray-900">{age} years</span>
                      </label>
                    ))}
                  </motion.div>
                )}

                {/* Step 5: Job Offer */}
                {currentStep === 5 && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-3 mb-6">
                      <Briefcase className="w-8 h-8 text-blue-600" />
                      <div>
                        <h3 className="text-2xl font-semibold text-gray-900">
                          Do you have a job offer or sponsor?
                        </h3>
                        <p className="text-sm text-gray-600">
                          This significantly impacts your pathway options
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[true, false].map((value) => (
                        <label
                          key={String(value)}
                          className={`flex items-center justify-center space-x-3 p-6 border-2 rounded-xl cursor-pointer transition-all ${
                            answers.hasJobOffer === value
                              ? 'border-blue-600 bg-blue-50 shadow-md'
                              : 'border-gray-300 hover:border-blue-500'
                          }`}
                        >
                          <input
                            type="radio"
                            name="hasJobOffer"
                            checked={answers.hasJobOffer === value}
                            onChange={() => setAnswers({ ...answers, hasJobOffer: value })}
                            className="sr-only"
                          />
                          <span className="text-2xl font-semibold text-gray-900">
                            {value ? 'Yes' : 'No'}
                          </span>
                        </label>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Step 6: Language Skills */}
                {currentStep === 6 && (
                  <motion.div
                    key="step6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center space-x-3 mb-6">
                      <Languages className="w-8 h-8 text-blue-600" />
                      <div>
                        <h3 className="text-2xl font-semibold text-gray-900">
                          Language skills?
                        </h3>
                        <p className="text-sm text-gray-600">
                          (Optional - select your proficiency levels)
                        </p>
                      </div>
                    </div>
                    {['en', 'de', 'fr', 'it'].map((lang) => {
                      const langNames = { en: 'English', de: 'German', fr: 'French', it: 'Italian' }
                      const levels: Array<'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'> = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
                      return (
                        <div key={lang} className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            {langNames[lang as keyof typeof langNames]}
                          </label>
                          <select
                            value={answers.languageSkills?.[lang as keyof typeof answers.languageSkills] || ''}
                            onChange={(e) => {
                              const skills = answers.languageSkills || {}
                              setAnswers({
                                ...answers,
                                languageSkills: {
                                  ...skills,
                                  [lang]: e.target.value || undefined,
                                },
                              })
                            }}
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                          >
                            <option value="">No proficiency</option>
                            {levels.map((level) => (
                              <option key={level} value={level}>
                                {level}
                              </option>
                            ))}
                          </select>
                        </div>
                      )
                    })}
                  </motion.div>
                )}

                {/* Step 7: Email (required for personalized plan) */}
                {currentStep === 7 && (
                  <motion.div
                    key="step7"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-3 mb-6">
                      <Mail className="w-8 h-8 text-blue-600" />
                      <div>
                        <h3 className="text-2xl font-semibold text-gray-900">
                          Get your free personalized immigration plan
                        </h3>
                        <p className="text-sm text-gray-600">
                          Enter your email to receive your custom pathway and recommendations
                        </p>
                      </div>
                    </div>
                    <input
                      type="email"
                      value={answers.email || ''}
                      onChange={(e) => setAnswers({ ...answers, email: e.target.value })}
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 text-lg"
                    />
                    <div className="p-5 bg-green-50 rounded-xl">
                      <p className="text-sm text-green-900 leading-relaxed">
                        You&apos;ll receive:
                        <br />• Your personalized immigration pathway
                        <br />• Timeline and requirements checklist
                        <br />• Recommended next steps and resources
                        <br />• No spam, unsubscribe anytime
                      </p>
                    </div>
                  </motion.div>
                )}
                </AnimatePresence>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <div className="text-sm text-gray-600 text-center sm:text-left">
                  {currentStep === TOTAL_STEPS
                    ? 'Final review before we build your pathway.'
                    : 'Complete each step to personalize your Swiss roadmap.'}
                </div>
                {currentStep < TOTAL_STEPS ? (
                  <button
                    onClick={handleNext}
                    disabled={!canProceed}
                    className="inline-flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!canProceed || isSubmitting}
                    className="inline-flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Complete & Get My Pathway</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </main>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

