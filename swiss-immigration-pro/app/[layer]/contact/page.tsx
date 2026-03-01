'use client'

import { useState, useEffect, use } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, Clock, CheckCircle, AlertCircle, MessageSquare, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import LayerHeader from '@/components/layout/LayerHeader'

const LAYER_CONFIG = {
  eu: {
    layer: 'eu' as const,
    homeHref: '/eu',
    badge: {
      icon: <Sparkles className="w-3.5 h-3.5" />,
      text: 'EU/EFTA Freedom of Movement: No Work Permit Quotas Required',
      bgColor: 'bg-blue-600',
      textColor: 'text-white'
    }
  },
  us: {
    layer: 'us' as const,
    homeHref: '/us',
    badge: {
      icon: <AlertCircle className="w-3.5 h-3.5" />,
      text: '2025 Quota Alert: ~4,500 B Permits for Third-Country Nationals • Apply Early',
      bgColor: 'bg-black',
      textColor: 'text-white'
    }
  },
  other: {
    layer: 'other' as const,
    homeHref: '/other',
    badge: {
      icon: <Sparkles className="w-3.5 h-3.5" />,
      text: 'Serving Citizens from 190+ Countries • Expert Third-Country Immigration Guidance',
      bgColor: 'bg-blue-600',
      textColor: 'text-white'
    }
  }
}

type PageProps = { params: Promise<{ layer: string }> }

export default function LayerContactPage({ params }: PageProps) {
  const { layer: layerParam } = use(params)
  const searchParams = useSearchParams()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [layer, setLayer] = useState<'eu' | 'us' | 'other'>('other')

  useEffect(() => {
    // Determine layer from URL
    if (layerParam === 'eu' || layerParam === 'us' || layerParam === 'other') {
      setLayer(layerParam)
    } else {
      // Fallback to localStorage or default
      const stored = localStorage.getItem('userLayer')
      if (stored) {
        try {
          const layerData = JSON.parse(stored)
          if (layerData?.layer === 'eu' || layerData?.layer === 'us' || layerData?.layer === 'other') {
            setLayer(layerData.layer)
          }
        } catch {
          setLayer('other')
        }
      }
    }
  }, [layerParam])

  const layerConfig = LAYER_CONFIG[layer] || LAYER_CONFIG.other
  const isConsultation = searchParams?.get('type') === 'consultation'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          layer,
          type: isConsultation ? 'consultation' : 'contact'
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      setSubmitted(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (err: any) {
      setError(err.message || 'Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <LayerHeader
        layer={layerConfig.layer}
        homeHref={layerConfig.homeHref}
        customBadge={layerConfig.badge}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6"
            >
              <Sparkles className="w-4 h-4" />
              {isConsultation ? "Book Your Consultation" : "We're here to help"}
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              {isConsultation ? 'Book a Consultation' : 'Get in Touch'}
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              {isConsultation 
                ? 'Schedule a personalized consultation with our immigration experts to discuss your specific situation.'
                : 'Have questions about Swiss immigration? Our team is ready to help you succeed on your journey.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form - Takes 2 columns on large screens */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-slate-200/50">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">Message Sent! 🎉</h2>
                  <p className="text-slate-600 mb-8 max-w-md mx-auto">
                    Thank you for reaching out. We'll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Send Another Message →
                  </button>
                </motion.div>
              ) : (
                <>
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-slate-900">
                        {isConsultation ? 'Book Your Consultation' : 'Send us a Message'}
                      </h2>
                      <p className="text-slate-600 mt-1">We typically respond within 24 hours</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Your Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900 placeholder-slate-400"
                          placeholder="John Doe"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900 placeholder-slate-400"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-slate-900 placeholder-slate-400"
                        placeholder={isConsultation ? "Consultation Request" : "How can we help you?"}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        required
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none text-slate-900 placeholder-slate-400"
                        placeholder={isConsultation 
                          ? "Please tell us about your situation and what you'd like to discuss in the consultation..."
                          : "Tell us about your situation or questions..."}
                      />
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3"
                      >
                        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                        <p className="text-red-700 text-sm">{error}</p>
                      </motion.div>
                    )}

                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          {isConsultation ? 'Request Consultation' : 'Send Message'}
                        </>
                      )}
                    </motion.button>
                  </form>
                </>
              )}
            </div>
          </motion.div>

          {/* Sidebar - Contact Info & Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200/50">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <motion.div
                  whileHover={{ x: 4 }}
                  className="flex items-start gap-4 group"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                    <Mail className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Email</h4>
                    <a
                      href="mailto:info@swissimmigrationpro.com"
                      className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      info@swissimmigrationpro.com
                    </a>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ x: 4 }}
                  className="flex items-start gap-4 group"
                >
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Phone</h4>
                    <a
                      href="mailto:contact@swissimmigrationpro.com"
                      className="text-slate-700 hover:text-blue-600 font-medium transition-colors"
                    >
                      Use the contact form below
                    </a>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ x: 4 }}
                  className="flex items-start gap-4 group"
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-purple-200 transition-colors">
                    <MapPin className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Office</h4>
                    <p className="text-slate-600 leading-relaxed">
                      Alpine Legal Partners<br />
                      Zurich, Switzerland
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ x: 4 }}
                  className="flex items-start gap-4 group"
                >
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-orange-200 transition-colors">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Response Time</h4>
                    <p className="text-slate-600">
                      Usually within 24 hours
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Quick Actions</h3>
              <p className="text-blue-100 mb-6 text-sm leading-relaxed">
                Get instant answers or book a personalized consultation
              </p>
              
              <div className="space-y-3">
                {!isConsultation && (
                  <Link
                    href={`/${layer}/contact?type=consultation`}
                    className="block w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl p-4 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold mb-1">Book Consultation</div>
                        <div className="text-sm text-blue-100">Expert guidance</div>
                      </div>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                )}

                <button
                  onClick={() => {
                    if (typeof window !== 'undefined' && (window as any).openChatWidget) {
                      (window as any).openChatWidget()
                    }
                  }}
                  className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl p-4 transition-all group text-left"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold mb-1">AI Chat Assistant</div>
                      <div className="text-sm text-blue-100">Instant answers</div>
                    </div>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-amber-900 mb-2">Important Notice</h4>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    This platform provides general information only. Not legal advice. For specific legal matters, please book a consultation.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

