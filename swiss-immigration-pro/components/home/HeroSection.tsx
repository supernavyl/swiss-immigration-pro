'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Zap } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useT } from '@/lib/i18n/useTranslation'

function openQuiz(): void {
  const win = window as Window & { openInitialQuiz?: () => void }
  win.openInitialQuiz?.()
}

const STATS = [
  { value: '31', label: 'Modules' },
  { value: '26', label: 'Cantons' },
  { value: '15', label: 'CV Templates' },
  { value: '4', label: 'Languages' },
]

const WORDS = ['Your', 'Swiss', 'permit,']
const GRADIENT_WORDS = ['planned', 'by', 'AI.']

export default function HeroSection(): React.ReactElement {
  const { t } = useT()
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -120])
  const statsY = useTransform(scrollYProgress, [0, 1], [0, -60])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-white dark:bg-slate-950 min-h-[100vh]"
    >
      {/* ── Background layers ── */}

      {/* Aurora gradient */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 100% 60% at 50% -10%, rgba(37,99,235,0.16) 0%, rgba(99,102,241,0.08) 40%, transparent 70%)',
          animation: 'aurora-flow 12s ease-in-out infinite',
          backgroundSize: '200% 200%',
        }}
      />

      {/* Dot grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.035] dark:opacity-[0.055]"
        style={{
          backgroundImage: 'radial-gradient(circle, #64748b 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Animated blobs */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          top: '-12%', right: '-8%', width: '680px', height: '680px',
          borderRadius: '60% 40% 55% 45% / 50% 60% 40% 50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.18) 0%, rgba(99,102,241,0.10) 50%, transparent 70%)',
          filter: 'blur(72px)', animation: 'blob-1 22s ease-in-out infinite', willChange: 'transform',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          bottom: '-18%', left: '-10%', width: '580px', height: '580px',
          borderRadius: '45% 55% 40% 60% / 55% 45% 60% 40%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(59,130,246,0.08) 50%, transparent 70%)',
          filter: 'blur(80px)', animation: 'blob-2 28s ease-in-out infinite', animationDelay: '-8s', willChange: 'transform',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          top: '35%', left: '25%', width: '440px', height: '440px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.10) 0%, rgba(139,92,246,0.06) 50%, transparent 70%)',
          filter: 'blur(60px)', animation: 'blob-3 18s ease-in-out infinite', animationDelay: '-4s', willChange: 'transform',
        }}
      />

      {/* ── 3-Panel Layout (desktop) ── */}
      <div className="relative z-10 hidden lg:grid lg:grid-cols-[35%_35%_30%] min-h-[100vh]">

        {/* Panel 1 — Text */}
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex flex-col justify-center px-10 xl:px-16 py-20"
          style={{ clipPath: 'polygon(0 0, 100% 0, 92% 100%, 0 100%)' }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8 w-fit relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(239,246,255,0.9) 0%, rgba(238,242,255,0.9) 100%)',
              borderColor: 'rgba(99,102,241,0.25)',
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
                backgroundSize: '200% 100%',
                animation: 'nav-shimmer 3s linear infinite',
              }}
            />
            <Zap className="w-3 h-3 text-blue-600 relative z-10" />
            <span className="text-xs font-semibold text-blue-700 tracking-wide relative z-10">
              AI trained on Swiss immigration law
            </span>
          </div>

          {/* Word-by-word headline */}
          <h1 className="text-5xl xl:text-6xl font-bold leading-[1.05] tracking-tight text-slate-900 dark:text-white mb-6">
            {WORDS.map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.12, duration: 0.5, ease: 'easeOut' }}
                className="inline-block mr-[0.3em]"
              >
                {word}
              </motion.span>
            ))}
            <br />
            {GRADIENT_WORDS.map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.12, duration: 0.5, ease: 'easeOut' }}
                className="inline-block mr-[0.3em] bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #1d4ed8 0%, #4f46e5 40%, #7c3aed 80%, #c026d3 100%)',
                  backgroundSize: '200% auto',
                  animation: 'nav-shimmer 5s linear infinite',
                }}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed mb-10 max-w-md"
          >
            {t('hero.subtitle')}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 mb-4"
          >
            <button
              onClick={openQuiz}
              className="group inline-flex items-center justify-center gap-2.5 text-white font-semibold px-8 py-3.5 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 40%, #4f46e5 100%)',
                boxShadow: '0 0 28px rgba(37,99,235,0.40), 0 4px 16px rgba(37,99,235,0.20)',
              }}
            >
              <span className="relative z-10 flex items-center gap-2.5">
                {t('hero.cta')}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </span>
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
                  backgroundSize: '200% 100%',
                  animation: 'nav-shimmer 2s linear infinite',
                }}
              />
            </button>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 text-slate-700 dark:text-slate-300 font-medium px-8 py-3.5 rounded-xl transition-all border border-slate-200 dark:border-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/60 hover:scale-[1.01]"
            >
              {t('hero.ctaSecondary')}
            </Link>
          </motion.div>

          <p className="text-slate-400 text-sm">No credit card required · Cancel anytime</p>
        </motion.div>

        {/* Panel 2 — Image with parallax */}
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden"
          style={{ clipPath: 'polygon(8% 0, 100% 0, 92% 100%, 0 100%)' }}
        >
          <motion.div className="absolute inset-0" style={{ y: imageY }}>
            <Image
              src="/images/family/swiss-family-outdoor.jpeg"
              alt="Family successfully relocated to Switzerland"
              fill
              className="object-cover scale-110"
              sizes="35vw"
              priority
            />
            {/* Bottom gradient */}
            <div
              className="absolute inset-x-0 bottom-0 h-40 pointer-events-none"
              style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 100%)' }}
            />
          </motion.div>

          {/* Floating badge — Cantons */}
          <div
            className="absolute bottom-12 left-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 px-5 py-4 flex items-center gap-3"
            style={{ animation: 'float 4s ease-in-out infinite' }}
          >
            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center">
              <span className="text-lg">🇨🇭</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900 dark:text-white">All 26 Swiss Cantons</p>
              <p className="text-[11px] text-slate-500">Quota data · Processing times</p>
            </div>
          </div>

          {/* AI Active badge */}
          <div
            className="absolute top-20 right-8 rounded-xl shadow-2xl px-4 py-3 flex items-center gap-2.5 text-white"
            style={{
              background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
              boxShadow: '0 0 20px rgba(99,102,241,0.4)',
              animation: 'float 5s ease-in-out infinite',
              animationDelay: '1.5s',
            }}
          >
            <div className="w-2 h-2 rounded-full bg-white" style={{ animation: 'glow-pulse 2s ease-in-out infinite' }} />
            <span className="text-xs font-semibold">AI Active</span>
          </div>
        </motion.div>

        {/* Panel 3 — Stats with parallax */}
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex flex-col justify-center px-8 xl:px-12"
          style={{
            clipPath: 'polygon(8% 0, 100% 0, 100% 100%, 0 100%)',
            background: 'linear-gradient(180deg, rgba(37,99,235,0.03) 0%, rgba(139,92,246,0.05) 100%)',
          }}
        >
          <motion.div style={{ y: statsY }} className="space-y-4">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.1, duration: 0.5, ease: 'easeOut' }}
                className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/30 hover:border-blue-300/50 transition-all hover:shadow-lg group"
                style={{ animation: `float ${4 + i * 0.5}s ease-in-out infinite`, animationDelay: `${i * 0.8}s` }}
              >
                <div
                  className="text-3xl font-bold tabular-nums bg-clip-text text-transparent mb-1 group-hover:scale-105 transition-transform origin-left"
                  style={{ backgroundImage: 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)' }}
                >
                  {stat.value}+
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* ── Mobile Layout ── */}
      <div className="relative z-10 lg:hidden flex flex-col min-h-[100vh]">
        {/* Image banner */}
        <div className="relative h-[40vh] overflow-hidden">
          <Image
            src="/images/family/swiss-family-outdoor.jpeg"
            alt="Family successfully relocated to Switzerland"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(255,255,255,0.95) 100%)' }}
          />
          <div
            className="absolute inset-0 pointer-events-none dark:block hidden"
            style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(2,6,23,0.95) 100%)' }}
          />
        </div>

        {/* Text content */}
        <div className="sip-container pt-8 pb-16 flex-1 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-6 w-fit"
            style={{
              background: 'linear-gradient(135deg, rgba(239,246,255,0.9), rgba(238,242,255,0.9))',
              borderColor: 'rgba(99,102,241,0.25)',
            }}
          >
            <Zap className="w-3 h-3 text-blue-600" />
            <span className="text-xs font-semibold text-blue-700 tracking-wide">
              AI trained on Swiss immigration law
            </span>
          </div>

          <h1 className="text-fluid-hero font-bold leading-[1.05] tracking-tight text-slate-900 dark:text-white mb-5">
            Your Swiss permit,{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(135deg, #1d4ed8 0%, #4f46e5 40%, #7c3aed 80%, #c026d3 100%)',
              }}
            >
              planned by AI.
            </span>
          </h1>

          <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <button
              onClick={openQuiz}
              className="group inline-flex items-center justify-center gap-2.5 text-white font-semibold px-8 py-3.5 rounded-xl"
              style={{
                background: 'linear-gradient(135deg, #1d4ed8, #2563eb, #4f46e5)',
                boxShadow: '0 0 28px rgba(37,99,235,0.40), 0 4px 16px rgba(37,99,235,0.20)',
              }}
            >
              {t('hero.cta')}
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 text-slate-700 dark:text-slate-300 font-medium px-8 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700"
            >
              {t('hero.ctaSecondary')}
            </Link>
          </div>

          <p className="text-slate-400 text-sm mb-8">No credit card required · Cancel anytime</p>

          {/* Stats strip */}
          <div className="grid grid-cols-4 gap-px bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden ring-1 ring-slate-200/60 dark:ring-slate-700/40">
            {STATS.map((stat) => (
              <div key={stat.label} className="bg-white dark:bg-slate-950 px-3 py-4 text-center">
                <div
                  className="text-lg font-bold tabular-nums bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(135deg, #1e40af, #4f46e5)' }}
                >
                  {stat.value}
                </div>
                <div className="text-[10px] text-slate-500 font-medium mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
