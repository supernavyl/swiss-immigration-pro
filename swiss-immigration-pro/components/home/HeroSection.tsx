'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight, CheckCircle, Shield, Users, Clock,
  TrendingUp, Zap, Rocket, Mail,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useT } from '@/lib/i18n/useTranslation'
import { SITE_STATS } from '@/lib/pricing'
import { api } from '@/lib/api'

interface StatItem {
  value: string
  label: string
}

function openQuiz() {
  const win = window as Window & { openInitialQuiz?: () => void }
  win.openInitialQuiz?.()
}

export default function HeroSection() {
  const { t } = useT()
  const [stats, setStats] = useState<StatItem[]>([
    { value: SITE_STATS.totalUsers, label: t('stats.successfulApps') },
    { value: SITE_STATS.successRate, label: t('stats.successRate') },
    { value: SITE_STATS.avgProcessingWeeks, label: t('stats.avgProcessing') },
    { value: '24/7', label: t('stats.aiSupport') },
  ])
  const [mounted, setMounted] = useState(false)
  const [heroEmail, setHeroEmail] = useState('')
  const [heroEmailSubmitted, setHeroEmailSubmitted] = useState(false)
  const [heroEmailLoading, setHeroEmailLoading] = useState(false)

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
    } catch {}
    setHeroEmailSubmitted(true)
    setHeroEmailLoading(false)
  }

  return (
    <motion.section
      className="relative overflow-hidden min-h-screen h-screen flex items-center"
      suppressHydrationWarning
    >
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        >
          <Image
            src="/images/environment/zurich-city.jpg"
            alt="Zurich city - Your path to Switzerland"
            fill
            className="object-cover"
            priority
            quality={95}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/20" />
        </motion.div>

        {/* Subtle background video overlay */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            src="/images/videos/swiss-family-success.mp4"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-blue-900/85 to-indigo-900/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.25) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(99, 102, 241, 0.25) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 20%, rgba(139, 92, 246, 0.25) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.25) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/15 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-600/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_rgba(0,0,0,0.3)_100%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full" suppressHydrationWarning>
        <div className="grid lg:grid-cols-2 gap-12 items-center" suppressHydrationWarning>
          <motion.div
            initial={false}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-white"
          >
            <motion.div
              initial={false}
              animate={mounted ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-medium mb-6 border border-white/10 text-blue-100"
            >
              <Shield className="w-3.5 h-3.5 text-white" />
              <span>#1 Swiss Immigration Platform</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight">
              {t('hero.title')}
            </h1>

            <p className="text-lg text-slate-200 mb-8 leading-relaxed max-w-xl font-light">
              {t('hero.subtitle', { count: '18,500+' })}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                onClick={openQuiz}
                className="group inline-flex items-center justify-center gap-2 bg-white text-slate-900 font-semibold px-8 py-3.5 rounded-lg transition-all hover:bg-blue-50 shadow-lg hover:shadow-xl"
              >
                <Rocket className="w-4 h-4 text-blue-600" />
                {t('hero.cta')}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-blue-600" />
              </motion.button>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-medium px-8 py-3.5 rounded-lg transition-all border border-white/20"
              >
                {t('hero.ctaSecondary')}
              </Link>
            </div>

            <div className="mb-12">
              {heroEmailSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-green-300 text-sm font-medium"
                >
                  <CheckCircle className="w-4 h-4" />
                  Free guide sent! Check your inbox.
                </motion.div>
              ) : (
                <form onSubmit={handleHeroEmail} className="flex flex-col sm:flex-row gap-2 max-w-sm">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                      type="email"
                      value={heroEmail}
                      onChange={(e) => setHeroEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/40 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={heroEmailLoading}
                    className="bg-blue-500 hover:bg-blue-400 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap disabled:opacity-60"
                  >
                    Get Free Guide
                  </button>
                </form>
              )}
              <p className="text-white/40 text-[11px] mt-1.5">No spam. Unsubscribe anytime.</p>
            </div>
          </motion.div>

          <div className="hidden lg:grid grid-cols-2 gap-4">
            {stats.map((stat, idx) => {
              const icons = [TrendingUp, Zap, Users, Clock]
              const Icon = icons[idx] || TrendingUp
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{
                    delay: 0.4 + idx * 0.1,
                    duration: 0.6,
                    type: 'spring',
                    stiffness: 100,
                  }}
                  whileHover={{
                    scale: 1.05,
                    y: -5,
                    transition: { duration: 0.2 },
                  }}
                  className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-xl font-bold text-white mb-0.5">{stat.value}</div>
                  <div className="text-slate-300 text-xs">{stat.label}</div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </motion.section>
  )
}
