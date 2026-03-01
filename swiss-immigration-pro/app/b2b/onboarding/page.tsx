'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api, ApiError } from '@/lib/api'
import {
  Building2,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Users,
  CreditCard,
  Plus,
  X,
  Loader2,
} from 'lucide-react'

const STEPS = ['Company Info', 'Choose Plan', 'Invite Team'] as const

const B2B_PLANS: ReadonlyArray<{
  id: string
  name: string
  price: number
  annualPrice: number
  maxEmployees: number
  badge?: string
  features: readonly string[]
}> = [
  {
    id: 'b2b_starter',
    name: 'Starter',
    price: 199,
    annualPrice: 159,
    maxEmployees: 25,
    features: [
      'Up to 25 employees',
      'Permit expiry tracking',
      'Compliance dashboard',
      'Email alerts',
      'CSV export',
    ],
  },
  {
    id: 'b2b_business',
    name: 'Business',
    price: 499,
    annualPrice: 399,
    maxEmployees: 100,
    badge: 'Most Popular',
    features: [
      'Up to 100 employees',
      'Everything in Starter',
      'Audit log & reporting',
      'Team roles (Admin, HR, Viewer)',
      'Priority support',
    ],
  },
  {
    id: 'b2b_enterprise',
    name: 'Enterprise',
    price: 999,
    annualPrice: 799,
    maxEmployees: 10000,
    features: [
      'Unlimited employees',
      'Everything in Business',
      'Dedicated account manager',
      'Custom integrations',
      'SLA guarantee',
    ],
  },
]

const INDUSTRIES = [
  { value: '', label: 'Select industry' },
  { value: 'technology', label: 'Technology' },
  { value: 'finance', label: 'Finance & Banking' },
  { value: 'pharma', label: 'Pharmaceuticals' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'hospitality', label: 'Hospitality' },
  { value: 'construction', label: 'Construction' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'education', label: 'Education' },
  { value: 'other', label: 'Other' },
]

const CANTONS = [
  'AG','AI','AR','BE','BL','BS','FR','GE','GL','GR',
  'JU','LU','NE','NW','OW','SG','SH','SO','SZ','TG',
  'TI','UR','VD','VS','ZG','ZH',
]

