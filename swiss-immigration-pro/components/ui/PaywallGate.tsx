'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Check, Sparkles, X } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { PRICING_PACKS } from '@/lib/pricing'
import { trackEvent } from '@/lib/analytics'

interface PaywallGateProps {
  /** Whether the content is locked for this user */
  isLocked: boolean
  /** Pack ID required to unlock (e.g. 'immigration', 'advanced', 'citizenship') */
  requiredPack: string
  /** Module or feature ID for analytics */
  contentId?: string
  children: React.ReactNode
  className?: string
}

const PACK_ORDER = ['free', 'immigration', 'advanced', 'citizenship'] as const
type PackKey = keyof typeof PRICING_PACKS

// Show the required pack + the one above it (upsell ladder)
function getUpgradePacks(requiredPack: string): PackKey[] {
  const idx = PACK_ORDER.indexOf(requiredPack as (typeof PACK_ORDER)[number])
  if (idx === -1) return ['immigration']
  return PACK_ORDER.slice(idx, Math.min(idx + 2, PACK_ORDER.length)) as unknown as PackKey[]
}

export function PaywallGate({
  isLocked,
  requiredPack,
  contentId,
  children,
  className,
}: PaywallGateProps) {
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    if (isLocked) {
      // Small delay so the page renders the blur first
      const t = setTimeout(() => setModalOpen(true), 300)
      trackEvent('paywall_shown', {
        required_pack: requiredPack,
        content_id: contentId ?? 'unknown',
      })
      return () => clearTimeout(t)
    }
  }, [isLocked, requiredPack, contentId])

  if (!isLocked) return <>{children}</>

  const upgradePacks = getUpgradePacks(requiredPack)
  const primaryPack = PRICING_PACKS[upgradePacks[0]]

  return (
    <>
      {/* Blurred content — stays in DOM for layout & SEO */}
      <div className={cn('relative', className)}>
        <div
          className="pointer-events-none select-none"
          style={{ filter: 'blur(6px)', opacity: 0.6 }}
          aria-hidden="true"
        >
          {children}
        </div>

        {/* Click-to-open overlay on the blur */}
        <button
          onClick={() => setModalOpen(true)}
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 cursor-pointer"
          aria-label="Unlock this content"
        >
          <div className="flex items-center gap-2 rounded-full bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 px-5 py-2.5 shadow-lg backdrop-blur-sm">
            <Lock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              {primaryPack?.name ?? requiredPack} required — click to upgrade
            </span>
          </div>
        </button>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setModalOpen(false)}
            />

            {/* Panel */}
            <motion.div
              key="panel"
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ type: 'spring', stiffness: 340, damping: 28 }}
              className="fixed inset-x-4 top-[10%] z-50 mx-auto max-w-2xl"
              role="dialog"
              aria-modal="true"
              aria-label="Upgrade your plan"
            >
              <div className="relative rounded-2xl bg-white dark:bg-gray-900 shadow-2xl ring-1 ring-black/10 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 text-white">
                  <button
                    onClick={() => setModalOpen(false)}
                    className="absolute right-4 top-4 rounded-full p-1 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    aria-label="Close"
                  >
                    <X className="h-5 w-5" />
                  </button>

                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl font-bold">Unlock this content</h2>
                  </div>
                  <p className="text-blue-100 text-sm">
                    This module requires the{' '}
                    <strong className="text-white">{primaryPack?.name}</strong>. Choose
                    the plan that fits your journey.
                  </p>
                </div>

                {/* Pricing cards */}
                <div className="p-6">
                  <div className={cn(
                    'grid gap-4',
                    upgradePacks.length === 1 ? 'grid-cols-1' : 'sm:grid-cols-2'
                  )}>
                    {upgradePacks.map((packKey, i) => {
                      const pack = PRICING_PACKS[packKey]
                      if (!pack || pack.price === 0) return null
                      const isPrimary = i === 0

                      return (
                        <motion.div
                          key={packKey}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + i * 0.07 }}
                          className={cn(
                            'rounded-xl border p-5 flex flex-col gap-4',
                            isPrimary
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 ring-2 ring-blue-500'
                              : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
                          )}
                        >
                          {/* Pack header */}
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className={cn(
                                  'font-bold text-base',
                                  isPrimary
                                    ? 'text-blue-700 dark:text-blue-300'
                                    : 'text-gray-800 dark:text-gray-200'
                                )}>
                                  {pack.name}
                                </h3>
                                {'badge' in pack && pack.badge && (
                                  <span className={cn(
                                    'text-[10px] font-semibold px-1.5 py-0.5 rounded-full',
                                    isPrimary
                                      ? 'bg-blue-600 text-white'
                                      : 'bg-gray-700 text-white'
                                  )}>
                                    {pack.badge as string}
                                  </span>
                                )}
                              </div>
                              <div className="mt-1 flex items-baseline gap-1">
                                <span className={cn(
                                  'text-2xl font-extrabold',
                                  isPrimary ? 'text-blue-700 dark:text-blue-300' : 'text-gray-800 dark:text-gray-200'
                                )}>
                                  CHF {pack.price}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">/mo</span>
                              </div>
                            </div>
                          </div>

                          {/* Top 4 features */}
                          <ul className="space-y-1.5 flex-1">
                            {pack.features.slice(0, 4).map((f) => (
                              <li key={f} className="flex items-start gap-2 text-sm">
                                <Check className={cn(
                                  'h-4 w-4 mt-0.5 shrink-0',
                                  isPrimary ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                                )} />
                                <span className="text-gray-700 dark:text-gray-300">{f}</span>
                              </li>
                            ))}
                            {pack.features.length > 4 && (
                              <li className="text-xs text-gray-400 dark:text-gray-500 pl-6">
                                +{pack.features.length - 4} more features
                              </li>
                            )}
                          </ul>

                          <Link
                            href={`/pricing?pack=${packKey}`}
                            onClick={() => {
                              trackEvent('paywall_upgrade_clicked', {
                                required_pack: requiredPack,
                                chosen_pack: packKey,
                                content_id: contentId ?? 'unknown',
                              })
                              setModalOpen(false)
                            }}
                            className={cn(
                              'w-full rounded-lg py-2.5 text-sm font-semibold text-center transition-all',
                              isPrimary
                                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                                : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                            )}
                          >
                            Get {pack.name} →
                          </Link>
                        </motion.div>
                      )
                    })}
                  </div>

                  <p className="mt-4 text-center text-xs text-gray-400 dark:text-gray-500">
                    Cancel anytime · Secure payment via Stripe · CHF pricing
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
