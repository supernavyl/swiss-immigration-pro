'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getAuthHeaderSync, useSession } from '@/lib/auth-client'
import { ArrowLeft, Star, Shield, MapPin, Globe, Phone, Mail, MessageSquare } from 'lucide-react'

export default function ProviderProfilePage() {
  const params = useParams()
  const slug = params?.slug as string
  const { data: session } = useSession()

  const [provider, setProvider] = useState<any>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [avgRating, setAvgRating] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showContact, setShowContact] = useState(false)
  const [message, setMessage] = useState('')
  const [contactSent, setContactSent] = useState(false)

  useEffect(() => {
    if (slug) fetchProvider()
  }, [slug])

  async function fetchProvider() {
    try {
      // Try lawyer first, then agency
      let res = await fetch(`/api/marketplace/providers/lawyers/${slug}`)
      if (!res.ok) {
        res = await fetch(`/api/marketplace/providers/agencies/${slug}`)
      }
      if (res.ok) {
        const data = await res.json()
        setProvider(data)
        fetchReviews(data.id, data.type)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function fetchReviews(providerId: string, providerType: string) {
    const res = await fetch(`/api/marketplace/reviews/${providerType}/${providerId}`)
    if (res.ok) {
      const data = await res.json()
      setReviews(data.reviews)
      setAvgRating(data.averageRating)
    }
  }

  async function handleContact() {
    if (!provider) return

    const res = await fetch('/api/marketplace/referrals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaderSync() },
      body: JSON.stringify({
        providerId: provider.id,
        providerType: provider.type,
        message,
        source: 'marketplace',
      }),
    })

    if (res.ok) {
      setContactSent(true)
      setShowContact(false)
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" /></div>
  if (!provider) return <div className="min-h-screen flex items-center justify-center text-gray-500">Provider not found</div>

  const name = provider.firmName || provider.agencyName || 'Provider'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/marketplace" className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Marketplace
        </Link>

        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{name}</h1>
                {provider.verified && (
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    <Shield className="w-3 h-3" /> Verified
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500">
                {avgRating > 0 && (
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    {avgRating.toFixed(1)} ({provider.reviewCount} reviews)
                  </span>
                )}
                {provider.hourlyRate && <span>CHF {provider.hourlyRate}/hr</span>}
              </div>
            </div>

            <button
              onClick={() => setShowContact(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              <MessageSquare className="w-4 h-4" /> Contact
            </button>
          </div>

          {provider.bio && (
            <p className="text-gray-600 dark:text-gray-300 mt-4">{provider.bio}</p>
          )}

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {(provider.cantonsServed || provider.regions || []).length > 0 && (
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Cantons Served</p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {(provider.cantonsServed || provider.regions || []).join(', ')}
                  </p>
                </div>
              </div>
            )}
            {provider.languages?.length > 0 && (
              <div className="flex items-start gap-2">
                <Globe className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Languages</p>
                  <p className="text-sm text-gray-900 dark:text-white">{provider.languages.join(', ')}</p>
                </div>
              </div>
            )}
            {provider.website && (
              <div className="flex items-start gap-2">
                <Globe className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Website</p>
                  <a href={provider.website} target="_blank" className="text-sm text-blue-600 hover:underline">{provider.website}</a>
                </div>
              </div>
            )}
            {provider.phone && (
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-gray-500">Phone</p>
                  <p className="text-sm text-gray-900 dark:text-white">{provider.phone}</p>
                </div>
              </div>
            )}
          </div>

          {/* Specializations / Services */}
          {(provider.specializations || provider.services || []).length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-medium text-gray-500 mb-2">
                {provider.type === 'lawyer' ? 'Specializations' : 'Services'}
              </p>
              <div className="flex flex-wrap gap-2">
                {(provider.specializations || provider.services || []).map((s: string) => (
                  <span key={s} className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                    {s.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Reviews */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Reviews ({reviews.length})
          </h2>

          {reviews.length === 0 ? (
            <p className="text-gray-500 text-sm">No reviews yet.</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r.id} className="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0">
                  <div className="flex items-center gap-2 mb-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < r.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="text-xs text-gray-400 ml-2">
                      {new Date(r.createdAt).toLocaleDateString('de-CH')}
                    </span>
                  </div>
                  {r.comment && <p className="text-sm text-gray-600 dark:text-gray-300">{r.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contact success */}
        {contactSent && (
          <div className="mt-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-green-800 dark:text-green-400 text-sm">
            Your message has been sent! The provider will contact you shortly.
          </div>
        )}

        {/* Contact modal */}
        {showContact && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowContact(false)}>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Contact {name}
              </h3>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your immigration situation and how they can help..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-sm mb-4"
              />
              <div className="flex gap-3">
                <button onClick={() => setShowContact(false)} className="flex-1 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm">
                  Cancel
                </button>
                <button onClick={handleContact} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                  Send Message
                </button>
              </div>
              {!session && (
                <p className="text-xs text-gray-400 mt-2 text-center">
                  <Link href="/auth/login" className="text-blue-600 hover:underline">Log in</Link> to include your contact info automatically
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
