'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, MessageCircle, Download, ChevronRight } from 'lucide-react'
import ReferralCard from '@/components/marketing/ReferralCard'
import { api } from '@/lib/api'
import type { TabProps } from './types'

function openChatbot() {
  const win = window as Window & { __openChatbot?: () => void }
  win.__openChatbot?.()
}

export default function OverviewTab({ modules, progress = 0 }: TabProps) {
  const [usageStats, setUsageStats] = useState({ messagesToday: 0, messagesLimit: 10, cvsCreated: 0 })

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const data = await api.get<{ packId?: string; messagesToday?: number }>('/user/limits')
        const limit = data.packId === 'free' ? 10 : Infinity
        setUsageStats({
          messagesToday: data.messagesToday ?? 0,
          messagesLimit: limit,
          cvsCreated: 0,
        })
      } catch {
        /* non-critical */
      }
    }
    fetchUsage()
  }, [])

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-green-50 dark:bg-green-900 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{progress}%</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Guide Progress</div>
          <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="bg-green-600 h-2 rounded-full"
            />
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {usageStats.messagesToday}
            {usageStats.messagesLimit !== Infinity && `/${usageStats.messagesLimit}`}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {usageStats.messagesLimit === Infinity ? 'AI Messages (Unlimited)' : 'AI Messages Used Today'}
          </div>
          {usageStats.messagesLimit !== Infinity && (
            <>
              <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((usageStats.messagesToday / usageStats.messagesLimit) * 100, 100)}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className={`h-2 rounded-full ${
                    usageStats.messagesToday >= usageStats.messagesLimit
                      ? 'bg-red-500'
                      : usageStats.messagesToday >= usageStats.messagesLimit * 0.8
                        ? 'bg-yellow-500'
                        : 'bg-blue-600'
                  }`}
                />
              </div>
              {usageStats.messagesToday >= usageStats.messagesLimit * 0.8 && (
                <a
                  href="/pricing"
                  className={`mt-3 flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    usageStats.messagesToday >= usageStats.messagesLimit
                      ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                      : 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800'
                  }`}
                >
                  <span>
                    {usageStats.messagesToday >= usageStats.messagesLimit
                      ? 'Limit reached \u2014 upgrade for unlimited access'
                      : `${usageStats.messagesLimit - usageStats.messagesToday} messages left today \u2014 upgrade for unlimited`}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                </a>
              )}
            </>
          )}
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-purple-50 dark:bg-purple-900 flex items-center justify-center">
              <Download className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{usageStats.cvsCreated}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">CVs Created</div>
        </div>
      </div>

      {/* Quick Access */}
      <div className="card p-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={openChatbot}
            className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg hover:shadow-lg transition-all text-left w-full"
          >
            <span className="font-medium text-gray-900 dark:text-white">AI Chat</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <a href="/pricing" className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg hover:shadow-lg transition-all">
            <span className="font-medium text-gray-900 dark:text-white">Browse Packs</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </a>
          <a href="/resources" className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg hover:shadow-lg transition-all">
            <span className="font-medium text-gray-900 dark:text-white">Downloads</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </a>
        </div>
      </div>

      <ReferralCard />
    </div>
  )
}
