'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import {
  Menu,
  X,
  User,
  LogOut,
  Shield,
  Settings,
  ArrowRight,
  Sparkles,
  ChevronDown,
  BookOpen,
  Wrench,
  HelpCircle,
  FileText,
  Mail,
} from 'lucide-react'
import { useSession, signOut } from '@/lib/auth-client'
import { useT } from '@/lib/i18n/useTranslation'
import { AnimatePresence, motion } from 'framer-motion'

import AdvancedSearch from '@/components/ui/AdvancedSearch'
import LanguageSwitcher from '@/components/layout/LanguageSwitcher'
import DarkModeToggle from '@/components/ui/DarkModeToggle'
import { useSwipe } from '@/lib/hooks/useSwipeGesture'
import { useHaptic } from '@/lib/hooks/useHaptic'
import { useIsMobile } from '@/lib/hooks/useMediaQuery'
import { cn } from '@/lib/utils/cn'

const resourcesLinks = [
  { href: '/tools', label: 'Tools', icon: Wrench, desc: 'Permit calculator, CV builder, timeline' },
  { href: '/blog', label: 'Blog', icon: BookOpen, desc: 'Guides, updates, success stories' },
  { href: '/faq', label: 'FAQ', icon: HelpCircle, desc: 'Common immigration questions' },
  { href: '/visas', label: 'Visa Guides', icon: FileText, desc: 'Complete permit documentation' },
  { href: '/contact', label: 'Contact', icon: Mail, desc: 'Reach our immigration team' },
]

interface AppUser {
  id?: string
  email?: string | null
  name?: string | null
  isAdmin?: boolean
  packId?: string | null
}

