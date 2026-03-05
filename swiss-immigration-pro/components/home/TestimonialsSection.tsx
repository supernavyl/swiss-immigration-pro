'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Star } from 'lucide-react'

const TESTIMONIALS = [
  {
    name: 'Priya Patel',
    role: 'Software Engineer · India → Zürich',
    photo: '/images/testimonials/priya-patel.jpg',
    quote: 'Finally understood what L vs B permit meant for my situation. The cantonal comparison saved me from applying in the wrong canton.',
    result: 'B permit · Zürich',
  },
  {
    name: 'Michael Rodriguez',
    role: 'Product Manager · USA → Geneva',
    photo: '/images/testimonials/michael-rodriguez.jpg',
    quote: "The AI answered questions my employer's HR couldn't. Step-by-step breakdown of the whole process in plain English.",
    result: 'Work permit · Geneva',
  },
  {
    name: 'Marie Dubois',
    role: 'Financial Analyst · France → Basel',
    photo: '/images/testimonials/marie-dubois.jpg',
    quote: "Coming from France I thought it would be simple. It's not. SIP walked me through every requirement — cantonal quotas included.",
    result: 'G → B permit · Basel',
  },
  {
    name: 'Ahmed Hassan',
    role: 'Research Scientist · Egypt → Bern',
    photo: '/images/testimonials/ahmed-hassan.jpg',
    quote: 'The citizenship roadmap section alone is worth it. Clear timeline, requirements per canton, and what actually trips people up.',
    result: 'B permit · Bern',
  },
  {
    name: 'Sarah Chen',
    role: 'UX Designer · Taiwan → Lausanne',
    photo: '/images/testimonials/sarah-chen.jpg',
    quote: 'Used the CV templates — Swiss format is completely different. Got callbacks immediately after reformatting.',
    result: 'L → B permit · Lausanne',
  },
  {
    name: 'Sofia Martinez',
    role: 'Marketing Lead · Spain → Zug',
    photo: '/images/testimonials/sofia-martinez.jpg',
    quote: 'CHF 9/month for this level of guidance is insane value. Traditional consultants wanted CHF 2,000 for the same information.',
    result: 'B permit · Zug',
  },
]

function Stars(): React.ReactElement {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
      ))}
    </div>
  )
}

function TestimonialCard({ t }: { t: typeof TESTIMONIALS[number] }): React.ReactElement {
  return (
    <article className="flex-shrink-0 w-[340px] bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-slate-700/30 p-6 flex flex-col gap-4">
      <Stars />
      <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed flex-1">
        &ldquo;{t.quote}&rdquo;
      </p>
      <div className="flex items-center gap-3 pt-2 border-t border-slate-200/50 dark:border-slate-700/30">
        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-slate-200 dark:bg-slate-800">
          <Image src={t.photo} alt={t.name} width={40} height={40} className="object-cover w-full h-full" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{t.name}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{t.role}</p>
        </div>
        <span className="ml-auto shrink-0 text-[10px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-1 rounded-full whitespace-nowrap">
          {t.result}
        </span>
      </div>
    </article>
  )
}

export default function TestimonialsSection(): React.ReactElement {
  const row1 = [...TESTIMONIALS, ...TESTIMONIALS]
  const row2 = [...[...TESTIMONIALS].reverse(), ...[...TESTIMONIALS].reverse()]

  return (
    <section className="sip-section bg-white dark:bg-slate-950 relative overflow-hidden">
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(99,102,241,0.06) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sip-container"
        >
          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 tracking-widest uppercase mb-3">
            User stories
          </p>
          <h2 className="text-fluid-2xl font-bold text-slate-900 dark:text-white mb-3">
            From first question to permit in hand
          </h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            People navigating Swiss immigration with SIP — from different countries, different cantons, different permit types.
          </p>
        </motion.div>

        {/* Marquee row 1 — scrolls left */}
        <div className="relative mb-5 marquee-track">
          <div
            className="flex gap-5 w-max"
            style={{ animation: 'marquee-left 50s linear infinite' }}
          >
            {row1.map((t, i) => (
              <TestimonialCard key={`r1-${i}`} t={t} />
            ))}
          </div>
        </div>

        {/* Marquee row 2 — scrolls right */}
        <div className="relative marquee-track">
          <div
            className="flex gap-5 w-max"
            style={{ animation: 'marquee-right 50s linear infinite' }}
          >
            {row2.map((t, i) => (
              <TestimonialCard key={`r2-${i}`} t={t} />
            ))}
          </div>
        </div>

        {/* Fade edges */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white dark:from-slate-950 to-transparent pointer-events-none z-10" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white dark:from-slate-950 to-transparent pointer-events-none z-10" />
      </div>
    </section>
  )
}
