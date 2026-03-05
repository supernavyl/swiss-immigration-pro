const FAQ_ITEMS = [
  {
    id: 'switch-plans',
    q: 'Can I switch plans later?',
    a: "Absolutely. You can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle, and we'll prorate any differences accordingly.",
  },
  {
    id: 'citizenship-one-time',
    q: 'Do you offer any one-time payment options?',
    a: 'Yes! Our Masterclass (CHF 497) and Citizenship Roadmap PDF (CHF 97) are one-time purchases with lifetime access. All subscription plans (Immigration, Advanced, Citizenship Pro) are billed monthly or annually and can be cancelled at any time with no penalties.',
  },
  {
    id: 'cancellation-policy',
    q: 'What is your cancellation policy?',
    a: 'You can cancel your subscription at any time with no penalties. Your access will continue until the end of your current billing period, ensuring you get full value from your purchase.',
  },
  {
    id: 'payment-methods',
    q: 'What payment methods do you accept?',
    a: "We accept all major credit and debit cards, Twint (Switzerland's leading mobile payment), SEPA Direct Debit for EU bank accounts, and other local payment methods. All payments are processed securely through Stripe. Prices are in CHF.",
  },
]

export default function PricingFAQ() {
  return (
    <section className="mt-12 sm:mt-16 md:mt-32 max-w-3xl mx-auto px-4 sm:px-6" aria-label="Frequently asked questions">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 md:mb-12 text-center transition-colors">
        Frequently Asked Questions
      </h2>
      <div className="space-y-3 sm:space-y-4" itemScope itemType="https://schema.org/FAQPage">
        {FAQ_ITEMS.map((item) => (
          <article
            key={item.id}
            className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md dark:hover:shadow-gray-900/30 transition-all"
            itemScope
            itemType="https://schema.org/Question"
          >
            <h3
              className="font-bold text-gray-900 dark:text-white mb-2 text-base sm:text-lg transition-colors"
              itemProp="name"
            >
              {item.q}
            </h3>
            <div itemScope itemType="https://schema.org/Answer">
              <p
                className="text-sm sm:text-base text-gray-700 dark:text-gray-400 transition-colors opacity-80 leading-relaxed"
                itemProp="text"
              >
                {item.a}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
