'use client'

import { useState, use } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, CreditCard, Download, Video, FileText, Users } from 'lucide-react'
import Link from 'next/link'
import MainHeader from '@/components/layout/MainHeader'
import { ONE_TIME_PRODUCTS } from '@/lib/pricing'

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const productId = resolvedParams?.id
  const product = productId ? ONE_TIME_PRODUCTS[productId as keyof typeof ONE_TIME_PRODUCTS] : null

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePurchase = async () => {
    setError(null)
    setLoading(true)

    try {
      const response = await fetch('/api/products/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
        <MainHeader />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Product Not Found</h1>
          <p className="text-slate-600 dark:text-gray-400 mb-8">The product you're looking for doesn't exist.</p>
          <Link href="/pricing" className="text-blue-600 hover:underline">
            View All Products →
          </Link>
        </div>
      </div>
    )
  }

  const priceCHF = product.price / 100
  const iconMap = {
    course: Video,
    pdf: FileText,
    service: Users
  }
  const Icon = iconMap[product.type] || FileText

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
      <MainHeader />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Product Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 md:p-12">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <Icon className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-1">
                    {product.type === 'course' ? 'Online Course' : product.type === 'pdf' ? 'Digital Download' : 'Service Package'}
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                    {product.name}
                  </h1>
                </div>
              </div>

              <p className="text-xl text-slate-600 dark:text-gray-400 mb-8 leading-relaxed">
                {product.description}
              </p>

              <div className="space-y-4 mb-8">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">What's Included:</h2>
                <ul className="space-y-3">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-700 dark:text-gray-200">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Trust Indicators */}
              <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-6 mb-8">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">18,500+</div>
                    <div className="text-xs text-slate-600 dark:text-gray-400">Students</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">87%</div>
                    <div className="text-xs text-slate-600 dark:text-gray-400">Success Rate</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">100%</div>
                    <div className="text-xs text-slate-600 dark:text-gray-400">Satisfaction</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Purchase Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:sticky lg:top-8 h-fit"
          >
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-xl p-8 text-white">
              <div className="mb-8">
                <div className="text-sm font-semibold opacity-90 mb-2">One-Time Purchase</div>
                <div className="text-5xl font-bold mb-2">
                  CHF {priceCHF}
                </div>
                <div className="text-sm opacity-75">
                  {product.type === 'pdf' && 'Instant download'}
                  {product.type === 'course' && 'Lifetime access'}
                  {product.type === 'service' && 'Full package'}
                </div>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-300 rounded-lg p-4 mb-6">
                  <p className="text-red-100 text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={handlePurchase}
                disabled={loading}
                className="w-full bg-white text-blue-600 hover:bg-blue-50 font-bold py-4 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-6"
              >
                {loading ? (
                  'Processing...'
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Purchase Now
                  </>
                )}
              </button>

              <div className="space-y-4 text-sm opacity-90">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>Secure payment via Stripe</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>Instant access after purchase</span>
                </div>
                {product.type !== 'service' && (
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>Lifetime access</span>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-8 border-t border-white/20">
                <p className="text-xs opacity-75 text-center">
                  Need help? <Link href="/contact" className="underline">Contact us</Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 md:p-12"
        >
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6 max-w-3xl mx-auto">
            {[
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards, debit cards, and other payment methods through Stripe. Your payment is secure and encrypted.'
              },
              {
                q: 'When will I get access?',
                a: product.type === 'pdf'
                  ? 'You\'ll receive instant access to download the PDF immediately after purchase.'
                  : product.type === 'course'
                  ? 'You\'ll receive instant access to the course platform after purchase. All materials are available immediately.'
                  : 'You\'ll receive an email confirmation with next steps within 24 hours of purchase.'
              },
              {
                q: 'What is your cancellation policy?',
                a: 'You can cancel your purchase at any time. For digital products, access will continue until the end of your subscription period if applicable.'
              },
              {
                q: 'Is this a subscription?',
                a: 'No, this is a one-time purchase. You pay once and get lifetime access (for courses and PDFs) or the full service package.'
              }
            ].map((faq, idx) => (
              <div key={idx} className="border-b border-slate-200 dark:border-gray-700 pb-6 last:border-0 last:pb-0">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{faq.q}</h3>
                <p className="text-slate-600 dark:text-gray-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

