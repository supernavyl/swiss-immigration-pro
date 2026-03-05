'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Download, Trash2, AlertTriangle, Database } from 'lucide-react'
import Link from 'next/link'
import { useSession } from '@/lib/auth-client'
import { useToast } from '@/components/providers/ToastProvider'
import { cn } from '@/lib/utils/cn'

export default function DataManagementPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { showToast } = useToast()
  const [confirmEmail, setConfirmEmail] = useState('')
  const [mounted, setMounted] = useState(false)

  const userEmail = (session?.user as { email?: string } | undefined)?.email ?? ''

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login')
  }, [status, router])

  useEffect(() => { setMounted(true) }, [])

  if (status === 'loading' || !mounted) {
    return (
      <div className="sip-container-wide py-12">
        <div className="max-w-2xl mx-auto space-y-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
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
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/30">
              <Database className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Data & Privacy</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manage your data in compliance with GDPR.</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Export */}
          <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
            <div className="flex items-start gap-3">
              <Download className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Export My Data</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Download a copy of all your personal data including profile, progress, and conversation history.
                </p>
                <button
                  onClick={() => showToast('Data export is coming soon. We\'ll notify you when it\'s ready.', 'info')}
                  className="mt-3 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-950/50 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Request data export
                </button>
              </div>
            </div>
          </section>

          {/* Download history */}
          <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Download History</h2>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                <Database className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">No data exports yet.</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Your export history will appear here.</p>
            </div>
          </section>

          {/* Danger zone */}
          <section className="bg-white dark:bg-gray-900 rounded-2xl border border-red-200 dark:border-red-900/50 p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <h2 className="text-sm font-semibold text-red-600 dark:text-red-400">Danger Zone</h2>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <div className="space-y-3">
              <div>
                <label htmlFor="confirm-email" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Type your email to confirm: <span className="font-mono text-gray-500">{userEmail}</span>
                </label>
                <input
                  id="confirm-email"
                  type="email"
                  value={confirmEmail}
                  onChange={e => setConfirmEmail(e.target.value)}
                  placeholder="your@email.com"
                  className={cn(
                    'w-full px-3 py-2 text-sm rounded-lg border bg-white dark:bg-gray-950 transition-colors',
                    'border-gray-200 dark:border-gray-800 focus:border-red-300 dark:focus:border-red-700 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900/30 outline-none',
                  )}
                />
              </div>
              <button
                onClick={() => {
                  if (confirmEmail.toLowerCase() !== userEmail.toLowerCase()) {
                    showToast('Email does not match. Please try again.', 'error')
                    return
                  }
                  showToast('Please contact support@swissimmigrationpro.ch to complete account deletion.', 'info')
                  setConfirmEmail('')
                }}
                disabled={!confirmEmail}
                className={cn(
                  'inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-colors',
                  confirmEmail
                    ? 'text-white bg-red-600 hover:bg-red-700'
                    : 'text-gray-400 bg-gray-100 dark:bg-gray-800 cursor-not-allowed',
                )}
              >
                <Trash2 className="w-4 h-4" />
                Delete my account
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
