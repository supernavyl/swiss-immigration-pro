'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/lib/auth-client'
import { motion } from 'framer-motion'
import { 
  Users, DollarSign, TrendingUp, Settings, Crown, Shield, Activity, 
  Search, Edit, Eye, Package, BarChart3, FileText, Download, 
  Calendar, CreditCard, MessageSquare, UserCheck, UserX, RefreshCw, Clock,
  ArrowUpDown, Filter, TrendingDown, Sparkles, Zap, Target, ArrowLeft, Home,
  Mail, Trash2, CheckSquare, Square, Send, List, AlertCircle, CheckCircle2,
  XCircle, FileSpreadsheet, UserPlus, Ban, Unlock, History, Bell
} from 'lucide-react'
import Link from 'next/link'
import { getModulesForPack } from '@/lib/content/pack-content'
import { PRICING_PACKS } from '@/lib/pricing'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import UserUpgradeModal from '@/components/admin/UserUpgradeModal'
import AdminHeader from '@/components/layout/AdminHeader'
import { useToast } from '@/components/providers/ToastProvider'
import { api, ApiError } from '@/lib/api'

interface AdminUser {
  id: string
  email: string
  full_name: string | null
  pack_id: string
  is_admin: boolean
}

interface User extends AdminUser {
  pack_expires_at: string | null
  created_at: string
  subscription_count: number
  payment_count: number
  total_spent: number
}

interface PackStats {
  pack_id: string
  user_count: number
  active_count: number
  expired_count: number
}

interface AdminAnalytics {
  revenueByMonth?: Array<{ month: string; revenue: number }>
  userGrowth?: Array<{ month: string; users: number }>
  revenueByPack?: Array<{ packId: string; revenue: number }>
  dailyActiveUsers?: Array<{ date: string; users: number }>
  topUsers?: Array<{ id: string; fullName?: string; email: string; messageCount: number; totalSpent: number }>
  moduleStats?: Array<{ moduleId: string; totalUsers: number; completedUsers: number; avgProgress: number }>
}

interface AdminPayment {
  id: string
  created_at: string
  user_email?: string
  pack_id?: string
  amount: number
  status: string
  stripe_payment_id?: string
}

interface ActivityLog {
  type: string
  action: string
  description?: string
  user_email?: string
  created_at: string
}

interface AdminStats {
  totalUsers: number
  totalRevenue: number
  monthlyRevenue: number
  activeSubscriptions: number
  messageCount: number
  totalPurchases: number
  recentSignups: number
  usersByPack: Array<{ packId: string; count: number }>
}

