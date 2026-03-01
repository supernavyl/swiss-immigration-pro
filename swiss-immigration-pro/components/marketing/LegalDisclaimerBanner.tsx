'use client'

import { AlertTriangle, X } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

export default function LegalDisclaimerBanner() {
  const [isDismissed, setIsDismissed] = useState(false)

  if (isDismissed) return null

  return (
    <div className="bg-yellow-50 border-b-2 border-yellow-400 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-yellow-900 font-semibold">
                ⚠️ <strong>Legal Disclaimer:</strong> This platform provides general educational information only. 
                Not legal advice. Always verify with official sources (
                <a href="https://www.sem.admin.ch" target="_blank" rel="noopener noreferrer" className="underline hover:text-yellow-800">
                  SEM.admin.ch
                </a>
                ) and consult a certified Swiss immigration lawyer for your specific case.
                {' '}
                <Link href="/terms" className="underline hover:text-yellow-800">
                  Read full terms
                </Link>
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsDismissed(true)}
            className="flex-shrink-0 text-yellow-600 hover:text-yellow-800 transition-colors"
            aria-label="Dismiss disclaimer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}





