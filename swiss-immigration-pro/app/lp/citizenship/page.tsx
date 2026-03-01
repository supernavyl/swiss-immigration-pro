import type { Metadata } from 'next'
import { generateMetadata as genMeta, generateFAQSchema } from '@/lib/seo/meta-helpers'
import CitizenshipContent from './content'

const FAQ_ITEMS = [
  {
    question: 'How long do you have to live in Switzerland to get citizenship?',
    answer:
      'Standard naturalization requires 10 years of legal residence in Switzerland. Time spent in Switzerland between ages 8-18 counts double. If your spouse is a Swiss citizen, you can apply after just 5 years of residence (and 3 years of marriage). Third-generation immigrants can apply through a simplified process regardless of residence duration.',
  },
  {
    question: 'What language level is required for Swiss citizenship?',
    answer:
      'You must demonstrate oral proficiency at CEFR level B1 and written proficiency at A2 in an official Swiss language (German, French, Italian, or Romansh). Some cantons require higher levels — for example, B2 oral in certain German-speaking cantons. Our platform includes language test preparation with practice materials for all levels.',
  },
  {
    question: 'How much does the Swiss naturalization process cost?',
    answer:
      'Costs vary significantly by canton and municipality. Federal fees range from CHF 100-150, but cantonal and municipal fees can add CHF 500-3,000+. Some cantons like Zurich charge based on income. Our canton guide breaks down exact costs for all 26 cantons so there are no surprises.',
  },
  {
    question: 'Can I hold dual citizenship with Switzerland?',
    answer:
      'Yes, Switzerland has allowed dual citizenship since 1992. You can keep your original nationality when becoming Swiss. However, check your home country\'s rules — some countries (e.g., Austria, Netherlands) may require you to renounce their citizenship. Our platform provides country-specific dual citizenship guidance.',
  },
  {
    question: 'What is the Swiss citizenship integration test?',
    answer:
      'The integration assessment evaluates your knowledge of Swiss geography, history, politics, and local customs. It also assesses your social integration — participation in local life, knowledge of the community, and adherence to Swiss values. Format varies by canton (interview, written test, or both). Our Citizenship Pro Pack includes a complete question bank and practice tests.',
  },
]

export const metadata: Metadata = genMeta({
  title: 'Swiss Citizenship & Naturalization Guide — Complete Roadmap',
  description:
    'Your complete path to Swiss citizenship. 10-year roadmap, language test prep, canton-specific requirements, integration test practice. AI-powered guidance from application to passport.',
  keywords: [
    'swiss citizenship',
    'Swiss naturalization',
    'Einbürgerung',
    'swiss passport',
    'Swiss citizenship test',
    'Swiss citizenship requirements',
    'Swiss naturalization process',
    'Swiss citizenship timeline',
    'Swiss integration test',
    'dual citizenship Switzerland',
  ],
  url: '/lp/citizenship',
})

export default function CitizenshipPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateFAQSchema(FAQ_ITEMS)),
        }}
      />
      <CitizenshipContent faqItems={FAQ_ITEMS} />
    </>
  )
}
