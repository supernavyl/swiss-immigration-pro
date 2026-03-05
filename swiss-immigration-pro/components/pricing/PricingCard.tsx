'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Crown, TrendingUp, Shield, Briefcase, Award } from 'lucide-react'

const TIER_CONFIG: Record<string, {
  accentBorder: string
  accentTop: string
  checkColor: string
  btnClass: string
  icon: typeof Shield
  iconColor: string
}> = {
  free: {
    accentBorder: 'border-gray-200 dark:border-gray-700',
    accentTop: 'bg-gray-400',
    checkColor: 'text-gray-500 dark:text-gray-400',
    btnClass: 'bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700',
    icon: Shield,
    iconColor: 'text-gray-500',
  },
  immigration: {
    accentBorder: 'border-emerald-300 dark:border-emerald-700',
    accentTop: 'bg-emerald-500',
    checkColor: 'text-emerald-500 dark:text-emerald-400',
    btnClass: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:shadow-emerald-500/30 hover:scale-[1.02] active:scale-[0.98]',
    icon: Briefcase,
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  advanced: {
    accentBorder: 'border-blue-500 dark:border-blue-400',
    accentTop: 'bg-blue-600',
    checkColor: 'text-blue-600 dark:text-blue-400',
    btnClass: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98]',
    icon: TrendingUp,
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  citizenship: {
    accentBorder: 'border-amber-400 dark:border-amber-600',
    accentTop: 'bg-amber-500',
    checkColor: 'text-amber-500 dark:text-amber-400',
    btnClass: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98]',
    icon: Award,
    iconColor: 'text-amber-500 dark:text-amber-400',
  },
}

export interface PricingPlan {
  id: string
  name: string
  price: number
  badge?: string
  shortDescription?: string
  recommendedFor?: string
  features: readonly string[]
}

interface PricingCardProps {
  pack: PricingPlan
  idx: number
  billingCycle: 'monthly' | 'annual'
  onCheckout: (packId: string) => void
}

export default function PricingCard({ pack, idx, billingCycle, onCheckout }: PricingCardProps) {
  const isPopular = pack.id === 'advanced'
  const tier = TIER_CONFIG[pack.id] ?? TIER_CONFIG.free
  const TierIcon = tier.icon
  const price =
    billingCycle === 'annual' && pack.price > 0
      ? Math.round(pack.price * 0.8)
      : pack.price
  const annualPrice = pack.price > 0 ? Math.round(pack.price * 0.8 * 12) : 0

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.1 }}
      itemScope
      itemType="https://schema.org/Product"
      className={`relative flex flex-col bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
        isPopular
          ? 'ring-2 sm:ring-4 ring-blue-500/30 dark:ring-blue-400/20 md:scale-105 z-10'
          : ''
      } ${tier.accentBorder}`}
      role="article"
      aria-labelledby={`pack-${pack.id}-title`}
    >
      {/* Tier accent bar */}
      <div className={`h-1.5 w-full ${tier.accentTop}`} />

      <div className="p-4 sm:p-6 flex flex-col flex-1">
      {(isPopular || pack.badge) && (
        <div className="absolute top-4 sm:top-5 right-4 sm:right-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 rounded-full shadow-lg flex items-center gap-1 whitespace-nowrap z-20">
          <Crown className="w-2.5 h-2.5 sm:w-3 sm:h-3" aria-hidden="true" />
          {pack.badge || 'POPULAR'}
        </div>
      )}
      <TierIcon className={`w-6 h-6 mb-3 ${tier.iconColor}`} aria-hidden="true" />

      <div className="mb-4 sm:mb-6">
        <h2
          id={`pack-${pack.id}-title`}
          className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 transition-colors"
          itemProp="name"
        >
          {pack.name}
        </h2>
        <div className="flex flex-wrap items-baseline gap-1" itemScope itemType="https://schema.org/Offer">
          <span className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white transition-colors" itemProp="price">
            {pack.price === 0 ? 'Free' : `CHF ${price}`}
          </span>
          <meta itemProp="priceCurrency" content="CHF" />
          {pack.price > 0 && (
            <>
              <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium transition-colors opacity-70" aria-label="per month">
                /month
              </span>
              {billingCycle === 'annual' && (
                <div className="w-full text-[10px] sm:text-xs text-green-600 dark:text-green-400 font-bold mt-1 transition-colors" aria-label={`Billed annually: CHF ${annualPrice} per year`}>
                  Billed CHF {annualPrice} yearly
                </div>
              )}
            </>
          )}
        </div>
        {pack.shortDescription && (
          <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mt-2 sm:mt-3 font-medium opacity-90 leading-relaxed" itemProp="description">
            {pack.shortDescription}
          </p>
        )}
        {pack.recommendedFor && (
          <p className="text-[10px] sm:text-xs text-blue-600 dark:text-blue-400 mt-2 font-semibold flex items-center gap-1 flex-wrap">
            <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" aria-hidden="true" />
            <span>Best for: {pack.recommendedFor}</span>
          </p>
        )}
      </div>

      <div className="flex-1 space-y-3 sm:space-y-4 mb-6 sm:mb-8">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-gray-200 uppercase tracking-wide">
            What&apos;s Included
          </h3>
          <span className="text-[10px] sm:text-xs font-bold text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
            {pack.features.length} Features
          </span>
        </div>
        <ul className="space-y-2 sm:space-y-3 max-h-[300px] sm:max-h-[400px] overflow-y-auto pr-1 sm:pr-2 custom-scrollbar" role="list">
          {pack.features.map((feature, fidx) => (
            <li
              key={fidx}
              className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm text-gray-800 dark:text-gray-300 group transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg p-1.5 sm:p-2 -m-1.5 sm:-m-2"
            >
              <CheckCircle
                className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 mt-0.5 ${tier.checkColor} transition-colors`}
                aria-hidden="true"
                strokeWidth={2.5}
              />
              <span className="group-hover:text-gray-900 dark:group-hover:text-white transition-colors leading-relaxed">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={() =>
          pack.price === 0
            ? (window.location.href = '/auth/register')
            : onCheckout(pack.id)
        }
        className={`w-full py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all shadow-lg touch-manipulation min-h-[44px] ${tier.btnClass}`}
        aria-label={`${pack.price === 0 ? 'Start with' : 'Get'} ${pack.name} plan`}
      >
        {pack.price === 0 ? 'Start Free' : 'Start 7-Day Free Trial'}
      </button>
      </div>
    </motion.article>
  )
}
