'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, Star, Shield, MapPin, Globe, Filter } from 'lucide-react'
import { useT } from '@/lib/i18n/useTranslation'

interface Provider {
  id: string
  firmName?: string
  agencyName?: string
  slug: string
  specializations?: string[]
  services?: string[]
  cantonsServed?: string[]
  regions?: string[]
  languages?: string[]
  hourlyRate?: number | null
  bio?: string | null
  verified: boolean
  rating: number
  reviewCount: number
  isFeatured?: boolean
  type: string
}

export default function MarketplacePage() {
  const { t } = useT()
  const [lawyers, setLawyers] = useState<Provider[]>([])
  const [agencies, setAgencies] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'lawyers' | 'agencies'>('lawyers')
  const [search, setSearch] = useState('')
  const [cantonFilter, setCantonFilter] = useState('')

  useEffect(() => {
    fetchProviders()
  }, [search, cantonFilter])

  async function fetchProviders() {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (cantonFilter) params.set('canton', cantonFilter)

      const [lawyerRes, agencyRes] = await Promise.all([
        fetch(`/api/marketplace/providers/lawyers?${params}`),
        fetch(`/api/marketplace/providers/agencies?${new URLSearchParams(cantonFilter ? { region: cantonFilter } : {})}`),
      ])

      if (lawyerRes.ok) {
        const data = await lawyerRes.json()
        setLawyers(data.providers)
      }
      if (agencyRes.ok) {
        const data = await agencyRes.json()
        setAgencies(data.providers)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const providers = tab === 'lawyers' ? lawyers : agencies

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">{t('market.title')}</h1>
          <p className="text-lg text-blue-100 mb-8">
            {t('market.subtitle')}
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('market.searchPlaceholder')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl text-gray-900 text-sm border-0 shadow-lg"
              />
            </div>
            <select
              value={cantonFilter}
              onChange={(e) => setCantonFilter(e.target.value)}
              className="px-4 py-3 rounded-xl text-gray-900 text-sm shadow-lg border-0"
            >
              <option value="">{t('market.allCantons')}</option>
              <option value="ZH">Zurich</option>
              <option value="BE">Bern</option>
              <option value="GE">Geneva</option>
              <option value="VD">Vaud</option>
              <option value="BS">Basel</option>
              <option value="LU">Lucerne</option>
              <option value="AG">Aargau</option>
              <option value="SG">St. Gallen</option>
              <option value="TI">Ticino</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 w-fit">
          <button
            onClick={() => setTab('lawyers')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              tab === 'lawyers' ? 'bg-white dark:bg-gray-700 shadow text-gray-900 dark:text-white' : 'text-gray-500'
            }`}
          >
            {t('market.lawyers')} ({lawyers.length})
          </button>
          <button
            onClick={() => setTab('agencies')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              tab === 'agencies' ? 'bg-white dark:bg-gray-700 shadow text-gray-900 dark:text-white' : 'text-gray-500'
            }`}
          >
            {t('market.agencies')} ({agencies.length})
          </button>
        </div>

        {/* Provider list */}
        {loading ? (
          <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" /></div>
        ) : providers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">{t('market.noProviders')}</p>
            <Link href="/marketplace/apply" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
              {t('market.applyListing')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {providers.map((p) => {
              const name = p.firmName || p.agencyName || 'Provider'
              const slug = p.slug
              return (
                <Link
                  key={p.id}
                  href={`/marketplace/${slug}`}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg transition"
                >
                  {p.isFeatured && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium mb-2">
                      <Star className="w-3 h-3" /> Featured
                    </span>
                  )}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {p.verified && (
                          <span className="flex items-center gap-1 text-xs text-green-600">
                            <Shield className="w-3 h-3" /> {t('market.verified')}
                          </span>
                        )}
                        {p.rating > 0 && (
                          <span className="flex items-center gap-1 text-xs text-yellow-500">
                            <Star className="w-3 h-3 fill-current" /> {p.rating.toFixed(1)} ({p.reviewCount})
                          </span>
                        )}
                      </div>
                    </div>
                    {p.hourlyRate && (
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        CHF {p.hourlyRate}/hr
                      </span>
                    )}
                  </div>

                  {p.bio && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">{p.bio}</p>
                  )}

                  <div className="flex flex-wrap gap-1 mt-3">
                    {(p.specializations || p.services || []).slice(0, 3).map((s) => (
                      <span key={s} className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs">
                        {s.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>

                  {(p.cantonsServed || p.regions || []).length > 0 && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                      <MapPin className="w-3 h-3" />
                      {(p.cantonsServed || p.regions || []).slice(0, 4).join(', ')}
                    </div>
                  )}
                </Link>
              )
            })}
          </div>
        )}

        {/* CTA for providers */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {t('market.joinCta')}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {t('market.joinDesc')}
          </p>
          <Link
            href="/marketplace/apply"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            {t('market.applyListing')}
          </Link>
        </div>
      </div>
    </div>
  )
}
