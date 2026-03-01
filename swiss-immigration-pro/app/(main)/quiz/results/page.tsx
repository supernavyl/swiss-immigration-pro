'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  CheckCircle,
  ArrowRight,
  Shield,
  Briefcase,
  GraduationCap,
  Users,
  Globe,
  Clock,
  Star,
  MessageSquare,
  Zap,
  Timer,
} from 'lucide-react'

interface QuizAnswers {
  countryOfOrigin?: string
  nationality?: string
  immigrationReason?: string[]
  ageRange?: string
  hasJobOffer?: boolean
  languageSkills?: Record<string, string>
  email?: string
}

const DISCOUNT_CODE = 'QUIZ25'
const DISCOUNT_PERCENT = 25
const DISCOUNT_HOURS = 24

const PACK_PRICES: Record<string, number> = {
  immigration: 9,
  advanced: 29,
  citizenship: 79,
}

function useCountdown(expiresAt: number) {
  const [remaining, setRemaining] = useState(() => Math.max(0, expiresAt - Date.now()))

  useEffect(() => {
    if (remaining <= 0) return
    const id = setInterval(() => {
      setRemaining((prev) => {
        const next = Math.max(0, expiresAt - Date.now())
        if (next <= 0) clearInterval(id)
        return next
      })
    }, 1000)
    return () => clearInterval(id)
  }, [expiresAt])

  const hours = Math.floor(remaining / 3_600_000)
  const minutes = Math.floor((remaining % 3_600_000) / 60_000)
  const seconds = Math.floor((remaining % 60_000) / 1000)

  return { hours, minutes, seconds, expired: remaining <= 0 }
}

const REASON_DETAILS: Record<string, { icon: React.ElementType; title: string; description: string }> = {
  Work: { icon: Briefcase, title: 'Work Immigration', description: 'You need a work permit (L or B) sponsored by a Swiss employer.' },
  Study: { icon: GraduationCap, title: 'Study Immigration', description: 'Student visas require proof of enrollment and sufficient funds.' },
  Family: { icon: Users, title: 'Family Reunification', description: 'You can join a family member who is a Swiss resident or citizen.' },
  Investment: { icon: Star, title: 'Investor Immigration', description: 'Switzerland offers residency for significant economic contributors.' },
  Other: { icon: Globe, title: 'Other Pathways', description: 'We can help identify the best pathway for your specific situation.' },
}

function getRecommendedPack(answers: QuizAnswers): { id: string; name: string; reason: string } {
  const reasons = answers.immigrationReason || []
  const hasJob = answers.hasJobOffer

  if (reasons.includes('Investment') || reasons.length >= 3) {
    return {
      id: 'citizenship',
      name: 'Citizenship Pro',
      reason: 'Your complex situation benefits from our comprehensive citizenship roadmap with expert support.',
    }
  }

  if (hasJob && reasons.includes('Work')) {
    return {
      id: 'advanced',
      name: 'Advanced Pack',
      reason: 'With a job offer, the Advanced Pack gives you AI-guided modules, cantonal strategies, and progress tracking.',
    }
  }

  return {
    id: 'immigration',
    name: 'Immigration Pack',
    reason: 'The Immigration Pack gives you unlimited AI chat, CV templates, and core modules to get started.',
  }
}

