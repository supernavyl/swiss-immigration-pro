'use client'

import { motion } from 'framer-motion'
import { 
  MapPin, Globe, Building2, Users, TrendingUp, TrendingDown, Award, 
  AlertCircle, CheckCircle, Lightbulb, Target, Zap, BarChart3, PieChart as PieChartIcon,
  Clock, DollarSign, Languages, Briefcase, ArrowRight, Sparkles, Shield, FileText
} from 'lucide-react'
import { 
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line 
} from 'recharts'
import { CANTONS } from '@/lib/constants'
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6']

// Canton Success Rate Data
const cantonSuccessData = [
  { canton: 'Basel-Stadt (BS)', successRate: 42, processing: 9, minSalary: 85, language: 'German B1', priority: 'Pharma/Biotech' },
  { canton: 'Ticino (TI)', successRate: 38, processing: 10, minSalary: 75, language: 'Italian B1+', priority: 'Tourism/Finance' },
  { canton: 'St. Gallen (SG)', successRate: 35, processing: 8, minSalary: 80, language: 'German B1', priority: 'Tech/Manufacturing' },
  { canton: 'Aargau (AG)', successRate: 32, processing: 8, minSalary: 78, language: 'German B1', priority: 'Engineering/Industry' },
  { canton: 'Bern (BE)', successRate: 28, processing: 12, minSalary: 82, language: 'German B2', priority: 'Government/NGO' },
  { canton: 'Vaud (VD)', successRate: 28, processing: 10, minSalary: 92, language: 'French B2', priority: 'Academia/Research' },
  { canton: 'Zurich (ZH)', successRate: 22, processing: 14, minSalary: 105, language: 'German B2', priority: 'Finance/Tech/Consulting' },
  { canton: 'Geneva (GE)', successRate: 18, processing: 16, minSalary: 110, language: 'French C1/C2', priority: 'Intl Orgs/Finance' },
]

// Quota Exhaustion Timeline
const quotaTimelineData = [
  { month: 'Jan', zh: 8, ge: 7, bs: 12, ag: 15, ti: 14, avg: 11.2 },
  { month: 'Feb', zh: 15, ge: 13, bs: 22, ag: 28, ti: 26, avg: 20.8 },
  { month: 'Mar', zh: 25, ge: 22, bs: 35, ag: 42, ti: 40, avg: 32.8 },
  { month: 'Apr', zh: 38, ge: 35, bs: 52, ag: 58, ti: 55, avg: 47.6 },
  { month: 'May', zh: 52, ge: 48, bs: 68, ag: 72, ti: 70, avg: 62 },
  { month: 'Jun', zh: 65, ge: 62, bs: 82, ag: 85, ti: 83, avg: 75.4 },
  { month: 'Jul', zh: 78, ge: 75, bs: 92, ag: 95, ti: 93, avg: 86.6 },
  { month: 'Aug', zh: 88, ge: 85, bs: 98, ag: 100, ti: 98, avg: 93.8 },
  { month: 'Sep', zh: 95, ge: 92, bs: 100, ag: 100, ti: 100, avg: 97.4 },
  { month: 'Oct', zh: 98, ge: 96, bs: 100, ag: 100, ti: 100, avg: 98.8 },
  { month: 'Nov', zh: 100, ge: 98, bs: 100, ag: 100, ti: 100, avg: 99.6 },
  { month: 'Dec', zh: 100, ge: 100, bs: 100, ag: 100, ti: 100, avg: 100 },
]

