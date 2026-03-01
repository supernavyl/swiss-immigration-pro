'use client'

import { ReactNode, useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useSession } from '@/lib/auth-client'
import { useT } from '@/lib/i18n/useTranslation'
import { Building2, Users, AlertTriangle, FileText, Settings, LayoutDashboard, ChevronLeft } from 'lucide-react'

export default function B2BLayout({ children }: { children: ReactNode }) {
  const { t } = useT()
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const [companyId, setCompanyId] = useState<string | null>(null)

  // Public landing page at /b2b — render without dashboard shell
  const isLandingPage = pathname === '/b2b'
  if (isLandingPage) {
    return <>{children}</>
  }

  const NAV_ITEMS = [
    { href: '/b2b/dashboard', label: t('b2b.dashboard'), icon: LayoutDashboard },
    { href: '/b2b/employees', label: t('b2b.employees'), icon: Users },
    { href: '/b2b/alerts', label: t('b2b.alerts'), icon: AlertTriangle },
    { href: '/b2b/reports', label: t('b2b.reports'), icon: FileText },
    { href: '/b2b/settings', label: t('b2b.settings'), icon: Settings },
  ]

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?redirect=/b2b/dashboard')
    }
  }, [status, router])

  useEffect(() => {
    // Load company ID from localStorage or fetch
    const stored = localStorage.getItem('sip_company_id')
    if (stored) setCompanyId(stored)
  }, [])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (status === 'unauthenticated') return null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top bar */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-gray-500 hover:text-gray-700 dark:text-gray-400">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <Building2 className="w-6 h-6 text-blue-600" />
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('b2b.title')}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {session?.user?.email}
          </span>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 min-h-[calc(100vh-57px)] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
          <div className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
