'use client'

import { useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useT } from '@/lib/i18n/useTranslation'

interface Pathway {
  type: string
  name: string
  badge: string
  desc: string
  cta: string
  link: string
  gradient: string
}

const PATHWAYS: Pathway[] = [
  {
    type: 'EU/EFTA Citizens',
    name: 'Freedom of Movement',
    badge: 'No Quotas',
    desc: 'EU/EFTA nationals skip the permit quota entirely. Your only risk is the paperwork.',
    cta: 'EU pathway',
    link: '/eu',
    gradient: 'from-blue-500/10 to-blue-600/5',
  },
  {
    type: 'US & Canada',
    name: 'North American',
    badge: '8,500 Quota',
    desc: 'Only 8,500 non-EU permits per year. Cantonal strategy is the difference between approval and a year-long wait.',
    cta: 'US/CA pathway',
    link: '/us',
    gradient: 'from-indigo-500/10 to-indigo-600/5',
  },
  {
    type: 'International',
    name: 'Global Citizens',
    badge: 'Strategic',
    desc: 'Non-quota pathways exist but require proving economic value. We build that case end-to-end.',
    cta: 'All pathways',
    link: '/visas',
    gradient: 'from-purple-500/10 to-purple-600/5',
  },
]

function TiltCard({ pathway, index }: { pathway: Pathway; index: number }): React.ReactElement {
  const cardRef = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg)')

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTransform(`perspective(1000px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateZ(10px)`)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)')
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12, duration: 0.5, ease: 'easeOut' }}
    >
      <Link href={pathway.link} className="group block">
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative rounded-2xl border border-slate-200/70 dark:border-slate-700/50 p-7 h-full flex flex-col bg-white dark:bg-slate-950 transition-all duration-300 ease-out hover:shadow-xl hover:shadow-blue-500/5"
          style={{ transform, transition: 'transform 0.15s ease-out, box-shadow 0.3s ease' }}
        >
          {/* Accent gradient */}
          <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${pathway.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />

          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {pathway.type}
              </span>
              <span
                className="text-xs font-medium text-slate-500 dark:text-slate-400 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800"
                style={{ animation: `float ${4 + index * 0.3}s ease-in-out infinite` }}
              >
                {pathway.badge}
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              {pathway.name}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6 flex-1">
              {pathway.desc}
            </p>

            <div className="flex items-center text-sm font-medium text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {pathway.cta}
              <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default function PathwayGrid(): React.ReactElement {
  const { t } = useT()

  return (
    <section className="sip-section bg-white dark:bg-slate-950 relative overflow-hidden clip-diagonal-top">
      <div className="sip-container">
        <div className="flex justify-between items-end mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-xl"
          >
            <h2 className="text-fluid-2xl font-bold text-slate-900 dark:text-white mb-2">
              {t('home.choosePathway')}
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              Tailored to your nationality and situation.
            </p>
          </motion.div>
          <Link
            href="/visas"
            className="hidden md:flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {PATHWAYS.map((p, i) => (
            <TiltCard key={p.link} pathway={p} index={i} />
          ))}
        </div>

        <div className="mt-6 text-center md:hidden">
          <Link href="/visas" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500">
            View all pathways <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