// Industry-Canton Matching
const industryCantonData = {
  Finance: [
    { canton: 'Zurich', match: 95, salary: 120, success: 22, tip: 'Apply early, emphasize international experience' },
    { canton: 'Geneva', match: 88, salary: 115, success: 18, tip: 'French C1 essential, UN/IO connections help' },
    { canton: 'Basel', match: 75, salary: 110, success: 42, tip: 'Best success rate for finance in pharma hub' },
  ],
  Technology: [
    { canton: 'Zurich', match: 92, salary: 115, success: 22, tip: 'Tech hub but competitive, need strong profile' },
    { canton: 'Vaud', match: 85, salary: 100, success: 28, tip: 'EPFL connection, startup-friendly' },
    { canton: 'St. Gallen', match: 78, salary: 90, success: 35, tip: 'Growing tech scene, better approval odds' },
  ],
  Pharma: [
    { canton: 'Basel', match: 98, salary: 110, success: 42, tip: 'Roche/Novartis HQ, highest success rate' },
    { canton: 'Zurich', match: 80, salary: 115, success: 22, tip: 'Research roles, but very competitive' },
    { canton: 'Bern', match: 70, salary: 95, success: 28, tip: 'Regulatory roles, moderate competition' },
  ],
  Engineering: [
    { canton: 'Aargau', match: 88, salary: 85, success: 32, tip: 'Manufacturing hub, good success rate' },
    { canton: 'St. Gallen', match: 82, salary: 88, success: 35, tip: 'Industry 4.0, fast processing' },
    { canton: 'Zurich', match: 78, salary: 110, success: 22, tip: 'R&D roles, high salary required' },
  ],
}

// Visa Hacks Data
const visaHacks = [
  {
    category: 'Timing Strategy',
    icon: Clock,
    hacks: [
      {
        title: 'Apply Q1-Q2 for Best Chances',
        description: 'Quotas are freshest, competition lower. Apply January-March for 30-50% higher approval rates.',
        impact: 'High',
        difficulty: 'Easy',
      },
      {
        title: 'Mid-Year Arrival Advantage',
        description: 'Arriving mid-year splits tax residency, potentially reducing first-year tax burden by 30-40%.',
        impact: 'Medium',
        difficulty: 'Easy',
      },
      {
        title: 'Avoid November Applications',
        description: 'November sees <10% approval rates as quotas are exhausted. Wait for January if possible.',
        impact: 'Critical',
        difficulty: 'Easy',
      },
    ]
  },
  {
    category: 'Canton Strategy',
    icon: MapPin,
    hacks: [
      {
        title: 'Strategic Canton Selection',
        description: 'Choosing Basel over Zurich can triple approval chances (42% vs 22%). Match canton to industry for best results.',
        impact: 'High',
        difficulty: 'Medium',
      },
      {
        title: 'Smaller Cantons = Better Odds',
        description: 'Aargau, Thurgau, Solothurn have better quota availability and faster processing (6-10 weeks vs 12-16 weeks).',
        impact: 'High',
        difficulty: 'Easy',
      },
      {
        title: 'Inter-Cantonal Transfer After Approval',
        description: 'Get approved in easier canton, transfer to preferred canton after 1-2 years when you have C permit eligibility.',
        impact: 'Medium',
        difficulty: 'Medium',
      },
    ]
  },
  {
    category: 'Salary Optimization',
    icon: DollarSign,
    hacks: [
      {
        title: '120% of Minimum = 45% Higher Approval',
        description: 'Salaries 20% above cantonal minimum see significantly higher approval. Negotiate hard before applying.',
        impact: 'High',
        difficulty: 'Medium',
      },
      {
        title: 'Total Compensation Package',
        description: 'Include bonuses, equity, relocation in package. Total comp matters more than base salary for approval.',
        impact: 'Medium',
        difficulty: 'Easy',
      },
      {
        title: 'Industry Benchmarking',
        description: 'Use SECO database to justify salary. Employers can reference industry data to support above-minimum offers.',
        impact: 'Medium',
        difficulty: 'Medium',
      },
    ]
  },
  {
    category: 'Documentation Hacks',
    icon: FileText,
    hacks: [
      {
        title: 'Pre-Translate Documents',
        description: 'Get apostilles and translations before arriving. Saves 2-4 weeks and prevents application delays.',
        impact: 'High',
        difficulty: 'Easy',
      },
      {
        title: 'Over-Document Everything',
        description: 'More documentation = better. Include certificates, publications, awards. Cantons value comprehensive applications.',
        impact: 'Medium',
        difficulty: 'Easy',
      },
      {
        title: 'Language Certificates Early',
        description: 'Get B1/B2 certificates 6+ months before applying. Shows commitment and prevents last-minute rejections.',
        impact: 'High',
        difficulty: 'Medium',
      },
    ]
  },
  {
    category: 'Application Process',
    icon: Target,
    hacks: [
      {
        title: 'Employer Pre-Approval Strategy',
        description: 'Have employer submit labor market test proof early. Start process before you formally apply to save time.',
        impact: 'Medium',
        difficulty: 'Medium',
      },
      {
        title: 'Multiple Embassy Options',
        description: 'Some countries have multiple Swiss embassies. Compare appointment availability and travel costs.',
        impact: 'Low',
        difficulty: 'Easy',
      },
      {
        title: 'Follow-Up Strategy',
        description: 'Politely follow up after 8 weeks if no response. Cantons respect professional inquiries.',
        impact: 'Low',
        difficulty: 'Easy',
      },
    ]
  },
]

