'use client'

import Link from 'next/link'
import { User, LogOut, Shield, Settings, ArrowRight, X, Bell, Gift, CreditCard } from 'lucide-react'
import { motion } from 'framer-motion'
import { useT } from '@/lib/i18n/useTranslation'
import { cn } from '@/lib/utils/cn'
import AdvancedSearch from '@/components/ui/AdvancedSearch'
import DarkModeToggle from '@/components/ui/DarkModeToggle'
import LanguageSwitcher from '@/components/layout/LanguageSwitcher'
import { useSwipe } from '@/lib/hooks/useSwipeGesture'

interface AppUser {
  id?: string
  email?: string | null
  name?: string | null
  isAdmin?: boolean
  packId?: string | null
}

interface MobileDrawerProps {
  appUser: AppUser | null
  navigationItems: Array<{ href: string; label: string }>
  isActive: (href: string) => boolean
  onClose: () => void
  onSignOut: () => Promise<void>
}

export default function MobileDrawer({
  appUser,
  navigationItems,
  isActive,
  onClose,
  onSignOut,
}: MobileDrawerProps) {
  const { t } = useT()
  const drawerRef = useSwipe<HTMLDivElement>({
    onSwipeRight: onClose,
    threshold: 80,
  })

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <motion.div
        ref={drawerRef}
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
        className="fixed inset-y-0 right-0 z-50 w-full max-w-[320px] bg-white/95 dark:bg-gray-950/95 backdrop-blur-2xl shadow-2xl lg:hidden overflow-y-auto overscroll-contain"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between bg-white/95 dark:bg-gray-950/95 backdrop-blur-2xl px-5 py-4 border-b border-gray-100 dark:border-gray-900">
          <div className="flex items-baseline gap-0 leading-none">
            <span className="text-sm font-semibold tracking-tight text-gray-900 dark:text-white">Swiss</span>
            <span className="text-sm font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500">
              Immigration
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-0.5 self-end mb-0.5">
              Pro
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors touch-manipulation"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-5 py-5 space-y-6">
          {/* Mobile search */}
          <div className="sm:hidden">
            <AdvancedSearch />
          </div>

          {/* User card */}
          {appUser && (
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 dark:bg-gray-900 p-3.5 ring-1 ring-gray-200 dark:ring-gray-800">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-bold shrink-0">
                {appUser.name?.charAt(0)?.toUpperCase() ?? <User className="h-4 w-4" />}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{appUser.name ?? 'Member'}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{appUser.email ?? ''}</p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="space-y-0.5">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  'flex items-center rounded-lg px-3.5 py-3 text-sm font-medium transition-colors touch-manipulation',
                  isActive(item.href)
                    ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-900'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900',
                )}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-900">
            <Link
              href="/consultation"
              onClick={onClose}
              className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-4 py-3 text-sm font-semibold text-white transition-all shadow-sm shadow-blue-600/25 touch-manipulation"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              {t('nav.consultation')}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              onClick={onClose}
              className="flex items-center justify-center gap-2 rounded-full ring-1 ring-gray-200 dark:ring-gray-800 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors touch-manipulation"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              {t('nav.contact')}
            </Link>
          </div>

          {/* Account links */}
          {appUser && (
            <div className="space-y-0.5 pt-2 border-t border-gray-100 dark:border-gray-900">
              <p className="text-[11px] font-medium text-gray-400 dark:text-gray-600 uppercase tracking-wider px-3.5 mb-1">
                Account
              </p>
              {appUser.isAdmin ? (
                <>
                  <MobileLink href="/admin" icon={Shield} label={t('auth.admin')} onClose={onClose} />
                  <MobileLink href="/admin/settings" icon={Settings} label={t('auth.settings')} onClose={onClose} />
                </>
              ) : (
                <>
                  <MobileLink href="/dashboard" icon={User} label={t('nav.dashboard')} onClose={onClose} />
                  <MobileLink href="/profile" icon={Settings} label={t('auth.profile')} onClose={onClose} />
                  <MobileLink href="/account/notifications" icon={Bell} label="Notifications" onClose={onClose} />
                  <MobileLink href="/account/billing" icon={CreditCard} label="Billing" onClose={onClose} />
                  <MobileLink href="/account/referrals" icon={Gift} label="Referrals" onClose={onClose} />
                </>
              )}
            </div>
          )}

          {/* Preferences */}
          <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-gray-900">
            <p className="text-[11px] font-medium text-gray-400 dark:text-gray-600 uppercase tracking-wider px-3.5">
              Preferences
            </p>
            <div className="flex items-center justify-between px-3.5">
              <span className="text-sm text-gray-600 dark:text-gray-400">Theme</span>
              <DarkModeToggle />
            </div>
            <div className="flex items-center justify-between px-3.5">
              <span className="text-sm text-gray-600 dark:text-gray-400">Language</span>
              <LanguageSwitcher />
            </div>
          </div>

          {/* Auth */}
          <div className="pt-2 border-t border-gray-100 dark:border-gray-900">
            {appUser ? (
              <button
                onClick={async () => { onClose(); await onSignOut() }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3.5 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors touch-manipulation"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <LogOut className="h-4 w-4" />
                {t('auth.signout')}
              </button>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/auth/login"
                  onClick={onClose}
                  className="block rounded-full bg-gray-900 dark:bg-white px-4 py-3 text-center text-sm font-semibold text-white dark:text-gray-900 transition-colors hover:bg-gray-800 dark:hover:bg-gray-100 touch-manipulation"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  {t('auth.signin')}
                </Link>
                <Link
                  href="/auth/register"
                  onClick={onClose}
                  className="block rounded-full ring-1 ring-gray-200 dark:ring-gray-800 px-4 py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900 touch-manipulation"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  {t('auth.createAccount')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  )
}

function MobileLink({ href, icon: Icon, label, onClose }: { href: string; icon: typeof User; label: string; onClose: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className="flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors touch-manipulation"
    >
      <Icon className="h-4 w-4 text-gray-400" />
      {label}
    </Link>
  )
}
