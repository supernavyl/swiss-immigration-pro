'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Bell, Save } from 'lucide-react'
import Link from 'next/link'
import { useSession } from '@/lib/auth-client'
import { useToast } from '@/components/providers/ToastProvider'
import { cn } from '@/lib/utils/cn'

const STORAGE_KEY = 'sip_notification_prefs'

interface Preferences {
  weeklyTips: boolean
  productUpdates: boolean
  billingAlerts: boolean
  newFeatures: boolean
}

const DEFAULT_PREFS: Preferences = {
  weeklyTips: true,
  productUpdates: true,
  billingAlerts: true,
  newFeatures: true,
}

const PREF_LABELS: Array<{ key: keyof Preferences; title: string; description: string }> = [
  { key: 'weeklyTips', title: 'Weekly Tips', description: 'Immigration tips and advice delivered every week.' },
  { key: 'productUpdates', title: 'Product Updates', description: 'New features, improvements, and module releases.' },
  { key: 'billingAlerts', title: 'Billing Alerts', description: 'Payment confirmations, invoice reminders, and plan changes.' },
  { key: 'newFeatures', title: 'New Features', description: 'Be the first to know about new tools and resources.' },
]

function loadPrefs(): Preferences {
  if (typeof window === 'undefined') return DEFAULT_PREFS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...DEFAULT_PREFS, ...(JSON.parse(raw) as Partial<Preferences>) } : DEFAULT_PREFS
  } catch {
    return DEFAULT_PREFS
  }
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200',
        checked ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700',
      )}
    >
      <span
        className={cn(
          'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform duration-200',
          checked ? 'translate-x-5' : 'translate-x-0',
        )}
      />
    </button>
  )
}

export default function NotificationsPage() {
  const router = useRouter()
  const { status } = useSession()
  const { showToast } = useToast()
  const [prefs, setPrefs] = useState<Preferences>(DEFAULT_PREFS)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login')
  }, [status, router])

  useEffect(() => {
    setPrefs(loadPrefs())
    setMounted(true)
  }, [])

  const updatePref = useCallback((key: keyof Preferences, value: boolean) => {
    setPrefs(prev => {
      const next = { ...prev, [key]: value }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const saveAll = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
    showToast('Notification preferences saved.', 'success')
  }, [prefs, showToast])

  if (status === 'loading' || !mounted) {
    return (
      <div className="sip-container-wide py-12">
        <div className="max-w-2xl mx-auto space-y-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-20 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="sip-container-wide py-8 sm:py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/30">
              <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Notification Preferences</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Choose which emails you&apos;d like to receive.</p>
            </div>
          </div>
        </div>

        {/* Toggles */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800">
          {PREF_LABELS.map(({ key, title, description }) => (
            <div key={key} className="flex items-center justify-between px-5 py-4">
              <div className="min-w-0 pr-4">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
              </div>
              <Toggle checked={prefs[key]} onChange={v => updatePref(key, v)} />
            </div>
          ))}
        </div>

        {/* Save + note */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Settings stored locally. Server sync coming soon.
          </p>
          <button
            onClick={saveAll}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            Save preferences
          </button>
        </div>
      </div>
    </div>
  )
}
