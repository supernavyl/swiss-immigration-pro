'use client'

import { motion } from 'framer-motion'
import { Target, Briefcase, Shield, CheckCircle } from 'lucide-react'
import { useT } from '@/lib/i18n/useTranslation'

export default function ProcessTimeline() {
  const { t } = useT()

  const steps = [
    { step: 1, title: t('home.step1Title'), desc: t('home.step1Desc'), icon: Target },
    { step: 2, title: t('home.step2Title'), desc: t('home.step2Desc'), icon: Briefcase },
    { step: 3, title: t('home.step3Title'), desc: t('home.step3Desc'), icon: Shield },
    { step: 4, title: t('home.step4Title'), desc: t('home.step4Desc'), icon: CheckCircle },
  ]

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
      className="py-24 bg-slate-50 dark:bg-gray-900 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            {t('home.howItWorks')}
          </h2>
          <p className="text-slate-600 dark:text-gray-400">Simple steps to your Swiss residency</p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-200 via-blue-300 to-blue-200 -translate-x-1/2 hidden md:block"
          />

          {steps.map((item, idx) => {
            const isEven = idx % 2 === 0
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: idx * 0.2, duration: 0.6 }}
                className={`relative flex items-center gap-8 mb-12 last:mb-0 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                <div className={`flex-1 ${isEven ? 'md:text-right' : 'md:text-left'}`}>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.title}</h3>
                  <p className="text-slate-500 dark:text-gray-400 text-sm mt-1">{item.desc}</p>
                </div>

                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                  className="relative z-10 w-14 h-14 bg-white dark:bg-gray-800 border-4 border-blue-100 dark:border-blue-900 rounded-full flex items-center justify-center shadow-md shrink-0 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                >
                  <span className="text-blue-600 font-bold">{item.step}</span>
                </motion.div>

                <div className="flex-1 hidden md:block" />
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.section>
  )
}
