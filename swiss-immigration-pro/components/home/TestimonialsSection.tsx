'use client'

import { motion } from 'framer-motion'
import { Star, Quote, Heart, MapPin } from 'lucide-react'
import Image from 'next/image'
import { useT } from '@/lib/i18n/useTranslation'

const TESTIMONIALS = [
  {
    name: 'Sarah Chen',
    role: 'Software Engineer from Singapore',
    location: 'Zurich, Switzerland',
    photo: '/images/testimonials/sarah-chen.jpg',
    accent: 'bg-violet-50 dark:bg-violet-900/20',
    badge: 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300',
    quote:
      'I was rejected twice before finding Swiss Immigration Pro. Their AI assistant helped me identify critical document issues. Approved in 8 weeks!',
    result: 'L Permit \u2022 CHF 120k Salary',
    rating: 5,
  },
  {
    name: 'Michael Rodriguez',
    role: 'Pharma Researcher from USA',
    location: 'Basel, Switzerland',
    photo: '/images/testimonials/michael-rodriguez.jpg',
    accent: 'bg-blue-50 dark:bg-blue-900/20',
    badge: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
    quote:
      'The cantonal strategy module was a game-changer. Switched from Zurich to Basel and got approved in 6 weeks when colleagues waited 16+ weeks.',
    result: 'B Permit \u2022 6 Weeks Processing',
    rating: 5,
  },
  {
    name: 'Priya Patel',
    role: 'Finance Professional from India',
    location: 'Geneva, Switzerland',
    photo: '/images/testimonials/priya-patel.jpg',
    accent: 'bg-rose-50 dark:bg-rose-900/20',
    badge: 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300',
    quote:
      'The salary negotiation scripts saved me CHF 25,000 annually. The CV optimization got me 3 interviews in 2 weeks. Worth every franc.',
    result: 'CHF 145k Salary \u2022 B Permit',
    rating: 5,
  },
  {
    name: 'Marie Dubois',
    role: 'Banking Executive from France',
    location: 'Geneva, Switzerland',
    photo: '/images/testimonials/marie-dubois.jpg',
    accent: 'bg-emerald-50 dark:bg-emerald-900/20',
    badge: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
    quote:
      'The CV templates are incredible. Applied the banking sector template and got 4 interviews. The embassy process guide eliminated all stress.',
    result: 'B Permit \u2022 4 Interviews',
    rating: 5,
  },
  {
    name: 'Ahmed Hassan',
    role: 'Tech Professional from Jordan',
    location: 'Zurich, Switzerland',
    photo: '/images/testimonials/ahmed-hassan.jpg',
    accent: 'bg-amber-50 dark:bg-amber-900/20',
    badge: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
    quote:
      'Brought my family to Switzerland using the family reunification guide. The checklist covered everything. Immigration office had no questions.',
    result: 'Family Reunified \u2022 Zurich',
    rating: 5,
  },
  {
    name: 'Sofia Martinez',
    role: 'Marketing Director from Spain',
    location: 'Lausanne, Switzerland',
    photo: '/images/testimonials/sofia-martinez.jpg',
    accent: 'bg-indigo-50 dark:bg-indigo-900/20',
    badge: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300',
    quote:
      'The integration guide helped my family adapt quickly. Language resources and cultural insights made the transition smooth and enjoyable.',
    result: 'C Permit \u2022 Full Integration',
    rating: 5,
  },
]

export default function TestimonialsSection() {
  const { t } = useT()

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
      className="py-24 bg-gradient-to-br from-blue-50 via-white to-slate-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-4 py-1.5 rounded-full text-xs font-semibold mb-4">
            <Heart className="w-3.5 h-3.5" />
            <span>Real Success Stories</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {t('home.testimonials')}
          </h2>
          <p className="text-slate-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Real people who made Switzerland their home. See how our platform transformed their
            immigration journey.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TESTIMONIALS.map((story, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ y: -6, scale: 1.01 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl dark:shadow-none transition-all border border-slate-100 dark:border-gray-700"
            >
              <div className="flex items-center gap-4 mb-5">
                <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 ring-2 ring-white dark:ring-gray-700 shadow-md">
                  <Image
                    src={story.photo}
                    alt={story.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm truncate">
                    {story.name}
                  </h4>
                  <p className="text-slate-500 dark:text-gray-400 text-xs truncate">{story.role}</p>
                  <div className="flex items-center gap-0.5 mt-1.5">
                    {[...Array(story.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-5">
                <Quote className="w-5 h-5 text-blue-400 opacity-40 mb-2" />
                <p className="text-slate-600 dark:text-gray-300 text-sm leading-relaxed">
                  &ldquo;{story.quote}&rdquo;
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-gray-700">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${story.badge}`}
                >
                  {story.result}
                </span>
                <span className="text-xs text-slate-400 dark:text-gray-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {story.location.split(',')[0]}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
