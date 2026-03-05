'use client'

import Image from 'next/image'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { SITE_STATS } from '@/lib/pricing'

const AVATARS = [
  { src: '/images/testimonials/sarah-chen.jpg', alt: 'Sarah C.' },
  { src: '/images/testimonials/michael-rodriguez.jpg', alt: 'Michael R.' },
  { src: '/images/testimonials/priya-patel.jpg', alt: 'Priya P.' },
  { src: '/images/testimonials/marie-dubois.jpg', alt: 'Marie D.' },
]

export default function TrustBar({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center gap-3 flex-wrap', className)}>
      <div className="flex -space-x-2">
        {AVATARS.map((a) => (
          <div
            key={a.alt}
            className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-white dark:ring-gray-900"
          >
            <Image src={a.src} alt={a.alt} fill className="object-cover" sizes="32px" />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
        ))}
      </div>
      <span className="text-sm text-slate-600 dark:text-gray-400">
        Covering <span className="font-semibold text-slate-900 dark:text-white">{SITE_STATS.cantons}</span> Swiss cantons
      </span>
    </div>
  )
}
