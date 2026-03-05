import { cn } from '@/lib/utils/cn'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Changelog | Swiss Immigration Pro',
  description: 'See the latest product updates, new features, and improvements to Swiss Immigration Pro.',
}

type Tag = 'new' | 'improved' | 'fixed'

interface ChangelogEntry {
  date: string
  title: string
  description: string
  tag: Tag
}

const TAG_STYLES: Record<Tag, string> = {
  new: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  improved: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  fixed: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
}

const DOT_STYLES: Record<Tag, string> = {
  new: 'bg-emerald-500',
  improved: 'bg-blue-500',
  fixed: 'bg-amber-500',
}

const ENTRIES: ChangelogEntry[] = [
  {
    date: '2026-03-04',
    title: 'Voice Conversations',
    description: 'Talk to our AI immigration assistant using your voice. Available in English and French with real-time speech recognition.',
    tag: 'new',
  },
  {
    date: '2026-03-03',
    title: 'Notification Centre',
    description: 'Stay updated with in-app notifications for new features, billing alerts, and weekly immigration tips.',
    tag: 'new',
  },
  {
    date: '2026-03-01',
    title: 'Citizenship Module Expansion',
    description: 'Added canton-specific citizenship requirements for all 26 cantons including detailed timelines and document checklists.',
    tag: 'new',
  },
  {
    date: '2026-03-01',
    title: 'Security Infrastructure Upgrade',
    description: 'Strengthened JWT validation, added rate limiting improvements, and patched 6 security vulnerabilities.',
    tag: 'fixed',
  },
  {
    date: '2026-02-28',
    title: 'Module Content Lazy Loading',
    description: 'Reduced initial bundle size by ~600KB. Module content now loads on demand for faster page navigation.',
    tag: 'improved',
  },
  {
    date: '2026-02-25',
    title: 'B2B Corporate Portal',
    description: 'New corporate portal for companies managing employee relocations. Includes compliance tracking, bulk onboarding, and ROI reporting.',
    tag: 'new',
  },
  {
    date: '2026-02-20',
    title: 'One-Time Product Checkout Fix',
    description: 'Fixed an issue where Masterclass, Citizenship Roadmap, and Application Support purchases were not processing correctly.',
    tag: 'fixed',
  },
  {
    date: '2026-02-15',
    title: 'AI Assistant Improvements',
    description: 'Enhanced the virtual lawyer with 5-provider AI fallback chain for 99.9% uptime. Added source citations and confidence indicators.',
    tag: 'improved',
  },
  {
    date: '2026-02-10',
    title: 'Dark Mode Support',
    description: 'Full dark mode support across all pages and components. Automatically follows your system preference.',
    tag: 'new',
  },
  {
    date: '2026-02-05',
    title: 'Referral Program Launch',
    description: 'Earn rewards for every friend who subscribes. Three tiers: Starter, Ambassador, and Champion with increasing per-referral bonuses.',
    tag: 'new',
  },
]

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function ChangelogPage() {
  return (
    <div className="sip-container-wide py-12 sm:py-16">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Changelog</h1>
          <p className="text-base text-gray-600 dark:text-gray-400">
            The latest updates, features, and improvements to Swiss Immigration Pro.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gray-200 dark:bg-gray-800" />

          <div className="space-y-8">
            {ENTRIES.map((entry, i) => (
              <div key={i} className="relative pl-8">
                {/* Dot */}
                <div className={cn('absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full border-2 border-white dark:border-gray-950', DOT_STYLES[entry.tag])} />

                {/* Content */}
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <time className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {formatDate(entry.date)}
                    </time>
                    <span className={cn('inline-flex px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full', TAG_STYLES[entry.tag])}>
                      {entry.tag}
                    </span>
                  </div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">{entry.title}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{entry.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
