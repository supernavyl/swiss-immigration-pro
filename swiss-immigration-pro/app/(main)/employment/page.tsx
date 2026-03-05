'use client'

import { motion } from 'framer-motion'
import {
  Briefcase, DollarSign, TrendingUp, Users, MapPin, Phone, Mail, Globe,
  Clock, AlertCircle, CheckCircle, ExternalLink, BarChart3, PieChart as PieChartIcon,
  Building2, Award, Calendar, FileText, ArrowRight, Brain, Sparkles, Zap,
  Target, Shield, Network, Database, Cpu, Activity
} from 'lucide-react'
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, LineChart, Line
} from 'recharts'
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

// Quota Data
const quotaData = {
  total: 8500,
  lPermit: 4000,
  bPermit: 4500,
  used: 6000,
  remaining: 2500,
  byQuarter: [
    { quarter: 'Q1', lPermit: 1200, bPermit: 1350 },
    { quarter: 'Q2', lPermit: 1100, bPermit: 1300 },
    { quarter: 'Q3', lPermit: 900, bPermit: 1100 },
    { quarter: 'Q4', lPermit: 800, bPermit: 750 },
  ],
  byCanton: [
    { canton: 'ZH', lPermit: 800, bPermit: 900, total: 1700 },
    { canton: 'GE', lPermit: 500, bPermit: 600, total: 1100 },
    { canton: 'VD', lPermit: 450, bPermit: 500, total: 950 },
    { canton: 'BS', lPermit: 350, bPermit: 400, total: 750 },
    { canton: 'BE', lPermit: 300, bPermit: 350, total: 650 },
    { canton: 'TI', lPermit: 250, bPermit: 300, total: 550 },
  ]
}

// Salary Data
const salaryData = {
  byIndustry: [
    { industry: 'IT/Tech', min: 95000, median: 120000, max: 180000 },
    { industry: 'Finance', min: 100000, median: 130000, max: 200000 },
    { industry: 'Pharma', min: 105000, median: 125000, max: 175000 },
    { industry: 'Engineering', min: 90000, median: 115000, max: 160000 },
    { industry: 'Consulting', min: 95000, median: 120000, max: 180000 },
    { industry: 'Healthcare', min: 100000, median: 125000, max: 170000 },
  ],
  byCanton: [
    { canton: 'Zurich (ZH)', avg: 115000, min: 97000, median: 118000 },
    { canton: 'Geneva (GE)', avg: 112000, min: 95000, median: 115000 },
    { canton: 'Basel (BS)', avg: 110000, min: 93000, median: 113000 },
    { canton: 'Vaud (VD)', avg: 108000, min: 92000, median: 111000 },
    { canton: 'Bern (BE)', avg: 105000, min: 90000, median: 108000 },
    { canton: 'Ticino (TI)', avg: 95000, min: 85000, median: 98000 },
  ],
  byExperience: [
    { level: 'Junior (0-3y)', range: 'CHF 75k - 95k' },
    { level: 'Mid (3-7y)', range: 'CHF 95k - 130k' },
    { level: 'Senior (7-12y)', range: 'CHF 130k - 170k' },
    { level: 'Lead (12y+)', range: 'CHF 170k - 250k+' },
  ]
}

