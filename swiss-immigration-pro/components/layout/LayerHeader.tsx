'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X, User, LogOut, Shield, Settings, Globe, Star, AlertTriangle } from 'lucide-react'
import { useSession, signOut } from '@/lib/auth-client'

import AdvancedSearch from '@/components/ui/AdvancedSearch'
import LanguageSwitcher from '@/components/layout/LanguageSwitcher'
import DarkModeToggle from '@/components/ui/DarkModeToggle'

type AppUser = {
  id?: string
  email?: string | null
  name?: string | null
  isAdmin?: boolean
  packId?: string | null
}

type LayerHeaderProps = {
  layer: 'eu' | 'us' | 'other'
  homeHref: string
  customBadge?: {
    icon: React.ReactNode
    text: string
    bgColor?: string
    textColor?: string
  }
}

export default function LayerHeader({ layer, homeHref, customBadge }: LayerHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [logoError, setLogoError] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  // Ensure layer is never undefined - fallback to 'other' if needed
  // Use useMemo to ensure consistent value during SSR and client hydration
  const safeLayer = useMemo(() => {
    if (layer && (layer === 'eu' || layer === 'us' || layer === 'other')) {
      return layer
    }
    return 'other'
  }, [layer])

  // Get session safely - SessionProvider should wrap this component
  const { data: session, status } = useSession()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle session safely - work even if SessionProvider isn't ready
  const appUser: AppUser | null = useMemo(() => {
    if (!mounted) {
      return null
    }

    try {
      if (status === 'loading' || !session?.user) {
        return null
      }

      const candidate = session.user as AppUser
      return {
        id: candidate.id,
        email: candidate.email ?? null,
        name: candidate.name ?? null,
        isAdmin: candidate.isAdmin ?? false,
        packId: candidate.packId ?? null,
      }
    } catch (error) {
      console.error('Error reading session:', error)
      return null
    }
  }, [session, status, mounted])

  // Layer-specific navigation - layer-specific pages + global tools/pricing
  const navigationItems = useMemo(() => {
    const base = [
      { href: homeHref, label: 'Home' },
      { href: `/${safeLayer}/visas`, label: 'Visas' },
      { href: `/${safeLayer}/citizenship`, label: 'Citizenship' },
      { href: `/${safeLayer}/tools`, label: 'Tools' },
      { href: `/${safeLayer}/pricing`, label: 'Pricing' },
    ]
    return base
  }, [safeLayer, homeHref])

  const closeMenu = useCallback(() => setIsMenuOpen(false), [])
  const toggleMenu = useCallback(() => {
    setIsMenuOpen((previous) => !previous)
  }, [])


  const handleSignOut = useCallback(async () => {
    await signOut({ callbackUrl: '/' })
  }, [])

  // Layer-specific badge defaults
  const badge = customBadge || {
    icon: safeLayer === 'eu' ? <Star className="w-4 h-4" /> : safeLayer === 'us' ? <AlertTriangle className="w-4 h-4" /> : <Globe className="w-4 h-4" />,
    text: safeLayer === 'eu'
      ? 'EU/EFTA Freedom of Movement: No Work Permit Quotas Required'
      : safeLayer === 'us'
      ? '2025 Quota Alert: ~4,500 B Permits for Third-Country Nationals • Apply Early'
      : 'Serving Citizens from 190+ Countries • Expert Third-Country Immigration Guidance',
    bgColor: safeLayer === 'eu' ? 'bg-blue-600' : safeLayer === 'us' ? 'bg-black' : 'bg-blue-600',
    textColor: 'text-white'
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <nav className="mx-auto flex max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between sm:h-20">
            <Link href="/" className="flex items-center gap-3">
              {logoError ? (
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-2xl shadow-lg transition-transform duration-200 hover:scale-105">
                  🇨🇭
                </div>
              ) : (
                <div className="flex h-11 w-11 items-center justify-center transition-transform duration-200 hover:scale-105 overflow-hidden rounded-xl bg-white/50 dark:bg-gray-800/50">
                  <img
                    src="/images/logo-removebg.png"
                    alt="Swiss Immigration Pro Logo"
                    width={44}
                    height={44}
                    className="w-full h-full object-contain"
                    onError={() => setLogoError(true)}
                    onLoad={() => setLogoError(false)}
                  />
                </div>
              )}
              <div className="hidden sm:flex flex-col leading-tight">
                <span className="font-semibold text-gray-900 dark:text-white">
                  Swiss<span className="text-blue-600 dark:text-blue-400">Immigration</span>Pro
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Expert Guidance</span>
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white sm:hidden">
                SIP
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    pathname === item.href
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-blue-50/60 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden sm:block">
                <AdvancedSearch />
              </div>

              {appUser ? (
                <div className="hidden items-center gap-2 lg:flex">
                  {!appUser.isAdmin && (
                    <>
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 rounded-lg border border-blue-200/50 dark:border-blue-700/50 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 transition-all duration-200 hover:bg-blue-50/60 dark:hover:bg-blue-900/30"
                      >
                        <User className="h-4 w-4" />
                        Dashboard
                      </Link>
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <User className="h-4 w-4" />
                        Profile
                      </Link>
                    </>
                  )}

                  {appUser.isAdmin && (
                    <>
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:from-purple-700 hover:via-purple-800 hover:to-purple-900 hover:shadow-lg"
                      >
                        <Shield className="h-4 w-4" />
                        Admin
                      </Link>
                      <Link
                        href="/admin/settings"
                        className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </Link>
                    </>
                  )}

                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 transition-all duration-200 hover:text-red-600 dark:hover:text-red-400"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth/login"
                  className="hidden rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg lg:inline-flex"
                >
                  Login
                </Link>
              )}

              <div className="hidden sm:block">
                <DarkModeToggle />
              </div>

              <div className="ml-1 hidden sm:block">
                <LanguageSwitcher />
              </div>

              <button
                onClick={toggleMenu}
                className="ml-1 rounded-lg p-3 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700 lg:hidden touch-manipulation"
                aria-label="Toggle navigation menu"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6 text-gray-700 dark:text-gray-200" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-700 dark:text-gray-200" />
                )}
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <div className="lg:hidden">
              <div className="space-y-2 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 shadow-lg max-h-[calc(100vh-120px)] overflow-y-auto -webkit-overflow-scrolling-touch">
                <div className="sm:hidden mb-4">
                  <AdvancedSearch />
                </div>

                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className="block rounded-xl px-4 py-4 text-base font-medium text-gray-700 dark:text-gray-200 transition-all active:bg-blue-100 dark:active:bg-blue-900/40 active:scale-[0.98] touch-manipulation"
                    style={{ WebkitTapHighlightColor: 'transparent', minHeight: '48px' }}
                  >
                    {item.label}
                  </Link>
                ))}


                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex items-center gap-3">
                  <DarkModeToggle />
                  <div onClick={closeMenu} className="flex-1">
                    <LanguageSwitcher />
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                  {appUser ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 rounded-xl bg-gray-50 dark:bg-gray-800 p-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white flex-shrink-0">
                          {appUser.name?.charAt(0)?.toUpperCase() ?? <User className="h-6 w-6" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                            {appUser.name ?? 'Member'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {appUser.email ?? 'No email set'}
                          </p>
                        </div>
                      </div>

                      {!appUser.isAdmin && (
                        <>
                          <Link
                            href="/dashboard"
                            onClick={closeMenu}
                            className="flex items-center gap-3 rounded-xl px-4 py-4 text-base font-medium text-gray-700 dark:text-gray-200 transition-all active:bg-gray-100 dark:active:bg-gray-800 active:scale-[0.98] touch-manipulation"
                            style={{ WebkitTapHighlightColor: 'transparent', minHeight: '48px' }}
                          >
                            <User className="h-5 w-5" />
                            Dashboard
                          </Link>
                          <Link
                            href="/profile"
                            onClick={closeMenu}
                            className="flex items-center gap-3 rounded-xl px-4 py-4 text-base font-medium text-gray-700 dark:text-gray-200 transition-all active:bg-gray-100 dark:active:bg-gray-800 active:scale-[0.98] touch-manipulation"
                            style={{ WebkitTapHighlightColor: 'transparent', minHeight: '48px' }}
                          >
                            <User className="h-5 w-5" />
                            Profile
                          </Link>
                        </>
                      )}

                      {appUser.isAdmin && (
                        <>
                          <Link
                            href="/admin"
                            onClick={closeMenu}
                            className="flex items-center gap-3 rounded-xl px-4 py-4 text-base font-semibold text-purple-600 dark:text-purple-400 transition-all active:bg-purple-50 dark:active:bg-purple-900/30 active:scale-[0.98] touch-manipulation"
                            style={{ WebkitTapHighlightColor: 'transparent', minHeight: '48px' }}
                          >
                            <Shield className="h-5 w-5" />
                            Admin
                          </Link>
                          <Link
                            href="/admin/settings"
                            onClick={closeMenu}
                            className="flex items-center gap-3 rounded-xl px-4 py-4 text-base font-medium text-gray-700 dark:text-gray-200 transition-all active:bg-gray-100 dark:active:bg-gray-800 active:scale-[0.98] touch-manipulation"
                            style={{ WebkitTapHighlightColor: 'transparent', minHeight: '48px' }}
                          >
                            <Settings className="h-5 w-5" />
                            Settings
                          </Link>
                        </>
                      )}

                      <button
                        onClick={async () => {
                          closeMenu()
                          await handleSignOut()
                        }}
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-4 text-base font-medium text-gray-600 dark:text-gray-300 transition-all active:bg-red-50 dark:active:bg-red-900/20 active:text-red-600 dark:active:text-red-400 active:scale-[0.98] touch-manipulation"
                        style={{ WebkitTapHighlightColor: 'transparent', minHeight: '48px' }}
                      >
                        <LogOut className="h-5 w-5" />
                        Sign out
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Link
                        href="/auth/login"
                        onClick={closeMenu}
                        className="block rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-4 text-center text-base font-semibold text-white shadow-md transition-all duration-200 active:from-blue-700 active:to-blue-800 active:scale-[0.98] touch-manipulation"
                        style={{ WebkitTapHighlightColor: 'transparent', minHeight: '48px' }}
                      >
                        Sign in
                      </Link>
                      <Link
                        href="/auth/register"
                        onClick={closeMenu}
                        className="block rounded-xl px-4 py-4 text-center text-base font-medium text-gray-700 dark:text-gray-200 transition-all active:bg-gray-100 dark:active:bg-gray-800 active:scale-[0.98] touch-manipulation"
                        style={{ WebkitTapHighlightColor: 'transparent', minHeight: '48px' }}
                      >
                        Create account
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>
    </>
  )
}

