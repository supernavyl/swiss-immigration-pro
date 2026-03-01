'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getAuthHeaderSync } from '@/lib/auth-client'
import { useToast } from '@/components/providers/ToastProvider'
import { Plus, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react'

interface Employee {
  id: string
  firstName: string
  lastName: string
  email: string | null
  nationality: string | null
  permitType: string | null
  permitExpiry: string | null
  department: string | null
  position: string | null
  status: string
}

export default function EmployeesPage() {
  const { showToast } = useToast()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [search, setSearch] = useState('')
  const [permitFilter, setPermitFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)

  const companyId = typeof window !== 'undefined' ? localStorage.getItem('sip_company_id') : null

  useEffect(() => {
    if (companyId) fetchEmployees()
  }, [companyId, page, search, permitFilter])

  async function fetchEmployees() {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: '25' })
      if (search) params.set('search', search)
      if (permitFilter) params.set('permitType', permitFilter)

      const res = await fetch(`/api/b2b/employees/${companyId}?${params}`, {
        headers: getAuthHeaderSync(),
      })
      if (res.ok) {
        const data = await res.json()
        setEmployees(data.employees)
        setTotal(data.total)
        setPages(data.pages)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleAddEmployee(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const body = {
      firstName: form.get('firstName'),
      lastName: form.get('lastName'),
      email: form.get('email') || null,
      nationality: form.get('nationality') || null,
      permitType: form.get('permitType') || null,
      permitNumber: form.get('permitNumber') || null,
      permitExpiry: form.get('permitExpiry') || null,
      department: form.get('department') || null,
      position: form.get('position') || null,
    }

    const res = await fetch(`/api/b2b/employees/${companyId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaderSync() },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      setShowAddModal(false)
      fetchEmployees()
    } else {
      const err = await res.json()
      showToast(err.detail || 'Failed to add employee', 'error')
    }
  }

  function getPermitBadgeColor(type: string | null) {
    const colors: Record<string, string> = {
      B: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      C: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      L: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      G: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    }
    return colors[type || ''] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }

  function getExpiryStatus(expiry: string | null) {
    if (!expiry) return { label: 'N/A', color: 'text-gray-400' }
    const days = Math.ceil((new Date(expiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    if (days < 0) return { label: 'Expired', color: 'text-red-600 font-semibold' }
    if (days <= 30) return { label: `${days}d left`, color: 'text-red-500' }
    if (days <= 90) return { label: `${days}d left`, color: 'text-yellow-500' }
    return { label: `${days}d left`, color: 'text-green-500' }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Employees</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" /> Add Employee
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search employees..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white"
          />
        </div>
        <select
          value={permitFilter}
          onChange={(e) => { setPermitFilter(e.target.value); setPage(1) }}
          className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white"
        >
          <option value="">All Permits</option>
          <option value="B">B Permit</option>
          <option value="C">C Permit</option>
          <option value="L">L Permit</option>
          <option value="G">G Permit</option>
          <option value="S">S Permit</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Name</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Nationality</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Permit</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Expiry</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Department</th>
              <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>
            ) : employees.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No employees found</td></tr>
            ) : (
              employees.map((emp) => {
                const expiry = getExpiryStatus(emp.permitExpiry)
                return (
                  <tr key={emp.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 cursor-pointer">
                    <td className="px-4 py-3">
                      <Link href={`/b2b/employees/${emp.id}`} className="font-medium text-gray-900 dark:text-white hover:text-blue-600">
                        {emp.firstName} {emp.lastName}
                      </Link>
                      {emp.email && <p className="text-xs text-gray-400">{emp.email}</p>}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{emp.nationality || '-'}</td>
                    <td className="px-4 py-3">
                      {emp.permitType ? (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPermitBadgeColor(emp.permitType)}`}>
                          {emp.permitType}
                        </span>
                      ) : '-'}
                    </td>
                    <td className={`px-4 py-3 text-xs ${expiry.color}`}>{expiry.label}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{emp.department || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        emp.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-gray-700">
            <span className="text-sm text-gray-500">{total} employees total</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1 rounded disabled:opacity-30"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Page {page} of {pages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(pages, p + 1))}
                disabled={page === pages}
                className="p-1 rounded disabled:opacity-30"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowAddModal(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-lg mx-4" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add Employee</h2>
            <form onSubmit={handleAddEmployee} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input name="firstName" required placeholder="First Name" className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm" />
                <input name="lastName" required placeholder="Last Name" className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm" />
              </div>
              <input name="email" type="email" placeholder="Email (optional)" className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm" />
              <div className="grid grid-cols-2 gap-3">
                <input name="nationality" placeholder="Nationality" className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm" />
                <select name="permitType" className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm">
                  <option value="">Permit Type</option>
                  <option value="B">B - Residence</option>
                  <option value="C">C - Settlement</option>
                  <option value="L">L - Short-term</option>
                  <option value="G">G - Cross-border</option>
                  <option value="S">S - Provisional</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input name="permitNumber" placeholder="Permit Number" className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm" />
                <input name="permitExpiry" type="date" placeholder="Permit Expiry" className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input name="department" placeholder="Department" className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm" />
                <input name="position" placeholder="Position" className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm">
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                  Add Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
