'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Gift,
  Copy,
  Mail,
  Users,
  TrendingUp,
  Award,
  CheckCircle,
  ExternalLink,
} from 'lucide-react'
import Link from 'next/link'
import { useSession } from '@/lib/auth-client'
import { api } from '@/lib/api'
import { useToast } from '@/components/providers/ToastProvider'
import { cn } from '@/lib/utils/cn'

interface ReferralStats {
  referral_code: string
  total_referred: number
  total_converted: number
  estimated_earnings_chf: number
}

const TIERS = [
  { name: 'Starter', min: 0, reward: 'CHF 10', color: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300' },
  { name: 'Ambassador', min: 5, reward: 'CHF 20', color: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' },
  { name: 'Champion', min: 15, reward: 'CHF 50', color: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300' },
] as const

type PageState =
  | { kind: 'loading' }
  | { kind: 'loaded'; stats: ReferralStats }

export default function ReferralsPage() {
  const router = useRouter()
  const { status } = useSession()
  const { showToast } = useToast()
  const [state, setState] = useState<PageState>({ kind: 'loading' })

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login')
  }, [status, router])

  useEffect(() => {
    if (status !== 'authenticated') return
    let cancelled = false

    async function load(): Promise<void> {
      try {
        const [codeRes, statsRes] = await Promise.all([
          api.get<{ referral_code: string }>('/api/referral/code'),
          api.get<{ total_referred: number; total_converted: number; estimated_earnings_chf: number }>('/api/referral/stats'),
        ])
        if (!cancelled) {
          setState({
            kind: 'loaded',
            stats: { referral_code: codeRes.referral_code, ...statsRes },
          })
        }
      } catch {
        if (!cancelled) {
          setState({
            kind: 'loaded',
            stats: { referral_code: 'SIP-REFER', total_referred: 0, total_converted: 0, estimated_earnings_chf: 0 },
          })
        }
      }
    }

    load()
    return () => { cancelled = true }
  }, [status])

  const referralLink = typeof window !== 'undefined' && state.kind === 'loaded'
    ? `${window.location.origin}/?ref=${state.stats.referral_code}`
    : ''

  const copyLink = useCallback(() => {
    if (!referralLink) return
    navigator.clipboard.writeText(referralLink)
    showToast('Referral link copied!', 'success')
  }, [referralLink, showToast])

  const shareEmail = useCallback(() => {
    const subject = encodeURIComponent('Check out Swiss Immigration Pro')
    const body = encodeURIComponent(`I've been using Swiss Immigration Pro and thought you'd find it helpful:\n\n${referralLink}`)
    window.open(`mailto:?subject=${subject}&body=${body}`, '_self')
  }, [referralLink])

  const shareTwitter = useCallback(() => {
    const text = encodeURIComponent(`Swiss Immigration Pro helped me navigate the Swiss permit process. Check it out: ${referralLink}`)
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank', 'noopener')
  }, [referralLink])

  if (state.kind === 'loading') {
    return (
      <div className="sip-container-wide py-12">
        <div className="max-w-3xl mx-auto space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  const { stats } = state

  const currentTier = TIERS.reduce((best, tier) => (stats.total_converted >= tier.min ? tier : best), TIERS[0])

  return (
    <div className="sip-container-wide py-8 sm:py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/30">
              <Gift className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Referral Program</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Earn rewards for every friend who subscribes.</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Left: Stats + Share */}
          <div className="lg:col-span-3 space-y-6">
            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Referred', value: stats.total_referred, icon: Users, color: 'text-blue-600 dark:text-blue-400' },
                { label: 'Converted', value: stats.total_converted, icon: TrendingUp, color: 'text-emerald-600 dark:text-emerald-400' },
                { label: 'Earned', value: `CHF ${stats.estimated_earnings_chf}`, icon: Award, color: 'text-purple-600 dark:text-purple-400' },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 text-center">
                  <Icon className={cn('w-5 h-5 mx-auto mb-2', color)} />
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
                </div>
              ))}
            </div>

            {/* Share section */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Your referral link</h2>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex-1 px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg font-mono text-gray-700 dark:text-gray-300 truncate">
                  {referralLink || '...'}
                </div>
                <button
                  onClick={copyLink}
                  className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={shareEmail}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Email
                </button>
                <button
                  onClick={shareTwitter}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Twitter
                </button>
              </div>
            </div>
          </div>

          {/* Right: How it works + Tiers */}
          <div className="lg:col-span-2 space-y-6">
            {/* How it works */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">How it works</h2>
              <div className="space-y-3">
                {[
                  { step: '1', text: 'Share your unique referral link' },
                  { step: '2', text: 'Friend signs up and subscribes' },
                  { step: '3', text: 'Both of you earn credit' },
                ].map(({ step, text }) => (
                  <div key={step} className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-950/40 text-xs font-bold text-blue-600 dark:text-blue-400 shrink-0">
                      {step}
                    </span>
                    <p className="text-sm text-gray-600 dark:text-gray-400 pt-0.5">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Reward tiers */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Reward Tiers</h2>
              <div className="space-y-2">
                {TIERS.map(tier => {
                  const isActive = tier.name === currentTier.name
                  return (
                    <div
                      key={tier.name}
                      className={cn(
                        'flex items-center justify-between px-3 py-2.5 rounded-lg text-sm',
                        tier.color,
                        isActive && 'ring-2 ring-blue-500/30',
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {isActive && <CheckCircle className="w-4 h-4" />}
                        <span className="font-medium">{tier.name}</span>
                        <span className="text-xs opacity-70">{tier.min}+ referrals</span>
                      </div>
                      <span className="font-bold text-xs">{tier.reward}/each</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
