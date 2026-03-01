'use client'

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
    <section className="py-16 sm:py-20 bg-slate-50/50 dark:bg-slate-900/30">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 tracking-wide uppercase mb-3">
            Simple Process
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
            {t('home.howItWorks')}
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Simple steps to your Swiss residency
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.step}
                className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 hover:shadow-xl hover:shadow-slate-100/80 dark:hover:shadow-none transition-all duration-300 overflow-hidden"
              >
                {/* Watermark number */}
                <span className="absolute top-3 right-4 text-5xl font-black text-slate-100 dark:text-slate-800 select-none pointer-events-none">
                  {item.step}
                </span>

                <div className="relative">
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-600 text-white text-xs font-bold rounded-full mb-4">
                    {item.step}
                  </span>
                  <div className="w-11 h-11 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
