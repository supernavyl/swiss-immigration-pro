'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Users, MapPin, Globe } from 'lucide-react'
import Link from 'next/link'
import { useT } from '@/lib/i18n/useTranslation'

export default function PathwayGrid() {
  const { t } = useT()

  const pathways = [
    {
      type: 'EU/EFTA',
      name: 'Freedom of Movement',
      duration: 'No Quotas',
      desc: 'Simplified residency through bilateral agreements.',
      icon: Users,
      link: '/eu',
    },
    {
      type: 'US & Canada',
      name: 'North American',
      duration: '8,500 Quota',
      desc: 'Specialized guidance for American professionals.',
      icon: MapPin,
      link: '/us',
    },
    {
      type: 'International',
      name: 'Global Citizens',
      duration: 'Strategic',
      desc: 'Comprehensive support for all nationalities.',
      icon: Globe,
      link: '/other',
    },
  ]

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
      className="py-24 bg-slate-50 dark:bg-gray-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-end mb-12"
        >
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {t('home.choosePathway')}
            </h2>
            <p className="text-slate-600 dark:text-gray-400">
              Personalized solutions tailored to your background
            </p>
          </div>
          <Link
            href="/pricing"
            className="hidden md:flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            View All Options <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {pathways.map((pathway, idx) => (
            <Link key={idx} href={pathway.link} className="group">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: idx * 0.15, duration: 0.5 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-slate-100 dark:border-gray-700 shadow-sm hover:shadow-lg dark:shadow-none transition-all duration-300"
              >
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                  <pathway.icon className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors" />
                </div>
                <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1 uppercase tracking-wider">
                  {pathway.type}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                  {pathway.name}
                </h3>
                <div className="text-xs text-slate-400 dark:text-gray-500 mb-3 font-medium">
                  {pathway.duration}
                </div>
                <p className="text-slate-500 dark:text-gray-400 text-sm leading-relaxed mb-4">
                  {pathway.desc}
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 dark:text-gray-500">From CHF 9/mo</span>
                  <span className="text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                    See plans <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
