'use client'

import { useEffect, useState } from 'react'
import { getAuthHeaderSync } from '@/lib/auth-client'
import { useT } from '@/lib/i18n/useTranslation'
import { AlertTriangle, CheckCircle, Clock, Shield, Users, TrendingUp } from 'lucide-react'

interface DashboardData {
  complianceScore: number
  totalEmployees: number
  expiringSoon: number
  expired: number
  alerts: { critical: number; high: number; medium: number; low: number }
  totalAlerts: number
  permitDistribution: Record<string, number>
}

export default function B2BDashboard() {
  const { t } = useT()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [companyId, setCompanyId] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('sip_company_id')
    if (stored) {
      setCompanyId(stored)
      fetchDashboard(stored)
    } else {
      fetchCompanies()
    }
  }, [])

  async function fetchCompanies() {
    try {
      const res = await fetch('/api/b2b/companies', { headers: getAuthHeaderSync() })
      const data = await res.json()
      if (data.length > 0) {
        const cid = data[0].id
        localStorage.setItem('sip_company_id', cid)
        setCompanyId(cid)
        fetchDashboard(cid)
      } else {
        setLoading(false)
      }
    } catch {
      setLoading(false)
    }
  }

  async function fetchDashboard(cid: string) {
    try {
      const res = await fetch(`/api/b2b/compliance/${cid}/dashboard`, {
        headers: getAuthHeaderSync(),
      })
      if (res.ok) {
        const d = await res.json()
        setData(d)
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (!companyId) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{t('b2b.noCompany')}</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-4">
          Create a company to get started with the HR Immigration Compliance Dashboard.
        </p>
        <a
          href="/b2b/onboarding"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {t('b2b.setupCompany')}
        </a>
      </div>
    )
  }

  if (!data) return <p className="text-gray-500">{t('common.error')}</p>

  const scoreColor =
    data.complianceScore >= 80 ? 'text-green-600' :
    data.complianceScore >= 50 ? 'text-yellow-600' : 'text-red-600'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('b2b.dashboard')}</h1>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Last updated: {new Date().toLocaleDateString('de-CH')}
        </span>
      </div>

      {/* Score and key metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Compliance Score */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 col-span-1">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('b2b.complianceScore')}</span>
          </div>
          <p className={`text-4xl font-bold ${scoreColor}`}>{data.complianceScore}</p>
          <p className="text-xs text-gray-400 mt-1">out of 100</p>
        </div>

        {/* Total Employees */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('b2b.activeEmployees')}</span>
          </div>
          <p className="text-4xl font-bold text-gray-900 dark:text-white">{data.totalEmployees}</p>
        </div>

        {/* Expiring Soon */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('b2b.expiringSoon')}</span>
          </div>
          <p className="text-4xl font-bold text-yellow-600">{data.expiringSoon}</p>
          <p className="text-xs text-gray-400 mt-1">within 90 days</p>
        </div>

        {/* Active Alerts */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('b2b.openAlerts')}</span>
          </div>
          <p className="text-4xl font-bold text-red-600">{data.totalAlerts}</p>
          <div className="flex gap-2 mt-1 text-xs">
            {data.alerts.critical > 0 && <span className="text-red-500">{data.alerts.critical} critical</span>}
            {data.alerts.high > 0 && <span className="text-orange-500">{data.alerts.high} high</span>}
          </div>
        </div>
      </div>

      {/* Alerts breakdown + Permit distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('b2b.alertBreakdown')}</h3>
          <div className="space-y-3">
            {[
              { label: 'Critical', count: data.alerts.critical, color: 'bg-red-500' },
              { label: 'High', count: data.alerts.high, color: 'bg-orange-500' },
              { label: 'Medium', count: data.alerts.medium, color: 'bg-yellow-500' },
              { label: 'Low', count: data.alerts.low, color: 'bg-blue-500' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Permit distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('b2b.permitDistribution')}</h3>
          <div className="space-y-3">
            {Object.entries(data.permitDistribution).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Permit {type}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${Math.min(100, (count / data.totalEmployees) * 100)}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Expired permits warning */}
      {data.expired > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-800 dark:text-red-400">
              {data.expired} Expired Permit{data.expired > 1 ? 's' : ''}
            </h4>
            <p className="text-sm text-red-600 dark:text-red-300 mt-1">
              Immediate action required. Employees with expired permits may be in violation of Swiss immigration law.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
