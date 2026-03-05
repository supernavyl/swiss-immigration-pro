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
    <section className="sip-section bg-slate-50/50 dark:bg-slate-900/30">
      <div className="sip-container">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 tracking-wide uppercase mb-3">
            Simple Process
          </p>
          <h2 className="text-fluid-2xl font-bold text-slate-900 dark:text-white mb-3">
            {t('home.howItWorks')}
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Simple steps to your Swiss residency
          </p>
        </div>

        {/* Desktop: horizontal stepper */}
        <div className="hidden lg:flex items-start gap-0">
          {steps.map((item, idx) => {
            const Icon = item.icon
            return (
              <div key={item.step} className="flex-1 flex flex-col items-center text-center px-4">
                {/* Circle + connector row */}
                <div className="w-full flex items-center mb-6">
                  {idx > 0 && (
                    <div className="flex-1 h-0.5 bg-slate-200 dark:bg-slate-700" />
                  )}
                  <div className="w-10 h-10 shrink-0 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm z-10">
                    {item.step}
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="flex-1 h-0.5 bg-slate-200 dark:bg-slate-700" />
                  )}
                </div>

                {/* Icon */}
                <div className="w-12 h-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                  <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            )
          })}
        </div>

        {/* Mobile: vertical stepper */}
        <div className="lg:hidden flex flex-col gap-0">
          {steps.map((item, idx) => {
            const Icon = item.icon
            return (
              <div key={item.step} className="flex gap-5">
                {/* Left: circle + vertical connector */}
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 shrink-0 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm z-10">
                    {item.step}
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="w-0.5 flex-1 min-h-[2rem] bg-slate-200 dark:bg-slate-700 mt-2" />
                  )}
                </div>

                {/* Right: content */}
                <div className="pb-8 flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center shadow-sm shrink-0">
                      <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{item.title}</h3>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed pl-[52px]">
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
