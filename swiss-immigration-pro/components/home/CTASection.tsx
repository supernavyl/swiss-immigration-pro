'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useT } from '@/lib/i18n/useTranslation'

function openQuiz(): void {
  const win = window as Window & { openInitialQuiz?: () => void }
  win.openInitialQuiz?.()
}

const PARTICLES = Array.from({ length: 8 }, (_, i) => ({
  left: `${12 + i * 11}%`,
  top: `${15 + (i % 3) * 25}%`,
  size: 3 + (i % 3) * 2,
  delay: i * 0.5,
  duration: 4 + (i % 4),
}))

export default function CTASection(): React.ReactElement {
  const { t } = useT()

  return (
    <section className="sip-section relative overflow-hidden">
      {/* Deep gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 40%, #172554 100%)',
        }}
      />

      {/* Animated particles */}
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-blue-400/20 pointer-events-none"
          style={{
            left: p.left,
            top: p.top,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animation: `float ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* Background blobs */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          top: '10%', left: '10%', width: '400px', height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'blob-1 20s ease-in-out infinite',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          bottom: '10%', right: '10%', width: '350px', height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'blob-2 25s ease-in-out infinite',
        }}
      />

      {/* Rotating border container */}
      <div className="relative sip-container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative max-w-3xl mx-auto rounded-3xl p-[1px] overflow-hidden"
          style={{
            background: 'conic-gradient(from var(--angle, 0deg), #2563eb, #7c3aed, #c026d3, #2563eb)',
            animation: 'cta-border-rotate 8s linear infinite',
          }}
        >
          <div className="bg-slate-950 rounded-3xl px-8 py-16 md:px-16 md:py-20 text-center">
            <h2 className="text-fluid-3xl font-bold text-white mb-4 leading-tight">
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #e879f9 100%)',
                }}
              >
                {t('home.startJourney')}
              </span>
            </h2>
            <p className="text-slate-400 text-lg mb-10 leading-relaxed max-w-xl mx-auto">
              {t('home.startJourneyDesc')}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={openQuiz}
                className="group inline-flex items-center justify-center gap-2.5 text-white font-semibold px-8 py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                  boxShadow: '0 0 40px rgba(99,102,241,0.4), 0 4px 20px rgba(37,99,235,0.3)',
                }}
              >
                <span className="relative z-10 flex items-center gap-2.5">
                  {t('hero.cta')}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </span>
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
                    backgroundSize: '200% 100%',
                    animation: 'nav-shimmer 2s linear infinite',
                  }}
                />
              </button>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 text-slate-300 px-8 py-4 rounded-xl font-medium transition-all border border-slate-700 hover:border-slate-500 hover:bg-slate-900"
              >
                {t('hero.ctaSecondary')}
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
