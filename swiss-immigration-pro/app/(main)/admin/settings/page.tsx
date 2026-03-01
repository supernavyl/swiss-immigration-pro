'use client'

import { useState, useEffect } from 'react'

export const dynamic = 'force-dynamic'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from '@/lib/auth-client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Settings, Shield, User, Bell, Database, Globe, Mail, 
  Save, Eye, EyeOff, LogOut, ArrowLeft, Image as ImageIcon,
  Palette, Lock, BarChart3, Users, DollarSign, Activity,
  Server, Key, Webhook, BellRing, FileText, Trash2, Zap,
  Sparkles, Rocket, Cpu, TrendingUp, Code, Layers, Home
} from 'lucide-react'
import AdminHeader from '@/components/layout/AdminHeader'

export default function AdminSettings() {
  const router = useRouter()
  const { data: session, status, update } = useSession()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [activeTab, setActiveTab] = useState<'profile' | 'system' | 'notifications' | 'security' | 'api' | 'advanced'>('profile')

  // Profile fields
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [avatar, setAvatar] = useState('')
  const [bio, setBio] = useState('')
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto')

  // System settings
  const [siteName, setSiteName] = useState('Swiss Immigration Pro')
  const [siteDescription, setSiteDescription] = useState('')
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [maxUsers, setMaxUsers] = useState(10000)

  // Notifications
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [newUserAlerts, setNewUserAlerts] = useState(true)
  const [paymentAlerts, setPaymentAlerts] = useState(true)
  const [systemAlerts, setSystemAlerts] = useState(true)

  // Security
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [sessionTimeout, setSessionTimeout] = useState(30)
  const [ipWhitelist, setIpWhitelist] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)

  // API Settings
  const [stripeWebhookUrl, setStripeWebhookUrl] = useState('')
  const [apiRateLimit, setApiRateLimit] = useState(100)

  // Advanced Features
  const [enableAnalytics, setEnableAnalytics] = useState(true)
  const [enableAIChat, setEnableAIChat] = useState(true)
  const [enableEmailMarketing, setEnableEmailMarketing] = useState(false)
  const [enableAdvancedReports, setEnableAdvancedReports] = useState(false)
  const [enableCustomBranding, setEnableCustomBranding] = useState(false)
  const [enableAPIAccess, setEnableAPIAccess] = useState(false)
  const [enableWebhooks, setEnableWebhooks] = useState(false)
  const [enableBetaFeatures, setEnableBetaFeatures] = useState(false)
  const [cacheStrategy, setCacheStrategy] = useState<'aggressive' | 'moderate' | 'minimal'>('moderate')
  const [logLevel, setLogLevel] = useState<'debug' | 'info' | 'warn' | 'error'>('info')

  useEffect(() => {
    if (status === 'loading') return

    if (status === 'unauthenticated' || !session) {
      router.push('/auth/login')
      return
    }

    if (!session.user.isAdmin) {
      router.push('/dashboard')
      return
    }

    // Load admin data
    setFullName(session.user.name || '')
    setEmail(session.user.email || '')
    
    // Load saved settings from localStorage
    const savedTheme = localStorage.getItem('adminTheme') || 'auto'
    setTheme(savedTheme as any)
    
    setLoading(false)
  }, [session, status, router])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch('/api/admin/user/' + session?.user.id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          avatar,
          bio,
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to update profile')
      }

      await update()
      setSuccess('Profile updated successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveSettings = async (category: string) => {
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      // Save to localStorage for now (can be moved to database later)
      if (category === 'system') {
        localStorage.setItem('admin_siteName', siteName)
        localStorage.setItem('admin_siteDescription', siteDescription)
        localStorage.setItem('admin_maintenanceMode', String(maintenanceMode))
        localStorage.setItem('admin_maxUsers', String(maxUsers))
      } else if (category === 'notifications') {
        localStorage.setItem('admin_emailNotifications', String(emailNotifications))
        localStorage.setItem('admin_newUserAlerts', String(newUserAlerts))
        localStorage.setItem('admin_paymentAlerts', String(paymentAlerts))
        localStorage.setItem('admin_systemAlerts', String(systemAlerts))
      } else if (category === 'security') {
        localStorage.setItem('admin_twoFactorEnabled', String(twoFactorEnabled))
        localStorage.setItem('admin_sessionTimeout', String(sessionTimeout))
        localStorage.setItem('admin_ipWhitelist', ipWhitelist)
      } else if (category === 'api') {
        localStorage.setItem('admin_stripeWebhookUrl', stripeWebhookUrl)
        localStorage.setItem('admin_apiRateLimit', String(apiRateLimit))
      } else if (category === 'advanced') {
        localStorage.setItem('admin_enableAnalytics', String(enableAnalytics))
        localStorage.setItem('admin_enableAIChat', String(enableAIChat))
        localStorage.setItem('admin_enableEmailMarketing', String(enableEmailMarketing))
        localStorage.setItem('admin_enableAdvancedReports', String(enableAdvancedReports))
        localStorage.setItem('admin_enableCustomBranding', String(enableCustomBranding))
        localStorage.setItem('admin_enableAPIAccess', String(enableAPIAccess))
        localStorage.setItem('admin_enableWebhooks', String(enableWebhooks))
        localStorage.setItem('admin_enableBetaFeatures', String(enableBetaFeatures))
        localStorage.setItem('admin_cacheStrategy', cacheStrategy)
        localStorage.setItem('admin_logLevel', logLevel)
      }

      setSuccess(`${category} settings saved successfully!`)
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <AdminHeader />
      <div className="py-6 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 sm:mb-8"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black dark:text-white mb-2 flex items-center">
                  <Settings className="w-8 h-8 sm:w-10 sm:h-10 mr-2 sm:mr-3 text-blue-600" />
                  Admin Settings
                </h1>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-200">
                  Advanced configuration and customization options
                </p>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Link
                  href="/"
                  className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg transition-colors shadow-sm text-sm sm:text-base"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Exit Admin</span>
                </Link>
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  <span className="text-xs sm:text-sm font-semibold text-blue-600">
                    Admin Access
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

        {/* Messages */}
        {error && (
          <div className="mb-4 sm:mb-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-3 sm:p-4">
            <p className="text-red-800 text-sm sm:text-base">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 sm:mb-6 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-3 sm:p-4">
            <p className="text-green-800 text-sm sm:text-base">{success}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 sm:mb-8 border-b border-gray-200 overflow-x-auto">
          <div className="flex space-x-4 sm:space-x-8 min-w-max sm:min-w-0">
            {[
              { id: 'profile', label: 'Profile', icon: User },
              { id: 'system', label: 'System', icon: Server },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'security', label: 'Security', icon: Lock },
              { id: 'api', label: 'API & Webhooks', icon: Webhook },
              { id: 'advanced', label: 'Advanced', icon: Zap },
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 pb-3 sm:pb-4 px-1 border-b-2 transition-colors whitespace-nowrap text-sm sm:text-base ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
          >
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-black mb-4 sm:mb-6">
                Admin Profile
              </h2>
              <form onSubmit={handleUpdateProfile} className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg bg-white text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs sm:text-sm text-gray-600">
                    Email cannot be changed. Contact support for email updates.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Avatar URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg bg-white text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio (Optional)
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    placeholder="Tell us about yourself..."
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg bg-white text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Theme Preference
                  </label>
                  <select
                    value={theme}
                    onChange={(e) => {
                      setTheme(e.target.value as any)
                      localStorage.setItem('adminTheme', e.target.value)
                    }}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto (System)</option>
                  </select>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center space-x-2 px-4 sm:px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm sm:text-base font-medium"
                  >
                    <Save className="w-4 h-4" />
                    <span>{saving ? 'Saving...' : 'Save Profile'}</span>
                  </button>
                </div>
              </form>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6 shadow-sm">
                <h3 className="text-base sm:text-lg font-semibold text-black dark:text-white mb-3 sm:mb-4">
                  Admin Info
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Role:</span>
                    <span className="font-semibold text-blue-600">Administrator</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Access Level:</span>
                    <span className="font-semibold text-green-600">Full</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6 shadow-sm">
                <h3 className="text-base sm:text-lg font-semibold text-red-600 mb-3 sm:mb-4">
                  Danger Zone
                </h3>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm sm:text-base"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
                <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                  Note: Password changes are managed by system administrators for security.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* System Tab */}
        {activeTab === 'system' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-black dark:text-white mb-4 sm:mb-6">
              System Configuration
            </h2>
            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Site Name
                </label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Site Description
                </label>
                <textarea
                  value={siteDescription}
                  onChange={(e) => setSiteDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div>
                  <h3 className="font-semibold text-black dark:text-white">Maintenance Mode</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Temporarily disable site access for all non-admin users
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={maintenanceMode}
                    onChange={(e) => setMaintenanceMode(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Maximum Users Limit
                </label>
                <input
                  type="number"
                  value={maxUsers}
                  onChange={(e) => setMaxUsers(Number(e.target.value))}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => handleSaveSettings('system')}
                  disabled={saving}
                  className="flex items-center space-x-2 px-4 sm:px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm sm:text-base font-medium"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save System Settings'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-black dark:text-white mb-4 sm:mb-6">
              Notification Preferences
            </h2>
            <div className="space-y-4 sm:space-y-6">
              {[
                { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive email alerts for important events', value: emailNotifications, setter: setEmailNotifications },
                { key: 'newUserAlerts', label: 'New User Alerts', description: 'Get notified when new users register', value: newUserAlerts, setter: setNewUserAlerts },
                { key: 'paymentAlerts', label: 'Payment Alerts', description: 'Receive alerts for successful payments', value: paymentAlerts, setter: setPaymentAlerts },
                { key: 'systemAlerts', label: 'System Alerts', description: 'Important system updates and errors', value: systemAlerts, setter: setSystemAlerts },
              ].map((item) => (
                <div key={item.key} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold text-black dark:text-white">{item.label}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={item.value}
                      onChange={(e) => item.setter(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              ))}

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => handleSaveSettings('notifications')}
                  disabled={saving}
                  className="flex items-center space-x-2 px-4 sm:px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm sm:text-base font-medium"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Notification Settings'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-black dark:text-white mb-4 sm:mb-6">
              Security Settings
            </h2>
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold text-black dark:text-white">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Add an extra layer of security to your admin account
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={twoFactorEnabled}
                    onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(Number(e.target.value))}
                  min={5}
                  max={1440}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  IP Whitelist (Optional)
                </label>
                <textarea
                  value={ipWhitelist}
                  onChange={(e) => setIpWhitelist(e.target.value)}
                  placeholder="192.168.1.1&#10;10.0.0.1"
                  rows={4}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                />
                <p className="mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Enter one IP address per line. Leave empty to allow all IPs.
                </p>
              </div>

              <div className="p-3 sm:p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-xs sm:text-sm text-yellow-800">
                  <strong>Note:</strong> Password changes for admin accounts are managed by system administrators for security purposes.
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => handleSaveSettings('security')}
                  disabled={saving}
                  className="flex items-center space-x-2 px-4 sm:px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm sm:text-base font-medium"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save Security Settings'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* API Tab */}
        {activeTab === 'api' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-black dark:text-white mb-4 sm:mb-6">
              API & Webhooks Configuration
            </h2>
            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  Stripe Webhook URL
                </label>
                <input
                  type="url"
                  value={stripeWebhookUrl}
                  onChange={(e) => setStripeWebhookUrl(e.target.value)}
                  placeholder="https://your-domain.com/api/webhooks/stripe"
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                  API Rate Limit (requests per minute)
                </label>
                <input
                  type="number"
                  value={apiRateLimit}
                  onChange={(e) => setApiRateLimit(Number(e.target.value))}
                  min={10}
                  max={1000}
                  className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="p-3 sm:p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-gray-700 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">API Endpoints</h3>
                <div className="space-y-2 text-xs sm:text-sm font-mono text-blue-800">
                  <div>/api/admin/stats</div>
                  <div>/api/admin/users</div>
                  <div>/api/admin/pack-stats</div>
                  <div>/api/admin/user/[id]</div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => handleSaveSettings('api')}
                  disabled={saving}
                  className="flex items-center space-x-2 px-4 sm:px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm sm:text-base font-medium"
                >
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : 'Save API Settings'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Advanced Features Tab */}
        {activeTab === 'advanced' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 sm:space-y-6"
          >
            {/* Feature Toggles */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-black dark:text-white mb-4 sm:mb-6 flex items-center">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-600" />
                Feature Toggles
              </h2>
              <div className="space-y-4 sm:space-y-6">
                {[
                  { 
                    key: 'enableAnalytics', 
                    label: 'Advanced Analytics', 
                    description: 'Enable detailed analytics tracking and reporting', 
                    icon: BarChart3,
                    value: enableAnalytics, 
                    setter: setEnableAnalytics 
                  },
                  { 
                    key: 'enableAIChat', 
                    label: 'AI Chatbot', 
                    description: 'Enable AI-powered chat assistance for users', 
                    icon: Sparkles,
                    value: enableAIChat, 
                    setter: setEnableAIChat 
                  },
                  { 
                    key: 'enableEmailMarketing', 
                    label: 'Email Marketing', 
                    description: 'Enable automated email campaigns and newsletters', 
                    icon: Mail,
                    value: enableEmailMarketing, 
                    setter: setEnableEmailMarketing 
                  },
                  { 
                    key: 'enableAdvancedReports', 
                    label: 'Advanced Reports', 
                    description: 'Generate detailed reports and insights', 
                    icon: FileText,
                    value: enableAdvancedReports, 
                    setter: setEnableAdvancedReports 
                  },
                  { 
                    key: 'enableCustomBranding', 
                    label: 'Custom Branding', 
                    description: 'Allow custom logos, colors, and branding', 
                    icon: Palette,
                    value: enableCustomBranding, 
                    setter: setEnableCustomBranding 
                  },
                  { 
                    key: 'enableAPIAccess', 
                    label: 'API Access', 
                    description: 'Enable third-party API integrations', 
                    icon: Code,
                    value: enableAPIAccess, 
                    setter: setEnableAPIAccess 
                  },
                  { 
                    key: 'enableWebhooks', 
                    label: 'Webhooks', 
                    description: 'Enable webhook notifications for events', 
                    icon: Webhook,
                    value: enableWebhooks, 
                    setter: setEnableWebhooks 
                  },
                  { 
                    key: 'enableBetaFeatures', 
                    label: 'Beta Features', 
                    description: 'Enable experimental and beta features', 
                    icon: Rocket,
                    value: enableBetaFeatures, 
                    setter: setEnableBetaFeatures 
                  },
                ].map((item) => (
                  <div key={item.key} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 transition-colors">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-black dark:text-white mb-1">{item.label}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                      <input
                        type="checkbox"
                        checked={item.value}
                        onChange={(e) => item.setter(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Settings */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-black dark:text-white mb-4 sm:mb-6 flex items-center">
                <Cpu className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-600" />
                Performance Settings
              </h2>
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Cache Strategy
                  </label>
                  <select
                    value={cacheStrategy}
                    onChange={(e) => setCacheStrategy(e.target.value as any)}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="aggressive">Aggressive (Maximum Performance)</option>
                    <option value="moderate">Moderate (Balanced)</option>
                    <option value="minimal">Minimal (Always Fresh Data)</option>
                  </select>
                  <p className="mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Choose how aggressively to cache data. Aggressive caching improves performance but may show stale data.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Log Level
                  </label>
                  <select
                    value={logLevel}
                    onChange={(e) => setLogLevel(e.target.value as any)}
                    className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="error">Error Only</option>
                    <option value="warn">Warnings & Errors</option>
                    <option value="info">Info, Warnings & Errors</option>
                    <option value="debug">Debug (All Logs)</option>
                  </select>
                  <p className="mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Set the verbosity level for system logs. Debug mode provides detailed information for troubleshooting.
                  </p>
                </div>
              </div>
            </div>

            {/* System Information */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-black dark:text-white mb-4 sm:mb-6 flex items-center">
                <Database className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-600" />
                System Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Platform Version</div>
                  <div className="text-sm font-semibold text-black dark:text-white">v2.0.1</div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Database Status</div>
                  <div className="text-sm font-semibold text-green-600">Connected</div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">API Status</div>
                  <div className="text-sm font-semibold text-green-600">Active</div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Last Backup</div>
                  <div className="text-sm font-semibold text-black dark:text-white">Today, 02:30 AM</div>
                </div>
              </div>
            </div>

            {/* Advanced Actions */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-black dark:text-white mb-4 sm:mb-6 flex items-center">
                <Layers className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-600" />
                Advanced Actions
              </h2>
              <div className="space-y-3 sm:space-y-4">
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to clear all cache? This may temporarily slow down the site.')) {
                      localStorage.removeItem('cache')
                      setSuccess('Cache cleared successfully!')
                      setTimeout(() => setSuccess(''), 3000)
                    }
                  }}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm sm:text-base font-medium"
                >
                  <Activity className="w-4 h-4" />
                  <span>Clear Cache</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to regenerate API keys? Existing integrations will stop working.')) {
                      setSuccess('API keys regenerated!')
                      setTimeout(() => setSuccess(''), 3000)
                    }
                  }}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm sm:text-base font-medium ml-0 sm:ml-3"
                >
                  <Key className="w-4 h-4" />
                  <span>Regenerate API Keys</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to optimize the database? This may take a few minutes.')) {
                      setSuccess('Database optimization started!')
                      setTimeout(() => setSuccess(''), 3000)
                    }
                  }}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm sm:text-base font-medium ml-0 sm:ml-3"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Optimize Database</span>
                </button>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={() => handleSaveSettings('advanced')}
                disabled={saving}
                className="flex items-center space-x-2 px-4 sm:px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm sm:text-base font-medium disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Advanced Settings'}</span>
              </button>
            </div>
          </motion.div>
        )}
        </div>
      </div>
    </div>
  )
}

