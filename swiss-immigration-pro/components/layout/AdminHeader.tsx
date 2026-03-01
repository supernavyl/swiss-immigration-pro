'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, Shield, Settings, LogOut, User, Home, ArrowLeft, Mail } from 'lucide-react'
import { useSession, signOut } from '@/lib/auth-client'
import { useState, useCallback, useMemo, useEffect } from 'react'

export default function AdminHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [logoError, setLogoError] = useState(false)
  const pathname = usePathname()
  const { data: session, status } = useSession()

  useEffect(() => {
    setMounted(true)
  }, [])

  const closeMenu = useCallback(() => setIsMenuOpen(false), [])
  const toggleMenu = useCallback(() => {
    setIsMenuOpen((previous) => !previous)
  }, [])

  const handleSignOut = useCallback(async () => {
    await signOut({ callbackUrl: '/' })
  }, [])

  const appUser = useMemo(() => {
    if (!mounted || status === 'loading' || !session?.user) {
      return null
    }
    return {
      id: session.user.id,
      email: session.user.email ?? null,
      name: session.user.name ?? null,
      isAdmin: session.user.isAdmin ?? false,
    }
  }, [session, status, mounted])

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <nav className="mx-auto flex max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between sm:h-20">
          <Link href="/admin" className="flex items-center gap-3">
            {logoError ? (
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white shadow-lg transition-transform duration-200 hover:scale-105">
                <Shield className="h-6 w-6" />
              </div>
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-200 hover:scale-105 overflow-hidden">
                <Image
                  src="/images/logo-removebg.png"
                  alt="Swiss Immigration Pro Logo"
                  width={44}
                  height={44}
                  className="w-full h-full object-contain"
                  onError={() => setLogoError(true)}
                />
              </div>
            )}
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="font-semibold text-gray-900 dark:text-white">
                Admin<span className="text-blue-600 dark:text-blue-400">Dashboard</span>
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Management Panel</span>
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-white sm:hidden">
              Admin
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-2">
            <Link
              href="/admin"
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                pathname === '/admin'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-blue-50/60 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              Overview
            </Link>
            <Link
              href="/admin/newsletter"
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                pathname === '/admin/newsletter'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-blue-50/60 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              Newsletter
            </Link>
            <Link
              href="/admin/settings"
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                pathname === '/admin/settings'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-blue-50/60 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              Settings
            </Link>
            <Link
              href="/dashboard"
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              User Dashboard
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white bg-blue-600 transition-all duration-200 hover:bg-blue-700 shadow-sm"
            >
              <Home className="h-4 w-4" />
              <span>Exit to Website</span>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {appUser && (
              <div className="hidden items-center gap-2 lg:flex">
                <div className="flex items-center gap-2 rounded-lg bg-gray-50 dark:bg-gray-800 px-3 py-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-semibold">
                    {appUser.name?.charAt(0)?.toUpperCase() ?? <User className="h-4 w-4" />}
                  </div>
                  <div className="hidden xl:block">
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">{appUser.name ?? 'Admin'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{appUser.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 transition-all duration-200 hover:text-red-600 dark:hover:text-red-400"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden xl:inline">Sign out</span>
                </button>
              </div>
            )}

            <button
              onClick={toggleMenu}
              className="ml-1 rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5 text-gray-700 dark:text-gray-200" />
              ) : (
                <Menu className="h-5 w-5 text-gray-700 dark:text-gray-200" />
              )}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 shadow-lg">
              <Link
                href="/admin"
                onClick={closeMenu}
                className={`block rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                  pathname === '/admin'
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30'
                }`}
              >
                Overview
              </Link>
              <Link
                href="/admin/newsletter"
                onClick={closeMenu}
                className={`block rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                  pathname === '/admin/newsletter'
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30'
                }`}
              >
                Newsletter
              </Link>
              <Link
                href="/admin/settings"
                onClick={closeMenu}
                className={`block rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                  pathname === '/admin/settings'
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900/30'
                }`}
              >
                Settings
              </Link>
              <Link
                href="/dashboard"
                onClick={closeMenu}
                className="block rounded-lg px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-200 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                User Dashboard
              </Link>
              <Link
                href="/"
                onClick={closeMenu}
                className="flex items-center gap-2 rounded-lg px-4 py-3 text-base font-medium text-white bg-blue-600 transition-colors hover:bg-blue-700 shadow-sm"
              >
                <Home className="h-4 w-4" />
                <span>Exit to Website</span>
              </Link>

              {appUser && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 space-y-2">
                  <div className="flex items-center gap-3 rounded-lg bg-gray-50 dark:bg-gray-800 p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
                      {appUser.name?.charAt(0)?.toUpperCase() ?? <User className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{appUser.name ?? 'Admin'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{appUser.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      closeMenu()
                      handleSignOut()
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

