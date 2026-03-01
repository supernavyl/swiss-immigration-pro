'use client'

import { useState } from 'react'
import Link from 'next/link'
import { getAuthHeaderSync } from '@/lib/auth-client'
import { Scale, ArrowRight, Star, Shield, X } from 'lucide-react'

interface LawyerSuggestionProps {
  source: string  // "quiz", "chatbot", "calculator"
  canton?: string
  specialization?: string
  message?: string
  onClose?: () => void
}

/**
 * Embeddable component that suggests marketplace lawyers/agencies
 * after quiz results, chatbot conversations, or calculator results.
 */
export default function LawyerSuggestion({
  source,
  canton,
  specialization,
  message,
  onClose,
}: LawyerSuggestionProps) {
  const [providers, setProviders] = useState<any[]>([])
  const [loaded, setLoaded] = useState(false)
  const [contacting, setContacting] = useState<string | null>(null)
  const [contacted, setContacted] = useState<Set<string>>(new Set())

  // Load on first render
  if (!loaded) {
    setLoaded(true)
    fetchProviders()
  }

  async function fetchProviders() {
    try {
      const params = new URLSearchParams({ limit: '3' })
      if (canton) params.set('canton', canton)
      if (specialization) params.set('specialization', specialization)

      const res = await fetch(`/api/marketplace/providers/lawyers?${params}`)
      if (res.ok) {
        const data = await res.json()
        setProviders(data.providers.slice(0, 3))
      }
    } catch {
      // Silently fail -- this is a suggestion, not critical
    }
  }

  async function handleContact(providerId: string, providerType: string) {
    setContacting(providerId)
    try {
      await fetch('/api/marketplace/referrals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaderSync() },
        body: JSON.stringify({
          providerId,
          providerType,
          message: message || `Lead from ${source}`,
          source,
        }),
      })
      setContacted(prev => new Set([...prev, providerId]))
    } catch {
      // silent
    } finally {
      setContacting(null)
    }
  }

  if (providers.length === 0) return null

  return (
    <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-5 mt-6">
      {onClose && (
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
          <X className="w-4 h-4" />
        </button>
      )}

      <div className="flex items-center gap-2 mb-3">
        <Scale className="w-5 h-5 text-blue-600" />
        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
          Need Professional Help?
        </h4>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
        Connect with verified immigration experts who can assist with your specific situation.
      </p>

      <div className="space-y-3">
        {providers.map((p) => (
          <div key={p.id} className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-100 dark:border-gray-700">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900 dark:text-white">{p.firmName || p.agencyName}</span>
                {p.verified && <Shield className="w-3 h-3 text-green-500" />}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                {p.rating > 0 && (
                  <span className="flex items-center gap-0.5 text-xs text-yellow-500">
                    <Star className="w-3 h-3 fill-current" /> {p.rating.toFixed(1)}
                  </span>
                )}
                {p.hourlyRate && <span className="text-xs text-gray-400">CHF {p.hourlyRate}/hr</span>}
              </div>
            </div>
            {contacted.has(p.id) ? (
              <span className="text-xs text-green-600 font-medium">Contacted</span>
            ) : (
              <button
                onClick={() => handleContact(p.id, p.type || 'lawyer')}
                disabled={contacting === p.id}
                className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {contacting === p.id ? '...' : 'Get Help'}
              </button>
            )}
          </div>
        ))}
      </div>

      <Link href="/marketplace" className="flex items-center gap-1 text-xs text-blue-600 hover:underline mt-3">
        View all providers <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  )
}
