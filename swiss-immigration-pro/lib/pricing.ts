// Pricing constants used by frontend components.
// Stripe server-side logic is handled by the Python backend.

// Verifiable product facts only — no marketing estimates
export const SITE_STATS = {
  modules: '31',
  languages: '4',
  cvTemplates: '15',
  cantons: '26',
} as const

export const PRICING_PACKS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    description: 'Get started with essential Swiss immigration resources and basic AI guidance at no cost. Perfect for exploring the platform and understanding Swiss immigration basics.',
    shortDescription: 'Essential Swiss immigration resources at no cost',
    valueProposition: 'Start your Swiss immigration journey completely free',
    recommendedFor: 'Newcomers exploring Swiss immigration options',
    keywords: ['free swiss immigration guide', 'swiss immigration resources', 'free immigration quiz', 'swiss visa information'],
    features: [
      'Access to 2 comprehensive guide modules',
      'Immigration eligibility quiz & assessment',
      'AI chatbot assistance (10 messages/day)',
      'Basic work permit information & pathways',
      'Canton comparison overview',
      'Essential document checklists',
      'Community forum access',
      'Email newsletter with updates',
    ],
  },
  immigration: {
    id: 'immigration',
    name: 'Immigration Pack',
    price: 9,
    badge: 'Most Popular for Job Seekers',
    description: 'Complete Swiss immigration toolkit with unlimited AI assistance, professional CV templates, employment guides, and comprehensive checklists. Everything you need to navigate work permits, visa applications, and employment in Switzerland.',
    shortDescription: 'Complete Swiss immigration toolkit with AI assistance and CV templates',
    valueProposition: 'All-in-one immigration resource center with AI-powered guidance',
    recommendedFor: 'Professionals actively applying for Swiss work permits and visas',
    keywords: ['swiss immigration pack', 'swiss work permit guide', 'swiss cv templates', 'swiss visa application help', 'ats optimized cv switzerland'],
    features: [
      'Unlimited AI chatbot access (24/7 expert guidance)',
      '25+ professional Swiss CV templates (ATS-optimized)',
      'Complete work permit application checklists',
      'Cantonal quota tracking & availability alerts',
      'Salary benchmarking by industry & canton',
      'Embassy submission guides & document kits',
      'ATS-optimized CV builder with real-time feedback',
      'Interactive permit eligibility calculator',
      'Priority email support (48h response)',
      'Access to all 5 core immigration modules',
      'Downloadable PDF guides & templates',
      'Job application strategy playbook',
    ],
  },
  advanced: {
    id: 'advanced',
    name: 'Advanced Pack',
    price: 29,
    badge: 'Best Value',
    description: 'Premium Swiss immigration masterclass with comprehensive learning modules, AI tutoring, progress tracking, and expert strategies. Advanced tools for job hunting, cantonal optimization, and long-term immigration success in Switzerland.',
    shortDescription: 'Premium masterclass with comprehensive learning modules and AI tutoring',
    valueProposition: 'Master Swiss immigration with expert guidance and advanced tools',
    recommendedFor: 'Serious applicants committed to long-term success in Switzerland',
    keywords: ['swiss immigration masterclass', 'swiss immigration course', 'advanced swiss visa guide', 'swiss cantonal immigration tips', 'swiss job search strategies'],
    features: [
      'Everything in Immigration Pack (all features included)',
      '10 comprehensive guide modules (66,000+ words)',
      'Advanced AI tutor with personalized learning paths',
      'Progress tracking dashboard & milestone system',
      'Strategic job hunt playbook (Swiss market secrets)',
      'Cantonal optimization strategies & insider tips',
      'Tax & financial planning calculator',
      'Language test preparation toolkit',
      'Healthcare & insurance system guide',
      'Housing & cost of living analysis',
      'Family reunification process roadmap',
      'Integration test preparation materials',
      'Priority email support (24h response)',
      'Success stories & real case studies',
      'Annual strategy review session',
    ],
  },
  citizenship: {
    id: 'citizenship',
    name: 'Citizenship Pro Pack',
    price: 79,
    badge: 'Ultimate Solution',
    description: 'Ultimate Swiss citizenship roadmap with lifetime access, personalized coaching, and expert video content. Complete 10-year pathway guidance including language test preparation, spouse shortcuts, and comprehensive application strategies for Swiss naturalization.',
    shortDescription: 'Ultimate Swiss citizenship roadmap with lifetime access and personalized coaching',
    valueProposition: 'Your complete path to Swiss citizenship with lifetime expert support',
    recommendedFor: 'Long-term residents committed to obtaining Swiss citizenship',
    keywords: ['swiss citizenship guide', 'swiss naturalization process', 'swiss citizenship roadmap', 'swiss citizenship test preparation', 'swiss citizenship application help'],
    features: [
      'Everything in Advanced Pack (complete access)',
      'Complete 10-year citizenship roadmap & timeline',
      'Spouse & 3rd-generation naturalization shortcuts',
      'Comprehensive language test preparation (B1-B2 level)',
      'Lifetime access to all content & future updates',
      'Priority support with 24-hour response guarantee',
      'Personalized application coaching sessions',
      'Cantonal naturalization requirements database',
      'Integration test question bank & practice tests',
      'Legal citation templates & application forms',
      'Success rate optimization strategies',
      'Community access to citizenship applicants',
      'Quarterly strategy review sessions',
      'Expert document review (up to 3 critical docs)',
      'Naturalization interview preparation guide',
      'All future content & feature additions included',
    ],
  },
} as const

export type PackId = keyof typeof PRICING_PACKS

export const ONE_TIME_PRODUCTS = {
  masterclass: {
    id: 'masterclass',
    name: 'Swiss Immigration Masterclass',
    price: 49700, // CHF 497 in cents
    description: 'Complete self-paced course covering everything from work permits to citizenship',
    type: 'course',
    features: [
      '8-hour video course',
      'Comprehensive study materials',
      'Certificate of completion',
      'Lifetime access',
      'Bonus: CV templates pack',
      'Bonus: Application checklists',
    ],
  },
  citizenship_roadmap: {
    id: 'citizenship_roadmap',
    name: 'Citizenship Roadmap PDF',
    price: 9700, // CHF 97 in cents
    description: 'Detailed 10-year roadmap to Swiss citizenship',
    type: 'pdf',
    features: [
      'Step-by-step 10-year plan',
      'Timeline visualization',
      'Requirements checklist',
      'Cantonal variations guide',
      'Language test preparation tips',
    ],
  },
  application_support: {
    id: 'application_support',
    name: 'Application Support Package',
    price: 150000, // CHF 1,500 in cents
    description: 'Full support through your entire application process',
    type: 'service',
    features: [
      '60-minute strategy call',
      'Application review & feedback',
      'Document preparation guidance',
      '3 follow-up calls (30min each)',
      'Email support throughout process',
      'Priority response (24h)',
    ],
  },
} as const

export type OneTimeProductId = keyof typeof ONE_TIME_PRODUCTS
