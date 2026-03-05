'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, Calendar, Mail, Video } from 'lucide-react'
import Link from 'next/link'
export default function ConsultationSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams?.get('session_id')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // You can verify the session here if needed
    if (sessionId) {
      setLoading(false)
    }
  }, [sessionId])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-gray-400">Processing your booking...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 md:p-12 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
          </motion.div>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Consultation Booked Successfully! 🎉
          </h1>

          <p className="text-lg text-slate-600 dark:text-gray-300 mb-8">
            Thank you for booking a consultation with us. We're excited to help you with your Swiss immigration journey.
          </p>

          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 rounded-lg p-6 mb-8 text-left">
            <h2 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              What Happens Next?
            </h2>
            <ol className="space-y-3 text-slate-700 dark:text-gray-300">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  1
                </span>
                <span>You'll receive a confirmation email within the next few minutes with all the details.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  2
                </span>
                <span>We'll review your consultation request and confirm the scheduled time.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  3
                </span>
                <span>You'll receive a video call link (Zoom or Google Meet) 24 hours before your consultation.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                  4
                </span>
                <span>At the scheduled time, join the call and we'll help you with your immigration questions!</span>
              </li>
            </ol>
          </div>

          <div className="bg-slate-50 dark:bg-gray-700 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-gray-300 mb-2">
              <Calendar className="w-5 h-5" />
              <span className="font-medium">Need to Reschedule?</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-gray-400 mb-4">
              Contact us at least 24 hours before your consultation and we'll find a new time that works for you.
            </p>
            <a
              href={`mailto:support@swissimmigrationpro.com?subject=Reschedule Consultation`}
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
            >
              Contact Support →
            </a>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-all"
            >
              <Video className="w-5 h-5" />
              Go to Dashboard
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-slate-200 dark:bg-gray-700 hover:bg-slate-300 dark:hover:bg-gray-600 text-slate-900 dark:text-white font-semibold px-6 py-3 rounded-lg transition-all"
            >
              Back to Home
            </Link>
          </div>

          <p className="text-sm text-slate-500 dark:text-gray-400 mt-8">
            Questions? Email us at{' '}
            <a href="mailto:support@swissimmigrationpro.com" className="text-blue-600 dark:text-blue-400 hover:underline">
              support@swissimmigrationpro.com
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

