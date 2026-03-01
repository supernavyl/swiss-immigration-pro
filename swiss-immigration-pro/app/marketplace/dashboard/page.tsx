'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getAuthHeaderSync, useSession } from '@/lib/auth-client'
import { BarChart3, MessageSquare, Star, CheckCircle, Clock, XCircle } from 'lucide-react'

export default function ProviderDashboardPage() {
  const { status } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [referrals, setReferrals] = useState<any[]>([])
  const [totalReferrals, setTotalReferrals] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login?redirect=/marketplace/dashboard')
    if (status === 'authenticated') fetchData()
  }, [status])

  async function fetchData() {
    try {
      const [profileRes, referralsRes] = await Promise.all([
        fetch('/api/marketplace/providers/me', { headers: getAuthHeaderSync() }),
        fetch('/api/marketplace/referrals/provider', { headers: getAuthHeaderSync() }),
      ])

      if (profileRes.ok) {
        const data = await profileRes.json()
        setProfile(data)
      }
      if (referralsRes.ok) {
        const data = await referralsRes.json()
        setReferrals(data.referrals)
        setTotalReferrals(data.total)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function updateReferral(id: string, action: 'accept' | 'complete') {
    const res = await fetch(`/api/marketplace/referrals/${id}/${action}`, {
      method: 'POST',
      headers: getAuthHeaderSync(),
    })
    if (res.ok) fetchData()
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" /></div>

  if (!profile?.profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Not a Provider Yet</h2>
          <p className="text-gray-500 mb-4">Apply to join the marketplace to access your dashboard.</p>
          <Link href="/marketplace/apply" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Apply Now
          </Link>
        </div>
      </div>
    )
  }

  const p = profile.profile
  const name = p.firmName || p.agencyName || 'Provider'
  const pending = referrals.filter(r => r.status === 'pending').length
  const accepted = referrals.filter(r => r.status === 'accepted').length
  const completed = referrals.filter(r => r.status === 'completed').length

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Provider Dashboard</h1>
            <p className="text-gray-500 text-sm">{name}</p>
          </div>
          <div className="flex items-center gap-2">
            {p.verified ? (
              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Verified</span>
            ) : (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">Pending Verification</span>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <MessageSquare className="w-5 h-5 text-blue-600 mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalReferrals}</p>
            <p className="text-xs text-gray-500">Total Leads</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <Clock className="w-5 h-5 text-yellow-500 mb-2" />
            <p className="text-2xl font-bold text-yellow-600">{pending}</p>
            <p className="text-xs text-gray-500">Pending</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <CheckCircle className="w-5 h-5 text-green-500 mb-2" />
            <p className="text-2xl font-bold text-green-600">{completed}</p>
            <p className="text-xs text-gray-500">Completed</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <Star className="w-5 h-5 text-yellow-500 mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{p.rating?.toFixed(1) || '0.0'}</p>
            <p className="text-xs text-gray-500">{p.reviewCount || 0} Reviews</p>
          </div>
        </div>

        {/* Referrals */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Leads</h2>

          {referrals.length === 0 ? (
            <p className="text-gray-500 text-sm">No leads yet. Once users find you in the marketplace, their inquiries will appear here.</p>
          ) : (
            <div className="space-y-3">
              {referrals.map((r) => (
                <div key={r.id} className="flex items-start justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {r.userName || r.userEmail || 'Anonymous'}
                    </p>
                    {r.message && <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{r.message}</p>}
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-gray-400">{r.source}</span>
                      <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString('de-CH')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {r.status === 'pending' && (
                      <button
                        onClick={() => updateReferral(r.id, 'accept')}
                        className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Accept
                      </button>
                    )}
                    {r.status === 'accepted' && (
                      <button
                        onClick={() => updateReferral(r.id, 'complete')}
                        className="px-3 py-1.5 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        Complete
                      </button>
                    )}
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      r.status === 'completed' ? 'bg-green-100 text-green-700' :
                      r.status === 'accepted' ? 'bg-blue-100 text-blue-700' :
                      r.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {r.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