// Embassy Data
const embassyData = [
  {
    country: 'United States',
    cities: [
      {
        city: 'Washington D.C.',
        type: 'Embassy',
        address: '2900 Cathedral Avenue NW, Washington, DC 20008',
        phone: '+1 (202) 745-7900',
        email: 'was.vertretung@eda.admin.ch',
        website: 'https://www.eda.admin.ch/washington',
        hours: 'Mon-Fri: 9:00-12:00',
        services: ['Visa applications', 'Permit collection', 'Notarizations']
      },
      {
        city: 'New York',
        type: 'Consulate General',
        address: '633 Third Avenue, 30th Floor, New York, NY 10017',
        phone: '+1 (212) 599-5700',
        email: 'nyc.vertretung@eda.admin.ch',
        website: 'https://www.eda.admin.ch/newyork',
        hours: 'Mon-Fri: 9:00-12:00',
        services: ['Visa applications', 'Permit collection']
      },
      {
        city: 'San Francisco',
        type: 'Consulate General',
        address: '456 Montgomery Street, Suite 1500, San Francisco, CA 94104',
        phone: '+1 (415) 788-2272',
        email: 'sfo.vertretung@eda.admin.ch',
        website: 'https://www.eda.admin.ch/sanfrancisco',
        hours: 'Mon-Fri: 9:00-12:00',
        services: ['Visa applications']
      }
    ]
  },
  {
    country: 'United Kingdom',
    cities: [
      {
        city: 'London',
        type: 'Embassy',
        address: '16-18 Montagu Place, London W1H 2BQ',
        phone: '+44 (0)20 7616 6000',
        email: 'lon.vertretung@eda.admin.ch',
        website: 'https://www.eda.admin.ch/london',
        hours: 'Mon-Fri: 9:00-12:00',
        services: ['Visa applications', 'Permit collection', 'Notarizations']
      }
    ]
  },
  {
    country: 'India',
    cities: [
      {
        city: 'New Delhi',
        type: 'Embassy',
        address: 'Nyaya Marg, Chanakyapuri, New Delhi 110021',
        phone: '+91 (11) 4995 9500',
        email: 'nde.vertretung@eda.admin.ch',
        website: 'https://www.eda.admin.ch/newdelhi',
        hours: 'Mon-Fri: 9:00-12:00',
        services: ['Visa applications', 'Permit collection', 'Notarizations']
      },
      {
        city: 'Mumbai',
        type: 'Consulate General',
        address: 'Cecil Court, 4th Floor, Mahakavi Bhushan Marg, Mumbai 400001',
        phone: '+91 (22) 2204 8219',
        email: 'bom.vertretung@eda.admin.ch',
        website: 'https://www.eda.admin.ch/mumbai',
        hours: 'Mon-Fri: 9:00-12:00',
        services: ['Visa applications']
      }
    ]
  },
  {
    country: 'China',
    cities: [
      {
        city: 'Beijing',
        type: 'Embassy',
        address: 'Sanlitun Dongwujie 3, Beijing 100600',
        phone: '+86 (10) 8532 8888',
        email: 'pek.vertretung@eda.admin.ch',
        website: 'https://www.eda.admin.ch/beijing',
        hours: 'Mon-Fri: 9:00-12:00',
        services: ['Visa applications', 'Permit collection', 'Notarizations']
      },
      {
        city: 'Shanghai',
        type: 'Consulate General',
        address: 'Level 18, Tower B, No. 889 Yi Shan Road, Shanghai 200233',
        phone: '+86 (21) 6235 0000',
        email: 'sha.vertretung@eda.admin.ch',
        website: 'https://www.eda.admin.ch/shanghai',
        hours: 'Mon-Fri: 9:00-12:00',
        services: ['Visa applications']
      },
      {
        city: 'Guangzhou',
        type: 'Consulate General',
        address: 'Room 2701, 27/F, R&F Center, 10 Huaxia Road, Tianhe District, Guangzhou 510623',
        phone: '+86 (20) 3833 0455',
        email: 'can.vertretung@eda.admin.ch',
        website: 'https://www.eda.admin.ch/guangzhou',
        hours: 'Mon-Fri: 9:00-12:00',
        services: ['Visa applications']
      }
    ]
  },
  {
    country: 'Brazil',
    cities: [
      {
        city: 'Brasília',
        type: 'Embassy',
        address: 'SES, Av. das Nações, Quadra 811, Lote 41, 70425-900 Brasília',
        phone: '+55 (61) 3443 5500',
        email: 'bra.vertretung@eda.admin.ch',
        website: 'https://www.eda.admin.ch/brasilia',
        hours: 'Mon-Fri: 9:00-12:00',
        services: ['Visa applications', 'Permit collection']
      },
      {
        city: 'São Paulo',
        type: 'Consulate General',
        address: 'Av. Paulista, 1754, 14º andar, 01310-200 São Paulo',
        phone: '+55 (11) 3371 6161',
        email: 'sao.vertretung@eda.admin.ch',
        website: 'https://www.eda.admin.ch/saopaulo',
        hours: 'Mon-Fri: 9:00-12:00',
        services: ['Visa applications']
      }
    ]
  }
]

