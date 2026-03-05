'use client'

import Link from 'next/link'
import Image from 'next/image'
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
  Sparkles,
} from 'lucide-react'
import { useSession, signOut } from '@/lib/auth-client'
import { useT } from '@/lib/i18n/useTranslation'
import { AnimatePresence, motion } from 'framer-motion'
import AdvancedSearch from '@/components/ui/AdvancedSearch'
import LanguageSwitcher from '@/components/layout/LanguageSwitcher'
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

export default function MainHeader(): React.ReactElement | null {
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

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    let ticking = false
    const onScroll = (): void => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 12)
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
    const handler = (e: KeyboardEvent): void => {
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

  const closeMenu = useCallback((): void => {
    setIsMenuOpen(false)
    haptic('light')
  }, [haptic])

  const toggleMenu = useCallback((): void => {
    setIsMenuOpen((prev) => {
      const next = !prev
      haptic(next ? 'medium' : 'light')
      return next
    })
  }, [haptic])

  const handleSignOut = useCallback(async (): Promise<void> => {
    await signOut({ callbackUrl: '/' })
  }, [])

  const isActive = (href: string): boolean =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  if (mounted && pathname?.startsWith('/auth')) return null

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-500',
        scrolled
          ? 'bg-white/88 dark:bg-slate-950/88 backdrop-blur-2xl'
          : 'bg-white dark:bg-slate-950',
      )}
    >
      {/* Animated gradient bottom border */}
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 h-px transition-opacity duration-500',
          scrolled ? 'opacity-100' : 'opacity-40',
        )}
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(59,130,246,0.5) 25%, rgba(139,92,246,0.6) 50%, rgba(59,130,246,0.5) 75%, transparent 100%)',
          backgroundSize: '200% 100%',
          animation: 'gradient-border 4s linear infinite',
        }}
      />

      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-14">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 shrink-0 group"
          aria-label="Swiss Immigration Pro — Home"
        >
          <div className="relative h-8 w-8 shrink-0">
            <Image
              src="/images/logo-removebg.png"
              alt="Swiss Immigration Pro logo"
              fill
              className="object-contain drop-shadow-sm group-hover:drop-shadow-md transition-all duration-300"
              sizes="32px"
              priority
            />
          </div>
          <div className="hidden sm:block">
            <span className="text-[15px] font-bold tracking-tight text-slate-900 dark:text-white leading-none">
              Swiss{' '}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                }}
              >
                Immigration
              </span>{' '}
              Pro
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-0.5">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                isActive(item.href)
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900/60',
              )}
            >
              {item.label}
              {/* Active underline */}
              {isActive(item.href) && (
                <span
                  className="absolute left-2 right-2 -bottom-px h-0.5 rounded-full"
                  style={{ background: 'linear-gradient(90deg, #2563eb, #7c3aed)' }}
                />
              )}
            </Link>
          ))}
          <ResourcesDropdown />

          {/* SIP AI — iridescent gradient pill */}
          <Link
            href="/lawyer"
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-lg transition-all',
              isActive('/lawyer')
                ? 'text-white shadow-md'
                : 'text-white shadow-sm hover:shadow-md hover:scale-[1.02]',
            )}
            style={{
              background: isActive('/lawyer')
                ? 'linear-gradient(135deg, #2563eb 0%, #7c3aed 60%, #c026d3 100%)'
                : 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 60%, #d946ef 100%)',
              boxShadow: '0 0 16px rgba(99,102,241,0.35)',
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            SIP AI
          </Link>
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
            <div className="hidden lg:flex items-center gap-1.5">
              {appUser ? (
                <>
                  {appUser.packId === 'free' && (
                    <Link
                      href="/pricing"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-lg transition-all hover:scale-[1.02]"
                      style={{
                        background:
                          'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
                        boxShadow: '0 0 14px rgba(37,99,235,0.4)',
                      }}
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
                            initial={{ opacity: 0, y: -6, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -6, scale: 0.96 }}
                            transition={{ duration: 0.15, ease: 'easeOut' }}
                            className="absolute right-0 mt-2 w-52 z-50 bg-white dark:bg-slate-900 rounded-xl shadow-2xl ring-1 ring-slate-200/60 dark:ring-slate-700/60 py-1.5 overflow-hidden"
                          >
                            {/* Subtle gradient header inside dropdown */}
                            <div
                              className="absolute inset-x-0 top-0 h-0.5"
                              style={{
                                background:
                                  'linear-gradient(90deg, #2563eb, #7c3aed, #c026d3)',
                              }}
                            />
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
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold text-white rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      background:
                        'linear-gradient(135deg, #1d4ed8 0%, #2563eb 50%, #4f46e5 100%)',
                      boxShadow: '0 0 18px rgba(37,99,235,0.45)',
                    }}
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
