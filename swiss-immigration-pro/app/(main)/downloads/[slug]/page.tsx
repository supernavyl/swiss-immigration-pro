'use client'

import { useState, useEffect, use } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Download, Mail, CheckCircle, AlertCircle, FileText, ArrowRight } from 'lucide-react'
const LEAD_MAGNETS: Record<string, {
  id: string
  title: string
  description: string
  fileUrl: string
  fileName: string
  preview: string[]
}> = {
  'immigration-checklist': {
    id: 'immigration-checklist',
    title: 'Swiss Immigration Checklist',
    description: 'Complete step-by-step checklist for your Swiss immigration journey. Includes all required documents, deadlines, and action items.',
    fileUrl: '/downloads/swiss-immigration-checklist.pdf',
    fileName: 'Swiss-Immigration-Checklist.pdf',
    preview: [
      '✓ Visa type identification guide',
      '✓ Document requirements checklist',
      '✓ Application timeline',
      '✓ Cantonal variations',
      '✓ Common mistakes to avoid'
    ]
  },
  'top-10-mistakes': {
    id: 'top-10-mistakes',
    title: 'Top 10 Mistakes to Avoid',
    description: 'Learn from others\' mistakes. This guide reveals the most common errors people make during Swiss immigration and how to avoid them.',
    fileUrl: '/downloads/top-10-mistakes.pdf',
    fileName: 'Top-10-Mistakes-to-Avoid.pdf',
    preview: [
      '❌ Waiting too long to apply',
      '❌ Incomplete documentation',
      '❌ Wrong visa type selection',
      '❌ Language test mistakes',
      '❌ Employment contract issues'
    ]
  },
  'canton-comparison': {
    id: 'canton-comparison',
    title: 'Canton Comparison Guide',
    description: 'Compare all 26 Swiss cantons to find the best fit for your immigration goals. Includes language requirements, job markets, and quality of life.',
    fileUrl: '/downloads/canton-comparison-guide.pdf',
    fileName: 'Canton-Comparison-Guide.pdf',
    preview: [
      '📊 All 26 cantons compared',
      '💼 Job market analysis',
      '🗣️ Language requirements',
      '💰 Cost of living',
      '🎓 Education options'
    ]
  },
  'cv-template-pack': {
    id: 'cv-template-pack',
    title: 'Swiss CV Template Pack',
    description: '5 professional Swiss-style CV templates optimized for ATS systems. Includes templates for tech, finance, healthcare, and more.',
    fileUrl: '/downloads/swiss-cv-templates.zip',
    fileName: 'Swiss-CV-Template-Pack.zip',
    preview: [
      '📝 5 professional templates',
      '✅ ATS-optimized format',
      '🇨🇭 Swiss style standards',
      '💼 Multiple industries',
      '📄 Ready to customize'
    ]
  }
}

export default function DownloadPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const resolvedParams = use(params)
  const router = useRouter()
  const slug = resolvedParams?.slug as string
  const leadMagnet = slug ? LEAD_MAGNETS[slug] : null

  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [alreadyDownloaded, setAlreadyDownloaded] = useState(false)

  useEffect(() => {
    // Check if user already downloaded (stored in localStorage)
    const downloaded = localStorage.getItem(`downloaded_${slug}`)
    if (downloaded === 'true') {
      setAlreadyDownloaded(true)
    }
  }, [slug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await fetch('/api/downloads/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: name || undefined,
          downloadId: slug,
          downloadName: leadMagnet?.title
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process download')
      }

      // Mark as downloaded
      localStorage.setItem(`downloaded_${slug}`, 'true')
      setSubmitted(true)

      // Trigger download
      if (leadMagnet) {
        const link = document.createElement('a')
        link.href = leadMagnet.fileUrl
        link.download = leadMagnet.fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  if (!leadMagnet) {
    return (
      <div className="min-h-screen bg-slate-50">

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Download Not Found</h1>
          <p className="text-slate-600 mb-8">The download you're looking for doesn't exist.</p>
          <a href="/resources" className="text-blue-600 hover:underline">
            View All Resources →
          </a>
        </div>
      </div>
    )
  }

  // If already submitted or downloaded, show download link
  if (submitted || alreadyDownloaded) {
    return (
      <div className="min-h-screen bg-slate-50">

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-8 md:p-12 text-center"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Download Ready! 🎉
            </h1>

            <p className="text-lg text-slate-600 mb-8">
              Your download should start automatically. If it doesn't, click the button below.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h2 className="font-semibold text-slate-900 mb-2">{leadMagnet.title}</h2>
              <p className="text-slate-600 text-sm mb-4">{leadMagnet.description}</p>
              
              <a
                href={leadMagnet.fileUrl}
                download={leadMagnet.fileName}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-all"
              >
                <Download className="w-5 h-5" />
                Download {leadMagnet.fileName}
              </a>
            </div>

            <div className="bg-slate-50 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-slate-900 mb-3">What's Next?</h3>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Check your email for additional resources and tips</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Explore our comprehensive guides and tools</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Book a consultation for personalized guidance</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/resources"
                className="inline-flex items-center justify-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold px-6 py-3 rounded-lg transition-all"
              >
                <FileText className="w-5 h-5" />
                View All Resources
              </a>
              <a
                href="/consultation"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-all"
              >
                Book Consultation
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 md:p-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                <Download className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{leadMagnet.title}</h1>
                <p className="text-blue-100 text-lg">{leadMagnet.description}</p>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12">
            {/* Preview */}
            <div className="bg-slate-50 rounded-lg p-6 mb-8">
              <h2 className="font-semibold text-slate-900 mb-4">What's Inside:</h2>
              <ul className="space-y-3">
                {leadMagnet.preview.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-700">
                    <span className="text-blue-600 font-semibold mt-0.5">{idx + 1}.</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Email Capture Form */}
            <div className="border-t border-slate-200 pt-8">
              <div className="flex items-center gap-3 mb-6">
                <Mail className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-slate-900">
                  Get Your Free Download
                </h2>
              </div>

              <p className="text-slate-600 mb-6">
                Enter your email address to download this resource. We'll also send you valuable immigration tips and updates.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="John Doe"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <p className="text-red-600">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    'Processing...'
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Download Free Resource
                    </>
                  )}
                </button>

                <p className="text-xs text-slate-500 text-center">
                  By downloading, you agree to receive email updates from Swiss Immigration Pro.
                  You can unsubscribe at any time.
                </p>
              </form>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 pt-8 border-t border-slate-200">
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">18,500+</div>
                  <div className="text-sm text-slate-600">Downloads</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">87%</div>
                  <div className="text-sm text-slate-600">Success Rate</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">Free</div>
                  <div className="text-sm text-slate-600">No Credit Card</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

