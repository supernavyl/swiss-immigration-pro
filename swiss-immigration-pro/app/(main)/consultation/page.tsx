'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, CheckCircle, AlertCircle, CreditCard } from 'lucide-react'
import Link from 'next/link'
import MainHeader from '@/components/layout/MainHeader'

const CONSULTATION_TYPES = [
  {
    id: 'quick',
    name: 'Quick Guidance',
    duration: '30 minutes',
    price: 80,
    description: 'Perfect for specific questions or quick review of your situation',
    features: [
      '30-minute guidance session',
      'Review your specific situation',
      'Get personalized advice',
      'Q&A session',
      'Email summary after session'
    ]
  },
  {
    id: 'full',
    name: 'Full Review',
    duration: '60 minutes',
    price: 200,
    description: 'Comprehensive review of your immigration path',
    features: [
      '60-minute guidance session',
      'Complete application review',
      'Personalized action plan',
      'Document checklist',
      'Priority email support (1 week)',
      'Follow-up session available'
    ],
    popular: true
  },
  {
    id: 'support',
    name: 'Application Support Package',
    duration: 'Ongoing',
    price: 600,
    description: 'Full support through your entire application process',
    features: [
      'Initial 60-minute strategy session',
      'Application review and feedback',
      'Document preparation guidance',
      'Email support throughout process',
      '3 follow-up sessions (30min each)',
      'Priority response (24h)',
      'Application submission review'
    ]
  }
]


export default function ConsultationPage() {
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    preferredDate: '',
    preferredTime: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const consultationType = CONSULTATION_TYPES.find(t => t.id === selectedType)
      if (!consultationType) {
        throw new Error('Please select a guidance option')
      }

      // Combine date and time
      const preferredDateTime = formData.preferredDate && formData.preferredTime
        ? new Date(`${formData.preferredDate}T${formData.preferredTime}`)
        : null

      const response = await fetch('/api/consultations/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consultationType: selectedType,
          ...formData,
          preferredDate: preferredDateTime?.toISOString()
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || data.error || 'Failed to book guidance session')
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl
        return
      }

      setSuccess('Booking confirmed! Check your email for details.')
      setLoading(false)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
      <MainHeader />

      {/* Hero Section with Image */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=600&fit=crop"
            alt="Swiss Alps"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Book Guidance
            </h1>
            <p className="text-xl md:text-2xl text-blue-50 max-w-2xl mx-auto mb-8">
              Get personalized guidance from our Swiss immigration experts. Choose the guidance option that fits your needs.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Guidance Options */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {CONSULTATION_TYPES.map((type) => (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              onClick={() => setSelectedType(type.id)}
              className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none p-8 cursor-pointer transition-all ${
                selectedType === type.id
                  ? 'ring-4 ring-blue-500 scale-105'
                  : 'hover:shadow-xl dark:hover:shadow-none hover:scale-102'
              } ${type.popular ? 'border-2 border-blue-500' : ''}`}
            >
              {type.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{type.name}</h3>
                <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-gray-400 mb-4">
                  <Clock className="w-4 h-4" />
                  <span>{type.duration}</span>
                </div>
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  CHF {type.price}
                </div>
                {type.id !== 'support' && (
                  <p className="text-sm text-slate-500 dark:text-gray-400">one-time payment</p>
                )}
              </div>

              <p className="text-slate-600 dark:text-gray-400 mb-6 text-center">{type.description}</p>

              <ul className="space-y-3 mb-6">
                {type.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="text-center">
                <div className={`w-6 h-6 rounded-full border-2 mx-auto ${
                  selectedType === type.id
                    ? 'bg-blue-500 border-blue-500'
                    : 'border-slate-300 dark:border-gray-700'
                }`}>
                  {selectedType === type.id && (
                    <div className="w-full h-full rounded-full bg-blue-500 scale-50" />
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Booking Form */}
        {selectedType && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-none p-8"
          >
            {success ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Booking Request Received!</h2>
                <p className="text-slate-600 dark:text-gray-300">{success}</p>
              </div>
            ) : (
            <>
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Book Your {CONSULTATION_TYPES.find(t => t.id === selectedType)?.name} Session
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-200 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-200 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900"
                  placeholder="john@example.com"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-200 mb-2">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-200 mb-2">
                    Preferred Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.preferredTime}
                    onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-200 mb-2">
                  Timezone
                </label>
                <input
                  type="text"
                  value={formData.timezone}
                  onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 dark:bg-gray-800"
                  readOnly
                />
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                  We'll confirm the exact time based on your timezone
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-200 mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900"
                  placeholder="Tell us about your specific situation or questions..."
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <p className="text-red-600">{error}</p>
                </div>
              )}

              <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-700 dark:text-gray-200 font-medium">Total Amount</span>
                  <span className="text-2xl font-bold text-blue-600">
                    CHF {CONSULTATION_TYPES.find(t => t.id === selectedType)?.price}
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-gray-400">
                  Payment will be processed securely through Stripe. You'll receive a confirmation email with meeting details after payment.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  'Processing...'
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Proceed to Payment
                  </>
                )}
              </button>
            </form>

            <p className="text-sm text-slate-500 dark:text-gray-400 text-center mt-6">
              By booking guidance, you agree to our{' '}
              <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
            </p>
            </>
            )}
          </motion.div>
        )}


        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-3xl mx-auto mt-16"
        >
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {[
              {
                q: 'How do the guidance sessions work?',
                a: 'After booking and payment, you\'ll receive a confirmation email with session details. At the scheduled time, you\'ll connect with one of our immigration experts for your guidance session.'
              },
              {
                q: 'What if I need to reschedule?',
                a: 'Contact us at least 24 hours before your scheduled session, and we\'ll work with you to find a new time. Rescheduling is free.'
              },
              {
                q: 'What is your cancellation policy?',
                a: 'You can reschedule your session by contacting us at least 24 hours before your scheduled time. Cancellations are handled on a case-by-case basis.'
              },
              {
                q: 'What languages are sessions available in?',
                a: 'Sessions are available in English, German, French, and Italian. Please mention your preferred language in the notes when booking.'
              },
              {
                q: 'Is this legal advice?',
                a: 'Our guidance sessions provide general information and advice. For specific legal matters, we recommend consulting with a certified Swiss immigration lawyer.'
              }
            ].map((faq, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-none p-6">
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