export default function MainHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [logoError, setLogoError] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [resourcesOpen, setResourcesOpen] = useState(false)
  const resourcesRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const { t } = useT()
  const { haptic } = useHaptic()
  const isMobile = useIsMobile()
  const headerRef = useRef<HTMLElement>(null)

  const { data: session, status } = useSession()

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
    if (isMobile && isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobile, isMenuOpen])


  const appUser: AppUser | null = useMemo(() => {
    if (typeof window === 'undefined' || !mounted) return null
    try {
      if (status === 'loading' || !session?.user) return null
      const u = session.user as AppUser
      return {
        id: u.id,
        email: u.email ?? null,
        name: u.name ?? null,
        isAdmin: u.isAdmin ?? false,
        packId: u.packId ?? null,
      }
    } catch {
      return null
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

  // Close resources dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (resourcesRef.current && !resourcesRef.current.contains(e.target as Node)) {
        setResourcesOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const [announcementVisible, setAnnouncementVisible] = useState(true)

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

  const drawerRef = useSwipe<HTMLDivElement>({
    onSwipeRight: () => {
      if (isMenuOpen) closeMenu()
    },
    threshold: 80,
  })

  const handleSignOut = useCallback(async () => {
    await signOut({ callbackUrl: '/' })
  }, [])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <header
      ref={headerRef}
      className={cn(
        'sticky top-0 z-50 w-full transition-[background-color,box-shadow,border-color] duration-300',
        scrolled
          ? 'bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] border-b border-gray-200/60 dark:border-gray-800/60'
          : 'bg-white dark:bg-gray-950 border-b border-transparent',
      )}
    >
      {/* Announcement bar */}
      <AnimatePresence>
        {announcementVisible && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-gradient-to-r from-indigo-600 via-blue-600 to-blue-600 text-white text-xs overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-center gap-2 relative">
              <div className="hidden sm:flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span className="font-medium">New: Citizenship Timeline Calculator with AI guide</span>
                <Link
                  href="/tools/citizenship-timeline"
                  className="underline underline-offset-2 font-semibold hover:text-blue-100 transition-colors whitespace-nowrap"
                >
                  Try it free &rarr;
                </Link>
              </div>
              <button
                onClick={() => setAnnouncementVisible(false)}
                className="absolute right-4 p-1 hover:bg-white/20 rounded transition-colors"
                aria-label="Dismiss announcement"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          {logoError && mounted ? (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-white text-sm font-bold shadow-sm">
              CH
            </div>
          ) : (
            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-gray-50 dark:bg-gray-900 ring-1 ring-gray-200/80 dark:ring-gray-800 transition-transform duration-200 group-hover:scale-105 shrink-0">
              <img
                src="/images/logo-removebg.png"
                alt="Swiss Immigration Pro"
                width={32}
                height={32}
                className="w-full h-full object-contain"
                onError={() => setLogoError(true)}
                onLoad={() => setLogoError(false)}
              />
            </div>
          )}
          <div className="hidden sm:block">
            <span className="text-[15px] font-bold tracking-tight text-gray-900 dark:text-white">
              Swiss<span className="text-red-600">Immigration</span>
            </span>
            <span className="ml-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Pro
            </span>
          </div>
        </Link>

        {/* Desktop Navigation — center */}
        <div className="hidden lg:flex items-center gap-1">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative px-3.5 py-2 text-sm font-medium rounded-md transition-colors duration-150',
                isActive(item.href)
                  ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800/60'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900',
              )}
            >
              {item.label}
              {isActive(item.href) && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-red-600 rounded-full" />
              )}
            </Link>
          ))}

          {/* Resources dropdown */}
          <div ref={resourcesRef} className="relative">
            <button
              onClick={() => setResourcesOpen((v) => !v)}
              className={cn(
                'inline-flex items-center gap-1 px-3.5 py-2 text-sm font-medium rounded-md transition-colors duration-150',
                resourcesOpen
                  ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800/60'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900',
              )}
            >
              Resources
              <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-150', resourcesOpen && 'rotate-180')} />
            </button>
            <AnimatePresence>
              {resourcesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white dark:bg-gray-950 rounded-xl shadow-xl shadow-black/10 border border-gray-200/80 dark:border-gray-800 overflow-hidden z-50"
                >
                  <div className="p-1.5">
                    {resourcesLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setResourcesOpen(false)}
                        className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors group/item"
                      >
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800 shrink-0 mt-0.5 group-hover/item:bg-red-50 dark:group-hover/item:bg-red-950/30 transition-colors">
                          <link.icon className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400 group-hover/item:text-red-600 transition-colors" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white leading-none mb-0.5">{link.label}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{link.desc}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-1">
          {/* Search */}
          <div className="hidden lg:block">
            <AdvancedSearch />
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px h-5 bg-gray-200 dark:bg-gray-800 mx-1" />

          <div className="hidden sm:block">
            <DarkModeToggle />
          </div>
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px h-5 bg-gray-200 dark:bg-gray-800 mx-1" />

          {/* Desktop auth */}
          {mounted && (
            <div className="hidden lg:flex items-center gap-1">
              {appUser ? (
                <>
                  <Link
                    href={appUser.isAdmin ? '/admin' : '/dashboard'}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                  >
                    {appUser.isAdmin ? <Shield className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                    {appUser.isAdmin ? t('auth.admin') : t('nav.dashboard')}
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                    title="Sign out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="px-3.5 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 rounded-lg hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                  >
                    {t('auth.login')}
                  </Link>
                  <Link
                    href="/consultation"
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm"
                  >
                    Book Consultation
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </>
              )}
            </div>
          )}

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="ml-1 inline-flex items-center justify-center rounded-lg p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors lg:hidden touch-manipulation"
            aria-label="Toggle navigation menu"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
              onClick={closeMenu}
              aria-hidden="true"
            />

            <motion.div
              ref={drawerRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-[320px] bg-white/95 dark:bg-gray-950/95 backdrop-blur-2xl shadow-2xl lg:hidden overflow-y-auto overscroll-contain"
            >
              {/* Drawer header */}
              <div className="sticky top-0 z-10 flex items-center justify-between bg-white/95 dark:bg-gray-950/95 backdrop-blur-2xl px-5 py-4 border-b border-gray-100 dark:border-gray-900">
                <div className="flex items-baseline gap-0 leading-none">
                  <span className="text-sm font-semibold tracking-tight text-gray-900 dark:text-white">
                    Swiss
                  </span>
                  <span className="text-sm font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-500">
                    Immigration
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 ml-0.5 self-end mb-0.5">
                    Pro
                  </span>
                </div>
                <button
                  onClick={closeMenu}
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
                      {appUser.name?.charAt(0)?.toUpperCase() ?? (
                        <User className="h-4 w-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {appUser.name ?? 'Member'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {appUser.email ?? ''}
                      </p>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="space-y-0.5">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMenu}
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
                    onClick={closeMenu}
                    className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 px-4 py-3 text-sm font-semibold text-white transition-all shadow-sm shadow-red-600/25 touch-manipulation"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    {t('nav.consultation')}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/contact"
                    onClick={closeMenu}
                    className="flex items-center justify-center gap-2 rounded-full ring-1 ring-gray-200 dark:ring-gray-800 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors touch-manipulation"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  >
                    {t('nav.contact')}
                  </Link>
                </div>

                {/* Quick links for logged-in users */}
                {appUser && (
                  <div className="space-y-0.5 pt-2 border-t border-gray-100 dark:border-gray-900">
                    <p className="text-[11px] font-medium text-gray-400 dark:text-gray-600 uppercase tracking-wider px-3.5 mb-1">
                      Account
                    </p>
                    {appUser.isAdmin ? (
                      <>
                        <Link
                          href="/admin"
                          onClick={closeMenu}
                          className="flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors touch-manipulation"
                        >
                          <Shield className="h-4 w-4 text-gray-400" />
                          {t('auth.admin')}
                        </Link>
                        <Link
                          href="/admin/settings"
                          onClick={closeMenu}
                          className="flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors touch-manipulation"
                        >
                          <Settings className="h-4 w-4 text-gray-400" />
                          {t('auth.settings')}
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/dashboard"
                          onClick={closeMenu}
                          className="flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors touch-manipulation"
                        >
                          <User className="h-4 w-4 text-gray-400" />
                          {t('nav.dashboard')}
                        </Link>
                        <Link
                          href="/profile"
                          onClick={closeMenu}
                          className="flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors touch-manipulation"
                        >
                          <Settings className="h-4 w-4 text-gray-400" />
                          {t('auth.profile')}
                        </Link>
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
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Theme
                    </span>
                    <DarkModeToggle />
                  </div>
                  <div className="flex items-center justify-between px-3.5">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Language
                    </span>
                    <LanguageSwitcher />
                  </div>
                </div>

                {/* Auth */}
                <div className="pt-2 border-t border-gray-100 dark:border-gray-900">
                  {appUser ? (
                    <button
                      onClick={async () => {
                        closeMenu()
                        await handleSignOut()
                      }}
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
                        onClick={closeMenu}
                        className="block rounded-full bg-gray-900 dark:bg-white px-4 py-3 text-center text-sm font-semibold text-white dark:text-gray-900 transition-colors hover:bg-gray-800 dark:hover:bg-gray-100 touch-manipulation"
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                      >
                        {t('auth.signin')}
                      </Link>
                      <Link
                        href="/auth/register"
                        onClick={closeMenu}
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
        )}
      </AnimatePresence>
    </header>
  )
}
