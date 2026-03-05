'use client'

import { useEffect, useState } from 'react'
import { useToast } from '@/components/providers/ToastProvider'
import { api } from '@/lib/api'
import { Building2, CreditCard, Users, Save } from 'lucide-react'

export default function B2BSettingsPage() {
  const { showToast } = useToast()
  const [company, setCompany] = useState<any>(null)
  const [members, setMembers] = useState<any[]>([])
  const [billing, setBilling] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('viewer')

  const companyId = typeof window !== 'undefined' ? localStorage.getItem('sip_company_id') : null

  useEffect(() => {
    if (companyId) {
      Promise.all([fetchCompany(), fetchMembers(), fetchBilling()]).finally(() => setLoading(false))
    }
  }, [companyId])

  async function fetchCompany() {
    try {
      setCompany(await api.get(`/api/b2b/companies/${companyId}`))
    } catch (err) { console.error('Failed to load company:', err) }
  }

  async function fetchMembers() {
    try {
      setMembers(await api.get(`/api/b2b/companies/${companyId}/members`))
    } catch (err) { console.error('Failed to load members:', err) }
  }

  async function fetchBilling() {
    try {
      setBilling(await api.get(`/api/b2b/billing/${companyId}`))
    } catch (err) { console.error('Failed to load billing:', err) }
  }

  async function handleUpdateCompany(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const body = {
      name: form.get('name'),
      domain: form.get('domain') || null,
      canton: form.get('canton') || null,
      industry: form.get('industry') || null,
      billingEmail: form.get('billingEmail'),
    }
    try {
      await api.put(`/api/b2b/companies/${companyId}`, body)
      await fetchCompany()
    } catch (err) { console.error('Failed to update company:', err) }
  }

  async function handleInvite() {
    if (!inviteEmail) return
    try {
      await api.post(`/api/b2b/companies/${companyId}/members`, { email: inviteEmail, role: inviteRole })
      setInviteEmail('')
      await fetchMembers()
    } catch (err) {
      const detail = err instanceof Error ? err.message : 'Failed to invite'
      showToast(detail, 'error')
    }
  }

  async function handleUpgrade(planId: string) {
    try {
      const data = await api.post<{ checkoutUrl?: string }>(`/api/b2b/billing/${companyId}/checkout`, { planId, cycle: 'monthly' })
      if (data.checkoutUrl) window.location.href = data.checkoutUrl
    } catch (err) {
      showToast('Failed to start checkout. Please try again.', 'error')
      console.error('Checkout failed:', err)
    }
  }

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" /></div>

  return (
    <div className="max-w-3xl space-y-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>

      {/* Company details */}
      {company && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Company Details</h2>
          </div>
          <form onSubmit={handleUpdateCompany} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Company Name</label>
                <input name="name" defaultValue={company.name} required className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Domain</label>
                <input name="domain" defaultValue={company.domain || ''} className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Canton</label>
                <input name="canton" defaultValue={company.canton || ''} maxLength={2} className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Industry</label>
                <input name="industry" defaultValue={company.industry || ''} className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Billing Email</label>
              <input name="billingEmail" type="email" defaultValue={company.billingEmail} required className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm" />
            </div>
            <button type="submit" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
              <Save className="w-4 h-4" /> Save
            </button>
          </form>
        </div>
      )}

      {/* Team members */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Team Members</h2>
        </div>

        <div className="space-y-2 mb-4">
          {members.map((m) => (
            <div key={m.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
              <div>
                <p className="text-sm text-gray-900 dark:text-white">{m.invitedEmail || m.userId}</p>
                <p className="text-xs text-gray-400">{m.role}</p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-xs ${m.acceptedAt ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {m.acceptedAt ? 'Active' : 'Pending'}
              </span>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="email"
            placeholder="Email to invite..."
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm"
          />
          <select
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value)}
            className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm"
          >
            <option value="viewer">Viewer</option>
            <option value="hr_manager">HR Manager</option>
            <option value="admin">Admin</option>
          </select>
          <button onClick={handleInvite} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
            Invite
          </button>
        </div>
      </div>

      {/* Billing */}
      {billing && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Billing</h2>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-500">Current plan:</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{billing.planName}</p>
            <p className="text-sm text-gray-400">Up to {billing.maxEmployees} employees</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(billing.availablePlans).map(([id, plan]: [string, any]) => (
              <div key={id} className={`border rounded-lg p-4 ${billing.currentPlan === id ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
                <h4 className="font-semibold text-gray-900 dark:text-white">{plan.name}</h4>
                <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                  CHF {(plan.priceMonthly / 100).toFixed(0)}<span className="text-sm font-normal text-gray-500">/mo</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">Up to {plan.maxEmployees} employees</p>
                {billing.currentPlan !== id && (
                  <button
                    onClick={() => handleUpgrade(id)}
                    className="mt-3 w-full px-3 py-1.5 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                  >
                    {billing.currentPlan < id ? 'Upgrade' : 'Switch'}
                  </button>
                )}
                {billing.currentPlan === id && (
                  <p className="mt-3 text-xs text-blue-600 font-medium text-center">Current Plan</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
