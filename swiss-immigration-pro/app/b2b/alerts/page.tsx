'use client'

import { useEffect, useState } from 'react'
import { getAuthHeaderSync } from '@/lib/auth-client'
import { AlertTriangle, CheckCircle, Eye, Filter } from 'lucide-react'

interface Alert {
  id: string
  employeeId: string | null
  alertType: string
  severity: string
  message: string
  dueDate: string | null
  acknowledgedAt: string | null
  resolvedAt: string | null
  createdAt: string | null
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [severityFilter, setSeverityFilter] = useState('')
  const [showResolved, setShowResolved] = useState(false)

  const companyId = typeof window !== 'undefined' ? localStorage.getItem('sip_company_id') : null

  useEffect(() => {
    if (companyId) fetchAlerts()
  }, [companyId, severityFilter, showResolved])

  async function fetchAlerts() {
    setLoading(true)
    try {
      const params = new URLSearchParams({ resolved: String(showResolved) })
      if (severityFilter) params.set('severity', severityFilter)

      const res = await fetch(`/api/b2b/compliance/${companyId}/alerts?${params}`, {
        headers: getAuthHeaderSync(),
      })
      if (res.ok) {
        const data = await res.json()
        setAlerts(data.alerts)
        setTotal(data.total)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function acknowledgeAlert(alertId: string) {
    const res = await fetch(`/api/b2b/compliance/${companyId}/alerts/${alertId}/acknowledge`, {
      method: 'POST',
      headers: getAuthHeaderSync(),
    })
    if (res.ok) fetchAlerts()
  }

  async function resolveAlert(alertId: string) {
    const res = await fetch(`/api/b2b/compliance/${companyId}/alerts/${alertId}/resolve`, {
      method: 'POST',
      headers: getAuthHeaderSync(),
    })
    if (res.ok) fetchAlerts()
  }

  const severityColors: Record<string, string> = {
    critical: 'border-l-red-600 bg-red-50 dark:bg-red-900/10',
    high: 'border-l-orange-500 bg-orange-50 dark:bg-orange-900/10',
    medium: 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/10',
    low: 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/10',
  }

  const severityBadge: Record<string, string> = {
    critical: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    high: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    low: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Compliance Alerts</h1>
        <span className="text-sm text-gray-500">{total} alert{total !== 1 ? 's' : ''}</span>
      </div>

      {/* Filters */}
      <div className="flex gap-3 items-center">
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm"
        >
          <option value="">All Severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <input
            type="checkbox"
            checked={showResolved}
            onChange={(e) => setShowResolved(e.target.checked)}
            className="rounded"
          />
          Show resolved
        </label>
      </div>

      {/* Alert list */}
      {loading ? (
        <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" /></div>
      ) : alerts.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">All Clear</h3>
          <p className="text-gray-500 text-sm">No open compliance alerts.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`border-l-4 rounded-lg p-4 ${severityColors[alert.severity] || 'border-l-gray-400'}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${severityBadge[alert.severity]}`}>
                      {alert.severity}
                    </span>
                    <span className="text-xs text-gray-400">{alert.alertType.replace('_', ' ')}</span>
                    {alert.dueDate && (
                      <span className="text-xs text-gray-400">
                        Due: {new Date(alert.dueDate).toLocaleDateString('de-CH')}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-800 dark:text-gray-200">{alert.message}</p>
                  {alert.acknowledgedAt && (
                    <p className="text-xs text-gray-400 mt-1">
                      Acknowledged {new Date(alert.acknowledgedAt).toLocaleDateString('de-CH')}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {!alert.acknowledgedAt && !alert.resolvedAt && (
                    <button
                      onClick={() => acknowledgeAlert(alert.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <Eye className="w-3 h-3" /> Acknowledge
                    </button>
                  )}
                  {!alert.resolvedAt && (
                    <button
                      onClick={() => resolveAlert(alert.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <CheckCircle className="w-3 h-3" /> Resolve
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
