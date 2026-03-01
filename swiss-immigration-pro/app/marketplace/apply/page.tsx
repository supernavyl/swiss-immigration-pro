'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getAuthHeaderSync, useSession } from '@/lib/auth-client'
import Link from 'next/link'
import { Scale, Building2, ArrowRight } from 'lucide-react'

export default function MarketplaceApplyPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [type, setType] = useState<'lawyer' | 'agency' | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (status === 'loading') return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" /></div>

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Sign in required</h2>
          <p className="text-gray-500 mb-4">You need to be logged in to apply as a provider.</p>
          <Link href="/auth/login?redirect=/marketplace/apply" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = new FormData(e.currentTarget)
    let body: Record<string, unknown> = {}
    let endpoint = ''

    if (type === 'lawyer') {
      endpoint = '/api/marketplace/providers/apply/lawyer'
      body = {
        firmName: form.get('firmName'),
        specializations: (form.get('specializations') as string)?.split(',').map(s => s.trim()).filter(Boolean) || [],
        cantonsServed: (form.get('cantonsServed') as string)?.split(',').map(s => s.trim()).filter(Boolean) || [],
        languages: (form.get('languages') as string)?.split(',').map(s => s.trim()).filter(Boolean) || [],
        hourlyRate: form.get('hourlyRate') ? Number(form.get('hourlyRate')) : null,
        bio: form.get('bio') || null,
        website: form.get('website') || null,
        phone: form.get('phone') || null,
        address: form.get('address') || null,
      }
    } else {
      endpoint = '/api/marketplace/providers/apply/agency'
      body = {
        agencyName: form.get('agencyName'),
        services: (form.get('services') as string)?.split(',').map(s => s.trim()).filter(Boolean) || [],
        regions: (form.get('regions') as string)?.split(',').map(s => s.trim()).filter(Boolean) || [],
        languages: (form.get('languages') as string)?.split(',').map(s => s.trim()).filter(Boolean) || [],
        bio: form.get('bio') || null,
        website: form.get('website') || null,
        phone: form.get('phone') || null,
      }
    }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaderSync() },
        body: JSON.stringify(body),
      })

      const data = await res.json()
      if (res.ok) {
        router.push('/marketplace/dashboard')
      } else {
        setError(data.detail || 'Application failed')
      }
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  if (!type) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Join Our Marketplace
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button
              onClick={() => setType('lawyer')}
              className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-8 text-center hover:border-blue-500 transition"
            >
              <Scale className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Immigration Lawyer</h3>
              <p className="text-sm text-gray-500 mt-2">
                Get qualified leads from people who need legal immigration help
              </p>
            </button>
            <button
              onClick={() => setType('agency')}
              className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 p-8 text-center hover:border-blue-500 transition"
            >
              <Building2 className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Relocation Agency</h3>
              <p className="text-sm text-gray-500 mt-2">
                Connect with clients looking for relocation and integration services
              </p>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <button onClick={() => setType(null)} className="text-sm text-gray-500 hover:text-gray-700 mb-4">
          &larr; Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Apply as {type === 'lawyer' ? 'Lawyer' : 'Agency'}
        </h1>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {type === 'lawyer' ? 'Firm Name' : 'Agency Name'} *
            </label>
            <input name={type === 'lawyer' ? 'firmName' : 'agencyName'} required className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {type === 'lawyer' ? 'Specializations' : 'Services'} (comma-separated)
            </label>
            <input
              name={type === 'lawyer' ? 'specializations' : 'services'}
              placeholder={type === 'lawyer' ? 'work_permits, citizenship, family' : 'relocation, housing, school'}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {type === 'lawyer' ? 'Cantons Served' : 'Regions'} (comma-separated)
            </label>
            <input
              name={type === 'lawyer' ? 'cantonsServed' : 'regions'}
              placeholder="ZH, BE, GE"
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Languages (comma-separated)</label>
            <input name="languages" placeholder="de, fr, en" className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm" />
          </div>

          {type === 'lawyer' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hourly Rate (CHF)</label>
              <input name="hourlyRate" type="number" placeholder="350" className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm" />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio / Description</label>
            <textarea name="bio" rows={3} className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Website</label>
              <input name="website" type="url" className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
              <input name="phone" className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm" />
            </div>
          </div>

          {type === 'lawyer' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
              <input name="address" className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm" />
            </div>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Application'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>

          <p className="text-xs text-gray-400 text-center">
            Your profile will be reviewed before appearing in the directory.
          </p>
        </form>
      </div>
    </div>
  )
}
