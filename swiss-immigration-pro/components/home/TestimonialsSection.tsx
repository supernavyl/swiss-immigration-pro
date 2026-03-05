'use client'

const PRODUCT_STATS = [
  {
    value: '4',
    label: 'Languages',
    subtext: 'English · French · German · Italian',
    accent: 'text-blue-600 dark:text-blue-400',
    bar: 'bg-blue-500',
  },
  {
    value: '31',
    label: 'Modules',
    subtext: 'L · B · C · G permits and citizenship',
    accent: 'text-indigo-600 dark:text-indigo-400',
    bar: 'bg-indigo-500',
  },
  {
    value: '15',
    label: 'CV templates',
    subtext: 'Swiss-format, ready for submission',
    accent: 'text-emerald-600 dark:text-emerald-400',
    bar: 'bg-emerald-500',
  },
  {
    value: '24/7',
    label: 'AI support',
    subtext: 'Always available, no queues',
    accent: 'text-violet-600 dark:text-violet-400',
    bar: 'bg-violet-500',
  },
]

export default function TestimonialsSection() {
  return (
    <section className="sip-section bg-slate-50/50 dark:bg-slate-900/30">
      <div className="sip-container">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 tracking-wide uppercase mb-3">
            By the numbers
          </p>
          <h2 className="text-fluid-2xl font-bold text-slate-900 dark:text-white mb-3">
            What&apos;s inside the platform
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            Every number below is a verifiable product fact — no estimates, no rounding up.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRODUCT_STATS.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 px-7 py-8 text-center"
            >
              <div className={`text-5xl font-black tabular-nums mb-1 ${stat.accent}`}>
                {stat.value}
              </div>
              <div className={`w-8 h-[3px] rounded-full mx-auto mb-3 ${stat.bar}`} />
              <div className="text-sm font-semibold text-slate-900 dark:text-white mb-1.5">
                {stat.label}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {stat.subtext}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
