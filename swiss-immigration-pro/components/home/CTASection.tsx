'use client'

import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, Star, Rocket } from 'lucide-react'
import Link from 'next/link'
import { useT } from '@/lib/i18n/useTranslation'
import { SITE_STATS } from '@/lib/pricing'

function openQuiz() {
  const win = window as Window & { openInitialQuiz?: () => void }
  win.openInitialQuiz?.()
}

export default function CTASection() {
  const { t } = useT()

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
      className="py-20 px-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
        whileHover={{ scale: 1.01 }}
        className="max-w-5xl mx-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-12 md:p-16 text-center relative overflow-hidden shadow-2xl border border-slate-700/50"
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.15, 0.25, 0.15],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none"
        >
          <div className="absolute top-10 left-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-400 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-300 rounded-full blur-2xl opacity-50"></div>
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 via-transparent to-transparent pointer-events-none"></div>

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-blue-500/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-medium mb-6 border border-blue-400/30 text-blue-200"
          >
            <Star className="w-3.5 h-3.5 text-white fill-white" />
            <span>{t('hero.trustedBy', { count: '18,500+' })}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight"
          >
            {t('home.startJourney')}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-slate-300 text-lg md:text-xl mb-8 max-w-2xl mx-auto font-light leading-relaxed"
          >
            {t('home.startJourneyDesc')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-6 mb-10 text-white/80 text-sm"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-blue-400" />
              <span>Free Assessment</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-blue-400" />
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-blue-400" />
              <span>{SITE_STATS.successRate} Success Rate</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-blue-400" />
              <span>24/7 AI Support</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              onClick={openQuiz}
              className="group bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-blue-600/30 flex items-center justify-center gap-2 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Rocket className="w-5 h-5 text-white relative z-10 group-hover:translate-y-[-2px] transition-transform" />
              <span className="relative z-10">{t('hero.cta')}</span>
              <ArrowRight className="w-4 h-4 text-white relative z-10 transition-transform group-hover:translate-x-1" />
            </motion.button>

            <motion.div
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Link
                href="/pricing"
                className="group bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-10 py-4 rounded-xl font-semibold transition-all border border-white/20 hover:border-white/30 inline-flex items-center justify-center gap-2"
              >
                {t('hero.ctaSecondary')}
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  )
}
