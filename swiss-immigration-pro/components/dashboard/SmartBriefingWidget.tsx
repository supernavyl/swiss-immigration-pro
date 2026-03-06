'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Zap, 
  Clock, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Lock
} from 'lucide-react'
import Link from 'next/link'
import { DashboardUser } from './types'

interface SmartBriefingWidgetProps {
  user: DashboardUser
  progress: number
}

export default function SmartBriefingWidget({ user, progress }: SmartBriefingWidgetProps) {
  const [greeting, setGreeting] = useState('')
  
  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 18) setGreeting('Good afternoon')
    else setGreeting('Good evening')
  }, [])

  // Mock dynamic insights - in a real app, these would come from an API based on user profile
  const insights = [
    {
      type: 'urgent',
      icon: AlertTriangle,
      color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400',
      title: 'Quota Update',
      text: 'Non-EU B permit quotas are 65% full for 2025. Submit your application by August to ensure availability.'
    },
    {
      type: 'action',
      icon: Zap,
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400',
      title: 'Recommended Action',
      text: progress === 0 
        ? 'Start with "Module 1: The Basics" to understand your eligibility.' 
        : 'You\'ve completed 2 modules. Take the "Readiness Quiz" to test your knowledge.'
    },
    {
      type: 'insight',
      icon: TrendingUp,
      color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400',
      title: 'Market Trend',
      text: 'IT and Pharma sectors in Basel are currently approving permits 20% faster than the national average.'
    }
  ]

  const isFree = user.packId === 'free'

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-8 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-full blur-3xl -mr-32 -mt-32 opacity-60" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {greeting}, {user.name?.split(' ')[0] || 'User'}. Here is your daily briefing.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insights.map((item, idx) => (
            <div key={idx} className="flex gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}>
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{item.text}</p>
              </div>
            </div>
          ))}
        </div>

        {isFree && (
          <div className="mt-6 flex items-center justify-between p-4 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <Lock className="w-5 h-5 text-blue-300" />
              </div>
              <div>
                <p className="font-semibold text-sm">Unlock personalized legal insights</p>
                <p className="text-xs text-gray-300">Upgrade to Immigration Pack for full AI analysis</p>
              </div>
            </div>
            <Link 
              href="/pricing"
              className="px-4 py-2 bg-white text-gray-900 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors"
            >
              Upgrade Now
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  )
}
