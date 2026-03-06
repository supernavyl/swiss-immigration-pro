'use client'

import { ArrowRight, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useT } from '@/lib/i18n/useTranslation'

const FEATURES = [
  { title: 'AI-Powered Guidance', desc: '24/7 access to expert immigration knowledge.' },
  { title: 'Document Support', desc: 'Professional templates and review services.' },
  { title: 'Timeline Planning', desc: 'Strategic roadmap tailored to your situation.' },
]

export default function JourneySection(): React.ReactElement {
  const { t } = useT()

  return (
    <section className="py-24 bg-[#06060a]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden border border-white/[0.06] aspect-[4/3]">
              <Image
                src="/images/family/success-story.jpg"
                alt="Success Story - Swiss Immigration"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Dark overlay for consistency */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#06060a]/60 via-transparent to-transparent" />
            </div>
          </div>

          {/* Content */}
          <div>
            <p className="text-xs font-semibold text-indigo-400 tracking-widest uppercase mb-3">
              Your Journey
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
              {t('home.startJourney')}
            </h2>
            <p className="text-slate-500 text-lg mb-8 leading-relaxed">
              {t('home.startJourneyDesc')}
            </p>

            <div className="space-y-4 mb-8">
              {FEATURES.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-white text-sm">{item.title}</h4>
                    <p className="text-slate-500 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 text-indigo-400 font-semibold hover:text-indigo-300 transition-colors group text-sm"
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
