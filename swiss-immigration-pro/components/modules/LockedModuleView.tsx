'use client'

import { useState } from 'react'
import Link from 'next/link'
import { getModulePack, type Module } from '@/lib/content/pack-content'
import { PRICING_PACKS } from '@/lib/pricing'
import UpgradeModal from './UpgradeModal'

interface LockedModuleViewProps {
  module: Module
}

export default function LockedModuleView({ module }: LockedModuleViewProps) {
  const [upgradeOpen, setUpgradeOpen] = useState(false)
  const owningPackId = getModulePack(module.id)
  const owningPack = PRICING_PACKS[owningPackId as keyof typeof PRICING_PACKS]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="card p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 mb-3">
                Locked Premium Module
              </span>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {module.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                This expert module lives inside the {owningPack?.name ?? 'premium'} plan.
                Upgrade to unlock the full legal strategy, checklists, and interactive tools.
              </p>
            </div>
            <button
              onClick={() => setUpgradeOpen(true)}
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg font-semibold shadow-md hover:from-blue-700 hover:to-blue-900 transition-all"
            >
              Upgrade Now &rarr;
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900/50">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                What you&apos;ll unlock
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>&bull; Full legal references and SEM-backed playbook</li>
                <li>&bull; Downloadable templates, checklists, and calculators</li>
                <li>&bull; Interactive progress tracking and milestone reminders</li>
              </ul>
            </div>
            <div className="p-5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Module snapshot
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{module.description}</p>
              <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
                Part of {owningPack?.name ?? 'Premium Pack'}
              </div>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
            Already upgraded? Make sure you&apos;re logged in with the right account.
          </div>
        </div>
      </div>

      <UpgradeModal
        isOpen={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        feature={module.title}
      />
    </div>
  )
}
