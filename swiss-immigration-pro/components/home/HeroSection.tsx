'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowRight, CheckCircle, Shield, Users, Clock,
  TrendingUp, Zap, Rocket, Mail, ChevronDown,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useT } from '@/lib/i18n/useTranslation'
import { SITE_STATS } from '@/lib/pricing'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils/cn'

interface StatItem {
  value: string
  label: string
}

function openQuiz() {
  const win = window as Window & { openInitialQuiz?: () => void }
  win.openInitialQuiz?.()
}

const STAGGER = 0.12
const EASE = [0.25, 0.1, 0.25, 1] as const

export default function HeroSection() {
  const { t } = useT()
  const sectionRef = useRef<HTMLElement>(null)
  const [stats, setStats] = useState<StatItem[]>([
    { value: SITE_STATS.successRate, label: t('stats.successRate') },
    { value: SITE_STATS.totalUsers, label: t('stats.successfulApps') },
    { value: SITE_STATS.avgProcessingWeeks, label: t('stats.avgProcessing') },
    { value: '24/7', label: t('stats.aiSupport') },
  ])
  const [mounted, setMounted] = useState(false)
  const [heroEmail, setHeroEmail] = useState('')
  const [heroEmailSubmitted, setHeroEmailSubmitted] = useState(false)
  const [heroEmailLoading, setHeroEmailLoading] = useState(false)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  useEffect(() => {
    setMounted(true)
    api.get<StatItem[]>('/api/stats')
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const labelMap: Record<string, string> = {
            'Successful Applications': t('stats.successfulApps'),
            'Success Rate': t('stats.successRate'),
            'Average Processing': t('stats.avgProcessing'),
            'AI Support': t('stats.aiSupport'),
          }
          setStats(data.map(stat => ({
            value: stat.value,
            label: labelMap[stat.label] || stat.label,
          })))
        }
      })
      .catch(() => {})
  }, [t])

  const handleHeroEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!heroEmail.trim() || heroEmailLoading) return
    setHeroEmailLoading(true)
    try {
      await api.post('/api/email-capture', { email: heroEmail, source: 'hero' })
    } catch { /* silent */ }
    setHeroEmailSubmitted(true)
    setHeroEmailLoading(false)
  }

  const statIcons = [TrendingUp, Users, Clock, Zap]

  return (
    <motion.section
      ref={sectionRef}
      className="relative overflow-hidden min-h-screen flex flex-col"
      style={{ opacity: 1 }}
      suppressHydrationWarning
    >
      {/* ── Background: Image + single overlay ── */}
      <div className="absolute inset-0 z-0">
        <motion.div className="absolute inset-0" style={{ y: bgY }}>
          <Image
            src="/images/environment/zurich-city.jpg"
            alt="Zurich cityscape"
            fill
            className="object-cover object-center scale-110"
            priority
            quality={90}
            sizes="100vw"
          />
        </motion.div>
        {/* Single refined overlay — dark left, fading right to reveal city */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/92 to-slate-900/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-950/30" />
      </div>

      {/* ── Swiss red accent — top edge ── */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-red-600 via-red-500 to-transparent z-20" />

      {/* ── Main content ── */}
      <motion.div
        className="relative z-10 flex-1 flex items-center"
        style={{ opacity: contentOpacity }}
      >
        <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-32 lg:py-0">
          <div className="max-w-3xl">

            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={mounted ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, ease: EASE }}
              className="flex items-center gap-3 mb-8"
            >
              {/* Swiss cross mark */}
              <span className="inline-flex items-center justify-center w-6 h-6 bg-red-600 rounded-sm">
                <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="white">
                  <rect x="3" y="6.5" width="10" height="3" rx="0.5" />
                  <rect x="6.5" y="3" width="3" height="10" rx="0.5" />
                </svg>
              </span>
              <span className="text-sm font-medium tracking-wide text-white/70 uppercase">
                #1 Swiss Immigration Platform
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: STAGGER, ease: EASE }}
              className="text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[1.05] tracking-tight text-white mb-6"
            >
              {t('hero.title')}
            </motion.h1>

            {/* Red accent rule */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={mounted ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: STAGGER * 2, ease: EASE }}
              className="origin-left w-16 h-[3px] bg-red-500 rounded-full mb-6"
            />

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: STAGGER * 3, ease: EASE }}
              className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-xl mb-10 font-light"
            >
              {t('hero.subtitle', { count: '18,500+' })}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: STAGGER * 4, ease: EASE }}
              className="flex flex-col sm:flex-row gap-3 mb-8"
            >
              <button
                onClick={openQuiz}
                className="group relative inline-flex items-center justify-center gap-2.5 bg-white text-slate-900 font-semibold px-7 py-3.5 rounded-lg overflow-hidden transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-red-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Rocket className="relative w-4 h-4 text-red-600" />
                <span className="relative">{t('hero.cta')}</span>
                <ArrowRight className="relative w-4 h-4 transition-transform group-hover:translate-x-1 text-red-600" />
              </button>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 text-white/90 font-medium px-7 py-3.5 rounded-lg transition-all border border-white/15 hover:border-white/30 hover:bg-white/5"
              >
                {t('hero.ctaSecondary')}
              </Link>
            </motion.div>

            {/* Email capture */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={mounted ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: STAGGER * 5, ease: EASE }}
              className="mb-12"
            >
              {heroEmailSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-emerald-400 text-sm font-medium"
                >
                  <CheckCircle className="w-4 h-4" />
                  Free guide sent! Check your inbox.
                </motion.div>
              ) : (
                <form onSubmit={handleHeroEmail} className="flex flex-col sm:flex-row gap-2 max-w-md">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type="email"
                      value={heroEmail}
                      onChange={(e) => setHeroEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full bg-white/[0.06] border border-white/10 text-white placeholder-white/30 rounded-lg pl-10 pr-3 py-2.5 text-sm focus:outline-none focus:border-white/25 focus:bg-white/[0.08] transition-colors"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={heroEmailLoading}
                    className="bg-red-600 hover:bg-red-500 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap disabled:opacity-60"
                  >
                    Get Free Guide
                  </button>
                </form>
              )}
              <p className="text-white/30 text-xs mt-2 tracking-wide">No spam. Unsubscribe anytime.</p>
            </motion.div>

            {/* ── Stats strip — editorial/institutional style ── */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: STAGGER * 6, ease: EASE }}
              className="flex flex-wrap gap-y-4"
            >
              {stats.map((stat, idx) => {
                const Icon = statIcons[idx] || TrendingUp
                return (
                  <div key={idx} className="flex items-center">
                    <div className="flex items-center gap-3 px-1 sm:px-3">
                      <div className="hidden sm:flex w-8 h-8 items-center justify-center rounded-md bg-white/[0.06]">
                        <Icon className="w-3.5 h-3.5 text-red-400" />
                      </div>
                      <div>
                        <div className="text-lg sm:text-xl font-bold text-white tracking-tight leading-none">
                          {stat.value}
                        </div>
                        <div className="text-[11px] sm:text-xs text-white/40 mt-0.5 tracking-wide">
                          {stat.label}
                        </div>
                      </div>
                    </div>
                    {idx < stats.length - 1 && (
                      <div className="w-px h-8 bg-white/10 mx-2 sm:mx-4" />
                    )}
                  </div>
                )
              })}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={mounted ? { opacity: 1 } : {}}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-1"
        >
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/25 font-medium">Scroll</span>
          <ChevronDown className="w-4 h-4 text-white/25" />
        </motion.div>
      </motion.div>

      {/* ── Bottom fade to next section ── */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-50 dark:from-gray-950 to-transparent z-10 pointer-events-none" />
    </motion.section>
  )
}
