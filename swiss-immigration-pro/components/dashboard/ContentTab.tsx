'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { BookOpen, ChevronRight, Check, Clock, HelpCircle, CheckSquare } from 'lucide-react'
import { PRICING_PACKS } from '@/lib/pricing'
import type { TabProps, DashboardModule } from './types'

const PREMIUM_HIGHLIGHTS = [
  {
    title: 'Cantonal Success Playbook',
    description: 'Advanced Pack members get 10x more cantonal data, salary scripts, and embassy-ready dossiers.',
    badge: 'Advanced Pack',
    href: '/pricing',
  },
  {
    title: 'Citizenship Timeline Planner',
    description: 'Unlock a personalised 10-year roadmap with StAG & OLN compliance checks built in.',
    badge: 'Citizenship Pro',
    href: '/pricing#citizenship',
  },
  {
    title: 'AI Permit Strategy Coach',
    description: 'Chat with our legal-grade AI tutor for unlimited document reviews and interview prep.',
    badge: 'All Paid Packs',
    href: '/pricing',
  },
]

export default function ContentTab({ modules, isFree, previewModules }: TabProps) {
  return (
    <div className="space-y-8">
      {isFree && (
        <div className="card p-6 bg-gradient-to-r from-blue-50 via-white to-purple-50 dark:from-blue-900/40 dark:via-gray-900 dark:to-purple-900/40 border-blue-100 dark:border-blue-800">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 mb-3">
                FREE PREVIEW ACCESS
              </span>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Start with our trusted foundation modules
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                You&apos;re seeing the same legal-grade frameworks we use with paying clients. Finish these two guides, then unlock the complete system when you&apos;re ready.
              </p>
            </div>
            <a
              href="/pricing"
              className="inline-flex items-center justify-center px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg font-semibold shadow-md hover:from-blue-700 hover:to-blue-900 transition-all"
            >
              See Everything You Unlock &rarr;
            </a>
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          {isFree ? 'Unlocked Starter Modules' : 'Your Content Modules'}
        </h2>
        {modules.length === 0 ? (
          <div className="card p-6 text-center text-gray-500 dark:text-gray-400">
            No modules available yet.
          </div>
        ) : (
          <div className="space-y-4">
            {modules.map((mod, idx) => (
              <ModuleCard key={mod.id} module={mod} idx={idx} isFree={isFree} />
            ))}
          </div>
        )}
      </div>

      {!isFree && (previewModules?.length ?? 0) > 0 && (
        <PreviewModulesSection previewModules={previewModules!} />
      )}

      {isFree && <FreeUpgradeSection />}
    </div>
  )
}

function ModuleCard({ module, idx, isFree }: { module: DashboardModule; idx: number; isFree?: boolean }) {
  const hasQuiz = module.quiz?.questions && module.quiz.questions.length > 0
  const hasExercises = module.exercises && module.exercises.length > 0
  const sectionCount = module.enhancedModule?.sections?.length ?? 0

  return (
    <Link href={`/modules/${module.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: idx * 0.05 }}
        className="card p-6 hover:shadow-xl transition-all cursor-pointer group"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                module.completed ? 'bg-green-100 dark:bg-green-900' : 'bg-blue-100 dark:bg-blue-900'
              }`}
            >
              {module.completed ? (
                <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
              ) : (
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{idx + 1}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center flex-wrap gap-2 mb-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {module.title}
                </h3>
                {isFree && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                    FREE PREVIEW
                  </span>
                )}
                {module.completed && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                    COMPLETED
                  </span>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{module.description}</p>
              <div className="flex items-center flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
                {module.duration && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {module.duration}
                  </span>
                )}
                {sectionCount > 0 && (
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" /> {sectionCount} sections
                  </span>
                )}
                {hasQuiz && (
                  <span className="flex items-center gap-1 text-purple-600 dark:text-purple-400">
                    <HelpCircle className="w-3.5 h-3.5" /> Quiz
                  </span>
                )}
                {hasExercises && (
                  <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                    <CheckSquare className="w-3.5 h-3.5" /> Exercises
                  </span>
                )}
              </div>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0 mt-1" />
        </div>
      </motion.div>
    </Link>
  )
}

function PreviewModulesSection({ previewModules }: { previewModules: Array<{ module: DashboardModule; packId: string }> }) {
  return (
    <div className="card p-6 border border-dashed border-purple-300 dark:border-purple-700 bg-white/60 dark:bg-gray-900/60">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div className="max-w-xl">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Explore what other members unlock</h3>
          <p className="text-gray-600 dark:text-gray-300">
            These premium modules come from our other packs. Upgrade to gain full access instantly.
          </p>
        </div>
        <a
          href="/pricing"
          className="inline-flex items-center justify-center px-5 py-3 bg-gradient-to-r from-purple-600 to-blue-700 text-white rounded-lg font-semibold shadow-md hover:from-purple-700 hover:to-blue-800 transition-all"
        >
          Compare Packs &rarr;
        </a>
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {previewModules.map(({ module: mod, packId }) => {
          const packName = PRICING_PACKS[packId as keyof typeof PRICING_PACKS]?.name ?? packId
          return (
            <div
              key={mod.id}
              className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-300 dark:hover:border-purple-600 transition-all"
            >
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                {packName}
              </span>
              <h4 className="mt-3 text-lg font-semibold text-gray-900 dark:text-white">{mod.title}</h4>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {mod.description ?? 'Premium module available in this pack.'}
              </p>
              <a
                href="/pricing"
                className="mt-4 inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
              >
                Upgrade to Unlock &rarr;
              </a>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function FreeUpgradeSection() {
  return (
    <div className="card p-6 border border-dashed border-blue-300 dark:border-blue-700 bg-white/60 dark:bg-gray-900/60">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div className="max-w-xl">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Ready to unlock the full Immigration Masterclass?
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Upgrade to access 20+ premium modules, interactive calculators, AI strategy coaches, and the exact legal templates that boost approval rates to 92%.
          </p>
        </div>
        <a
          href="/pricing"
          className="inline-flex items-center justify-center px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-md transition-all"
        >
          Upgrade Now &rarr;
        </a>
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {PREMIUM_HIGHLIGHTS.map((h) => (
          <a
            key={h.title}
            href={h.href}
            className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all bg-white dark:bg-gray-800 hover:shadow-lg"
          >
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
              {h.badge}
            </span>
            <h4 className="mt-3 text-lg font-semibold text-gray-900 dark:text-white">{h.title}</h4>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{h.description}</p>
            <span className="mt-3 inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
              Learn more &rarr;
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}
