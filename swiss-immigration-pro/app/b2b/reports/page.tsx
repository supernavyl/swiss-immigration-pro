'use client'

import { useEffect, useState } from 'react'
import { getAuthHeaderSync } from '@/lib/auth-client'
import { Download, FileText, BarChart3 } from 'lucide-react'

interface ReportData {
  generatedAt: string
  byPermitType: Record<string, number>
  byDepartment: Record<string, number>
  upcomingExpirations: Record<string, number>
  alertsLast30Days: number
  resolvedLast30Days: number
}

export default function ReportsPage() {
  const [data, setData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)

  const companyId = typeof window !== 'undefined' ? localStorage.getItem('sip_company_id') : null

  useEffect(() => {
    if (companyId) fetchReport()
  }, [companyId])

  async function fetchReport() {
    try {
      const res = await fetch(`/api/b2b/reports/${companyId}/compliance-summary`, {
        headers: getAuthHeaderSync(),
      })
      if (res.ok) setData(await res.json())
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function downloadCSV() {
    const res = await fetch(`/api/b2b/reports/${companyId}/export-csv`, {
      headers: getAuthHeaderSync(),
    })
    if (res.ok) {
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `employees_export.csv`
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" /></div>
  if (!data) return <p className="text-gray-500">Failed to load report data.</p>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports</h1>
        <button
          onClick={downloadCSV}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
        >
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Alerts (Last 30 Days)</h3>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-4">
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{data.alertsLast30Days}</p>
              <p className="text-xs text-gray-400">Total generated</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-600">{data.resolvedLast30Days}</p>
              <p className="text-xs text-gray-400">Resolved</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Upcoming Expirations</h3>
          <div className="space-y-2">
            {Object.entries(data.upcomingExpirations).map(([window, count]) => (
              <div key={window} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {window.replace(/_/g, ' ').replace('next ', 'Next ')}
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Distribution tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">By Permit Type</h3>
          <div className="space-y-2">
            {Object.entries(data.byPermitType).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between py-1 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <span className="text-sm text-gray-700 dark:text-gray-300">Permit {type}</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">By Department</h3>
          <div className="space-y-2">
            {Object.entries(data.byDepartment).map(([dept, count]) => (
              <div key={dept} className="flex items-center justify-between py-1 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <span className="text-sm text-gray-700 dark:text-gray-300">{dept}</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-400 text-right">
        Report generated: {new Date(data.generatedAt).toLocaleString('de-CH')}
      </p>
    </div>
  )
}
