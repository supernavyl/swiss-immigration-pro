'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Calendar, Clock, ArrowRight, ChevronRight,
  FileText, Users, Briefcase, Globe, Home, Star, Languages, Shield,
} from 'lucide-react'

/* ────────────────────────────────────────────────
   Category config
   ──────────────────────────────────────────────── */

interface CategoryStyle {
  dot: string
  bg: string
  text: string
  gradient: string
  icon: React.ElementType
  thumbnail?: string
}

const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  'Permits & Visas': {
    dot: 'bg-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    text: 'text-blue-700 dark:text-blue-300',
    gradient: 'from-blue-500 to-indigo-600',
    icon: Shield,
    thumbnail: '/images/blog/permits.jpg',
  },
  Citizenship: {
    dot: 'bg-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    text: 'text-emerald-700 dark:text-emerald-300',
    gradient: 'from-emerald-500 to-teal-600',
    icon: Star,
    thumbnail: '/images/blog/citizenship.jpg',
  },
  'Immigration Strategy': {
    dot: 'bg-violet-500',
    bg: 'bg-violet-50 dark:bg-violet-950/40',
    text: 'text-violet-700 dark:text-violet-300',
    gradient: 'from-violet-500 to-purple-600',
    icon: Globe,
    thumbnail: '/images/blog/integration.jpg',
  },
  'Employment & Career': {
    dot: 'bg-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    text: 'text-amber-700 dark:text-amber-300',
    gradient: 'from-amber-500 to-orange-600',
    icon: Briefcase,
    thumbnail: '/images/blog/work.jpg',
  },
  'Family & Immigration': {
    dot: 'bg-rose-500',
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    text: 'text-rose-700 dark:text-rose-300',
    gradient: 'from-rose-500 to-pink-600',
    icon: Users,
    thumbnail: '/images/blog/family.jpg',
  },
  'Living in Switzerland': {
    dot: 'bg-teal-500',
    bg: 'bg-teal-50 dark:bg-teal-950/40',
    text: 'text-teal-700 dark:text-teal-300',
    gradient: 'from-teal-500 to-cyan-600',
    icon: Home,
    thumbnail: '/images/blog/legal.jpg',
  },
  'Integration & Language': {
    dot: 'bg-indigo-500',
    bg: 'bg-indigo-50 dark:bg-indigo-950/40',
    text: 'text-indigo-700 dark:text-indigo-300',
    gradient: 'from-indigo-500 to-blue-600',
    icon: Languages,
    thumbnail: '/images/blog/integration.jpg',
  },
}

const DEFAULT_STYLE: CategoryStyle = {
  dot: 'bg-gray-500',
  bg: 'bg-gray-50 dark:bg-gray-900',
  text: 'text-gray-700 dark:text-gray-300',
  gradient: 'from-gray-500 to-slate-600',
  icon: FileText,
}

/* ────────────────────────────────────────────────
   Post data
   ──────────────────────────────────────────────── */

interface BlogPost {
  slug: string
  title: string
  description: string
  publishedAt: string
  category: string
  readingTime: number
}

const POSTS: BlogPost[] = [
  {
    slug: 'language-requirements-a1-to-c1',
    title: 'Language Requirements for Swiss Immigration: From A1 to C1',
    description:
      'Complete guide to Swiss language requirements for permits, citizenship, and integration. Required levels, recognized tests, study timelines, and immersion strategies.',
    publishedAt: '2025-01-30',
    category: 'Integration & Language',
    readingTime: 18,
  },
  {
    slug: 'cost-of-living-swiss-cities-2026',
    title: 'Cost of Living in Major Swiss Cities: Complete 2026 Guide',
    description:
      'Detailed breakdown of living costs in Zurich, Geneva, Basel, Bern, and Lausanne. Housing, food, transport, and total monthly budgets.',
    publishedAt: '2025-01-28',
    category: 'Living in Switzerland',
    readingTime: 17,
  },
  {
    slug: 'family-reunification-step-by-step-process',
    title: 'Family Reunification in Switzerland: Step-by-Step Process Guide',
    description:
      'Complete guide to bringing your family to Switzerland. Income thresholds, housing requirements, document checklists, and cantonal timelines.',
    publishedAt: '2025-01-26',
    category: 'Family & Immigration',
    readingTime: 18,
  },
  {
    slug: 'cv-format-swiss-employers-ats-optimization',
    title: 'CV Format for Swiss Employers: ATS Optimization Guide',
    description:
      'Format your CV for Swiss employers and ATS systems. Photo requirements, Swiss-specific sections, keyword optimization, and industry templates.',
    publishedAt: '2025-01-24',
    category: 'Employment & Career',
    readingTime: 17,
  },
  {
    slug: 'salary-negotiation-switzerland-cultural-insights',
    title: 'Salary Negotiation in Switzerland: Cultural Insights & Strategies',
    description:
      'Master salary negotiation with Swiss cultural awareness. Ranges by industry and canton, negotiation scripts, and total compensation strategies.',
    publishedAt: '2025-01-22',
    category: 'Employment & Career',
    readingTime: 13,
  },
  {
    slug: 'understanding-swiss-cantonal-variations',
    title:
      'Understanding Swiss Cantonal Variations: How 26 Cantons Shape Your Application',
    description:
      'Approval rates, processing times, salary minimums, and housing rules across Swiss cantons. Data-driven strategies for choosing the right canton.',
    publishedAt: '2025-01-20',
    category: 'Immigration Strategy',
    readingTime: 15,
  },
  {
    slug: '10-common-mistakes-work-permit-applications',
    title:
      '10 Common Mistakes in Swiss Work Permit Applications (And How to Avoid Them)',
    description:
      'After analyzing thousands of applications, here are the most frequent mistakes that lead to rejection — and exactly how to avoid each one.',
    publishedAt: '2025-01-18',
    category: 'Permits & Visas',
    readingTime: 12,
  },
  {
    slug: 'swiss-l-permit-guide',
    title: 'Complete Guide to Swiss L Permit (Short-term Residence)',
    description:
      'Everything about the L permit: requirements, application process, quota system, renewal rules, and tips for a successful application.',
    publishedAt: '2025-01-15',
    category: 'Permits & Visas',
    readingTime: 5,
  },
  {
    slug: 'swiss-b-permit-complete-guide',
    title: 'Swiss B Permit: The Definitive Guide to Long-term Residence',
    description:
      'EU vs non-EU pathways, quotas, cantonal processing differences, family reunification, path to C permit, costs, and employment change rules.',
    publishedAt: '2025-01-10',
    category: 'Permits & Visas',
    readingTime: 8,
  },
  {
    slug: 'swiss-citizenship-guide',
    title: 'Swiss Citizenship: Complete Naturalization Guide',
    description:
      'Three-level naturalization explained: federal, cantonal, and municipal. Language tests, integration interviews, costs by canton, and success tips.',
    publishedAt: '2025-01-05',
    category: 'Citizenship',
    readingTime: 10,
  },
]

