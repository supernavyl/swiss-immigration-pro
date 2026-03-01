import type { Metadata } from 'next'
import { generateMetadata as genMeta, generateFAQSchema } from '@/lib/seo/meta-helpers'
import WorkPermitContent from './content'

const FAQ_ITEMS = [
  {
    question: 'What types of Swiss work permits are there?',
    answer:
      'Switzerland has several work permit types: L permit (short-term, up to 1 year), B permit (residence, renewable annually), C permit (permanent settlement after 5-10 years), and G permit (cross-border commuters). EU/EFTA nationals benefit from the Agreement on the Free Movement of Persons, while non-EU nationals face stricter quota-based requirements.',
  },
  {
    question: 'How long does the Swiss work permit process take?',
    answer:
      'Processing times vary by canton and permit type. L and B permits for EU/EFTA nationals typically take 2-4 weeks. For non-EU nationals, the process involves cantonal labor market approval and can take 6-12 weeks. Our platform helps you prepare all documents correctly upfront to avoid delays from incomplete applications.',
  },
  {
    question: 'What are the main reasons for work permit rejection?',
    answer:
      'Common rejection reasons include: incomplete documentation, failing to demonstrate that no qualified Swiss or EU candidate is available (for non-EU applicants), not meeting salary thresholds, incorrect permit type selection, and missing cantonal quota windows. Our Permit Calculator and AI assistant help you avoid all of these pitfalls.',
  },
  {
    question: 'Do I need to speak German or French to work in Switzerland?',
    answer:
      'Language requirements depend on the canton and role. While not always legally required for a work permit, most employers expect at least basic proficiency in the local language (German, French, or Italian). English-only roles exist primarily in international organizations and tech companies. Our platform includes language test preparation resources.',
  },
  {
    question: 'How much does Swiss Immigration Pro cost?',
    answer:
      'We offer a free tier with basic resources and 10 daily AI questions. The Immigration Pack at CHF 9/month includes unlimited AI access, 25+ Swiss CV templates, and complete work permit checklists. The Advanced Pack at CHF 29/month adds 10 comprehensive guide modules, progress tracking, and advanced AI tutoring. Cancel anytime, no commitment.',
  },
]

export const metadata: Metadata = genMeta({
  title: 'Swiss Work Permit Guide — 96% Success Rate',
  description:
    'Navigate Swiss work permits with AI-powered guidance. Professional CV templates, permit calculator, expert checklists. Join 18,500+ successful applicants. Start free today.',
  keywords: [
    'swiss work permit',
    'B permit Switzerland',
    'L permit Switzerland',
    'work in Switzerland',
    'Swiss visa application',
    'Swiss work visa',
    'Swiss employment permit',
    'work permit rejection',
    'Swiss CV template',
    'ATS optimized CV Switzerland',
  ],
  url: '/lp/work-permit',
})

export default function WorkPermitPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateFAQSchema(FAQ_ITEMS)),
        }}
      />
      <WorkPermitContent faqItems={FAQ_ITEMS} />
    </>
  )
}
