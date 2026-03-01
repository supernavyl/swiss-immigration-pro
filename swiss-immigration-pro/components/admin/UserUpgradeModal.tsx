 'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Crown, Calendar, AlertCircle, CheckCircle } from 'lucide-react'
import { PRICING_PACKS } from '@/lib/pricing'

interface UserUpgradeModalProps {
  user: {
    id: string
    email: string
    full_name: string | null
    pack_id: string
    pack_expires_at: string | null
  }
  onClose: () => void
  onUpgrade: (userId: string, packId: string, expiresAt: string | null) => Promise<void>
}

export default function UserUpgradeModal({ user, onClose, onUpgrade }: UserUpgradeModalProps) {
  const [selectedPack, setSelectedPack] = useState(user.pack_id)
  const [expirationDays, setExpirationDays] = useState<number | null>(null)
  const [customDate, setCustomDate] = useState<string>('')
  const [expirationType, setExpirationType] = useState<'never' | 'days' | 'custom'>('never')
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async () => {
    setLoading(true)
    try {
      let expiresAt: string | null = null

      if (expirationType === 'days' && expirationDays) {
        const date = new Date()
        date.setDate(date.getDate() + expirationDays)
        expiresAt = date.toISOString()
      } else if (expirationType === 'custom' && customDate) {
        expiresAt = new Date(customDate).toISOString()
      }

      await onUpgrade(user.id, selectedPack, expiresAt)
      onClose()
    } catch (error) {
      console.error('Error upgrading user:', error)
    } finally {
      setLoading(false)
    }
  }

  const selectedPackInfo = PRICING_PACKS[selectedPack as keyof typeof PRICING_PACKS]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <Crown className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Upgrade User Pack
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {user.email} • Current: {user.pack_id.toUpperCase()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Pack Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Select Masterclass Pack
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(PRICING_PACKS).map(([packId, pack]) => (
                <button
                  key={packId}
                  onClick={() => setSelectedPack(packId)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedPack === packId
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                      : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-900 dark:text-white">{pack.name}</h3>
                    {selectedPack === packId && (
                      <CheckCircle className="w-5 h-5 text-purple-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {pack.features[0]}
                  </p>
                  <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                    CHF {pack.price.toFixed(2)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Expiration Options */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Pack Expiration
            </label>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                <input
                  type="radio"
                  name="expiration"
                  value="never"
                  checked={expirationType === 'never'}
                  onChange={() => setExpirationType('never')}
                  className="w-4 h-4 text-purple-600"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">Never Expires</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Permanent access</div>
                </div>
              </label>

              <label className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                <input
                  type="radio"
                  name="expiration"
                  value="days"
                  checked={expirationType === 'days'}
                  onChange={() => setExpirationType('days')}
                  className="w-4 h-4 text-purple-600"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">Expires in Days</div>
                  {expirationType === 'days' && (
                    <input
                      type="number"
                      min="1"
                      value={expirationDays || ''}
                      onChange={(e) => setExpirationDays(parseInt(e.target.value) || null)}
                      placeholder="Number of days"
                      className="mt-2 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  )}
                </div>
              </label>

              <label className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                <input
                  type="radio"
                  name="expiration"
                  value="custom"
                  checked={expirationType === 'custom'}
                  onChange={() => setExpirationType('custom')}
                  className="w-4 h-4 text-purple-600"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">Custom Date</div>
                  {expirationType === 'custom' && (
                    <input
                      type="date"
                      value={customDate}
                      onChange={(e) => setCustomDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="mt-2 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Current Status */}
          {user.pack_expires_at && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <span className="font-semibold text-yellow-800 dark:text-yellow-300">
                  Current Expiration
                </span>
              </div>
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                {new Date(user.pack_expires_at).toLocaleDateString()} at{' '}
                {new Date(user.pack_expires_at).toLocaleTimeString()}
              </p>
            </div>
          )}

          {/* Summary */}
          <div className="p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-800">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Upgrade Summary</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">New Pack:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {selectedPackInfo?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Expiration:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {expirationType === 'never'
                    ? 'Never'
                    : expirationType === 'days'
                    ? `${expirationDays} days`
                    : customDate
                    ? new Date(customDate).toLocaleDateString()
                    : 'Not set'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 p-6 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUpgrade}
            disabled={loading || selectedPack === user.pack_id}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Upgrading...</span>
              </>
            ) : (
              <>
                <Crown className="w-4 h-4" />
                <span>Upgrade User</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

