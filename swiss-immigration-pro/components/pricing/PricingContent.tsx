'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Zap } from 'lucide-react'
import { useToast } from '@/components/providers/ToastProvider'
import { analytics } from '@/lib/analytics'
import { api, ApiError } from '@/lib/api'
import { PRICING_PACKS, SITE_STATS } from '@/lib/pricing'
import PricingCard, { type PricingPlan } from './PricingCard'
import ComparisonTable from './ComparisonTable'
import FeatureDeepDive from './FeatureDeepDive'
import PricingFAQ from './PricingFAQ'
import AddOnsList from './AddOnsList'
import TrustBar from '@/components/marketing/TrustBar'

type PackValue = (typeof PRICING_PACKS)[keyof typeof PRICING_PACKS]

function packToPlan(pack: PackValue): PricingPlan {
  return {
    id: pack.id,
    name: pack.name,
    price: pack.price,
    badge: 'badge' in pack ? (pack as { badge: string }).badge : undefined,
    shortDescription: 'shortDescription' in pack ? (pack as { shortDescription: string }).shortDescription : undefined,
    recommendedFor: 'recommendedFor' in pack ? (pack as { recommendedFor: string }).recommendedFor : undefined,
    features: pack.features,
  }
}

export default function PricingContent({
  discountCode,
}: {
  layer?: string
  discountCode?: string
}) {
  const { showToast } = useToast()
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual')

  useEffect(() => {
    analytics.pricingViewed()
  }, [])

  // JSON-LD structured data for SEO — built from compile-time constants, no user input
  const structuredData = useMemo(() => {
    try {
      return {
        '@context': 'https://schema.org',
        '@type': 'OfferCatalog',
        name: 'Swiss Immigration Pricing Plans',
        description:
          'Comprehensive pricing plans for Swiss immigration guidance, from free resources to premium citizenship roadmaps',
        offers: (Object.values(PRICING_PACKS) as PackValue[]).map((pack) => ({
          '@type': pack.price === 0 ? 'Offer' : 'Product',
          name: pack.name,
          description: pack.description || '',
          price: pack.price,
          priceCurrency: 'CHF',
          availability: 'https://schema.org/InStock',
          url: typeof window !== 'undefined' ? `${window.location.origin}/pricing` : '/pricing',
          category:
            pack.id === 'citizenship'
              ? 'Citizenship Services'
              : pack.id === 'advanced'
                ? 'Advanced Immigration Services'
                : pack.id === 'immigration'
                  ? 'Immigration Services'
                  : 'Free Resources',
          offers:
            pack.price > 0
              ? {
                  '@type': 'Offer',
                  price: pack.price,
                  priceCurrency: 'CHF',
                  priceValidUntil: '2026-12-31',
                  availability: 'https://schema.org/InStock',
                  url: typeof window !== 'undefined' ? `${window.location.origin}/pricing` : '/pricing',
                }
              : undefined,
        })),
      }
    } catch {
      return null
    }
  }, [])

  const handleCheckout = async (packId: string) => {
    analytics.checkoutStarted(packId)
    try {
      const data = await api.post<{ checkoutUrl?: string; checkout_url?: string; url?: string }>(
        '/api/checkout',
        { packId, cycle: billingCycle, ...(discountCode && { discountCode }) },
      )
      const redirectUrl = data.checkoutUrl || data.checkout_url || data.url
      if (redirectUrl) {
        window.location.href = redirectUrl
      } else {
        showToast('Failed to initiate checkout. Please try again.', 'error')
      }
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        window.location.href = '/auth/login?redirect=' + encodeURIComponent(window.location.pathname)
        return
      }
      const message =
        error instanceof ApiError
          ? error.detail
          : 'Failed to initiate checkout. Please check your connection and try again.'
      showToast(message, 'error')
    }
  }

  const handleProductCheckout = async (productId: string) => {
    analytics.checkoutStarted(productId)
    try {
      const data = await api.post<{ checkoutUrl?: string; checkout_url?: string }>(
        '/api/products/checkout',
        { productId },
      )
      const redirectUrl = data.checkoutUrl || data.checkout_url
      if (redirectUrl) {
        window.location.href = redirectUrl
      } else {
        showToast('Failed to initiate checkout. Please try again.', 'error')
      }
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        window.location.href = '/auth/login?redirect=' + encodeURIComponent(window.location.pathname)
        return
      }
      const message =
        error instanceof ApiError ? error.detail : 'Failed to initiate checkout. Please try again.'
      showToast(message, 'error')
    }
  }

  const packs = Object.values(PRICING_PACKS) as PackValue[]

  return (
    <>
      {/* JSON-LD for SEO — content is from compile-time constants only, safe to inject */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}

      <main
        className="min-h-screen bg-white font-sans transition-colors duration-300"
        itemScope
        itemType="https://schema.org/OfferCatalog"
      >
        {/* Discount Code Banner */}
        {discountCode && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 text-center py-3 px-4 font-semibold text-sm sm:text-base">
            <Zap className="w-4 h-4 inline mr-1.5 -mt-0.5" />
            Discount code{' '}
            <span className="font-mono font-bold bg-white/30 px-2 py-0.5 rounded">
              {discountCode}
            </span>{' '}
            applied &mdash; savings will appear at checkout
          </div>
        )}

        {/* Header with Billing Toggle */}
        <header className="relative bg-gradient-to-b from-white via-blue-50/30 to-white pt-16 sm:pt-20 md:pt-24 pb-16 sm:pb-24 md:pb-32 overflow-hidden transition-colors duration-300">
          <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-5" aria-hidden="true" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-blue-100/20 to-transparent pointer-events-none" aria-hidden="true" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold text-gray-900 mb-4 sm:mb-6 tracking-tight px-2">
                Swiss Immigration{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Pricing Plans
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-black max-w-2xl mx-auto mb-3 sm:mb-4 font-semibold leading-relaxed px-2">
                Premium guidance, AI-powered tools, and expert resources at a fraction of the cost of
                traditional consultants.
              </p>
              <p className="text-sm sm:text-base md:text-lg text-black max-w-2xl mx-auto mb-4 sm:mb-6 font-light opacity-80 px-2">
                Choose the perfect plan for your Swiss immigration journey - from free resources to
                comprehensive citizenship roadmaps.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-black mb-6 sm:mb-8 px-2">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 shrink-0" />
                  <span>{SITE_STATS.successRate} Success Rate</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 shrink-0" />
                  <span className="whitespace-nowrap">{SITE_STATS.contentWords} Words</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 shrink-0" />
                  <span className="whitespace-nowrap">Save {SITE_STATS.savingsRange}</span>
                </div>
              </div>

              {/* Billing Toggle */}
              <div className="flex items-center justify-center gap-3 sm:gap-4 mb-2 px-2" role="group" aria-label="Billing cycle selector">
                <span className={`text-xs sm:text-sm font-medium transition-colors ${billingCycle === 'monthly' ? 'text-black' : 'text-black opacity-50'}`}>
                  Monthly
                </span>
                <button
                  role="switch"
                  aria-checked={billingCycle === 'annual'}
                  onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                  className={`w-14 h-7 sm:w-16 sm:h-8 rounded-full p-0.5 sm:p-1 relative transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center ${billingCycle === 'annual' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-200 hover:bg-gray-300'}`}
                  aria-label={`Switch to ${billingCycle === 'monthly' ? 'annual' : 'monthly'} billing`}
                >
                  <motion.div
                    animate={{ x: billingCycle === 'annual' ? (typeof window !== 'undefined' && window.innerWidth < 640 ? 28 : 32) : 0 }}
                    className="w-6 h-6 bg-white rounded-full shadow-lg"
                  />
                </button>
                <span className={`text-xs sm:text-sm font-medium transition-colors ${billingCycle === 'annual' ? 'text-black' : 'text-black opacity-50'}`}>
                  Annual{' '}
                  <span className="text-green-600 text-[10px] sm:text-xs ml-1 font-bold bg-green-50 px-1.5 py-0.5 rounded-full">
                    Save 20%
                  </span>
                </span>
              </div>
              <p className="text-center text-[11px] text-green-700 font-semibold mb-6 sm:mb-8">
                &#9889; 847 people started their free trial this week
              </p>
            </motion.div>
          </div>
        </header>

        {/* Pricing Cards + Supporting Sections */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 sm:-mt-16 md:-mt-20 relative z-20 pb-12 sm:pb-16 md:pb-24" aria-label="Pricing plans">
          <TrustBar className="mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {packs.map((pack, idx) => (
              <PricingCard
                key={pack.id}
                pack={packToPlan(pack)}
                idx={idx}
                billingCycle={billingCycle}
                onCheckout={handleCheckout}
              />
            ))}
          </div>

          {/* Value Proposition */}
          <section className="mt-16 sm:mt-24 md:mt-32 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12" aria-label="Value proposition">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 px-2">
                Save{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  CHF 5,000-15,000
                </span>{' '}
                vs Traditional Consultants
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-black mb-6 sm:mb-8 leading-relaxed px-2">
                Get expert-level guidance, comprehensive resources, and AI-powered tools at a fraction
                of the cost. Traditional immigration consultants charge CHF 150-300/hour. Our platform
                gives you everything you need for less than the cost of a single consultation.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12">
                {[
                  { stat: SITE_STATS.successRate, title: 'Average Success Rate', desc: 'Across all permit types' },
                  { stat: SITE_STATS.contentWords, title: 'Words of Content', desc: 'Comprehensive guides & modules' },
                  { stat: SITE_STATS.cvTemplates, title: 'CV Templates', desc: 'ATS-optimized for Swiss market' },
                ].map((item, idx) => (
                  <div key={idx} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
                    <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">{item.stat}</div>
                    <div className="text-sm sm:text-base text-black font-semibold">{item.title}</div>
                    <div className="text-xs sm:text-sm text-black opacity-70 mt-2">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <ComparisonTable />
          <FeatureDeepDive />
          <PricingFAQ />
          <AddOnsList onCheckout={handleProductCheckout} />

          {/* Trust Strip */}
          <aside className="mt-12 sm:mt-16 md:mt-24 py-8 sm:py-12 border-t border-gray-200 px-4" aria-label="Trusted organizations">
            <p className="text-center text-gray-400 font-semibold uppercase tracking-widest text-xs sm:text-sm mb-6 sm:mb-8">
              Trusted by professionals from leading organizations
            </p>
            <div className="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-12" role="list">
              {['Google', 'Novartis', 'Roche', 'UBS', 'CERN'].map((logo) => (
                <span
                  key={logo}
                  className="text-lg sm:text-xl md:text-2xl font-bold text-gray-300 hover:text-gray-500 transition-colors"
                  role="listitem"
                >
                  {logo}
                </span>
              ))}
            </div>
          </aside>
        </section>
      </main>
    </>
  )
}
