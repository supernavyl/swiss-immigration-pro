'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getAuthHeaderSync } from '@/lib/auth-client'
import { useToast } from '@/components/providers/ToastProvider'
import { ArrowLeft, Save, Trash2 } from 'lucide-react'

interface EmployeeDetail {
  id: string
  firstName: string
  lastName: string
  email: string | null
  nationality: string | null
  permitType: string | null
  permitNumber: string | null
  permitExpiry: string | null
  employmentStart: string | null
  department: string | null
  position: string | null
  status: string
  notes: string | null
}

export default function EmployeeDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { showToast } = useToast()
  const [employee, setEmployee] = useState<EmployeeDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const companyId = typeof window !== 'undefined' ? localStorage.getItem('sip_company_id') : null
  const employeeId = params?.id as string

  useEffect(() => {
    if (companyId && employeeId) fetchEmployee()
  }, [companyId, employeeId])

  async function fetchEmployee() {
    try {
      const res = await fetch(`/api/b2b/companies/${companyId}/employees/${employeeId}`, {
        headers: getAuthHeaderSync(),
      })
      if (res.ok) setEmployee(await res.json())
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    const form = new FormData(e.currentTarget)
    const body: Record<string, any> = {}

    for (const [key, value] of form.entries()) {
      if (value) body[key] = value
    }

    try {
      const res = await fetch(`/api/b2b/companies/${companyId}/employees/${employeeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaderSync() },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        fetchEmployee()
      } else {
        const err = await res.json()
        showToast(err.detail || 'Failed to update', 'error')
      }
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this employee record?')) return
    const res = await fetch(`/api/b2b/companies/${companyId}/employees/${employeeId}`, {
      method: 'DELETE',
      headers: getAuthHeaderSync(),
    })
    if (res.ok) router.push('/b2b/employees')
  }

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" /></div>
  if (!employee) return <p className="text-gray-500">Employee not found</p>

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.push('/b2b/employees')} className="text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {employee.firstName} {employee.lastName}
        </h1>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
          employee.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
        }`}>
          {employee.status}
        </span>
      </div>

      <form onSubmit={handleSave} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">First Name</label>
            <input name="firstName" defaultValue={employee.firstName} className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Last Name</label>
            <input name="lastName" defaultValue={employee.lastName} className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
          <input name="email" defaultValue={employee.email || ''} className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Nationality</label>
            <input name="nationality" defaultValue={employee.nationality || ''} className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Permit Type</label>
            <select name="permitType" defaultValue={employee.permitType || ''} className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm">
              <option value="">None</option>
              <option value="B">B - Residence</option>
              <option value="C">C - Settlement</option>
              <option value="L">L - Short-term</option>
              <option value="G">G - Cross-border</option>
              <option value="S">S - Provisional</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Permit Number</label>
            <input name="permitNumber" defaultValue={employee.permitNumber || ''} className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Permit Expiry</label>
            <input name="permitExpiry" type="date" defaultValue={employee.permitExpiry?.split('T')[0] || ''} className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Department</label>
            <input name="department" defaultValue={employee.department || ''} className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Position</label>
            <input name="position" defaultValue={employee.position || ''} className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
          <select name="status" defaultValue={employee.status} className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="terminated">Terminated</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Notes</label>
          <textarea name="notes" defaultValue={employee.notes || ''} rows={3} className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm" />
        </div>

        <div className="flex items-center justify-between pt-4">
          <button type="button" onClick={handleDelete} className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-sm">
            <Trash2 className="w-4 h-4" /> Delete
          </button>
          <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm disabled:opacity-50">
            <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
