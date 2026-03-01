'use client'

import { CheckCircle } from 'lucide-react'
import { PRICING_PACKS } from '@/lib/pricing'

type PackValue = (typeof PRICING_PACKS)[keyof typeof PRICING_PACKS]

const COMPARISON_ROWS = [
  { feature: 'AI Chatbot Messages', values: ['10/day', 'Unlimited', 'Unlimited', 'Unlimited'] },
  { feature: 'Guide Modules', values: ['2 modules', '5 modules', '10 modules', '10 modules + extras'] },
  { feature: 'CV Templates', values: ['Basic samples', '25+ templates', '25+ templates', '25+ templates'] },
  { feature: 'Cantonal Strategies', values: ['Overview', 'Complete guides', 'Deep dive + optimization', 'Complete + coaching'] },
  { feature: 'Email Support', values: ['Community only', '48h response', '24h response', '24h priority'] },
  { feature: 'Progress Tracking', values: ['Basic', 'Dashboard', 'Advanced dashboard', 'Advanced + reviews'] },
  { feature: 'Language Test Prep', values: ['Basic info', 'Guides', 'Complete toolkit', 'Complete + practice tests'] },
  { feature: 'Citizenship Roadmap', values: ['Overview', 'Basic guide', 'Comprehensive', 'Complete + coaching'] },
  { feature: 'Document Review', values: ['Self-service', 'Templates', 'AI assistance', 'Expert review (3 docs)'] },
  { feature: 'Content Updates', values: ['Limited', 'All updates', 'All updates', 'Lifetime access'] },
]

const HIGHLIGHT_VALUES = ['Unlimited', 'Complete', 'Advanced', 'All updates', 'Lifetime']
const DIM_VALUES = ['Community only', 'Basic', 'Basic info', 'Overview', 'Self-service', 'Limited']

export default function ComparisonTable() {
  const packs = Object.values(PRICING_PACKS) as PackValue[]

  return (
    <section className="mt-12 sm:mt-16 md:mt-24" aria-label="Feature comparison">
      <div className="text-center mb-8 sm:mb-12 px-2">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 transition-colors">
          Compare Plans Side-by-Side
        </h2>
        <p className="text-sm sm:text-base text-black max-w-2xl mx-auto transition-colors opacity-80">
          See exactly what&apos;s included in each plan to choose the perfect fit for your Swiss
          immigration journey.
        </p>
      </div>

      <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 overflow-hidden shadow-xl">
        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
          <div className="text-xs text-gray-500 mb-2 sm:hidden text-center">
            &larr; Scroll to see all plans &rarr;
          </div>
          <table className="w-full min-w-[600px]">
            <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <tr>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-semibold text-xs sm:text-sm sticky left-0 bg-gradient-to-r from-blue-600 to-indigo-600 z-10">
                  Features
                </th>
                {packs.map((pack) => (
                  <th
                    key={pack.id}
                    className={`px-3 sm:px-6 py-3 sm:py-4 text-center font-semibold text-xs sm:text-sm ${pack.id === 'advanced' ? 'bg-white/20' : ''}`}
                  >
                    <div className="font-bold text-sm sm:text-lg">{pack.name}</div>
                    <div className="text-xs sm:text-sm font-normal opacity-90 mt-1">
                      {pack.price === 0 ? 'Free' : `CHF ${pack.price}/mo`}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {COMPARISON_ROWS.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-gray-900 text-xs sm:text-sm sticky left-0 bg-inherit z-10 whitespace-nowrap">
                    {row.feature}
                  </td>
                  {packs.map((pack, pidx) => {
                    const value = row.values[pidx]
                    const isCheckmark = HIGHLIGHT_VALUES.some((v) => value.includes(v))
                    const isEmpty = DIM_VALUES.includes(value) && pidx === 0

                    return (
                      <td key={pack.id} className="px-3 sm:px-6 py-3 sm:py-4 text-center">
                        <div className="flex items-center justify-center">
                          {isCheckmark ? (
                            <CheckCircle
                              className={`w-4 h-4 sm:w-5 sm:h-5 ${pidx === 1 ? 'text-green-600' : pidx === 2 ? 'text-blue-600' : 'text-purple-600'}`}
                            />
                          ) : isEmpty ? (
                            <span className="text-gray-400 text-xs sm:text-sm">&mdash;</span>
                          ) : (
                            <span className="text-xs sm:text-sm text-black whitespace-nowrap">
                              {value}
                            </span>
                          )}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
