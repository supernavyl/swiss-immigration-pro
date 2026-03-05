'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Award, BookOpen, TrendingUp, Shield } from 'lucide-react'
import { ONE_TIME_PRODUCTS } from '@/lib/pricing'

interface AddOnsListProps {
  onCheckout: (productId: string) => void
}

const ADD_ONS = [
  {
    id: ONE_TIME_PRODUCTS.citizenship_roadmap.id,
    name: ONE_TIME_PRODUCTS.citizenship_roadmap.name,
    price: 'CHF 97',
    type: 'PDF Guide',
    description: ONE_TIME_PRODUCTS.citizenship_roadmap.description,
    features: ONE_TIME_PRODUCTS.citizenship_roadmap.features,
    icon: BookOpen,
    color: 'bg-blue-50 text-blue-600',
    badge: null as string | null,
  },
  {
    id: ONE_TIME_PRODUCTS.masterclass.id,
    name: ONE_TIME_PRODUCTS.masterclass.name,
    price: 'CHF 497',
    type: 'Video Course',
    description: ONE_TIME_PRODUCTS.masterclass.description,
    features: ONE_TIME_PRODUCTS.masterclass.features,
    icon: TrendingUp,
    color: 'bg-purple-50 text-purple-600',
    badge: 'Best Value',
  },
  {
    id: ONE_TIME_PRODUCTS.application_support.id,
    name: ONE_TIME_PRODUCTS.application_support.name,
    price: 'CHF 1,500',
    type: 'Expert Service',
    description: ONE_TIME_PRODUCTS.application_support.description,
    features: ONE_TIME_PRODUCTS.application_support.features,
    icon: Shield,
    color: 'bg-green-50 text-green-600',
    badge: 'Highest Success Rate',
  },
]

export default function AddOnsList({ onCheckout }: AddOnsListProps) {
  return (
    <section className="mt-12 sm:mt-16 md:mt-24" aria-label="Premium add-ons">
      <div className="text-center mb-8 sm:mb-12 px-2">
        <div className="inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 px-4 py-1.5 rounded-full text-xs font-semibold mb-4 border border-amber-200 dark:border-amber-700/30">
          <Award className="w-3.5 h-3.5" />
          Premium Add-Ons &mdash; One-Time Purchase
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
          Need More? Go Premium
        </h2>
        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-400 max-w-2xl mx-auto opacity-80">
          Standalone products to complement any subscription plan. Pay once, keep forever.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {ADD_ONS.map((product) => (
          <motion.div
            key={product.id}
            whileHover={{ y: -4 }}
            className="bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-gray-100 dark:border-gray-800 shadow-lg hover:shadow-xl dark:hover:shadow-gray-900/40 transition-all relative"
          >
            {product.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow whitespace-nowrap">
                {product.badge}
              </div>
            )}
            <div className={`w-11 h-11 ${product.color} rounded-xl flex items-center justify-center mb-4 dark:bg-opacity-20`}>
              <product.icon className="w-5 h-5" />
            </div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">
              {product.type}
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{product.name}</h3>
            <div className="text-2xl font-extrabold text-gray-900 dark:text-white mb-3">
              {product.price}{' '}
              <span className="text-sm font-normal text-gray-400 dark:text-gray-500">one-time</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">{product.description}</p>
            <ul className="space-y-2 mb-6">
              {product.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-400">
                  <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400 shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => onCheckout(product.id)}
              className="w-full py-3 rounded-xl font-bold text-sm bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white transition-all shadow active:scale-[0.98] touch-manipulation min-h-[44px]"
              aria-label={`Purchase ${product.name}`}
            >
              Buy Now &mdash; {product.price}
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
