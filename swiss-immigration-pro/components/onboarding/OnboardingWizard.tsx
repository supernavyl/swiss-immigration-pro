'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, BookOpen, FileText, ArrowRight, X, Sparkles } from 'lucide-react'

const ONBOARDING_KEY = 'sip_onboarding_completed'

interface OnboardingWizardProps {
  userName?: string | null
}

export default function OnboardingWizard({ userName }: OnboardingWizardProps) {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    try {
      const completed = localStorage.getItem(ONBOARDING_KEY)
      if (!completed) {
        const timer = setTimeout(() => setIsVisible(true), 1000)
        return () => clearTimeout(timer)
      }
    } catch {}
  }, [])

  const dismiss = useCallback(() => {
    localStorage.setItem(ONBOARDING_KEY, 'true')
    setIsVisible(false)
  }, [])

  const goToFeature = useCallback(
    (href: string) => {
      dismiss()
      router.push(href)
    },
    [dismiss, router]
  )

  if (!isVisible) return null

  const steps = [
    {
      title: `Welcome${userName ? `, ${userName}` : ''}!`,
      subtitle: "Let's get you set up for success",
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Swiss Immigration Pro gives you everything you need to navigate your journey to Switzerland.
            Here&apos;s a quick tour of what you can do.
          </p>
          <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <Sparkles className="w-5 h-5 text-green-600" />
            <span className="text-sm text-green-700 dark:text-green-300">You have access to 3 free modules and 10 AI messages per day</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Your core tools',
      subtitle: 'Three features to help you succeed',
      content: (
        <div className="space-y-3">
          {[
            {
              icon: MessageSquare,
              title: 'AI Immigration Chat',
              desc: 'Ask any question about Swiss immigration and get instant expert answers.',
              color: 'blue',
            },
            {
              icon: BookOpen,
              title: 'Learning Modules',
              desc: 'Step-by-step guides covering permits, cantons, employment, and more.',
              color: 'purple',
            },
            {
              icon: FileText,
              title: 'CV Builder',
              desc: 'Create a Swiss-optimized CV with 25+ professional templates.',
              color: 'emerald',
            },
          ].map((feature) => {
            const Icon = feature.icon
            return (
              <div key={feature.title} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className={`p-2 rounded-lg bg-${feature.color}-100 dark:bg-${feature.color}-900/30`}>
                  <Icon className={`w-5 h-5 text-${feature.color}-600`} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{feature.title}</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{feature.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      ),
    },
    {
      title: 'Start exploring',
      subtitle: 'Pick where to begin',
      content: (
        <div className="space-y-3">
          {[
            { label: 'Chat with AI assistant', href: '/dashboard', icon: MessageSquare },
            { label: 'Start first module', href: '/modules/free-01', icon: BookOpen },
            { label: 'Build your CV', href: '/tools/cv-editor', icon: FileText },
          ].map((action) => {
            const Icon = action.icon
            return (
              <button
                key={action.href}
                onClick={() => goToFeature(action.href)}
                className="w-full flex items-center gap-3 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-md transition-all group text-left"
              >
                <Icon className="w-5 h-5 text-blue-600" />
                <span className="flex-1 font-medium text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                  {action.label}
                </span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </button>
            )
          })}
        </div>
      ),
    },
  ]

  const currentStep = steps[step]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={dismiss}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 pt-6 pb-4 flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{currentStep.title}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{currentStep.subtitle}</p>
            </div>
            <button onClick={dismiss} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 pb-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {currentStep.content}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
            {/* Progress dots */}
            <div className="flex gap-1.5">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === step ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <button onClick={dismiss} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                Skip
              </button>
              {step < steps.length - 1 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-1.5"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={dismiss}
                  className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Get Started
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
