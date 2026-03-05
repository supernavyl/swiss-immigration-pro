'use client'

import { useT } from '@/lib/i18n/useTranslation'

export default function ProcessTimeline() {
  const { t } = useT()

  const steps = [
    { step: '01', title: t('home.step1Title'), desc: t('home.step1Desc') },
    { step: '02', title: t('home.step2Title'), desc: t('home.step2Desc') },
    { step: '03', title: t('home.step3Title'), desc: t('home.step3Desc') },
    { step: '04', title: t('home.step4Title'), desc: t('home.step4Desc') },
  ]

  return (
    <section className="sip-section bg-slate-50/50 dark:bg-slate-900/30">
      <div className="sip-container">
        <div className="max-w-2xl mb-12">
          <h2 className="text-fluid-2xl font-bold text-slate-900 dark:text-white mb-3">
            {t('home.howItWorks')}
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Four steps from assessment to approval.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 dark:bg-slate-800 rounded-2xl overflow-hidden">
          {steps.map((item) => (
            <div
              key={item.step}
              className="bg-white dark:bg-slate-950 p-6"
            >
              <span className="text-xs font-mono font-bold text-slate-300 dark:text-slate-600 mb-4 block">
                {item.step}
              </span>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
