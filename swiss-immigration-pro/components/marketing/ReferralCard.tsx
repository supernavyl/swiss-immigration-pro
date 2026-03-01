'use client'

import { useState, useEffect } from 'react'
import { Gift, Copy, CheckCircle, Users, Share2 } from 'lucide-react'
import { api } from '@/lib/api'
import { useToast } from '@/components/providers/ToastProvider'

interface ReferralData {
  referralCode: string
  referralLink: string
}

interface ReferralStats {
  totalReferrals: number
  convertedReferrals: number
}

export default function ReferralCard() {
  const { showToast } = useToast()
  const [data, setData] = useState<ReferralData | null>(null)
  const [stats, setStats] = useState<ReferralStats | null>(null)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [codeRes, statsRes] = await Promise.all([
          api.get<ReferralData>('/api/referral/code'),
          api.get<ReferralStats>('/api/referral/stats'),
        ])
        setData(codeRes)
        setStats(statsRes)
      } catch {
        // User might not be authenticated
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function handleCopy() {
    if (!data) return
    const fullLink =
      typeof window !== 'undefined'
        ? `${window.location.origin}${data.referralLink}`
        : data.referralLink

    try {
      await navigator.clipboard.writeText(fullLink)
      setCopied(true)
      showToast('Referral link copied!', 'success')
      setTimeout(() => setCopied(false), 3000)
    } catch {
      showToast('Failed to copy', 'error')
    }
  }

  async function handleShare() {
    if (!data) return
    const fullLink =
      typeof window !== 'undefined'
        ? `${window.location.origin}${data.referralLink}`
        : data.referralLink

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Swiss Immigration Pro',
          text: 'Join me on Swiss Immigration Pro — get AI-powered Swiss immigration guidance, CV templates, and expert learning modules.',
          url: fullLink,
        })
      } catch {
        // User cancelled
      }
    } else {
      handleCopy()
    }
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-3" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4" />
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full" />
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl border border-purple-200 dark:border-purple-800 p-6">
      <div className="flex items-center gap-2 mb-3">
        <Gift className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Invite Friends & Earn
        </h3>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Share your referral link. When friends sign up and subscribe, you both get rewarded.
      </p>

      {/* Referral link */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 px-3 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 font-mono truncate">
          {typeof window !== 'undefined'
            ? `${window.location.origin}${data.referralLink}`
            : data.referralLink}
        </div>
        <button
          onClick={handleCopy}
          className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-1.5 text-sm font-medium flex-shrink-0"
        >
          {copied ? (
            <>
              <CheckCircle className="w-4 h-4" /> Copied
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" /> Copy
            </>
          )}
        </button>
        <button
          onClick={handleShare}
          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5 text-sm font-medium flex-shrink-0"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="flex gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600 dark:text-gray-400">
              <strong className="text-gray-900 dark:text-white">
                {stats.totalReferrals}
              </strong>{' '}
              referral{stats.totalReferrals !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-gray-600 dark:text-gray-400">
              <strong className="text-gray-900 dark:text-white">
                {stats.convertedReferrals}
              </strong>{' '}
              converted
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
