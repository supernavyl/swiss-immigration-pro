'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, CheckCircle, Building } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useT } from '@/lib/i18n/useTranslation'

const FEATURES = [
  { title: 'AI-Powered Guidance', desc: '24/7 access to expert immigration knowledge.' },
  { title: 'Document Support', desc: 'Professional templates and review services.' },
  { title: 'Timeline Planning', desc: 'Strategic roadmap tailored to your situation.' },
]

export default function JourneySection(): React.ReactElement {
  const { t } = useT()
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })
  const imageY = useTransform(scrollYProgress, [0, 1], [40, -40])

  return (
    <section
      ref={sectionRef}
      className="relative bg-slate-900 overflow-hidden clip-diagonal-both"
    >
      {/* Background blob */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          top: '20%', right: '-10%', width: '500px', height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: 'blob-4 24s ease-in-out infinite',
        }}
      />

      <div className="sip-container py-24 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 md:gap-14 lg:gap-16 items-center">
          {/* Image with parallax */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
              <motion.div className="absolute inset-0" style={{ y: imageY }}>
                <Image
                  src="/images/family/success-story.jpg"
                  alt="Success Story - Swiss Immigration"
                  fill
                  className="object-cover scale-110"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </motion.div>
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent pointer-events-none" />
            </div>

            {/* Floating card */}
            <motion.div
              initial={{ x: 60, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="absolute -bottom-5 -right-3 bg-white dark:bg-slate-800 p-5 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-700 max-w-[220px] hidden md:block"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center shrink-0">
                  <Building className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">Expert Support</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Certified specialists guide every step.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Content */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="text-sm font-semibold text-blue-400 tracking-wide uppercase mb-3 flex items-center gap-2"
            >
              <span className="w-8 h-[2px] bg-blue-400" />
              Your Journey Starts Here
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="text-fluid-2xl font-bold text-white mb-4 leading-tight"
            >
              {t('home.startJourney')}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-slate-400 text-lg mb-8 leading-relaxed"
            >
              {t('home.startJourneyDesc')}
            </motion.p>

            <div className="space-y-4 mb-8">
              {FEATURES.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.15, duration: 0.4 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-white text-sm">{item.title}</h4>
                    <p className="text-slate-400 text-sm">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 0.4 }}
            >
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 text-blue-400 font-semibold hover:text-blue-300 transition-colors group"
              >
                Explore Our Plans
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