// Canton Comparison Radar Data — each entry is a metric (spoke), each canton is a series
const cantonRadarData = [
  { metric: 'Success Rate',     Zurich: 22,  Basel: 85, Aargau: 70 },
  { metric: 'Processing Speed', Zurich: 60,  Basel: 75, Aargau: 80 },
  { metric: 'Salary Level',     Zurich: 95,  Basel: 85, Aargau: 70 },
  { metric: 'Cost of Living',   Zurich: 90,  Basel: 75, Aargau: 65 },
  { metric: 'Opportunities',    Zurich: 100, Basel: 80, Aargau: 70 },
  { metric: 'Language Req',     Zurich: 85,  Basel: 60, Aargau: 60 },
]

export default function CantonsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="py-24">
      <div className="sip-container-wide">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Cantonal Tips & Visa Hacks
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Strategic insights, success rates, and proven shortcuts to maximize your Swiss work permit approval chances
          </p>
        </motion.div>

        {/* Success Rate Overview */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Canton Success Rates (2025)</h2>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Approval rates vary dramatically by canton - strategic selection can multiply your chances 2-3x
            </p>
          </motion.div>

          {/* Success Rate Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-8 mb-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
              Approval Rates by Canton (Non-EU Work Permits)
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={cantonSuccessData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" domain={[0, 50]} stroke="#6b7280" tickFormatter={(value) => `${value}%`} />
                <YAxis dataKey="canton" type="category" width={150} stroke="#6b7280" />
                <Tooltip 
                  formatter={(value) => `${value}%`}
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Bar dataKey="successRate" fill="#3b82f6" name="Success Rate (%)" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Detailed Comparison Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Building2 className="w-6 h-6 text-blue-600" />
              Complete Canton Comparison
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                    <th className="text-left py-4 px-4 font-semibold text-gray-900 dark:text-white">Canton</th>
                    <th className="text-right py-4 px-4 font-semibold text-gray-900 dark:text-white">Success Rate</th>
                    <th className="text-right py-4 px-4 font-semibold text-gray-900 dark:text-white">Processing (weeks)</th>
                    <th className="text-right py-4 px-4 font-semibold text-gray-900 dark:text-white">Min Salary (k CHF)</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-900 dark:text-white">Language</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-900 dark:text-white">Priority Industries</th>
                  </tr>
                </thead>
                <tbody>
                  {cantonSuccessData.map((canton, idx) => (
                    <motion.tr
                      key={canton.canton}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + idx * 0.05 }}
                      className={`border-b border-gray-100 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors ${
                        canton.successRate >= 35 ? 'bg-green-50/30 dark:bg-green-900/20' : canton.successRate >= 28 ? 'bg-amber-50/30 dark:bg-amber-900/20' : ''
                      }`}
                    >
                      <td className="py-4 px-4 font-medium text-gray-900 dark:text-white">{canton.canton}</td>
                      <td className="py-4 px-4 text-right">
                        <span className={`font-bold ${
                          canton.successRate >= 35 ? 'text-green-600' : canton.successRate >= 28 ? 'text-amber-600' : 'text-red-600'
                        }`}>
                          {canton.successRate}%
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right text-gray-700 dark:text-gray-200">{canton.processing}</td>
                      <td className="py-4 px-4 text-right text-gray-700 dark:text-gray-200">{canton.minSalary}</td>
                      <td className="py-4 px-4 text-gray-700 dark:text-gray-200">{canton.language}</td>
                      <td className="py-4 px-4 text-gray-700 dark:text-gray-200">{canton.priority}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </section>

        {/* Quota Exhaustion Timeline */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-8 h-8 text-amber-600" />
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Quota Exhaustion Timeline</h2>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Track when quotas fill up by canton - timing is critical for approval success
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <TrendingDown className="w-6 h-6 text-amber-600" />
              Quota Usage by Month (% Exhausted)
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={quotaTimelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
                <Line type="monotone" dataKey="zh" stroke="#ef4444" strokeWidth={2} name="Zurich" dot={{ r: 3 }} />
                <Line type="monotone" dataKey="ge" stroke="#3b82f6" strokeWidth={2} name="Geneva" dot={{ r: 3 }} />
                <Line type="monotone" dataKey="bs" stroke="#10b981" strokeWidth={2} name="Basel" dot={{ r: 3 }} />
                <Line type="monotone" dataKey="ag" stroke="#f59e0b" strokeWidth={2} name="Aargau" dot={{ r: 3 }} />
                <Line type="monotone" dataKey="ti" stroke="#8b5cf6" strokeWidth={2} name="Ticino" dot={{ r: 3 }} />
                <Line type="monotone" dataKey="avg" stroke="#6b7280" strokeWidth={2} strokeDasharray="5 5" name="Average" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-900 dark:text-green-300">Best Time: January-March</span>
                </div>
                <p className="text-sm text-green-800 dark:text-green-400">Fresh quotas, lowest competition, 30-50% higher approval rates</p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  <span className="font-semibold text-amber-900 dark:text-amber-300">Risky: July-September</span>
                </div>
                <p className="text-sm text-amber-800 dark:text-amber-400">Quotas filling fast, higher competition, selective approvals</p>
              </div>
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <span className="font-semibold text-red-900 dark:text-red-300">Avoid: October-December</span>
                </div>
                <p className="text-sm text-red-800 dark:text-red-400">Quotas exhausted, &lt;10% approval rates, wait for next year</p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Industry-Canton Matching */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <Briefcase className="w-8 h-8 text-purple-600" />
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Industry-Canton Matching</h2>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Match your industry to the best cantons for maximum approval chances
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {Object.entries(industryCantonData).map(([industry, cantons], idx) => (
              <motion.div
                key={industry}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="card p-8"
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <Briefcase className="w-6 h-6 text-purple-600" />
                  {industry}
                </h3>
                <div className="space-y-4">
                  {cantons.map((canton, cIdx) => (
                    <div
                      key={cIdx}
                      className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/30 rounded-lg p-5 border border-purple-100 dark:border-purple-900/40"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-lg font-bold text-gray-900 dark:text-white">{canton.canton}</h4>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Match: <span className="font-semibold text-purple-600">{canton.match}%</span>
                            </span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Success: <span className="font-semibold text-green-600">{canton.success}%</span>
                            </span>
                          </div>
                        </div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white bg-white dark:bg-gray-700 px-3 py-1 rounded-full">
                          CHF {canton.salary}k+
                        </span>
                      </div>
                      <div className="bg-white/80 dark:bg-gray-700/50 rounded-lg p-3 border border-purple-200 dark:border-purple-900/40">
                        <div className="flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-700 dark:text-gray-300">{canton.tip}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Visa Hacks Section */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-8 h-8 text-amber-600" />
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Proven Visa Hacks & Shortcuts</h2>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Insider strategies and shortcuts to maximize your approval chances and speed up the process
            </p>
          </motion.div>

          <div className="space-y-8">
            {visaHacks.map((category, catIdx) => {
              const IconComponent = category.icon
              return (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: catIdx * 0.1 }}
                  className="card p-8"
                >
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <IconComponent className="w-7 h-7 text-amber-600" />
                    {category.category}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {category.hacks.map((hack, hackIdx) => (
                      <motion.div
                        key={hackIdx}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: (catIdx * 0.1) + (hackIdx * 0.05) }}
                        className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-xl p-6 border border-amber-200 dark:border-amber-900/40 hover:shadow-lg transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="text-lg font-bold text-gray-900 dark:text-white flex-1">{hack.title}</h4>
                          <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0 ml-2" />
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">{hack.description}</p>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs font-semibold px-2 py-1 rounded ${
                            hack.impact === 'High' || hack.impact === 'Critical' 
                              ? 'bg-red-100 text-red-700' 
                              : hack.impact === 'Medium'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {hack.impact} Impact
                          </span>
                          <span className={`text-xs font-semibold px-2 py-1 rounded ${
                            hack.difficulty === 'Easy' 
                              ? 'bg-green-100 text-green-700' 
                              : hack.difficulty === 'Medium'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {hack.difficulty}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* Canton Radar Comparison */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-8 h-8 text-indigo-600" />
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Multi-Factor Canton Comparison</h2>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Compare cantons across multiple dimensions to find your best match
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-8"
          >
            <ResponsiveContainer width="100%" height={500}>
              <RadarChart data={cantonRadarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis
                  dataKey="metric"
                  tick={{ fill: '#374151', fontSize: 13, fontWeight: 'bold' }}
                />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Radar
                  name="Zurich"
                  dataKey="Zurich"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Radar
                  name="Basel"
                  dataKey="Basel"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Radar
                  name="Aargau"
                  dataKey="Aargau"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                <span className="font-semibold text-gray-900 dark:text-white">Success Rate:</span>
                <span className="text-gray-600 dark:text-gray-400 ml-2">Approval percentage</span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                <span className="font-semibold text-gray-900 dark:text-white">Processing Speed:</span>
                <span className="text-gray-600 dark:text-gray-400 ml-2">Faster is better</span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                <span className="font-semibold text-gray-900 dark:text-white">Salary Level:</span>
                <span className="text-gray-600 dark:text-gray-400 ml-2">Typical compensation</span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                <span className="font-semibold text-gray-900 dark:text-white">Cost of Living:</span>
                <span className="text-gray-600 dark:text-gray-400 ml-2">Lower is better</span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                <span className="font-semibold text-gray-900 dark:text-white">Opportunities:</span>
                <span className="text-gray-600 dark:text-gray-400 ml-2">Job market size</span>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                <span className="font-semibold text-gray-900 dark:text-white">Language Req:</span>
                <span className="text-gray-600 dark:text-gray-400 ml-2">Lower is easier</span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Key Insights */}
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="w-8 h-8 text-amber-600" />
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Key Strategic Insights</h2>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="card p-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800 border-green-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Best Strategies</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-200">Choose Basel over Zurich: 42% vs 22% success rate (2x better)</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-200">Apply Q1-Q2: 30-50% higher approval rates with fresh quotas</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-200">Negotiate 120% of minimum salary: 45% approval boost</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-200">Match industry to canton: Pharma → Basel, Finance → Zurich/Geneva</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-200">Get language certificates 6+ months early to prevent delays</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="card p-8 bg-gradient-to-br from-red-50 to-rose-50 dark:from-gray-800 dark:to-gray-800 border-red-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Common Mistakes to Avoid</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-200">Applying in November: &lt;10% approval rates, quotas exhausted</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-200">Picking Zurich first: 15% success vs 42% in Basel (3x worse)</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-200">Salary below cantonal minimum: Automatic rejection in most cases</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-200">Missing language certificates: Major delay or rejection factor</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-200">Incomplete documentation: 31% of rejections due to missing docs</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </section>

        {/* Upgrade CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-12 text-white text-center"
        >
          <h2 className="text-3xl font-bold mb-4">
            Get Personalized Cantonal Strategy
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Unlock detailed canton playbooks, real-time quota tracking, salary calculators, and AI-powered canton matching
          </p>
          <a 
            href="/pricing" 
            className="inline-block bg-white dark:bg-gray-800 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 font-bold px-8 py-4 rounded-lg transition-all transform hover:scale-105"
          >
            View Pricing Plans →
          </a>
        </motion.div>
      </div>
      </div>
    </div>
  )
}
