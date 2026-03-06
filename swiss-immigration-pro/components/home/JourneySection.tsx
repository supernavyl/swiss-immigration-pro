'use client'

import { ArrowRight, CheckCircle, Building } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useT } from '@/lib/i18n/useTranslation'

const FEATURES = [
  { title: 'AI-Powered Guidance', desc: '24/7 access to expert immigration knowledge.' },
  { title: 'Document Support', desc: 'Professional templates and review services.' },
  { title: 'Timeline Planning', desc: 'Strategic roadmap tailored to your situation.' },
]

export default function JourneySection() {
  const { t } = useT()

  return (
    <section className="sip-section bg-slate-900">
      <div className="sip-container">
        <div className="grid md:grid-cols-2 gap-12 md:gap-14 lg:gap-16 items-center">
          {/* Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3]">
              <Image
                src="/images/family/success-story.jpg"
                alt="Success Story - Swiss Immigration"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              </div>

            {/* Floating card */}
            <div className="absolute -bottom-5 -right-3 bg-white dark:bg-slate-800 p-5 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 max-w-[220px] hidden md:block">
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
            </div>
          </div>

          {/* Content */}
          <div>
            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 tracking-wide uppercase mb-3 flex items-center gap-2">
              <span className="w-8 h-[2px] bg-blue-600 dark:bg-blue-400" />
              Your Journey Starts Here
            </p>
            <h2 className="text-fluid-2xl font-bold text-white mb-4 leading-tight">
              {t('home.startJourney')}
            </h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              {t('home.startJourneyDesc')}
            </p>

            <div className="space-y-4 mb-8">
              {FEATURES.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-white text-sm">{item.title}</h4>
                    <p className="text-slate-400 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors group"
            >
              Explore Our Plans
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
