'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from '@/lib/auth-client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { UserCircle, Download, BookOpen, TrendingUp, Crown, Home } from 'lucide-react'
import dynamic from 'next/dynamic'
import { analytics } from '@/lib/analytics'
import { getPackContent, getModulesForPack, getProgressPercentage, getAllModulesForAdmin, getModulePack } from '@/lib/content/pack-content'

import type { DashboardUser, DashboardModule } from '@/components/dashboard/types'
import OverviewTab from '@/components/dashboard/OverviewTab'
import ContentTab from '@/components/dashboard/ContentTab'
import ResourcesTab from '@/components/dashboard/ResourcesTab'
import ProgressTab from '@/components/dashboard/ProgressTab'

const OnboardingWizard = dynamic(() => import('@/components/onboarding/OnboardingWizard'), { ssr: false })

type TabId = 'overview' | 'content' | 'resources' | 'progress'

const TABS: Array<{ id: TabId; label: string; icon: typeof TrendingUp }> = [
  { id: 'overview', label: 'Overview', icon: TrendingUp },
  { id: 'content', label: 'My Content', icon: BookOpen },
  { id: 'resources', label: 'Resources', icon: Download },
  { id: 'progress', label: 'Progress', icon: UserCircle },
]

export default function Dashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const [user, setUser] = useState<DashboardUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [modules, setModules] = useState<DashboardModule[]>([])
  const [previewModules, setPreviewModules] = useState<Array<{ module: DashboardModule; packId: string }>>([])
  const [progress, setProgress] = useState(0)
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const paymentTracked = useRef(false)

  useEffect(() => {
    if (searchParams.get('payment') === 'success' && !paymentTracked.current) {
      paymentTracked.current = true
      analytics.paymentSuccess(searchParams.get('pack') ?? undefined)
    }
  }, [searchParams])

  useEffect(() => {
    if (status === 'loading') return
    if (status === 'unauthenticated' || !session) { router.push('/auth/login'); return }
    if (session.user.isAdmin) { router.push('/admin'); return }

    const userData: DashboardUser = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name ?? undefined,
      packId: session.user.packId ?? 'free',
      isAdmin: session.user.isAdmin ?? false,
    }
    setUser(userData)

    const packContent = getPackContent(userData.packId)
    if (packContent) {
      const packModules = getModulesForPack(userData.packId)
      setModules(packModules as unknown as DashboardModule[])
      setProgress(getProgressPercentage(packModules))

      const previews: Array<{ module: DashboardModule; packId: string }> = []
      const counts: Record<string, number> = {}
      for (const mod of getAllModulesForAdmin()) {
        const pid = getModulePack(mod.id)
        if (!pid || pid === userData.packId) continue
        counts[pid] = counts[pid] ?? 0
        if (counts[pid] >= 2) continue
        counts[pid] += 1
        previews.push({ module: mod as unknown as DashboardModule, packId: pid })
      }
      setPreviewModules(previews)
    }

    setLoading(false)
  }, [session, status, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (!user) return null
  const isFree = user.packId === 'free'
  const tabProps = { user, modules, progress, isFree, previewModules }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <OnboardingWizard userName={session?.user?.name} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-start justify-between">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back, {user.name ?? 'User'}!
            </h1>
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                <Home className="w-4 h-4 mr-2" />
                Exit to Website
              </Link>
              <Link
                href="/profile"
                className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <UserCircle className="w-4 h-4 mr-2" />
                Profile Settings
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-2 flex-wrap gap-2 mt-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              <Crown className="w-4 h-4 mr-1" />
              {user.packId.toUpperCase()} PACK
            </span>
            {isFree && (
              <a
                href="/pricing"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all text-sm"
              >
                Upgrade to Unlock All Content &rarr;
              </a>
            )}
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="mb-8 border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-8">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          {activeTab === 'overview' && <OverviewTab {...tabProps} />}
          {activeTab === 'content' && <ContentTab {...tabProps} />}
          {activeTab === 'resources' && <ResourcesTab user={user} isFree={isFree} />}
          {activeTab === 'progress' && <ProgressTab {...tabProps} />}
        </motion.div>
      </div>
    </div>
  )
}
