'use client'

import { useSession } from '@/lib/auth-client'
import { ArrowRight, Gift, Users } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function ReferralSection() {
  const { data: session, status } = useSession()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isLoggedIn = mounted && status === 'authenticated' && !!session?.user

  return (
    <section className="sip-section bg-gradient-to-b from-transparent to-slate-50 dark:to-slate-900/50">
      <div className="sip-container">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-fluid-3xl font-bold text-gray-900 dark:text-white mb-4">
            Earn While You Share
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Know someone applying to Switzerland? Refer them and both get CHF 10 off your next upgrade.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-8 mb-12">
          {/* Referrer card */}
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900">
                <Gift className="w-5 h-5 text-blue-600 dark:text-blue-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                You Get
              </h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                <span className="text-gray-700 dark:text-gray-300">
                  CHF 10 credit on your next purchase
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                <span className="text-gray-700 dark:text-gray-300">
                  Unlimited referrals — earn unlimited credits
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                <span className="text-gray-700 dark:text-gray-300">
                  Withdraw earnings anytime
                </span>
              </li>
            </ul>
          </div>

          {/* Friend card */}
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Your Friend Gets
              </h3>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                <span className="text-gray-700 dark:text-gray-300">
                  CHF 10 off their first purchase
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                <span className="text-gray-700 dark:text-gray-300">
                  Full access to free resources
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                <span className="text-gray-700 dark:text-gray-300">
                  Personal visa pathway assessment
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-3.5 rounded-lg transition-all hover:shadow-lg"
            >
              View Your Referral Link
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-3.5 rounded-lg transition-all hover:shadow-lg"
            >
              Get Your Referral Link
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
      </div>
    </section>
  )
}
