'use client'

import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, Star, Building } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useT } from '@/lib/i18n/useTranslation'
import { SITE_STATS } from '@/lib/pricing'

export default function JourneySection() {
  const { t } = useT()

  const features = [
    { title: 'AI-Powered Guidance', desc: '24/7 access to expert immigration knowledge.' },
    { title: 'Document Support', desc: 'Professional templates and review services.' },
    { title: 'Timeline Planning', desc: 'Strategic roadmap tailored to your situation.' },
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
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]"
            >
              <Image
                src="/images/family/success-story.jpg"
                alt="Success Story - Swiss Immigration"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="w-4 h-4 text-blue-400 fill-blue-400" />
                  <span className="text-sm font-medium">Success Story</span>
                </div>
                <p className="font-bold text-lg">Join {SITE_STATS.totalUsers} Successful Applicants</p>
                <p className="text-sm text-white/80">Your pathway to Switzerland starts here</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl border border-slate-100 dark:border-gray-700 max-w-xs hidden md:block"
            >
              <div className="flex items-start gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
                  <Building className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">Expert Support</h4>
                  <p className="text-xs text-slate-500 dark:text-gray-400 mt-1 leading-relaxed">
                    Certified immigration specialists guide you through every step.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 text-blue-600 font-semibold text-sm mb-4">
              <span className="w-8 h-[2px] bg-blue-600"></span>
              Your Journey Starts Here
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
              {t('home.startJourney')}
            </h2>
            <p className="text-slate-600 dark:text-gray-400 text-lg mb-8 leading-relaxed font-light">
              {t('home.startJourneyDesc')}
            </p>

            <div className="space-y-4 mb-10">
              {features.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{item.title}</h4>
                    <p className="text-slate-500 dark:text-gray-400 text-sm">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors group"
            >
              Explore Our Plans
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}
