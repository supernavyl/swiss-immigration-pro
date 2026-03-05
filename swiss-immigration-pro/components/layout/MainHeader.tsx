'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import {
  Menu,
  X,
  User,
  LogOut,
  Shield,
  ArrowRight,
  ChevronDown,
  Crown,
  Bot,
} from 'lucide-react'
import { useSession, signOut } from '@/lib/auth-client'
import { useT } from '@/lib/i18n/useTranslation'
import { AnimatePresence, motion } from 'framer-motion'
import AdvancedSearch from '@/components/ui/AdvancedSearch'
import LanguageSwitcher from '@/components/layout/LanguageSwitcher'
import { useChatbot } from '@/components/chatbot/ChatbotProvider'
import DarkModeToggle from '@/components/ui/DarkModeToggle'
import ResourcesDropdown from '@/components/layout/ResourcesDropdown'
import MobileDrawer from '@/components/layout/MobileDrawer'
import NotificationBell from '@/components/layout/NotificationBell'
import KeyboardShortcutsModal from '@/components/layout/KeyboardShortcutsModal'
import { useHaptic } from '@/lib/hooks/useHaptic'
import { useIsMobile } from '@/lib/hooks/useMediaQuery'
import { cn } from '@/lib/utils/cn'

interface AppUser {
  id?: string
  email?: string | null
  name?: string | null
  isAdmin?: boolean
  packId?: string | null
}

export default function MainHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const pathname = usePathname()
  const { t } = useT()
  const { haptic } = useHaptic()
  const isMobile = useIsMobile()
  const { data: session, status } = useSession()
  const { openChatbot } = useChatbot()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 8)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMobile && isMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobile, isMenuOpen])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.key === '?' &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes(
          (e.target as HTMLElement)?.tagName,
        )
      ) {
        e.preventDefault()
        setShortcutsOpen(true)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const appUser: AppUser | null = useMemo(() => {
    if (typeof window === 'undefined' || !mounted) return null
    if (status === 'loading' || !session?.user) return null
    const u = session.user as AppUser
    return {
      id: u.id,
      email: u.email ?? null,
      name: u.name ?? null,
      isAdmin: u.isAdmin ?? false,
      packId: u.packId ?? null,
    }
  }, [session, status, mounted])

  const navigationItems = useMemo(
    () => [
      { href: '/visas', label: t('nav.visas') || 'Visas & Permits' },
      { href: '/pricing', label: t('nav.pricing') || 'Pricing' },
      { href: '/b2b', label: t('nav.b2b') || 'For Companies' },
    ],
    [t],
  )

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false)
    haptic('light')
  }, [haptic])
  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => {
      const next = !prev
      haptic(next ? 'medium' : 'light')
      return next
    })
  }, [haptic])
  const handleSignOut = useCallback(async () => {
    await signOut({ callbackUrl: '/' })
  }, [])
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  if (mounted && pathname?.startsWith('/auth')) return null

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80'
          : 'bg-white dark:bg-slate-950 border-b border-transparent',
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-14">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600">
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="white">
              <rect x="3" y="6.5" width="10" height="3" rx="0.5" />
              <rect x="6.5" y="3" width="3" height="10" rx="0.5" />
            </svg>
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-slate-900 dark:text-white hidden sm:block">
            Swiss Immigration Pro
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-0.5">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                isActive(item.href)
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900',
              )}
            >
              {item.label}
            </Link>
          ))}
          <ResourcesDropdown />
          <button
            onClick={openChatbot}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors"
          >
            <Bot className="w-3.5 h-3.5" />
            SIP AI
          </button>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1">
          <div className="hidden lg:block">
            <AdvancedSearch />
          </div>
          <div className="hidden lg:block w-px h-4 bg-slate-200 dark:bg-slate-800 mx-1" />
          <div className="hidden sm:block">
            <DarkModeToggle />
          </div>
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          {mounted && appUser && (
            <div className="hidden sm:block">
              <NotificationBell />
            </div>
          )}
          <div className="hidden lg:block w-px h-4 bg-slate-200 dark:bg-slate-800 mx-1" />

          {/* Desktop auth */}
          {mounted && (
            <div className="hidden lg:flex items-center gap-1">
              {appUser ? (
                <>
                  {appUser.packId === 'free' && (
                    <Link
                      href="/pricing"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                      Upgrade
                    </Link>
                  )}
                  <div className="relative">
                    <button
                      onClick={() => setProfileOpen((prev) => !prev)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                    >
                      {appUser.isAdmin ? (
                        <Shield className="h-3.5 w-3.5" />
                      ) : (
                        <User className="h-3.5 w-3.5" />
                      )}
                      {appUser.name ??
                        (appUser.isAdmin ? t('auth.admin') : t('nav.dashboard'))}
                      <ChevronDown className="h-3 w-3" />
                    </button>
                    <AnimatePresence>
                      {profileOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setProfileOpen(false)}
                          />
                          <motion.div
                            initial={{ opacity: 0, y: -4, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -4, scale: 0.97 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 mt-2 w-52 z-50 bg-white dark:bg-slate-900 rounded-xl shadow-xl ring-1 ring-slate-200 dark:ring-slate-800 py-1.5"
                          >
                            <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                              <span
                                className={cn(
                                  'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium',
                                  appUser.packId === 'citizenship'
                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                                    : appUser.packId === 'advanced'
                                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                      : appUser.packId === 'immigration'
                                        ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                                        : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
                                )}
                              >
                                <Crown className="h-3 w-3" />
                                {(appUser.packId ?? 'free').toUpperCase()}
                              </span>
                            </div>
                            <Link
                              href={appUser.isAdmin ? '/admin' : '/dashboard'}
                              onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                              {appUser.isAdmin ? (
                                <Shield className="h-3.5 w-3.5" />
                              ) : (
                                <User className="h-3.5 w-3.5" />
                              )}
                              {appUser.isAdmin
                                ? t('auth.admin')
                                : t('nav.dashboard')}
                            </Link>
                            <button
                              onClick={() => {
                                setProfileOpen(false)
                                handleSignOut()
                              }}
                              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                              <LogOut className="h-3.5 w-3.5" />
                              Sign out
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 rounded-lg hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
                  >
                    {t('auth.login')}
                  </Link>
                  <Link
                    href="/consultation"
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    Get started
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </>
              )}
            </div>
          )}

          {/* Mobile toggle */}
          <button
            onClick={toggleMenu}
            className="ml-1 inline-flex items-center justify-center rounded-lg p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors lg:hidden touch-manipulation"
            aria-label="Toggle navigation menu"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <MobileDrawer
            appUser={appUser}
            navigationItems={navigationItems}
            isActive={isActive}
            onClose={closeMenu}
            onSignOut={handleSignOut}
          />
        )}
      </AnimatePresence>

      <KeyboardShortcutsModal
        isOpen={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
      />
    </header>
  )
}
