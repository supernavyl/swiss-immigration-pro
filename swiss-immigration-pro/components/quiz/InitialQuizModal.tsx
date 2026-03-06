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
  const countries = COUNTRIES_LIST
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

    localStorage.setItem('quizAnswers', JSON.stringify(completeAnswers))
    localStorage.setItem('userLayer', layer)
    localStorage.setItem('quizCompleted', 'true')

    const oneYear = 60 * 60 * 24 * 365
    document.cookie = `userLayer=${layer}; path=/; max-age=${oneYear}`
    document.cookie = `quizCompleted=true; path=/; max-age=${oneYear}`
    if (completeAnswers.countryOfOrigin) {
      document.cookie = `countryOfOrigin=${completeAnswers.countryOfOrigin}; path=/; max-age=${oneYear}`
    }

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

  const inputClass = 'w-full px-4 py-3.5 rounded-xl bg-slate-800/60 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40 transition-all text-sm'

  const optionClass = (selected: boolean) =>
    `flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-150 ${
      selected
        ? 'border-cyan-400 bg-cyan-400/10 shadow-[0_0_16px_rgba(6,182,212,0.25)]'
        : 'border-white/10 bg-white/[0.03] hover:border-cyan-400/50 hover:bg-cyan-400/[0.06]'
    }`

  const iconClass = 'w-5 h-5 text-cyan-400 flex-shrink-0'

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/8 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-500/8 rounded-full blur-3xl" />
        </div>

        <motion.div
          ref={scrollRef}
          initial={{ opacity: 0, scale: 0.95, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 24 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative bg-slate-950 border border-cyan-500/15 rounded-3xl shadow-[0_0_80px_rgba(6,182,212,0.12)] w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Dot grid ambient */}
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage: 'radial-gradient(circle, #06b6d4 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Header */}
          <div className="relative px-6 py-5 border-b border-white/[0.06] flex items-start justify-between gap-4 sticky top-0 bg-slate-950/95 backdrop-blur-sm z-10 rounded-t-3xl">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                Personalized Assessment
              </span>
              <h2 className="text-xl font-bold text-white">
                Build Your Swiss Pathway
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-slate-300 transition-colors rounded-lg hover:bg-white/5 flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <main className="relative flex-1 px-6 py-6">
            <div className="space-y-6">

              {/* Step dots + progress */}
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2">
                  {Array.from({ length: TOTAL_STEPS }, (_, i) => {
                    const step = i + 1
                    const isActive = step === currentStep
                    const isPast = step < currentStep
                    return (
                      <div
                        key={step}
                        className={`rounded-full transition-all duration-300 ${
                          isActive
                            ? 'w-6 h-2 bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                            : isPast
                            ? 'w-2 h-2 bg-slate-400'
                            : 'w-2 h-2 bg-slate-700'
                        }`}
                      />
                    )
                  })}
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 px-0.5">
                  <span>Step {currentStep} of {TOTAL_STEPS}</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                  <motion.div
                    key={currentStep}
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className="h-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]"
                  />
                </div>
              </div>

              {/* Step card */}
              <div className="bg-white/[0.025] border border-white/[0.07] rounded-2xl p-5 sm:p-6">
                <AnimatePresence mode="wait">

                  {/* Step 1: Country of Origin */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                          <Globe className={iconClass} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">Where are you from?</h3>
                          <p className="text-xs text-slate-400">Personalizes your immigration pathway</p>
                        </div>
                      </div>
                      <select
                        value={answers.countryOfOrigin || ''}
                        onChange={(e) => setAnswers({ ...answers, countryOfOrigin: e.target.value })}
                        className={inputClass}
                      >
                        <option value="" className="bg-slate-900">Select your country…</option>
                        {countries.map((country) => (
                          <option key={country.code} value={country.code} className="bg-slate-900">
                            {country.name}
                          </option>
                        ))}
                      </select>
                      {answers.countryOfOrigin && (
                        <div className="mt-3 p-4 bg-cyan-500/5 border border-cyan-500/15 rounded-xl">
                          <p className="text-xs text-cyan-300 leading-relaxed">
                            💡 You&apos;ll be placed in one of three personalized pathways:
                            EU/EFTA · Americas · Third-country
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
                      transition={{ duration: 0.2 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                          <Briefcase className={iconClass} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">Why immigrate to Switzerland?</h3>
                          <p className="text-xs text-slate-400">Select all that apply</p>
                        </div>
                      </div>
                      {['Work', 'Study', 'Family', 'Investment', 'Other'].map((reason) => {
                        const selected = answers.immigrationReason?.includes(reason) || false
                        return (
                          <label key={reason} className={optionClass(selected)}>
                            <input
                              type="checkbox"
                              checked={selected}
                              onChange={(e) => {
                                const current = answers.immigrationReason || []
                                setAnswers({
                                  ...answers,
                                  immigrationReason: e.target.checked
                                    ? [...current, reason]
                                    : current.filter((r) => r !== reason),
                                })
                              }}
                              className="sr-only"
                            />
                            <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all ${selected ? 'bg-cyan-500 border-cyan-500' : 'border-white/20'}`}>
                              {selected && <span className="text-white text-[10px] font-bold">✓</span>}
                            </div>
                            <span className="text-sm text-slate-200">{reason}</span>
                          </label>
                        )
                      })}
                    </motion.div>
                  )}

                  {/* Step 3: Nationality */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                          <User className={iconClass} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">Your nationality?</h3>
                          <p className="text-xs text-slate-400">Optional — if different from country of origin</p>
                        </div>
                      </div>
                      <select
                        value={answers.nationality || answers.countryOfOrigin || ''}
                        onChange={(e) => setAnswers({ ...answers, nationality: e.target.value })}
                        className={inputClass}
                      >
                        <option value="" className="bg-slate-900">Same as country of origin</option>
                        {countries.map((country) => (
                          <option key={country.code} value={country.code} className="bg-slate-900">
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
                      transition={{ duration: 0.2 }}
                      className="space-y-3"
                    >
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                          <Calendar className={iconClass} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">Age range?</h3>
                          <p className="text-xs text-slate-400">Optional — tailors opportunities to you</p>
                        </div>
                      </div>
                      {(['18-25', '26-40', '41+'] as const).map((age) => {
                        const selected = answers.ageRange === age
                        return (
                          <label key={age} className={optionClass(selected)}>
                            <input
                              type="radio"
                              name="ageRange"
                              value={age}
                              checked={selected}
                              onChange={() => setAnswers({ ...answers, ageRange: age })}
                              className="sr-only"
                            />
                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-all ${selected ? 'border-cyan-400' : 'border-white/20'}`}>
                              {selected && <div className="w-2 h-2 rounded-full bg-cyan-400" />}
                            </div>
                            <span className="text-sm text-slate-200">{age} years</span>
                          </label>
                        )
                      })}
                    </motion.div>
                  )}

                  {/* Step 5: Job Offer */}
                  {currentStep === 5 && (
                    <motion.div
                      key="step5"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                          <Briefcase className={iconClass} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">Do you have a job offer?</h3>
                          <p className="text-xs text-slate-400">Significantly impacts your pathway options</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {[true, false].map((value) => {
                          const selected = answers.hasJobOffer === value
                          return (
                            <label key={String(value)} className={`${optionClass(selected)} justify-center py-6`}>
                              <input
                                type="radio"
                                name="hasJobOffer"
                                checked={selected}
                                onChange={() => setAnswers({ ...answers, hasJobOffer: value })}
                                className="sr-only"
                              />
                              <span className={`text-xl font-bold transition-colors ${selected ? 'text-cyan-400' : 'text-slate-300'}`}>
                                {value ? 'Yes' : 'No'}
                              </span>
                            </label>
                          )
                        })}
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
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                          <Languages className={iconClass} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">Language skills?</h3>
                          <p className="text-xs text-slate-400">Optional — select your proficiency</p>
                        </div>
                      </div>
                      {['en', 'de', 'fr', 'it'].map((lang) => {
                        const langNames = { en: 'English', de: 'German', fr: 'French', it: 'Italian' }
                        const levels: Array<'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'> = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']
                        return (
                          <div key={lang} className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                              {langNames[lang as keyof typeof langNames]}
                            </label>
                            <select
                              value={answers.languageSkills?.[lang as keyof typeof answers.languageSkills] || ''}
                              onChange={(e) => {
                                const skills = answers.languageSkills || {}
                                setAnswers({
                                  ...answers,
                                  languageSkills: { ...skills, [lang]: e.target.value || undefined },
                                })
                              }}
                              className={inputClass}
                            >
                              <option value="" className="bg-slate-900">No proficiency</option>
                              {levels.map((level) => (
                                <option key={level} value={level} className="bg-slate-900">{level}</option>
                              ))}
                            </select>
                          </div>
                        )
                      })}
                    </motion.div>
                  )}

                  {/* Step 7: Email */}
                  {currentStep === 7 && (
                    <motion.div
                      key="step7"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                          <Mail className={iconClass} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">Get your personalized plan</h3>
                          <p className="text-xs text-slate-400">Free — your custom Swiss pathway delivered</p>
                        </div>
                      </div>
                      <input
                        type="email"
                        value={answers.email || ''}
                        onChange={(e) => setAnswers({ ...answers, email: e.target.value })}
                        placeholder="your.email@example.com"
                        className={inputClass}
                      />
                      <div className="p-4 bg-emerald-500/5 border border-emerald-500/15 rounded-xl">
                        <p className="text-xs text-emerald-400 leading-relaxed space-y-0.5">
                          You&apos;ll receive your personalized immigration pathway, timeline checklist, and recommended next steps. No spam — unsubscribe anytime.
                        </p>
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="flex items-center gap-1.5 px-4 py-2.5 text-sm text-slate-400 hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>

                <p className="text-[11px] text-slate-500 text-center hidden sm:block">
                  {currentStep === TOTAL_STEPS
                    ? 'Final step — build your pathway'
                    : 'Each step personalizes your roadmap'}
                </p>

                {currentStep < TOTAL_STEPS ? (
                  <button
                    onClick={handleNext}
                    disabled={!canProceed}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-cyan-500 to-violet-600 text-white hover:from-cyan-400 hover:to-violet-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:shadow-[0_0_28px_rgba(6,182,212,0.4)]"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!canProceed || isSubmitting}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-500 to-cyan-600 text-white hover:from-emerald-400 hover:to-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing…
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Complete &amp; Get My Pathway
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
