'use client'

import { motion } from 'framer-motion'
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
    <section className="sip-section bg-slate-50/50 dark:bg-slate-900/30 relative overflow-hidden">
      {/* Dot pattern bg */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: 'radial-gradient(circle, #64748b 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="sip-container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-16"
        >
          <h2 className="text-fluid-2xl font-bold text-slate-900 dark:text-white mb-3">
            {t('home.howItWorks')}
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Four steps from assessment to approval.
          </p>
        </motion.div>

        {/* Desktop: Horizontal connected timeline */}
        <div className="hidden lg:block">
          {/* Animated connecting line */}
          <div className="relative mb-8">
            <div className="absolute top-5 left-8 right-8 h-[2px] bg-slate-200 dark:bg-slate-800" />
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-5 left-8 right-8 h-[2px] origin-left"
              style={{
                background: 'linear-gradient(90deg, #2563eb 0%, #7c3aed 100%)',
              }}
            />

            <div className="relative grid grid-cols-4 gap-6">
              {steps.map((item, i) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 0.3 + i * 0.2,
                    duration: 0.5,
                    type: 'spring',
                    stiffness: 200,
                    damping: 15,
                  }}
                  className="flex flex-col items-center text-center"
                >
                  {/* Number circle */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold mb-6 relative"
                    style={{
                      background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                      boxShadow: '0 0 20px rgba(99,102,241,0.3)',
                    }}
                  >
                    {item.step}
                  </div>

                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-[220px]">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: Vertical cards */}
        <div className="lg:hidden grid sm:grid-cols-2 gap-4">
          {steps.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="bg-white dark:bg-slate-950 p-6 rounded-2xl border border-slate-200/70 dark:border-slate-800/70"
            >
              <span
                className="text-2xl font-bold tabular-nums bg-clip-text text-transparent mb-3 block"
                style={{ backgroundImage: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)' }}
              >
                {item.step}
              </span>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