export default function EmploymentPage() {
  const quotaPieData = [
    { name: 'L Permit', value: quotaData.lPermit, color: '#3b82f6' },
    { name: 'B Permit', value: quotaData.bPermit, color: '#10b981' },
  ]

  const quotaStatusData = [
    { name: 'Used', value: quotaData.used, fill: '#ef4444' },
    { name: 'Remaining', value: quotaData.remaining, fill: '#10b981' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <div className="pt-24 pb-32">
      <div className="sip-container-wide">
        {/* Modern Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
            <Cpu className="w-4 h-4" />
            AI-Powered Employment Hub
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent">
            Swiss Work Permits & Employment
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Comprehensive data on quotas, salary benchmarks, and embassy contacts to guide your Swiss employment journey
          </p>
        </motion.div>

        {/* Modern Quotas Section */}
        <section className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Work Permit Quotas 2025</h2>
                <p className="text-lg md:text-xl text-gray-600">
                  Annual federal quotas for non-EU/EFTA nationals seeking employment in Switzerland
                </p>
              </div>
            </div>
          </motion.div>

          {/* Modern Quota Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl border border-gray-100 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-bold text-blue-700 bg-blue-100 px-3 py-1.5 rounded-full">Total</span>
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{quotaData.total.toLocaleString()}</div>
                <div className="text-sm font-medium text-gray-500">Total Annual Quota</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl border border-gray-100 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Briefcase className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-3 py-1.5 rounded-full">L Permit</span>
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{quotaData.lPermit.toLocaleString()}</div>
                <div className="text-sm font-medium text-gray-500">Short-term Permits</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } } }
              className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl border border-gray-100 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-bold text-blue-700 bg-blue-100 px-3 py-1.5 rounded-full">B Permit</span>
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{quotaData.bPermit.toLocaleString()}</div>
                <div className="text-sm font-medium text-gray-500">Residence Permits</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={`group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl border transition-all duration-300 overflow-hidden ${
                quotaData.remaining > 2000 
                  ? 'border-blue-200' 
                  : 'border-amber-200'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                quotaData.remaining > 2000 
                  ? 'from-blue-500/5 to-indigo-500/5' 
                  : 'from-amber-500/5 to-orange-500/5'
              }`} />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br rounded-xl flex items-center justify-center shadow-lg ${
                    quotaData.remaining > 2000 
                      ? 'from-blue-500 to-blue-600' 
                      : 'from-amber-500 to-amber-600'
                  }`}>
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                    quotaData.remaining > 2000 
                      ? 'text-blue-700 bg-blue-100' 
                      : 'text-amber-700 bg-amber-100'
                  }`}>Remaining</span>
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">{quotaData.remaining.toLocaleString()}</div>
                <div className="text-sm font-medium text-gray-500">
                  {((quotaData.remaining / quotaData.total) * 100).toFixed(1)}% Available
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quota Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Quota Distribution Pie Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
            >
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              Quota Distribution by Permit Type
            </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={quotaPieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {quotaPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => value.toLocaleString()} />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Quota Status Pie Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
            >
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              Quota Status (2025)
            </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={quotaStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {quotaStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => value.toLocaleString()} />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Quarterly Breakdown Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 mb-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              Quarterly Quota Usage Trend
            </h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={quotaData.byQuarter}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="quarter" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Bar dataKey="lPermit" fill="#3b82f6" name="L Permits" />
                <Bar dataKey="bPermit" fill="#10b981" name="B Permits" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Modern Canton Breakdown Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              Quota Allocation by Canton
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                    <th className="text-left py-4 px-6 font-bold text-gray-900">Canton</th>
                    <th className="text-right py-4 px-6 font-bold text-gray-900">L Permits</th>
                    <th className="text-right py-4 px-6 font-bold text-gray-900">B Permits</th>
                    <th className="text-right py-4 px-6 font-bold text-gray-900">Total</th>
                    <th className="text-right py-4 px-6 font-bold text-gray-900">Share</th>
                  </tr>
                </thead>
                <tbody>
                  {quotaData.byCanton.map((canton, idx) => (
                    <motion.tr
                      key={canton.canton}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.9 + idx * 0.1 }}
                      className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
                    >
                      <td className="py-5 px-6 font-semibold text-gray-900">{canton.canton}</td>
                      <td className="py-5 px-6 text-right text-gray-700 font-medium">{canton.lPermit.toLocaleString()}</td>
                      <td className="py-5 px-6 text-right text-gray-700 font-medium">{canton.bPermit.toLocaleString()}</td>
                      <td className="py-5 px-6 text-right font-bold text-gray-900 text-lg">{canton.total.toLocaleString()}</td>
                      <td className="py-5 px-6 text-right">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
                          {((canton.total / quotaData.total) * 100).toFixed(1)}%
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Modern Important Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border border-blue-200 rounded-2xl p-8 shadow-md"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Important: Quota System</h4>
                <p className="text-gray-700 leading-relaxed text-lg">
                  Permits are allocated on a first-come, first-served basis. Quotas typically fill by Q3-Q4. 
                  Apply early in the year for best chances. EU/EFTA nationals are not subject to quotas under 
                  the Free Movement Agreement.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Modern Salaries Section */}
        <section className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Target className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Salary Benchmarks</h2>
                <p className="text-lg md:text-xl text-gray-600">
                  Industry and canton-specific salary data to help negotiate competitive offers
                </p>
              </div>
            </div>
          </motion.div>

          {/* Modern Salary by Industry Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 mb-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Database className="w-5 h-5 text-white" />
              </div>
              Salary Ranges by Industry
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={salaryData.byIndustry} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" stroke="#6b7280" tickFormatter={(value) => `CHF ${(value / 1000)}k`} />
                <YAxis dataKey="industry" type="category" width={120} stroke="#6b7280" />
                <Tooltip formatter={(value) => `CHF ${value.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="min" fill="#93c5fd" name="Minimum" />
                <Bar dataKey="median" fill="#3b82f6" name="Median" />
                <Bar dataKey="max" fill="#1e40af" name="Maximum" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Salary by Canton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Network className="w-5 h-5 text-white" />
                </div>
                Average Salaries by Canton
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={salaryData.byCanton}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="canton" angle={-45} textAnchor="end" height={100} stroke="#6b7280" />
                  <YAxis stroke="#6b7280" tickFormatter={(value) => `CHF ${(value / 1000)}k`} />
                  <Tooltip formatter={(value) => `CHF ${value.toLocaleString()}`} />
                  <Bar dataKey="avg" fill="#3b82f6" name="Average Salary" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                Salary by Experience Level
              </h3>
              <div className="space-y-4">
                {salaryData.byExperience.map((level, idx) => (
                  <motion.div
                    key={level.level}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + idx * 0.1 }}
                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                    className="p-5 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 rounded-xl border border-blue-100 hover:border-blue-200 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900 text-lg">{level.level}</span>
                      <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{level.range}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Modern Salary Tips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border border-blue-200 rounded-2xl p-8 shadow-md"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Salary Negotiation Tips</h4>
                <ul className="space-y-3">
                  {[
                    'Salaries must meet cantonal minimums (typically CHF 97,000+ for non-EU permits)',
                    'Research SECO salary database for your role and industry',
                    'Consider total compensation: base salary, bonuses, benefits, and relocation packages',
                    'Higher salaries (CHF 120k+) improve quota approval chances significantly',
                    'Factor in cost of living differences between cantons'
                  ].map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Modern Embassy Contacts Section */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Embassy & Consulate Contacts</h2>
                <p className="text-lg md:text-xl text-gray-600">
                  Swiss diplomatic missions worldwide for visa applications and permit collection
                </p>
              </div>
            </div>
          </motion.div>

          {/* Embassy Listings */}
          <div className="space-y-8">
            {embassyData.map((country, countryIdx) => (
              <motion.div
                key={country.country}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: countryIdx * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              >
                <h3 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Network className="w-6 h-6 text-white" />
                  </div>
                  {country.country}
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {country.cities.map((city, cityIdx) => (
                    <motion.div
                      key={city.city}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (countryIdx * 0.1) + (cityIdx * 0.05) }}
                      whileHover={{ y: -4, transition: { duration: 0.2 } }}
                      className="bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-50 rounded-xl p-6 border border-purple-200 hover:border-purple-300 hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-xl font-bold text-gray-900 mb-1">{city.city}</h4>
                          <span className="inline-block text-xs font-semibold text-purple-700 bg-purple-200 px-2 py-1 rounded">
                            {city.type}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-700 text-sm">{city.address}</p>
                        </div>

                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-purple-600 flex-shrink-0" />
                          <a href={`tel:${city.phone}`} className="text-gray-700 text-sm hover:text-purple-600 transition-colors">
                            {city.phone}
                          </a>
                        </div>

                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-purple-600 flex-shrink-0" />
                          <a href={`mailto:${city.email}`} className="text-gray-700 text-sm hover:text-purple-600 transition-colors break-all">
                            {city.email}
                          </a>
                        </div>

                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-purple-600 flex-shrink-0" />
                          <p className="text-gray-700 text-sm">{city.hours}</p>
                        </div>

                        <div className="flex items-start gap-3">
                          <FileText className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-semibold text-gray-900 mb-1">Services:</p>
                            <ul className="text-gray-700 text-sm space-y-1">
                              {city.services.map((service, idx) => (
                                <li key={idx} className="flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4 text-blue-600" />
                                  {service}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <a
                          href={city.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold text-sm transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Visit Official Website
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Modern Embassy Tips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 border border-purple-200 rounded-2xl p-8 shadow-md"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Embassy Application Tips</h4>
                <ul className="space-y-3">
                  {[
                    'Book appointments 4-6 weeks in advance (8-10 weeks during peak seasons)',
                    'Bring all original documents plus copies, properly apostilled if required',
                    'Embassy fees range from CHF 60-250 depending on country and permit type',
                    'Check embassy-specific requirements on their website before visiting',
                    'Some embassies allow applications by mail; check availability',
                    'Arrive 15 minutes early for security screening and check-in'
                  ].map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Modern Upgrade CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-20 relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 rounded-3xl p-12 md:p-16 text-white text-center shadow-2xl"
        >
          <div 
            className="absolute inset-0 opacity-20" 
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.1, duration: 0.5 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Get Personalized Employment Support
              </h2>
              <p className="text-xl md:text-2xl mb-10 opacity-95 max-w-2xl mx-auto leading-relaxed">
                Unlock CV templates, detailed checklists, real-time quota tracking, and AI-powered guidance
              </p>
              <motion.a 
                href="/pricing" 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 font-bold px-10 py-5 rounded-xl transition-all shadow-xl hover:shadow-2xl text-lg"
              >
                View Pricing Plans
                <ArrowRight className="w-5 h-5" />
              </motion.a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
    </div>
  )
}
