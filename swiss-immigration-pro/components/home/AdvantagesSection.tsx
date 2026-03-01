'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Clock, Zap } from 'lucide-react'
import { useT } from '@/lib/i18n/useTranslation'

export default function AdvantagesSection() {
  const { t } = useT()

  const advantages = [
    {
      icon: TrendingUp,
      title: t('home.successRate'),
      description: t('home.successRateDesc'),
      tag: 'Guaranteed',
    },
    {
      icon: Clock,
      title: t('home.fastProcessing'),
      description: t('home.fastProcessingDesc'),
      tag: 'Fast Track',
    },
    {
      icon: Zap,
      title: t('home.aiSupport'),
      description: t('home.aiSupportDesc'),
      tag: 'Innovative',
    },
  ]

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
      className="py-24 bg-white dark:bg-gray-950"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            {t('home.whyChoose')}
          </h2>
          <p className="text-slate-600 dark:text-gray-400 text-lg font-light">
            {t('home.whyChooseDesc')}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {advantages.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: idx * 0.15, duration: 0.5 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] dark:shadow-none transition-all duration-300 border border-slate-100 dark:border-gray-700"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <item.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-gray-300 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                  {item.tag}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h3>
              <p className="text-slate-600 dark:text-gray-400 leading-relaxed text-sm">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
