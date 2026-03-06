'use client'

import { useT } from '@/lib/i18n/useTranslation'

export default function ProcessTimeline(): React.ReactElement {
  const { t } = useT()

  const steps = [
    { step: '01', title: t('home.step1Title'), desc: t('home.step1Desc') },
    { step: '02', title: t('home.step2Title'), desc: t('home.step2Desc') },
    { step: '03', title: t('home.step3Title'), desc: t('home.step3Desc') },
    { step: '04', title: t('home.step4Title'), desc: t('home.step4Desc') },
  ]

  return (
    <section className="py-24 bg-[#06060a]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mb-14">
          <p className="text-xs font-semibold text-indigo-400 tracking-widest uppercase mb-3">
            Process
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            {t('home.howItWorks')}
          </h2>
          <p className="text-slate-500">
            Four steps from assessment to approval.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((item) => (
            <div
              key={item.step}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 hover:border-white/[0.10] transition-colors"
            >
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs font-bold text-indigo-400 mb-4">
                {item.step}
              </span>
              <h3 className="font-semibold text-white mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