export default function AdminDashboard() {
  const router = useRouter()
  const { showToast } = useToast()
  const { data: session, status } = useSession()
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'stats' | 'content' | 'payments' | 'tools' | 'activity'>('overview')
  const [searchQuery, setSearchQuery] = useState('')
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    activeSubscriptions: 0,
    messageCount: 0,
    totalPurchases: 0,
    recentSignups: 0,
    usersByPack: [] as { packId: string; count: number }[],
  })

  const [users, setUsers] = useState<User[]>([])
  const [packStats, setPackStats] = useState<PackStats[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [upgradeUser, setUpgradeUser] = useState<User | null>(null)
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null)
  const [sortBy, setSortBy] = useState<'name' | 'email' | 'pack' | 'spent' | 'date'>('date')
  const [filterPack, setFilterPack] = useState<string>('all')
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set())
  const [payments, setPayments] = useState<AdminPayment[]>([])
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([])
  const [emailModal, setEmailModal] = useState(false)
  const [emailRecipients, setEmailRecipients] = useState<string[]>([])
  const [emailSubject, setEmailSubject] = useState('')
  const [emailBody, setEmailBody] = useState('')
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' })
  const [paymentFilter, setPaymentFilter] = useState<string>('all')

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

    const userData = {
      id: session.user.id,
      email: session.user.email,
      full_name: session.user.name ?? null,
      pack_id: session.user.packId || 'free',
      is_admin: session.user.isAdmin || false,
    }

    setUser(userData)
    loadData()
    setLoading(false)
  }, [session, status, router])

  const loadData = async () => {
    await Promise.all([
      loadStats(),
      loadUsers(),
      loadPackStats(),
      loadAnalytics(),
      loadPayments(),
      loadActivityLogs(),
    ])
  }

  const loadAnalytics = async () => {
    try {
      const data = await api.get<AdminAnalytics>('/api/admin/analytics', { cache: 'no-store' })
      setAnalytics(data)
    } catch (error) {
      console.error('Error loading analytics:', error instanceof ApiError ? error.detail : error)
    }
  }

  const loadStats = async () => {
    try {
      const data = await api.get<AdminStats>('/api/admin/stats', { cache: 'no-store' })
      setStats(data)
    } catch (error) {
      console.error('Error loading stats:', error instanceof ApiError ? error.detail : error)
    }
  }

  const loadUsers = async () => {
    try {
      const data = await api.get<User[]>('/api/admin/users', { cache: 'no-store' })
      setUsers(data)
    } catch (error) {
      console.error('Error loading users:', error instanceof ApiError ? error.detail : error)
    }
  }

  const loadPackStats = async () => {
    try {
      const data = await api.get<{ packStats?: PackStats[] }>('/api/admin/pack-stats', { cache: 'no-store' })
      setPackStats(data.packStats || [])
    } catch (error) {
      console.error('Error loading pack stats:', error instanceof ApiError ? error.detail : error)
    }
  }

  const loadPayments = async () => {
    try {
      const data = await api.get<{ payments?: AdminPayment[] }>('/api/admin/payments', { cache: 'no-store' })
      setPayments(data.payments || [])
    } catch (error) {
      console.error('Error loading payments:', error instanceof ApiError ? error.detail : error)
    }
  }

  const loadActivityLogs = async () => {
    try {
      const data = await api.get<{ logs?: ActivityLog[] }>('/api/admin/activity-logs', { cache: 'no-store' })
      setActivityLogs(data.logs || [])
    } catch (error) {
      console.error('Error loading activity logs:', error instanceof ApiError ? error.detail : error)
    }
  }

  const exportUsersToCSV = () => {
    const headers = ['Email', 'Full Name', 'Pack', 'Total Spent (CHF)', 'Purchases', 'Join Date', 'Admin']
    const rows = filteredUsers.map(user => [
      user.email,
      user.full_name || '',
      user.pack_id,
      (user.total_spent / 100).toFixed(2),
      user.payment_count || 0,
      new Date(user.created_at).toLocaleDateString(),
      user.is_admin ? 'Yes' : 'No'
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `users_export_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleBulkPackChange = async (newPackId: string) => {
    if (selectedUsers.size === 0) {
      showToast('Please select at least one user', 'warning')
      return
    }

    if (!confirm(`Change pack to ${newPackId} for ${selectedUsers.size} selected users?`)) {
      return
    }

    try {
      await Promise.all(
        Array.from(selectedUsers).map(userId =>
          api.put(`/api/admin/user/${userId}`, { packId: newPackId })
        )
      )
      setSelectedUsers(new Set())
      await loadUsers()
      await loadStats()
      showToast(`Successfully updated ${selectedUsers.size} users`, 'success')
    } catch (error) {
      console.error('Error updating users:', error instanceof ApiError ? error.detail : error)
      showToast('Failed to update users. Please try again.', 'error')
    }
  }

  const toggleUserSelection = (userId: string) => {
    const newSelection = new Set(selectedUsers)
    if (newSelection.has(userId)) {
      newSelection.delete(userId)
    } else {
      newSelection.add(userId)
    }
    setSelectedUsers(newSelection)
  }

  const toggleSelectAll = () => {
    if (selectedUsers.size === filteredUsers.length) {
      setSelectedUsers(new Set())
    } else {
      setSelectedUsers(new Set(filteredUsers.map(u => u.id)))
    }
  }

  const sendEmailToUsers = async () => {
    if (!emailSubject || !emailBody) {
      showToast('Please fill in both subject and body', 'warning')
      return
    }

    if (emailRecipients.length === 0) {
      showToast('Please select at least one recipient', 'warning')
      return
    }

    try {
      await api.post('/api/admin/send-email', {
        recipients: emailRecipients,
        subject: emailSubject,
        body: emailBody,
      })
      showToast(`Email sent to ${emailRecipients.length} users`, 'success')
      setEmailModal(false)
      setEmailSubject('')
      setEmailBody('')
      setEmailRecipients([])
    } catch (error) {
      console.error('Error sending email:', error instanceof ApiError ? error.detail : error)
      showToast('Failed to send email. Please try again.', 'error')
    }
  }

  const handleUpdateUserPack = async (userId: string, newPackId: string, expiresAt: string | null = null) => {
    try {
      await api.put(`/api/admin/user/${userId}`, {
        packId: newPackId,
        packExpiresAt: expiresAt,
      })
      await Promise.all([loadUsers(), loadStats()])
      setUpgradeUser(null)
    } catch (error) {
      console.error('Error updating user pack:', error instanceof ApiError ? error.detail : error)
      showToast(
        error instanceof Error
          ? error.message
          : 'Failed to update user pack. Please try again.',
        'error'
      )
    }
  }

  const filteredUsers = users
    .filter(u => 
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.full_name && u.full_name.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .filter(u => filterPack === 'all' || u.pack_id === filterPack)
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.full_name || '').localeCompare(b.full_name || '')
        case 'email':
          return a.email.localeCompare(b.email)
        case 'pack':
          return a.pack_id.localeCompare(b.pack_id)
        case 'spent':
          return b.total_spent - a.total_spent
        case 'date':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

      const allPackContent = ['free', 'immigration', 'advanced', 'citizenship'].map(packId => ({
      packId,
      packName: PRICING_PACKS[packId as keyof typeof PRICING_PACKS]?.name || packId,
      modules: getModulesForPack(packId),
    }))

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <AdminHeader />
      <div className="py-6 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black dark:text-white mb-2">
              <Shield className="inline-block w-8 h-8 sm:w-10 sm:h-10 mr-2 sm:mr-3 text-blue-600" />
              Admin Dashboard
            </h1>
            <p className="text-sm sm:text-base text-gray-700 dark:text-gray-200">
              Full control panel - Manage users, content, and statistics
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <Link
              href="/"
              className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg transition-colors shadow-sm text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Exit Admin</span>
            </Link>
            <Link
              href="/admin/settings"
              className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm text-sm sm:text-base"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>
            <button
              onClick={loadData}
              className="flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm sm:text-base"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 sm:mb-8 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          <div className="flex space-x-4 sm:space-x-8 min-w-max sm:min-w-0">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'users', label: 'Clients', icon: Users },
              { id: 'stats', label: 'Statistics', icon: TrendingUp },
              { id: 'payments', label: 'Payments', icon: CreditCard },
              { id: 'activity', label: 'Activity', icon: History },
              { id: 'tools', label: 'Tools', icon: Settings },
              { id: 'content', label: 'Content', icon: FileText },
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 pb-4 px-1 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {[
                {
                  title: 'Total Users',
                  value: stats.totalUsers,
                  icon: Users,
                  color: 'text-blue-600',
                  bg: 'bg-blue-50',
                  subtitle: `${stats.recentSignups} new this week`,
                },
                {
                  title: 'Total Revenue',
                  value: `CHF ${stats.totalRevenue.toFixed(2)}`,
                  icon: DollarSign,
                  color: 'text-green-600',
                  bg: 'bg-green-50',
                  subtitle: `CHF ${stats.monthlyRevenue.toFixed(2)} this month`,
                },
                {
                  title: 'Active Subscriptions',
                  value: stats.activeSubscriptions,
                  icon: Crown,
                  color: 'text-blue-600',
                  bg: 'bg-blue-50',
                  subtitle: `${stats.totalPurchases} total purchases`,
                },
                {
                  title: 'AI Messages',
                  value: stats.messageCount,
                  icon: Activity,
                  color: 'text-blue-600',
                  bg: 'bg-blue-50',
                  subtitle: 'All time messages',
                },
              ].map((stat) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg ${stat.bg} dark:bg-blue-900/30 flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-black dark:text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-700 mb-1">
                    {stat.title}
                  </div>
                  <div className="text-xs text-gray-600">
                    {stat.subtitle}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Users by Pack */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {stats.usersByPack.map((pack) => (
                <div key={pack.packId} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <Crown className="w-8 h-8 text-blue-600" />
                    <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {pack.packId.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-3xl font-bold text-black dark:text-white mb-1">
                    {pack.count}
                  </div>
<div className="text-sm text-gray-700 dark:text-gray-200">
                  Users
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Search & Filters */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 sm:p-4 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users by email or name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-black focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={filterPack}
                    onChange={(e) => setFilterPack(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-black focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Packs</option>
                    <option value="free">Free</option>
                    <option value="immigration">Immigration</option>
                    <option value="advanced">Advanced</option>
                    <option value="citizenship">Citizenship Pro</option>
                  </select>
                </div>
                <div className="relative">
                  <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-black focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="name">Sort by Name</option>
                    <option value="email">Sort by Email</option>
                    <option value="pack">Sort by Pack</option>
                    <option value="spent">Sort by Spent</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-black dark:text-white">
                  All Clients ({filteredUsers.length})
                </h2>
                {selectedUsers.size > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-700">{selectedUsers.size} selected</span>
                    <select
                      onChange={(e) => handleBulkPackChange(e.target.value)}
                      className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white text-sm"
                      defaultValue=""
                    >
                      <option value="" disabled>Bulk Change Pack</option>
                      <option value="free">Free</option>
                      <option value="immigration">Immigration</option>
                      <option value="advanced">Advanced</option>
                      <option value="citizenship">Citizenship Pro</option>
                    </select>
                    <button
                      onClick={() => setSelectedUsers(new Set())}
                      className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-sm"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="w-full text-xs sm:text-sm min-w-[800px]">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-gray-700 dark:text-gray-200 font-semibold">
                        <button
                          onClick={toggleSelectAll}
                          className="flex items-center"
                        >
                          {selectedUsers.size === filteredUsers.length && filteredUsers.length > 0 ? (
                            <CheckSquare className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Square className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-gray-700 dark:text-gray-200 font-semibold">Email</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-gray-700 font-semibold hidden sm:table-cell">Name</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-gray-700 dark:text-gray-200 font-semibold">Pack</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-gray-700 font-semibold hidden md:table-cell">Purchases</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-gray-700 font-semibold hidden lg:table-cell">Spent</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-gray-700 font-semibold hidden xl:table-cell">Joined</th>
                      <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-gray-700 dark:text-gray-200 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-2 sm:px-4 py-2 sm:py-3">
                          <button
                            onClick={() => toggleUserSelection(user.id)}
                            className="flex items-center"
                          >
                            {selectedUsers.has(user.id) ? (
                              <CheckSquare className="w-4 h-4 text-blue-600" />
                            ) : (
                              <Square className="w-4 h-4 text-gray-400" />
                            )}
                          </button>
                        </td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-black dark:text-white">
                          <div className="flex items-center space-x-2">
                            {user.is_admin && <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />}
                            <span className="truncate max-w-[150px] sm:max-w-none">{user.email}</span>
                          </div>
                          <div className="sm:hidden text-xs text-gray-500 dark:text-gray-400 mt-1">{user.full_name || '—'}</div>
                        </td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-700 hidden sm:table-cell">
                          {user.full_name || '—'}
                        </td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3">
                          <select
                            value={user.pack_id}
                            onChange={(e) => handleUpdateUserPack(user.id, e.target.value)}
                            className="text-xs px-1.5 sm:px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-black dark:text-white w-full sm:w-auto"
                          >
                            <option value="free">Free</option>
                            <option value="immigration">Immigration</option>
                            <option value="advanced">Advanced</option>
                            <option value="citizenship">Citizenship Pro</option>
                          </select>
                        </td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-700 dark:text-gray-200 hidden md:table-cell">
                          {user.payment_count || 0}
                        </td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-700 dark:text-gray-200 hidden lg:table-cell">
                          CHF {(user.total_spent / 100).toFixed(2)}
                        </td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-gray-700 dark:text-gray-200 hidden xl:table-cell">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3">
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1 sm:gap-2">
                            <button
                              onClick={() => setUpgradeUser(user)}
                              className="px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-all shadow-sm hover:shadow-md flex items-center justify-center space-x-1"
                            >
                              <Crown className="w-3 h-3" />
                              <span className="hidden sm:inline">Upgrade</span>
                            </button>
                            <button
                              onClick={() => setSelectedUser(user)}
                              className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium px-2 py-1"
                            >
                              Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            {/* Pack Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {packStats.map((pack) => (
                <motion.div
                  key={pack.pack_id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-black dark:text-white">
                      {pack.pack_id.toUpperCase()} Pack
                    </h3>
                    <Package className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-200">Total Users:</span>
                      <span className="font-bold text-black dark:text-white">{pack.user_count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-200">Active:</span>
                      <span className="font-semibold text-green-600">{pack.active_count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-700 dark:text-gray-200">Expired:</span>
                      <span className="font-semibold text-red-600">{pack.expired_count}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Additional Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm"
            >
              <h3 className="text-xl font-bold text-black mb-4 flex items-center space-x-2">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                <span>Purchase Statistics</span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-100 dark:border-gray-700">
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.totalPurchases}
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">Total Purchases</div>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-100 dark:border-gray-700">
                  <div className="text-2xl font-bold text-green-600">
                    CHF {stats.totalRevenue.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">Total Revenue</div>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-100 dark:border-gray-700">
                  <div className="text-2xl font-bold text-blue-600">
                    CHF {stats.monthlyRevenue.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">This Month</div>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-100 dark:border-gray-700">
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.activeSubscriptions}
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-200">Active Subs</div>
                </div>
              </div>
            </motion.div>

            {/* Revenue & Growth Charts */}
            {analytics && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Revenue Chart */}
                {analytics.revenueByMonth && analytics.revenueByMonth.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-black dark:text-white flex items-center space-x-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <span>Revenue Trend (12 Months)</span>
                      </h3>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={analytics.revenueByMonth}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="month" 
                          tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short' })}
                          stroke="#6b7280"
                        />
                        <YAxis 
                          tickFormatter={(value) => `CHF ${value}`}
                          stroke="#6b7280"
                        />
                        <Tooltip 
                          formatter={(value: number) => [`CHF ${value.toFixed(2)}`, 'Revenue']}
                          labelFormatter={(label) => new Date(label).toLocaleDateString()}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="#10b981" 
                          strokeWidth={2}
                          dot={{ fill: '#10b981', r: 4 }}
                          name="Revenue"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </motion.div>
                )}

                {/* User Growth Chart */}
                {analytics.userGrowth && analytics.userGrowth.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-black dark:text-white flex items-center space-x-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        <span>User Growth (12 Months)</span>
                      </h3>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={analytics.userGrowth}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="month" 
                          tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short' })}
                          stroke="#6b7280"
                        />
                        <YAxis stroke="#6b7280" />
                        <Tooltip 
                          formatter={(value: number) => [value, 'New Users']}
                          labelFormatter={(label) => new Date(label).toLocaleDateString()}
                        />
                        <Legend />
                        <Bar dataKey="count" fill="#3b82f6" name="New Users" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </motion.div>
                )}
              </div>
            )}

            {/* Revenue by Pack Pie Chart */}
            {analytics && analytics.revenueByPack && analytics.revenueByPack.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm"
              >
                <h3 className="text-lg font-bold text-black mb-4 flex items-center space-x-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  <span>Revenue by Pack</span>
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={analytics.revenueByPack}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ packId, revenue }) => `${packId}: CHF ${(revenue as number).toFixed(2)}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="revenue"
                    >
                      {analytics.revenueByPack.map((_entry, index: number) => {
                        const colors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b']
                        return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      })}
                    </Pie>
                    <Tooltip formatter={(value: number) => `CHF ${value.toFixed(2)}`} />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>
            )}

            {/* Daily Active Users Chart */}
            {analytics && analytics.dailyActiveUsers && analytics.dailyActiveUsers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm"
              >
                <h3 className="text-lg font-bold text-black mb-4 flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <span>Daily Active Users (Last 30 Days)</span>
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.dailyActiveUsers}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      stroke="#6b7280"
                    />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      formatter={(value: number) => [value, 'Active Users']}
                      labelFormatter={(label) => new Date(label).toLocaleDateString()}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#f97316" 
                      strokeWidth={2}
                      dot={{ fill: '#f97316', r: 3 }}
                      name="Active Users"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>
            )}

            {/* Top Users */}
            {analytics && analytics.topUsers && analytics.topUsers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm"
              >
                <h3 className="text-lg font-bold text-black mb-4 flex items-center space-x-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  <span>Top Active Users</span>
                </h3>
                <div className="space-y-3">
                  {analytics.topUsers.slice(0, 10).map((user, idx: number) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center font-bold text-blue-600">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="font-semibold text-black dark:text-white">
                            {user.fullName || user.email}
                          </div>
                          <div className="text-sm text-gray-700 dark:text-gray-200">
                            {user.messageCount} messages • CHF {user.totalSpent.toFixed(2)} spent
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const foundUser = users.find(u => u.id === user.id)
                          if (foundUser) setUpgradeUser(foundUser)
                        }}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors"
                      >
                        Manage
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Module Completion Stats */}
            {analytics && analytics.moduleStats && analytics.moduleStats.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm"
              >
                <h3 className="text-lg font-bold text-black mb-4 flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span>Module Completion Statistics</span>
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="px-4 py-3 text-left text-gray-700 dark:text-gray-200 font-semibold">Module</th>
                        <th className="px-4 py-3 text-left text-gray-700 font-semibold">Total Users</th>
                        <th className="px-4 py-3 text-left text-gray-700 font-semibold">Completed</th>
                        <th className="px-4 py-3 text-left text-gray-700 font-semibold">Avg Progress</th>
                        <th className="px-4 py-3 text-left text-gray-700 font-semibold">Completion Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {analytics.moduleStats.map((module) => {
                        const completionRate = module.totalUsers > 0 
                          ? Math.round((module.completedUsers / module.totalUsers) * 100) 
                          : 0
                        return (
                          <tr key={module.moduleId} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="px-4 py-3 text-black dark:text-white font-medium">
                              {module.moduleId}
                            </td>
                            <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
                              {module.totalUsers}
                            </td>
                            <td className="px-4 py-3">
                              <span className="font-semibold text-green-600">
                                {module.completedUsers}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
                              {module.avgProgress.toFixed(1)}%
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center space-x-2">
                                <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                  <div
                                    className="bg-green-600 h-2 rounded-full transition-all"
                                    style={{ width: `${completionRate}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-semibold text-black dark:text-white w-12 text-right">
                                  {completionRate}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={paymentFilter}
                    onChange={(e) => setPaymentFilter(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Payments</option>
                    <option value="succeeded">Succeeded</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="Start Date"
                  />
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="End Date"
                  />
                </div>
              </div>
            </div>

            {/* Payments Table */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-black dark:text-white mb-4">Payment History</h2>
              <div className="overflow-x-auto">
                {payments.length > 0 ? (
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="px-4 py-3 text-left text-gray-700 font-semibold">Date</th>
                        <th className="px-4 py-3 text-left text-gray-700 font-semibold">User</th>
                        <th className="px-4 py-3 text-left text-gray-700 font-semibold">Pack</th>
                        <th className="px-4 py-3 text-left text-gray-700 font-semibold">Amount</th>
                        <th className="px-4 py-3 text-left text-gray-700 font-semibold">Status</th>
                        <th className="px-4 py-3 text-left text-gray-700 font-semibold">Payment ID</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {payments
                        .filter(p => paymentFilter === 'all' || p.status === paymentFilter)
                        .filter(p => {
                          if (!dateRange.start && !dateRange.end) return true
                          const paymentDate = new Date(p.created_at)
                          if (dateRange.start && paymentDate < new Date(dateRange.start)) return false
                          if (dateRange.end && paymentDate > new Date(dateRange.end)) return false
                          return true
                        })
                        .map((payment) => (
                          <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
                              {new Date(payment.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 text-black dark:text-white">
                              {payment.user_email || 'N/A'}
                            </td>
                            <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
                              {payment.pack_id || 'N/A'}
                            </td>
                            <td className="px-4 py-3 font-semibold text-black dark:text-white">
                              CHF {(payment.amount / 100).toFixed(2)}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                payment.status === 'succeeded' ? 'bg-green-100 text-green-700' :
                                payment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                payment.status === 'failed' ? 'bg-red-100 text-red-700' :
                                'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
                              }`}>
                                {payment.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-gray-600 dark:text-gray-400 font-mono text-xs">
                              {payment.stripe_payment_id || payment.id}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>No payments found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-black mb-4 flex items-center space-x-2">
                <History className="w-6 h-6 text-blue-600" />
                <span>Activity Logs</span>
              </h2>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {activityLogs.length > 0 ? (
                  activityLogs.map((log, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex items-start space-x-3"
                    >
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        log.type === 'user_action' ? 'bg-blue-500' :
                        log.type === 'payment' ? 'bg-green-500' :
                        log.type === 'admin_action' ? 'bg-purple-500' :
                        'bg-gray-500'
                      }`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-black dark:text-white">{log.action}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(log.created_at).toLocaleString()}
                          </span>
                        </div>
                        <div className="text-sm text-gray-700 dark:text-gray-200">
                          {log.description || 'No description'}
                        </div>
                        {log.user_email && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            User: {log.user_email}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No activity logs available
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tools Tab */}
        {activeTab === 'tools' && (
          <div className="space-y-6">
            {/* Export Section */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-black mb-4 flex items-center space-x-2">
                <FileSpreadsheet className="w-6 h-6 text-blue-600" />
                <span>Export Data</span>
              </h2>
              <div className="space-y-4">
                <button
                  onClick={exportUsersToCSV}
                  className="flex items-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Download className="w-5 h-5" />
                  <span>Export Users to CSV</span>
                </button>
                <p className="text-sm text-gray-600">
                  Export all user data including email, name, pack, spending, and join date.
                </p>
              </div>
            </div>

            {/* Email Management */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-black mb-4 flex items-center space-x-2">
                <Mail className="w-6 h-6 text-blue-600" />
                <span>Email Management</span>
              </h2>
              <div className="space-y-4">
                <button
                  onClick={() => {
                    setEmailRecipients(selectedUsers.size > 0 
                      ? Array.from(selectedUsers).map(id => {
                          const user = users.find(u => u.id === id)
                          return user?.email || ''
                        }).filter(Boolean)
                      : users.map(u => u.email)
                    )
                    setEmailModal(true)
                  }}
                  className="flex items-center space-x-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <Send className="w-5 h-5" />
                  <span>
                    {selectedUsers.size > 0 
                      ? `Send Email to ${selectedUsers.size} Selected Users`
                      : 'Send Email to All Users'
                    }
                  </span>
                </button>
                <p className="text-sm text-gray-600">
                  Send emails to selected users or all users. Select users in the Clients tab first.
                </p>
              </div>
            </div>

            {/* Bulk Actions */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-black mb-4 flex items-center space-x-2">
                <CheckSquare className="w-6 h-6 text-blue-600" />
                <span>Bulk Actions</span>
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bulk Change Pack
                  </label>
                  <div className="flex items-center space-x-2">
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          handleBulkPackChange(e.target.value)
                          e.target.value = ''
                        }
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-white text-black"
                      defaultValue=""
                    >
                      <option value="" disabled>Select Pack</option>
                      <option value="free">Free</option>
                      <option value="immigration">Immigration</option>
                      <option value="advanced">Advanced</option>
                      <option value="citizenship">Citizenship Pro</option>
                    </select>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Select users in the Clients tab, then choose a pack to apply to all selected users.
                  </p>
                </div>
              </div>
            </div>

            {/* System Info */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-black mb-4 flex items-center space-x-2">
                <Settings className="w-6 h-6 text-blue-600" />
                <span>System Information</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Users</div>
                  <div className="text-2xl font-bold text-black dark:text-white">{stats.totalUsers}</div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</div>
                  <div className="text-2xl font-bold text-green-600">CHF {stats.totalRevenue.toFixed(2)}</div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Active Subscriptions</div>
                  <div className="text-2xl font-bold text-blue-600">{stats.activeSubscriptions}</div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Messages</div>
                  <div className="text-2xl font-bold text-purple-600">{stats.messageCount}</div>
                </div>
              </div>
            </div>
          </div>
        )}

            {/* Content Tab - Full Access to All Packs */}
        {activeTab === 'content' && (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-black dark:text-white">
                  All Pack Content
                </h2>
                <span className="text-xs sm:text-sm text-blue-600 font-semibold">
                  Admin Full Access
                </span>
              </div>

      <div className="space-y-6 sm:space-y-8">
        {allPackContent.map((pack) => (
          <div key={pack.packId} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6 bg-white dark:bg-gray-800">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 mb-4">
              <h3 className="text-lg sm:text-xl font-bold text-black dark:text-white">
                {pack.packName}
              </h3>
              <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-200">
                {pack.modules.length} modules
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {pack.modules.map((module) => (
                <button
                  key={module.id}
                  type="button"
                  onClick={() => {
                    router.push(`/admin/module/${module.id}`)
                  }}
                  className="w-full text-left border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-300 transition-all cursor-pointer group relative focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bg-white dark:bg-gray-800"
                >
                  <div className="flex items-start justify-between mb-2 gap-2">
                    <h4 className="font-semibold text-sm sm:text-base text-black group-hover:text-blue-600 transition-colors flex-1">
                      {module.title}
                    </h4>
                    <Eye className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                  </div>
                  <p className="text-xs sm:text-sm text-gray-700 mb-2 line-clamp-2">
                    {module.description}
                  </p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-gray-600">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                      {module.type}
                    </span>
                    {module.duration && (
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{module.duration}</span>
                      </span>
                    )}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-xs text-blue-600 font-medium flex items-center justify-between group-hover:text-blue-700 transition-colors">
                      <span>Open admin view</span>
                      <span>→</span>
                  </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
            </div>
          </div>
        )}

        {/* User Upgrade Modal */}
        {upgradeUser && (
          <UserUpgradeModal
            user={upgradeUser}
            onClose={() => setUpgradeUser(null)}
            onUpgrade={handleUpdateUserPack}
          />
        )}

        {/* User Details Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-black dark:text-white">
                  User Details
                </h2>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
                    <div className="text-black dark:text-white mt-1">{selectedUser.email}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Name</label>
                    <div className="text-black dark:text-white mt-1">{selectedUser.full_name || '—'}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Current Pack</label>
                    <div className="text-black dark:text-white mt-1">{selectedUser.pack_id.toUpperCase()}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Pack Expires</label>
                    <div className="text-black dark:text-white mt-1">
                      {selectedUser.pack_expires_at 
                        ? new Date(selectedUser.pack_expires_at).toLocaleDateString()
                        : 'Never'
                      }
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Total Spent</label>
                    <div className="text-black dark:text-white mt-1">CHF {(selectedUser.total_spent / 100).toFixed(2)}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Purchases</label>
                    <div className="text-black dark:text-white mt-1">{selectedUser.payment_count}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Subscriptions</label>
                    <div className="text-black mt-1">{selectedUser.subscription_count || 0}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Join Date</label>
                    <div className="text-black mt-1">
                      {new Date(selectedUser.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Admin Status</label>
                    <div className="mt-1">
                      {selectedUser.is_admin ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                          <Shield className="w-3 h-3 mr-1" />
                          Admin
                        </span>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">Regular User</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setSelectedUser(null)
                      setUpgradeUser(selectedUser)
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Manage User Pack
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Email Modal */}
        {emailModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-black flex items-center space-x-2">
                  <Mail className="w-6 h-6 text-blue-600" />
                  <span>Send Email</span>
                </h2>
                <button
                  onClick={() => setEmailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Recipients ({emailRecipients.length} users)
                  </label>
                  <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg max-h-32 overflow-y-auto">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {emailRecipients.slice(0, 5).join(', ')}
                      {emailRecipients.length > 5 && ` and ${emailRecipients.length - 5} more...`}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="Email subject"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Message
                  </label>
                  <textarea
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    rows={8}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="Email message body"
                  />
                </div>
                <div className="flex items-center justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setEmailModal(false)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={sendEmailToUsers}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Email</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}