export default function B2BOnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Step 1: Company info
  const [companyName, setCompanyName] = useState('')
  const [billingEmail, setBillingEmail] = useState('')
  const [domain, setDomain] = useState('')
  const [canton, setCanton] = useState('')
  const [industry, setIndustry] = useState('')
  const [companyId, setCompanyId] = useState<string | null>(null)

  // Step 2: Plan
  const [cycle, setCycle] = useState<'monthly' | 'annual'>('annual')
  const [selectedPlan, setSelectedPlan] = useState('b2b_business')

  // Step 3: Invite
  const [invites, setInvites] = useState<{ email: string; role: string }[]>([])
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('viewer')
  const [inviteSent, setInviteSent] = useState<string[]>([])

  // Step 1: Create company
  async function handleCreateCompany() {
    if (!companyName.trim() || !billingEmail.trim()) {
      setError('Company name and billing email are required.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const data = await api.post<{ success: boolean; companyId: string }>(
        '/api/b2b/companies',
        {
          name: companyName,
          billingEmail,
          domain: domain || null,
          canton: canton || null,
          industry: industry || null,
        },
      )
      if (data.companyId) {
        localStorage.setItem('sip_company_id', data.companyId)
        setCompanyId(data.companyId)
        setStep(1)
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.detail : 'Failed to create company')
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Subscribe to plan
  async function handleSubscribe() {
    if (!companyId) return
    setLoading(true)
    setError('')
    try {
      const data = await api.post<{ checkoutUrl: string }>(
        `/api/b2b/billing/${companyId}/checkout`,
        { planId: selectedPlan, cycle },
      )
      if (data.checkoutUrl) {
        // Open Stripe checkout — they'll return to /b2b/dashboard after success
        window.location.href = data.checkoutUrl
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.detail : 'Checkout failed')
      setLoading(false)
    }
  }

  // Step 3: Add invite to list
  function addInvite() {
    if (!inviteEmail.trim()) return
    if (invites.some((i) => i.email === inviteEmail)) return
    setInvites([...invites, { email: inviteEmail, role: inviteRole }])
    setInviteEmail('')
  }

  function removeInvite(email: string) {
    setInvites(invites.filter((i) => i.email !== email))
  }

  // Step 3: Send all invites
  async function handleSendInvites() {
    if (!companyId || invites.length === 0) {
      router.push('/b2b/dashboard')
      return
    }
    setLoading(true)
    setError('')
    const sent: string[] = []
    for (const invite of invites) {
      try {
        await api.post(`/api/b2b/companies/${companyId}/members`, {
          email: invite.email,
          role: invite.role,
        })
        sent.push(invite.email)
      } catch {
        // Continue with other invites
      }
    }
    setInviteSent(sent)
    setLoading(false)
    // Brief pause to show success, then redirect
    setTimeout(() => router.push('/b2b/dashboard'), 1500)
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                  i < step
                    ? 'bg-green-500 text-white'
                    : i === step
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                }`}
              >
                {i < step ? <CheckCircle className="w-5 h-5" /> : i + 1}
              </div>
              <span
                className={`text-sm hidden sm:inline ${
                  i === step
                    ? 'text-gray-900 dark:text-white font-semibold'
                    : 'text-gray-400'
                }`}
              >
                {label}
              </span>
              {i < STEPS.length - 1 && (
                <div className="w-8 h-px bg-gray-300 dark:bg-gray-600" />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Company Info */}
        {step === 0 && (
          <div>
            <div className="text-center mb-6">
              <Building2 className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Set Up Your Company
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                Start managing your team&apos;s immigration compliance
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Company Name *
                </label>
                <input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Acme GmbH"
                  className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Billing Email *
                </label>
                <input
                  type="email"
                  value={billingEmail}
                  onChange={(e) => setBillingEmail(e.target.value)}
                  placeholder="billing@acme.ch"
                  className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Domain
                  </label>
                  <input
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="acme.ch"
                    className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Canton
                  </label>
                  <select
                    value={canton}
                    onChange={(e) => setCanton(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="">Select</option>
                    {CANTONS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Industry
                </label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                >
                  {INDUSTRIES.map((i) => (
                    <option key={i.value} value={i.value}>{i.label}</option>
                  ))}
                </select>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button
                onClick={handleCreateCompany}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold disabled:opacity-50 transition-colors"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Choose Plan */}
        {step === 1 && (
          <div>
            <div className="text-center mb-6">
              <CreditCard className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Choose Your Plan
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                All plans include a 14-day free trial
              </p>
            </div>

            {/* Billing toggle */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <button
                onClick={() => setCycle('monthly')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  cycle === 'monthly'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setCycle('annual')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  cycle === 'annual'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                Annual
                <span className="ml-1 text-xs opacity-80">Save 20%</span>
              </button>
            </div>

            <div className="space-y-4">
              {B2B_PLANS.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                    selectedPlan === plan.id
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {plan.name}
                      </h3>
                      {plan.badge && (
                        <span className="px-2 py-0.5 text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-full">
                          {plan.badge}
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-extrabold text-gray-900 dark:text-white">
                        CHF {cycle === 'annual' ? plan.annualPrice : plan.price}
                      </span>
                      <span className="text-sm text-gray-500">/mo</span>
                    </div>
                  </div>
                  <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-gray-400">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>

            {error && <p className="text-sm text-red-500 mt-3">{error}</p>}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400"
              >
                Skip for now
              </button>
              <button
                onClick={handleSubscribe}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold disabled:opacity-50 transition-colors"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Start Free Trial
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Invite Team */}
        {step === 2 && (
          <div>
            <div className="text-center mb-6">
              <Users className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Invite Your Team
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                Add team members who will manage immigration compliance
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              {/* Invite form */}
              <div className="flex gap-2 mb-4">
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@acme.ch"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addInvite())}
                  className="flex-1 px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                />
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="px-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm"
                >
                  <option value="admin">Admin</option>
                  <option value="hr_manager">HR Manager</option>
                  <option value="viewer">Viewer</option>
                </select>
                <button
                  onClick={addInvite}
                  className="p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Invite list */}
              {invites.length > 0 && (
                <div className="space-y-2 mb-4">
                  {invites.map((invite) => (
                    <div
                      key={invite.email}
                      className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-900 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        {inviteSent.includes(invite.email) ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <Users className="w-4 h-4 text-gray-400" />
                        )}
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {invite.email}
                        </span>
                        <span className="text-xs text-gray-400 capitalize">
                          {invite.role.replace('_', ' ')}
                        </span>
                      </div>
                      {!inviteSent.includes(invite.email) && (
                        <button
                          onClick={() => removeInvite(invite.email)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {invites.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">
                  Add team member emails above, or skip this step.
                </p>
              )}
            </div>

            {error && <p className="text-sm text-red-500 mt-3">{error}</p>}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => router.push('/b2b/dashboard')}
                className="px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400"
              >
                Skip
              </button>
              <button
                onClick={handleSendInvites}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-semibold disabled:opacity-50 transition-colors"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : invites.length > 0 ? (
                  <>
                    Send {invites.length} Invite{invites.length > 1 ? 's' : ''} & Continue
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Go to Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