function RecommendedPackCard({
  recommended,
  discountExpiry,
}: {
  recommended: { id: string; name: string; reason: string }
  discountExpiry: number
}) {
  const { hours, minutes, seconds, expired } = useCountdown(discountExpiry)
  const basePrice = PACK_PRICES[recommended.id] || 9
  const discountedPrice = Math.ceil(basePrice * (1 - DISCOUNT_PERCENT / 100))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white"
    >
      {/* Discount banner */}
      {!expired && (
        <div className="absolute top-0 right-0 bg-yellow-400 text-gray-900 px-4 py-1.5 rounded-bl-xl text-sm font-bold flex items-center gap-1.5">
          <Zap className="w-4 h-4" />
          {DISCOUNT_PERCENT}% OFF — Code: {DISCOUNT_CODE}
        </div>
      )}

      <div className="flex items-center gap-2 mb-2">
        <Star className="w-5 h-5 text-yellow-300" />
        <span className="text-sm font-semibold text-blue-200 uppercase tracking-wider">
          Recommended for you
        </span>
      </div>

      <h2 className="text-2xl font-bold mb-2">{recommended.name}</h2>
      <p className="text-blue-100 mb-4">{recommended.reason}</p>

      {/* Price with discount */}
      {!expired ? (
        <div className="flex items-baseline gap-3 mb-2">
          <span className="text-4xl font-extrabold">CHF {discountedPrice}</span>
          <span className="text-xl text-blue-300 line-through">CHF {basePrice}</span>
          <span className="text-sm text-blue-200">/month</span>
        </div>
      ) : (
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-4xl font-extrabold">CHF {basePrice}</span>
          <span className="text-sm text-blue-200">/month</span>
        </div>
      )}

      {/* Countdown timer */}
      {!expired && (
        <div className="flex items-center gap-2 mb-6 text-sm">
          <Timer className="w-4 h-4 text-yellow-300" />
          <span className="text-yellow-200">
            Offer expires in{' '}
            <span className="font-mono font-bold text-white">
              {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
          </span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href={`/pricing?code=${DISCOUNT_CODE}`}
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-colors text-lg"
        >
          {!expired ? 'Claim Your Discount' : 'Start 7-Day Free Trial'}
          <ArrowRight className="w-5 h-5" />
        </Link>
        <Link
          href="/auth/register"
          className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-blue-500/30 text-white font-semibold rounded-xl hover:bg-blue-500/40 transition-colors border border-blue-400/30"
        >
          Create Free Account
        </Link>
      </div>

      {!expired && (
        <p className="text-xs text-blue-300 mt-3">
          Use code <strong>{DISCOUNT_CODE}</strong> at checkout. 7-day free trial included.
        </p>
      )}
    </motion.div>
  )
}

export default function QuizResultsPage() {
  const router = useRouter()
  const [answers, setAnswers] = useState<QuizAnswers | null>(null)
  const [layer, setLayer] = useState<string>('others')
  const [discountExpiry, setDiscountExpiry] = useState<number>(0)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('quizAnswers')
      const storedLayer = localStorage.getItem('userLayer')
      if (stored) {
        setAnswers(JSON.parse(stored))
      }
      if (storedLayer) {
        setLayer(storedLayer)
      }

      // Set or restore discount expiry (24h from first visit)
      const existingExpiry = localStorage.getItem('quizDiscountExpiry')
      if (existingExpiry) {
        setDiscountExpiry(Number(existingExpiry))
      } else {
        const expiry = Date.now() + DISCOUNT_HOURS * 60 * 60 * 1000
        localStorage.setItem('quizDiscountExpiry', String(expiry))
        setDiscountExpiry(expiry)
      }
    } catch {
      // If no quiz data, redirect to home
    }
  }, [])

  if (!answers) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">No assessment data found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Take the free assessment first to get your personalized results.</p>
          <button
            onClick={() => window.openInitialQuiz?.()}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Start Free Assessment
          </button>
        </div>
      </div>
    )
  }

  const recommended = getRecommendedPack(answers)
  const reasons = answers.immigrationReason || []
  const layerLabel = layer === 'europeans' ? 'EU/EFTA' : layer === 'americans' ? 'US/Canada' : 'International'

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-green-600 via-emerald-700 to-teal-800 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', duration: 0.5 }}>
            <CheckCircle className="w-16 h-16 text-white mx-auto mb-4" />
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Your Personalized Immigration Plan
          </h1>
          <p className="text-lg text-green-100">
            Based on your answers, here&apos;s your recommended pathway to Switzerland
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-5 text-center">
            <Globe className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Pathway</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{layerLabel}</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/30 rounded-xl p-5 text-center">
            <Briefcase className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Reason</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{reasons.join(', ') || 'General'}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-5 text-center">
            <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Job Offer</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{answers.hasJobOffer ? 'Yes' : 'Not yet'}</p>
          </div>
        </motion.div>

        {/* Pathway Details */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your Immigration Pathways</h2>
          <div className="space-y-3">
            {reasons.map((reason) => {
              const detail = REASON_DETAILS[reason]
              if (!detail) return null
              const Icon = detail.icon
              return (
                <div key={reason} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <Icon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{detail.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{detail.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Recommended Pack with Urgency Discount */}
        <RecommendedPackCard recommended={recommended} discountExpiry={discountExpiry} />

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400"
        >
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-green-500" /> 18,500+ users
          </span>
          <span className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-yellow-500" /> 96% success rate
          </span>
          <span className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-blue-500" /> Cancel anytime
          </span>
        </motion.div>

        {/* Next Steps */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your Next Steps</h2>
          <div className="space-y-4">
            {[
              { step: 1, icon: MessageSquare, title: 'Chat with our AI assistant', desc: 'Ask any immigration question and get instant expert answers.', href: '/dashboard' },
              { step: 2, icon: GraduationCap, title: 'Start your first module', desc: 'Learn the fundamentals of Swiss immigration with guided content.', href: '/dashboard' },
              { step: 3, icon: Clock, title: 'Book a consultation', desc: 'Get personalized advice from an immigration expert.', href: '/consultation' },
            ].map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.step}
                  href={item.href}
                  className="flex items-start gap-4 p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all group"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold">
                    {item.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{item.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0 mt-1" />
                </Link>
              )
            })}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
