'use client'

import Link from 'next/link'
import { getModulePack, type Module } from '@/lib/content/pack-content'
import { PRICING_PACKS } from '@/lib/pricing'

interface LockedModuleViewProps {
  module: Module
}

export default function LockedModuleView({ module }: LockedModuleViewProps) {
  const owningPackId = getModulePack(module.id)
  const owningPack = PRICING_PACKS[owningPackId as keyof typeof PRICING_PACKS]

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="card p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 mb-3">
                Locked Premium Module
              </span>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {module.title}
              </h1>
              <p className="text-gray-600">
                This expert module lives inside the {owningPack?.name ?? 'premium'} plan.
                Upgrade to unlock the full legal strategy, checklists, and interactive tools.
              </p>
            </div>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg font-semibold shadow-md hover:from-blue-700 hover:to-blue-900 transition-all"
            >
              View Upgrade Options &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What you&apos;ll unlock
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>&bull; Full legal references and SEM-backed playbook</li>
                <li>&bull; Downloadable templates, checklists, and calculators</li>
                <li>&bull; Interactive progress tracking and milestone reminders</li>
              </ul>
            </div>
            <div className="p-5 bg-white rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Module snapshot
              </h3>
              <p className="text-sm text-gray-600">{module.description}</p>
              <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                Part of {owningPack?.name ?? 'Premium Pack'}
              </div>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-500 text-sm">
            Already upgraded? Make sure you&apos;re logged in with the right account.
          </div>
        </div>
      </div>
    </div>
  )
}
