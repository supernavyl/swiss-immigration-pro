'use client'

import Image from 'next/image'
import { Star } from 'lucide-react'

const TESTIMONIALS = [
  {
    name: 'Priya Patel',
    role: 'Software Engineer · India → Zürich',
    photo: '/images/testimonials/priya-patel.jpg',
    quote:
      'Finally understood what L vs B permit meant for my situation. The cantonal comparison saved me from applying in the wrong canton.',
    result: 'B permit · Zürich',
  },
  {
    name: 'Michael Rodriguez',
    role: 'Product Manager · USA → Geneva',
    photo: '/images/testimonials/michael-rodriguez.jpg',
    quote:
      "The AI answered questions my employer's HR couldn't. Step-by-step breakdown of the whole process in plain English.",
    result: 'Work permit · Geneva',
  },
  {
    name: 'Marie Dubois',
    role: 'Financial Analyst · France → Basel',
    photo: '/images/testimonials/marie-dubois.jpg',
    quote:
      "Coming from France I thought it would be simple. It's not. SIP walked me through every requirement — cantonal quotas included.",
    result: 'G → B permit · Basel',
  },
  {
    name: 'Ahmed Hassan',
    role: 'Research Scientist · Egypt → Bern',
    photo: '/images/testimonials/ahmed-hassan.jpg',
    quote:
      'The citizenship roadmap section alone is worth it. Clear timeline, requirements per canton, and what actually trips people up.',
    result: 'B permit · Bern',
  },
  {
    name: 'Sarah Chen',
    role: 'UX Designer · Taiwan → Lausanne',
    photo: '/images/testimonials/sarah-chen.jpg',
    quote:
      'Used the CV templates — Swiss format is completely different. Got callbacks immediately after reformatting.',
    result: 'L → B permit · Lausanne',
  },
  {
    name: 'Sofia Martinez',
    role: 'Marketing Lead · Spain → Zug',
    photo: '/images/testimonials/sofia-martinez.jpg',
    quote:
      'CHF 9/month for this level of guidance is insane value. Traditional consultants wanted CHF 2,000 for the same information.',
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

export default function TestimonialsSection(): React.ReactElement {
  return (
    <section className="py-24 bg-[#08080d]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold text-indigo-400 tracking-widest uppercase mb-3">
            User stories
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            From first question to permit in hand
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            People navigating Swiss immigration with SIP — from different countries, different cantons, different permit types.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t) => (
            <article
              key={t.name}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 flex flex-col gap-4 hover:border-white/[0.10] transition-colors"
            >
              <Stars />
              <p className="text-slate-400 text-sm leading-relaxed flex-1">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 border border-white/[0.08]">
                  <Image
                    src={t.photo}
                    alt={t.name}
                    width={36}
                    height={36}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {t.name}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {t.role}
                  </p>
                </div>
                <span className="ml-auto shrink-0 text-[10px] font-semibold text-indigo-400 border border-indigo-400/20 bg-indigo-400/[0.06] px-2 py-1 rounded-full whitespace-nowrap">
                  {t.result}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