/* ────────────────────────────────────────────────
   Helpers
   ──────────────────────────────────────────────── */

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function CategoryBadge({ category }: { category: string }) {
  const c = CATEGORY_STYLES[category] ?? DEFAULT_STYLE
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {category}
    </span>
  )
}

function ArticleCardHeader({ category }: { category: string }) {
  const c = CATEGORY_STYLES[category] ?? DEFAULT_STYLE
  const Icon = c.icon
  return (
    <div
      className={`relative h-32 bg-gradient-to-br ${c.gradient} flex items-center justify-center overflow-hidden`}
    >
      {c.thumbnail && (
        <Image
          src={c.thumbnail}
          alt={category}
          fill
          className="object-cover opacity-30 mix-blend-overlay"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      )}
      <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/10" />
      <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-white/10" />
      <Icon className="w-9 h-9 text-white/80 relative z-10" />
    </div>
  )
}

/* ────────────────────────────────────────────────
   Page
   ──────────────────────────────────────────────── */

const ALL_CATEGORIES = ['All', ...Array.from(new Set(POSTS.map((p) => p.category))).sort()]

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('All')

  const sorted = [...POSTS].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )
  const featured = sorted[0]
  const rest = sorted.slice(1)

  const filtered =
    activeCategory === 'All'
      ? rest
      : rest.filter((p) => p.category === activeCategory)

  const featuredStyle = CATEGORY_STYLES[featured.category] ?? DEFAULT_STYLE
  const FeaturedIcon = featuredStyle.icon

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* ── Header ── */}
      <section className="pt-16 pb-10 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 tracking-wide uppercase mb-3">
            Blog
          </p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            Immigration Guides&nbsp;&amp;&nbsp;Insights
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
            In-depth articles on Swiss permits, citizenship, employment, and life
            in Switzerland&nbsp;&mdash; written by immigration experts.
          </p>
        </div>
      </section>

      {/* ── Featured Post ── */}
      <section className="px-5 sm:px-8 pb-6">
        <div className="max-w-5xl mx-auto">
          <Link
            href={`/blog/${featured.slug}`}
            className="group relative block overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 hover:shadow-xl"
          >
            {/* Visual header band */}
            <div
              className={`relative h-32 bg-gradient-to-br ${featuredStyle.gradient} flex items-center overflow-hidden`}
            >
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,_white,_transparent_60%)]" />
              <div className="absolute right-0 top-0 w-64 h-64 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/4" />
              <div className="px-10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                  <FeaturedIcon className="w-6 h-6 text-white" />
                </div>
                <span className="text-white/70 text-sm font-semibold uppercase tracking-wider">
                  Featured Article
                </span>
              </div>
            </div>

            <div className="p-8 sm:p-10 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
              <div className="flex items-center gap-3 mb-4">
                <CategoryBadge category={featured.category} />
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                {featured.title}
              </h2>

              <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-2xl leading-relaxed">
                {featured.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {featured.readingTime} min read
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {formatDate(featured.publishedAt)}
                </span>
                <span className="ml-auto hidden sm:inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  Read article <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ── Category Filter ── */}
      <section className="px-5 sm:px-8 pt-4 pb-2">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap gap-2">
            {ALL_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat
              const style = cat === 'All' ? null : (CATEGORY_STYLES[cat] ?? DEFAULT_STYLE)
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? style
                        ? `bg-gradient-to-r ${style.gradient} text-white shadow-sm`
                        : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat === 'All' ? `All (${rest.length})` : cat}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Articles Grid ── */}
      <section className="px-5 sm:px-8 py-8">
        <div className="max-w-5xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-400 dark:text-slate-600">
              No articles in this category yet.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg hover:shadow-slate-100/80 dark:hover:shadow-none transition-all duration-300 overflow-hidden"
                >
                  {/* Visual category header */}
                  <ArticleCardHeader category={post.category} />

                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <CategoryBadge category={post.category} />
                      <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                        <Clock className="w-3 h-3" />
                        {post.readingTime} min
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 dark:text-white mb-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 flex-1 line-clamp-3 leading-relaxed">
                      {post.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-xs text-slate-400 dark:text-slate-500">
                        {formatDate(post.publishedAt)}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-5 sm:px-8 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Ready to start your Swiss journey?
            </h2>
            <p className="text-blue-100 mb-8 max-w-lg mx-auto">
              Take our free assessment to get a personalized immigration pathway
              in under 5&nbsp;minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/quiz"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition-colors"
              >
                Start Free Assessment <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
              >
                View Plans
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
