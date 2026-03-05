'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Bell, Sparkles, CreditCard, Info, Lightbulb } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

interface Notification {
  id: string
  title: string
  body: string
  date: string
  type: 'system' | 'billing' | 'feature' | 'tip'
  link?: string
}

const TYPE_ICON = {
  system: Info,
  billing: CreditCard,
  feature: Sparkles,
  tip: Lightbulb,
} as const

const TYPE_COLOR = {
  system: 'text-blue-500',
  billing: 'text-amber-500',
  feature: 'text-purple-500',
  tip: 'text-emerald-500',
} as const

const NOTIFICATIONS: Notification[] = [
  { id: '1', title: 'Voice Conversations Available', body: 'Talk to our AI immigration assistant using your voice.', date: '2026-03-04', type: 'feature', link: '/lawyer' },
  { id: '2', title: 'New Citizenship Module', body: 'Canton-specific citizenship requirements now available.', date: '2026-03-01', type: 'feature', link: '/modules/cit-05' },
  { id: '3', title: 'Security Update', body: 'We\'ve strengthened our security infrastructure.', date: '2026-03-01', type: 'system', link: '/security' },
  { id: '4', title: 'Weekly Tip: B Permit Renewal', body: 'Start your B permit renewal 3 months before expiry.', date: '2026-02-28', type: 'tip' },
]

const STORAGE_KEY = 'sip_notifications_read'

function getReadIds(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set()
  } catch {
    return new Set()
  }
}

function saveReadIds(ids: Set<string>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]))
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  return `${Math.floor(days / 7)}w ago`
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [readIds, setReadIds] = useState<Set<string>>(new Set())
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setReadIds(getReadIds())
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const unreadCount = NOTIFICATIONS.filter(n => !readIds.has(n.id)).length

  const markRead = useCallback((id: string) => {
    setReadIds(prev => {
      const next = new Set(prev)
      next.add(id)
      saveReadIds(next)
      return next
    })
  }, [])

  const markAllRead = useCallback(() => {
    const allIds = new Set(NOTIFICATIONS.map(n => n.id))
    setReadIds(allIds)
    saveReadIds(allIds)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(prev => !prev)}
        className="relative p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full" />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-80 z-50 bg-white dark:bg-gray-900 rounded-xl shadow-xl ring-1 ring-gray-200 dark:ring-gray-800 overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
                {NOTIFICATIONS.map(n => {
                  const Icon = TYPE_ICON[n.type]
                  const isUnread = !readIds.has(n.id)
                  const itemClass = cn(
                    'flex gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors',
                    isUnread && 'bg-blue-50/50 dark:bg-blue-950/20',
                  )
                  const inner = (
                    <>
                      <div className={cn('mt-0.5 shrink-0', TYPE_COLOR[n.type])}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className={cn('text-sm truncate', isUnread ? 'font-semibold text-gray-900 dark:text-white' : 'font-medium text-gray-700 dark:text-gray-300')}>
                            {n.title}
                          </p>
                          {isUnread && <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0" />}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{n.body}</p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">{timeAgo(n.date)}</p>
                      </div>
                    </>
                  )
                  const handleClick = () => { markRead(n.id); if (n.link) setOpen(false) }

                  return n.link ? (
                    <Link key={n.id} href={n.link} onClick={handleClick} className={itemClass}>
                      {inner}
                    </Link>
                  ) : (
                    <div key={n.id} onClick={handleClick} className={itemClass}>
                      {inner}
                    </div>
                  )
                })}
              </div>

              <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-800">
                <Link
                  href="/account/notifications"
                  onClick={() => setOpen(false)}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 font-medium"
                >
                  Manage preferences
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
