// Comprehensive Content for Each Pricing Pack
// NOTE: Enhanced module content is lazy-loaded via enhanced-module-loader.ts
// to keep it out of the client JS bundle (~710KB savings).

import type { EnhancedModule } from './enhanced-modules/non-free-enhanced-modules'

export interface PackContent {
  packId: string
  packName: string
  modules: Module[]
  resources: Resource[]
  tools: Tool[]
}

export interface Module {
  id: string
  title: string
  description: string
  type: 'guide' | 'checklist' | 'template' | 'video' | 'interactive'
  duration?: string
  order: number
  content?: string
  attachments?: string[]
  completed: boolean
  quiz?: {
    questions: Array<{
      question: string
      options: string[]
      correct: number
    }>
  }
  exercises?: Array<{
    title: string
    description: string
  }>
  enhancedModule?: EnhancedModule
}

export interface Resource {
  id: string
  title: string
  type: 'pdf' | 'template' | 'checklist' | 'guide' | 'video'
  category: string
  downloadUrl?: string
}

export interface Tool {
  id: string
  title: string
  description: string
  type: 'calculator' | 'generator' | 'tracker' | 'quiz' | 'planner'
  url: string
}

export const PACK_CONTENT: Record<string, PackContent> = {
  free: {
    packId: 'free',
    packName: 'Free Starter Pack',
    modules: [
      {
        id: 'free-01',
        title: 'Complete Guide to the Swiss Immigration System',
        description: 'A comprehensive and authoritative introduction to Switzerland\'s immigration framework. This guide covers the complete legal foundations, all residence permit categories, entry requirements, and practical pathways for foreign nationals seeking to establish residence and employment in Switzerland.',
        type: 'interactive',
        duration: '75-90 minutes',
        order: 1,
        completed: false,
        // enhancedModule loaded lazily via loadEnhancedModule()
        quiz: {
          questions: [
            { question: 'What is the main distinction in Switzerland\'s immigration system?', options: ['Age-based track', 'Dual-track (EU/EFTA vs Third-Country)', 'Income-based track', 'Language-based track'], correct: 1 },
            { question: 'How many foreign residents does Switzerland host?', options: ['500,000', '1.2 million', '2.4 million', '4 million'], correct: 2 },
            { question: 'Which agreement governs EU/EFTA citizens\' access to Switzerland?', options: ['Schengen Agreement', 'Dublin Regulation', 'Agreement on Free Movement of Persons (FMPA)', 'Lisbon Treaty'], correct: 2 },
            { question: 'How many cantons does Switzerland have?', options: ['16', '20', '26', '30'], correct: 2 }
          ]
        },
        exercises: [
          { title: 'Identify Your Track', description: 'Determine whether you fall under the EU/EFTA or Third-Country track and list the key differences that apply to you' },
          { title: 'Canton Research', description: 'Research your target canton\'s migration office website and note their specific requirements' }
        ]
      },
      {
        id: 'free-02',
        title: 'Application Process: Documentation and Timelines',
        description: 'A detailed procedural guide covering all documentation requirements, realistic processing timelines, common application pitfalls, and proven strategies for successful residence permit applications in Switzerland.',
        type: 'interactive',
        duration: '60-70 minutes',
        order: 2,
        completed: false,
        // enhancedModule loaded lazily via loadEnhancedModule()
        quiz: {
          questions: [
            { question: 'How long must your passport be valid beyond the permit period?', options: ['3 months', '6 months', '12 months', '15 months'], correct: 3 },
            { question: 'What type of health insurance is required in Switzerland?', options: ['Any international plan', 'KVG-compliant Swiss plan', 'Employer-provided only', 'None required initially'], correct: 1 },
            { question: 'Within how many days must you register at your commune after arrival?', options: ['7 days', '14 days', '30 days', '90 days'], correct: 1 },
            { question: 'Who is responsible for submitting a work permit application?', options: ['The applicant directly', 'The employer', 'A registered lawyer', 'The Swiss embassy'], correct: 1 }
          ]
        },
        exercises: [
          { title: 'Document Audit', description: 'Go through each item in the readiness checklist and mark which documents you already have and which you still need to obtain' },
          { title: 'Timeline Builder', description: 'Create a personal timeline with deadlines for gathering all required documents before your target application date' }
        ]
      },
      {
        id: 'free-03',
        title: 'Integration Requirements and Swiss Society',
        description: 'Understanding integration as both a legal requirement and practical necessity in Switzerland. This module covers language proficiency standards, economic participation requirements, and practical guidance for successfully establishing yourself within Swiss society.',
        type: 'interactive',
        duration: '50-60 minutes',
        order: 3,
        completed: false,
        // enhancedModule loaded lazily via loadEnhancedModule()
        quiz: {
          questions: [
            { question: 'What is the annual quota for non-EU/EFTA work permits?', options: ['4,000', '6,500', '8,500', '12,000'], correct: 2 },
            { question: 'Which permit leads to permanent residence?', options: ['L Permit', 'G Permit', 'B Permit converting to C Permit', 'S Permit'], correct: 2 },
            { question: 'What language level is typically required for integration?', options: ['A1', 'A2', 'B1', 'C1'], correct: 2 }
          ]
        },
        exercises: [
          { title: 'Pathway Mapping', description: 'Based on your nationality and situation, map out your specific permit progression pathway with estimated timelines' }
        ]
      }
    ],
    resources: [
      { id: 'res-free-01', title: 'SEM Official Guidance Links', type: 'guide', category: 'Regulations', downloadUrl: '/downloads/sem-guidance-links.pdf' },
      { id: 'res-free-02', title: 'Swiss CV Quick Fix Template', type: 'template', category: 'Employment', downloadUrl: '/downloads/swiss-cv-quick-template.docx' }
    ],
    tools: [
      { id: 'tool-free-01', title: 'Personal Eligibility Snapshot', description: 'Auto-detected region-based guidance', type: 'tracker', url: '/resources' },
      { id: 'tool-free-02', title: 'Permit Document Checklist', description: 'Track your readiness in under 10 minutes', type: 'tracker', url: '/tools/permit-calculator' }
    ]
  },
  immigration: {
    packId: 'immigration',
    packName: 'Immigration Pack',
    modules: [
      {
        id: 'imm-01',
        title: 'Swiss CV Template and Formatting',
        description: 'Master the Swiss CV format with comprehensive templates, formatting guidelines, cultural insights, and proven strategies. Learn exactly how Swiss employers evaluate CVs, what information to include, what to exclude, and how to optimize your CV for maximum impact in the Swiss job market.',
        type: 'interactive',
        duration: '85-110 minutes',
        order: 1,
        // enhancedModule loaded lazily via loadEnhancedModule()
        quiz: {
          questions: [
            { question: 'What is the maximum duration of an L Permit?', options: ['6 months', '12 months', '24 months', '5 years'], correct: 1 },
            { question: 'After how many years can EU/EFTA B permit holders apply for a C permit?', options: ['2 years', '5 years', '10 years', '15 years'], correct: 1 },
            { question: 'What is the G Permit designed for?', options: ['Students', 'Cross-border commuters', 'Refugees', 'Entrepreneurs'], correct: 1 },
            { question: 'How many non-EU B permits are available annually?', options: ['2,000', '4,500', '8,500', '12,000'], correct: 1 },
            { question: 'Which permit provides permanent residence in Switzerland?', options: ['L Permit', 'B Permit', 'G Permit', 'C Permit'], correct: 3 }
          ]
        },
        exercises: [
          { title: 'Permit Type Assessment', description: 'Based on your employment situation and nationality, identify which permit type you should target and list the specific requirements' },
          { title: 'Canton Comparison', description: 'Compare 3 cantons that interest you: their priority industries, salary expectations, language requirements, and processing times' }
        ],
        completed: false
      },
      {
        id: 'imm-02',
        title: 'Swiss Cover Letter Mastery',
        description: 'Master the art of writing compelling Swiss cover letters (Bewerbungsschreiben) that get results. Learn Swiss professional communication standards, cultural nuances, legal compliance requirements, and proven frameworks that increase application success rates by 3x in the competitive Swiss job market.',
        type: 'interactive',
        duration: '90-120 minutes',
        order: 2,
        // enhancedModule loaded lazily via loadEnhancedModule()
        quiz: {
          questions: [
            {
              question: 'How many passport photos are typically required?',
              options: ['1', '2-4', '5-6', 'Not required'],
              correct: 1
            },
            {
              question: 'What is the minimum passport validity required?',
              options: ['3 months', '6 months', '1 year', 'Does not matter'],
              correct: 1
            },
            {
              question: 'Who submits the application to the cantonal authority?',
              options: ['You directly', 'Your employer', 'A lawyer', 'Embassy'],
              correct: 1
            }
          ]
        },
        exercises: [
          {
            title: 'Document Preparation Exercise',
            description: 'Create a personalized checklist based on your situation'
          },
          {
            title: 'Timeline Planner',
            description: 'Plan your application timeline based on your start date'
          }
        ],
        completed: false
      },
      {
        id: 'imm-03',
        title: 'Swiss CV Templates and Interactive Builder',
        description: 'Access comprehensive Swiss CV templates for every career level and industry. Includes ready-to-use formats with real example content, Swiss vs. international format comparison, ATS optimization checklist, and sector-specific templates for tech, finance, pharma, and consulting.',
        type: 'interactive',
        duration: '75-95 minutes',
        order: 3,
        // enhancedModule loaded lazily via loadEnhancedModule()
        quiz: {
          questions: [
            { question: 'What is the standard length for a Swiss CV?', options: ['1 page', '2 pages', '3-5 pages', 'No limit'], correct: 1 },
            { question: 'Should a Swiss CV include a professional photo?', options: ['Never', 'Always', 'Yes, it is standard practice', 'Only for senior roles'], correct: 2 },
            { question: 'Which section comes first on a Swiss CV?', options: ['Work experience', 'Education', 'Personal details and photo', 'Skills summary'], correct: 2 },
            { question: 'How should work experience be ordered on a Swiss CV?', options: ['Oldest first', 'Newest first (reverse chronological)', 'By relevance', 'Alphabetically'], correct: 1 }
          ]
        },
        exercises: [
          { title: 'CV Formatting Check', description: 'Review your current CV against Swiss standards: photo, length, structure, and language. Note what needs to change.' },
          { title: 'Industry-Specific CV Draft', description: 'Using the templates provided, create a first draft of your Swiss-format CV tailored to your target industry' }
        ],
        completed: false
      },
      {
        id: 'imm-04',
        title: 'Swiss Salary Benchmarks and Negotiation',
        description: 'Comprehensive salary analysis across all industries, cantons, and experience levels. Master salary negotiation strategies, understand total compensation packages, and maximize your earning potential in the Swiss job market with data-driven insights and proven negotiation frameworks based on official SECO data.',
        type: 'interactive',
        duration: '90-120 minutes',
        order: 4,
        // enhancedModule loaded lazily via loadEnhancedModule()
        quiz: {
          questions: [
            { question: 'What is the approximate median annual salary in Switzerland?', options: ['CHF 50,000', 'CHF 65,000', 'CHF 80,000', 'CHF 120,000'], correct: 2 },
            { question: 'Which canton generally has the highest salary expectations?', options: ['Ticino', 'Bern', 'Zug', 'Vaud'], correct: 2 },
            { question: 'What is a 13th month salary?', options: ['A bonus for good performance', 'An extra monthly salary paid annually as standard', 'Overtime compensation', 'A tax refund'], correct: 1 },
            { question: 'Why does salary matter for work permit applications?', options: ['It does not matter', 'Higher salary improves approval chances for non-EU applicants', 'Only minimum wage is checked', 'Salary only matters for C permits'], correct: 1 }
          ]
        },
        exercises: [
          { title: 'Salary Benchmarking', description: 'Research the SECO salary database for your specific role, experience level, and target canton. Calculate your market value range.' },
          { title: 'Total Compensation Analysis', description: 'Beyond base salary, list all components of a typical Swiss package: pension (BVG), insurance, bonus, vacation days, and other benefits' }
        ],
        completed: false
      },
      {
        id: 'imm-05',
        title: 'Embassy Submission Guide',
        description: 'Master the embassy submission process with comprehensive checklists, document preparation guides, appointment scheduling strategies, and step-by-step procedures for successful permit collection at Swiss embassies and consulates worldwide. Includes legal requirements, common issues resolution, and embassy-specific procedures.',
        type: 'interactive',
        duration: '75-90 minutes',
        order: 5,
        // enhancedModule loaded lazily via loadEnhancedModule()
        quiz: {
          questions: [
            { question: 'Where do you collect your Swiss residence permit after approval?', options: ['At the cantonal office', 'At the Swiss embassy/consulate in your home country', 'It is mailed to you', 'At the airport on arrival'], correct: 1 },
            { question: 'Within how many days of permit issuance must you enter Switzerland?', options: ['30 days', '60 days', '90 days', '180 days'], correct: 2 },
            { question: 'What should you do within 14 days of arriving in Switzerland?', options: ['Open a bank account', 'Register at the local municipality', 'Find an apartment', 'Get a Swiss phone number'], correct: 1 }
          ]
        },
        exercises: [
          { title: 'Embassy Appointment Checklist', description: 'Identify your nearest Swiss embassy/consulate and prepare the complete document package needed for your appointment' },
          { title: 'Arrival Day Plan', description: 'Create a detailed plan for your first 14 days in Switzerland: commune registration, health insurance activation, bank account, and essential setup tasks' }
        ],
        completed: false
      },
      {
        id: 'imm-06',
        title: 'Finding Work in Switzerland',
        description: 'Master the Swiss job market with proven strategies, official platforms, networking approaches, and employer outreach. Covers job-room.ch, LinkedIn, recruitment agencies, Swiss business etiquette, application timing, and what employers look for.',
        type: 'interactive',
        duration: '60-80 minutes',
        order: 6,
        // enhancedModule loaded lazily via loadEnhancedModule()
        quiz: {
          questions: [
            { question: 'What is the official Swiss job portal run by SECO and the RAVs?', options: ['LinkedIn', 'jobs.ch', 'job-room.ch', 'Indeed Switzerland'], correct: 2 },
            { question: 'Why is networking often called "Vitamin B" in Switzerland?', options: ['It refers to vitamin supplements', 'B stands for Beziehungen (connections)', 'It is a type of job contract', 'It refers to bilingualism'], correct: 1 },
            { question: 'What is Probezeit?', options: ['A type of work permit', 'Probation period at the start of employment', 'A reference letter', 'A salary bonus'], correct: 1 },
            { question: 'For non-EU/EFTA nationals, when do permit quotas often fill in competitive cantons?', options: ['Quotas do not apply', 'Typically earlier in the year (Q1-Q2)', 'Only in December', 'Quotas are unlimited'], correct: 1 }
          ]
        },
        exercises: [
          { title: 'job-room.ch Profile', description: 'Create or update your profile on job-room.ch, set filters for your target region and role, and activate job alerts' },
          { title: 'Target Company and Outreach List', description: 'List 10 companies in your sector and region; for 3 of them, draft a short, personalized cold outreach message' }
        ],
        completed: false
      },
      {
        id: 'imm-07',
        title: 'Health Insurance and Your First 30 Days',
        description: 'Everything you need to know when you first arrive in Switzerland: mandatory registration within 14 days, Swiss health insurance (KVG) within 3 months, opening a bank account, transport and mobile setup, finding housing, and essential services like AHV and integration resources.',
        type: 'interactive',
        duration: '50-70 minutes',
        order: 7,
        // enhancedModule loaded lazily via loadEnhancedModule()
        quiz: {
          questions: [
            { question: 'Within how many days must you register at the commune (Einwohnerkontrolle) after moving in?', options: ['7 days', '14 days', '30 days', '90 days'], correct: 1 },
            { question: 'What is the deadline to take out Swiss basic health insurance (KVG) after registration?', options: ['14 days', '1 month', '3 months', '6 months'], correct: 2 },
            { question: 'Which official website compares Swiss health insurance premiums by canton and age?', options: ['comparis.ch only', 'priminfo.admin.ch', 'sbb.ch', 'postfinance.ch'], correct: 1 },
            { question: 'What is the typical maximum rental deposit (Kaution) in Switzerland?', options: ['1 month rent', '2 months rent', '3 months rent', '6 months rent'], correct: 2 },
            { question: 'Which document do landlords often require to prove you have no unpaid debts?', options: ['Salary slip', 'Betreibungsauszug', 'Health insurance card', 'Residence permit only'], correct: 1 }
          ]
        },
        exercises: [
          { title: 'First 14 Days Checklist', description: 'List your commune, required documents, and appointment details for registration; add tasks for Anmeldebestätigung, bank account, and health insurance comparison' },
          { title: 'Health Insurance Comparison', description: 'Use priminfo.admin.ch to compare premiums for your canton and age with different franchise levels (e.g. CHF 300 vs CHF 2,500) and note the difference' }
        ],
        completed: false
      },
      {
        id: 'imm-08',
        title: 'Understanding Swiss Workplace Culture',
        description: 'Navigate Swiss professional norms, expectations, communication style, and etiquette. Learn work-life balance expectations, regional differences, employment law essentials, and how to avoid common mistakes so you can integrate successfully into the Swiss workplace.',
        type: 'interactive',
        duration: '45-60 minutes',
        order: 8,
        // enhancedModule loaded lazily via loadEnhancedModule()
        quiz: {
          questions: [
            { question: 'How early should you arrive for a meeting in Switzerland?', options: ['Right on time', '5 minutes early', '15 minutes early', 'It does not matter'], correct: 1 },
            { question: 'What is the typical probation period (Probezeit) in Switzerland?', options: ['2 weeks', '1 month', '1-3 months', '6 months'], correct: 2 },
            { question: 'What is an Arbeitszeugnis?', options: ['A job application', 'A formal reference letter from your employer', 'A tax document', 'A health certificate'], correct: 1 },
            { question: 'What are Ruhezeiten?', options: ['Holiday entitlements', 'Quiet hours when noise must be minimized', 'Break times during work', 'Religious observances'], correct: 1 }
          ]
        },
        exercises: [
          { title: 'Culture Readiness Assessment', description: 'Review the common mistakes listed in this module and honestly assess which ones you might be at risk of making. Create a personal awareness checklist.' },
          { title: 'Regional Research', description: 'Research the specific workplace culture of your target region (German, French, or Italian-speaking) and note key differences from your home country' }
        ],
        completed: false
      }
    ],
    resources: [
      { id: 'res-001', title: 'Work Permit Application Form', type: 'pdf', category: 'Forms' },
      { id: 'res-002', title: 'Employment Contract Template', type: 'template', category: 'Templates' },
      { id: 'res-003', title: 'Document Checklist PDF', type: 'pdf', category: 'Checklists' },
      { id: 'res-004', title: 'Quota Tracker Spreadsheet', type: 'template', category: 'Tools' }
    ],
    tools: [
      { id: 'tool-001', title: 'Permit Eligibility Checker', description: 'Determine which permit you qualify for', type: 'calculator', url: '/tools/permit-checker' },
      { id: 'tool-002', title: 'CV Builder', description: 'Create Swiss-format CV in minutes', type: 'generator', url: '/tools/cv-builder' },
      { id: 'tool-003', title: 'Salary Calculator', description: 'Calculate your Swiss salary expectations', type: 'calculator', url: '/tools/salary-calc' }
    ]
  },
  advanced: {
    packId: 'advanced',
    packName: 'Advanced Pack',
    modules: [
      {
        id: 'adv-01',
        title: 'Beat the Non-EU Quota System',
        description: 'Master strategic approaches to navigate Switzerland\'s strict annual quota system for non-EU/EFTA nationals. Learn quota management strategies, timing optimization, exception categories, and proven methods to maximize your chances within the competitive 8,500 annual permit allocation. Includes detailed analysis of quota exhaustion patterns, cantonal distribution, and industry-specific strategies.',
        type: 'interactive',
        duration: '100-130 minutes',
        order: 1,
        // enhancedModule loaded lazily via loadEnhancedModule()
        quiz: {
          questions: [
            { question: 'What is the total annual quota for non-EU/EFTA work permits?', options: ['4,000', '6,000', '8,500', '12,000'], correct: 2 },
            { question: 'When do quotas typically exhaust in competitive cantons?', options: ['March', 'June', 'August-September', 'December'], correct: 2 },
            { question: 'Which category can bypass the quota system?', options: ['All EU citizens', 'Highly qualified specialists and researchers', 'Anyone with a job offer', 'Students'], correct: 1 },
            { question: 'What is the optimal time to submit a non-EU application?', options: ['Q3-Q4', 'Q4 previous year or Q1 current year', 'Summer months', 'Any time works equally'], correct: 1 }
          ]
        },
        exercises: [
          { title: 'Quota Timing Strategy', description: 'Based on your target canton and industry, calculate the optimal application window and create a submission timeline' },
          { title: 'Exception Category Analysis', description: 'Review the quota exemption categories and assess whether your profile qualifies for any exception path' }
        ],
        completed: false
      },
      {
        id: 'adv-02',
        title: 'Employer Motivation Letters',
        description: 'Master employer motivation letters for Swiss work permit applications with full letter templates for tech, finance, pharma, and consulting sectors, before/after weak-to-strong examples, mandatory legal content checklist, canton-specific preference guide, and common rejection pitfalls. Based on LEI Art. 23, OASA Art. 15-22, and SEM application requirements.',
        type: 'interactive',
        duration: '85-110 minutes',
        order: 2,
        // enhancedModule loaded lazily via loadEnhancedModule()
        quiz: {
          questions: [
            { question: 'What must an employer motivation letter explicitly demonstrate?', options: ['Company profits', 'Why specifically this foreign worker is needed', 'Number of employees', 'Office location'], correct: 1 },
            { question: 'What is the labor market test (Inländervorrang)?', options: ['A language exam', 'Proof that no suitable Swiss/EU candidate was found', 'A salary calculation', 'An integration assessment'], correct: 1 },
            { question: 'How long must a job be advertised on job-room.ch before hiring non-EU?', options: ['7 days', '14 days', '30 days', '60 days'], correct: 1 }
          ]
        },
        exercises: [
          { title: 'Motivation Letter Draft', description: 'Write a draft employer motivation letter for your specific role, citing relevant legal articles and demonstrating unique qualifications' },
          { title: 'Labor Market Test Preparation', description: 'Prepare the documentation proving the labor market test: job postings, applicant responses, and justification for why domestic candidates were unsuitable' }
        ],
        completed: false
      },
      {
        id: 'adv-03',
        title: 'Cantonal Immigration Variations',
        description: 'Master cantonal variations in Swiss immigration processing. Comprehensive analysis of all 26 cantons, their success rates, requirements, processing times, and strategic selection criteria. Learn how choosing the right canton can multiply your approval chances 2-3x. Includes industry alignment, language requirements, salary thresholds, and quota availability by canton.',
        type: 'interactive',
        duration: '110-140 minutes',
        order: 3,
        // enhancedModule loaded lazily via loadEnhancedModule()
        quiz: {
          questions: [
            {
              question: 'Which canton typically has the highest success rate for non-EU applicants?',
              options: ['Zurich (22%)', 'Geneva (18%)', 'Basel-Stadt (42%)', 'All cantons are equal'],
              correct: 2
            },
            {
              question: 'What legal basis governs cantonal variations in immigration processing?',
              options: ['Federal law only', 'AuG Art. 12 (cantonal competence)', 'Each canton has its own law', 'No legal basis'],
              correct: 1
            },
            {
              question: 'How much can choosing the right canton improve your approval chances?',
              options: ['5-10% improvement', '10-20% improvement', '2-3x improvement', 'No improvement'],
              correct: 2
            }
          ]
        },
        exercises: [
          {
            title: 'Canton Selection Calculator',
            description: 'Calculate which canton offers the best success rate for your profile'
          }
        ],
        completed: false
      },
      {
        id: 'adv-04',
        title: 'Swiss Tax and Financial Planning',
        description: 'Master Swiss tax system, optimize your financial planning, and maximize wealth building in Switzerland. Comprehensive guide to federal and cantonal taxes, Pillar 2 and 3a pension optimization, investment strategies, and financial planning frameworks. Includes full 2025 tax tables, cantonal comparisons, and Pillar 3a/2 optimization calculators.',
        type: 'interactive',
        duration: '95-120 minutes',
        order: 4,
        // enhancedModule loaded lazily via loadEnhancedModule()
        quiz: {
          questions: [
            { question: 'What is Switzerland\'s federal tax rate for high earners?', options: ['About 11.5%', 'About 25%', 'About 40%', 'There is no federal tax'], correct: 0 },
            { question: 'Which pillar of the Swiss pension system is mandatory for employees?', options: ['1st pillar only', '1st and 2nd pillars', 'All three pillars', 'None are mandatory'], correct: 1 },
            { question: 'What is the Quellensteuer (withholding tax)?', options: ['A property tax', 'Tax withheld at source for foreign workers without C permit', 'A church tax', 'A cantonal sales tax'], correct: 1 },
            { question: 'Which canton has the lowest overall tax burden?', options: ['Zurich', 'Geneva', 'Zug', 'Basel'], correct: 2 }
          ]
        },
        exercises: [
          { title: 'Tax Estimation', description: 'Use a Swiss tax calculator to estimate your annual tax burden in your target canton based on your expected salary and family situation' },
          { title: 'Pension Analysis', description: 'Calculate your expected contributions to pillars 1, 2, and 3a. Determine the optimal 3a contribution for tax savings.' }
        ],
        completed: false
      },
      {
        id: 'adv-05',
        title: 'Swiss Language Requirements and Test Preparation',
        description: 'Master Swiss language requirements for work permits, residence, and citizenship. Comprehensive guide to German, French, and Italian proficiency levels, test preparation strategies, certification options, and proven study frameworks. Includes detailed analysis of B1/B2 requirements, test formats, preparation resources, and optimization strategies for maximum success.',
        type: 'interactive',
        duration: '100-130 minutes',
        order: 5,
        // enhancedModule loaded lazily via loadEnhancedModule()
        quiz: {
          questions: [
            { question: 'What is the minimum language level typically required for a C permit?', options: ['A1', 'A2', 'B1', 'B2'], correct: 2 },
            { question: 'Which organization administers the official Swiss language tests (fide)?', options: ['SEM', 'SECO', 'fide - Swiss National Integration Commission', 'Goethe Institut'], correct: 2 },
            { question: 'How many national languages does Switzerland have?', options: ['2', '3', '4', '5'], correct: 2 },
            { question: 'Which language should you learn for Zurich?', options: ['French', 'Italian', 'German (Swiss German)', 'Romansh'], correct: 2 }
          ]
        },
        exercises: [
          { title: 'Language Self-Assessment', description: 'Take an online placement test in your target language and honestly assess your current CEFR level' },
          { title: 'Study Plan', description: 'Create a 6-month language study plan with weekly goals, resources, and milestones to reach B1 level' }
        ],
        completed: false
      },
      {
        id: 'adv-06',
        title: 'Swiss Integration and Social Adaptation',
        description: 'Master the Swiss integration requirements for work permits, residence permits, and citizenship. Comprehensive guide to integration criteria, language proficiency, economic participation, social adaptation, integration agreements, and proven strategies for successful integration. Includes detailed analysis of LEI Art. 58a, OASA Art. 62, LN Art. 11-12, and cantonal integration requirements.',
        type: 'interactive',
        duration: '110-140 minutes',
        order: 6,
        // enhancedModule loaded lazily via loadEnhancedModule()
        quiz: {
          questions: [
            { question: 'What does "integration" mean under Swiss law?', options: ['Assimilation into Swiss culture', 'A mutual process between immigrants and Swiss society', 'Learning Swiss German only', 'Getting a Swiss passport'], correct: 1 },
            { question: 'Which of these is NOT a formal integration criterion?', options: ['Language proficiency', 'Respect for public order', 'Economic participation', 'Having Swiss friends'], correct: 3 },
            { question: 'What is an integration agreement (Integrationsvereinbarung)?', options: ['A rental contract', 'A formal plan between you and authorities setting integration goals', 'An employment contract', 'A language course registration'], correct: 1 }
          ]
        },
        exercises: [
          { title: 'Integration Self-Audit', description: 'Score yourself on each official integration criterion and identify your weakest areas' },
          { title: 'Community Involvement Plan', description: 'Research 3 local organizations, clubs, or volunteer opportunities in your commune that would support your integration' }
        ],
        completed: false
      },
      {
        id: 'adv-07',
        title: 'Swiss Healthcare and Insurance System',
        description: 'Master Switzerland\'s mandatory healthcare system, understand KVG requirements, navigate insurance selection, optimize costs, and ensure compliance. Comprehensive guide to Pillar 1 health insurance, insurance models, premium optimization, coverage options, and healthcare system navigation. Includes detailed analysis of KVG Art. 3, mandatory requirements, premium structures, and cost-saving strategies.',
        type: 'interactive',
        duration: '100-130 minutes',
        order: 7,
        // enhancedModule loaded lazily via loadEnhancedModule()
        quiz: {
          questions: [
            { question: 'Is health insurance mandatory in Switzerland?', options: ['No, it is optional', 'Yes, within 3 months of arrival', 'Only for employed people', 'Only for families'], correct: 1 },
            { question: 'What does KVG stand for?', options: ['Cantonal Health Office', 'Federal Health Insurance Act', 'Community Healthcare Group', 'Swiss Medical Association'], correct: 1 },
            { question: 'What is the franchise (Franchise) in Swiss health insurance?', options: ['A hospital fee', 'The annual deductible you pay before insurance covers costs', 'A monthly premium', 'A tax on medicine'], correct: 1 },
            { question: 'Can you choose any doctor in Switzerland?', options: ['Always', 'Depends on your insurance model (HMO vs standard)', 'Never', 'Only in your canton'], correct: 1 }
          ]
        },
        exercises: [
          { title: 'Insurance Comparison', description: 'Use comparis.ch or priminfo.admin.ch to compare health insurance plans and find the best option for your situation and budget' },
          { title: 'Coverage Checklist', description: 'List what is covered by basic KVG insurance vs what requires supplementary insurance for your specific health needs' }
        ],
        completed: false
      },
      {
        id: 'adv-08',
        title: 'Swiss Housing and Cost of Living',
        description: 'Master Swiss rental markets, housing requirements, cost of living, and practical living expenses. Comprehensive guide to finding housing, rental contracts, deposits, utilities, living costs by canton, and budgeting strategies. Includes detailed analysis of rental law, housing documentation requirements, cost breakdowns, and optimization strategies.',
        type: 'interactive',
        duration: '95-120 minutes',
        order: 8,
        // enhancedModule loaded lazily via loadEnhancedModule()
        quiz: {
          questions: [
            { question: 'What is the typical notice period for apartment rentals in Switzerland?', options: ['1 month', '3 months', '6 months', '1 year'], correct: 1 },
            { question: 'What is a Betreibungsregisterauszug?', options: ['A rental application form', 'A debt collection registry extract proving no unpaid debts', 'A residence permit', 'An employment certificate'], correct: 1 },
            { question: 'Which city has the highest cost of living in Switzerland?', options: ['Bern', 'Basel', 'Zurich', 'Lugano'], correct: 2 }
          ]
        },
        exercises: [
          { title: 'Monthly Budget Planner', description: 'Create a detailed monthly budget for your target city including rent, insurance, groceries, transport, taxes, and savings' },
          { title: 'Housing Application Pack', description: 'Prepare a complete rental application dossier: personal letter, Betreibungsauszug, salary confirmation, and references' }
        ],
        completed: false
      },
      {
        id: 'adv-09',
        title: 'Swiss Family Reunification',
        description: 'Master the Swiss family reunification process, understand legal requirements, prepare comprehensive applications, and successfully reunite with family members. Comprehensive guide to eligibility criteria, documentation requirements, application procedures, timelines, and common challenges. Includes detailed analysis of LEI Art. 44-46, OASA Art. 42-47, and cantonal family reunification requirements.',
        type: 'interactive',
        duration: '110-140 minutes',
        order: 9,
        // enhancedModule loaded lazily via loadEnhancedModule()
        quiz: {
          questions: [
            { question: 'Can a B permit holder bring their spouse to Switzerland?', options: ['No', 'Yes, through family reunification', 'Only after 5 years', 'Only with C permit'], correct: 1 },
            { question: 'What is the age limit for children in family reunification?', options: ['Under 12', 'Under 16', 'Under 18', 'Under 21'], correct: 2 },
            { question: 'What must you prove for family reunification?', options: ['Swiss citizenship', 'Sufficient income and adequate housing', 'Language fluency', 'Property ownership'], correct: 1 }
          ]
        },
        exercises: [
          { title: 'Family Reunification Timeline', description: 'Map out the application timeline for bringing your family, including document preparation, processing times, and arrival planning' },
          { title: 'Income and Housing Assessment', description: 'Calculate whether your current income and housing situation meet the requirements for family reunification in your canton' }
        ],
        completed: false
      },
      {
        id: 'adv-10',
        title: 'Success Stories and Lessons Learned',
        description: 'Learn from successful Swiss immigrants who navigated the system effectively. Comprehensive collection of real-world success stories, proven strategies, common mistakes to avoid, and actionable lessons learned. Includes detailed case studies across different nationalities, industries, permit types, and immigration pathways.',
        type: 'interactive',
        duration: '85-110 minutes',
        order: 10,
        // enhancedModule loaded lazily via loadEnhancedModule()
        quiz: {
          questions: [
            { question: 'What is the most common reason for initial permit rejection?', options: ['Criminal record', 'Incomplete documentation', 'Low salary', 'Wrong canton'], correct: 1 },
            { question: 'What should you do if your application is rejected?', options: ['Give up', 'File an appeal within 30 days (Einsprache/Recours)', 'Apply to a different canton immediately', 'Contact the media'], correct: 1 },
            { question: 'What is the single best way to improve your chances?', options: ['Hire an expensive lawyer', 'Submit a complete, well-documented application', 'Apply to multiple cantons simultaneously', 'Wait for quotas to reset'], correct: 1 }
          ]
        },
        exercises: [
          { title: 'Lessons Applied', description: 'Read 3 success stories from the module and list the specific strategies you can apply to your own situation' },
          { title: 'Risk Assessment', description: 'Identify the top 3 risks for your specific application and create a mitigation plan for each' }
        ],
        completed: false
      }
    ],
    resources: [
      { id: 'res-101', title: 'Integration Test Prep Guide', type: 'pdf', category: 'Exam Prep' },
      { id: 'res-102', title: 'Tax Optimization Strategies', type: 'pdf', category: 'Financial' },
      { id: 'res-103', title: 'Language Learning Resources', type: 'guide', category: 'Language' },
      { id: 'res-104', title: 'Housing Application Templates', type: 'template', category: 'Housing' }
    ],
    tools: [
      { id: 'tool-101', title: 'Citizenship Timeline Calculator', description: 'Estimate your path to Swiss citizenship', type: 'calculator', url: '/tools/timeline-planner' },
      { id: 'tool-102', title: 'Integration Score Tracker', description: 'Track your integration progress', type: 'tracker', url: '/tools/integration-tracker' },
      { id: 'tool-103', title: 'Language Practice Tool', description: 'Practice Swiss languages', type: 'quiz', url: '/tools/language-practice' },
      { id: 'tool-104', title: 'Timeline Planner', description: 'Plan your immigration timeline', type: 'planner', url: '/tools/timeline-planner' }
    ]
  },
  citizenship: {
    packId: 'citizenship',
    packName: 'Citizenship Pro Pack',
    modules: [
      {
        id: 'cit-01',
        title: '10-Year Path to Swiss Citizenship',
        description: 'Master the complete 10-year journey from first arrival to Swiss citizenship. Comprehensive guide to permit progression (L → B → C), year-by-year milestones, cantonal comparison for strategic residence planning, and detailed application preparation. Includes LN Art. 9-19 analysis, residency calculation rules, and a practical year-by-year checklist.',
        type: 'interactive',
        duration: '120-150 minutes',
        order: 1,
        // enhancedModule loaded lazily via loadEnhancedModule()
        quiz: {
          questions: [
            { question: 'How many years of residence are required for ordinary naturalization?', options: ['5 years', '8 years', '10 years', '12 years'], correct: 2 },
            { question: 'What permit must you hold when applying for citizenship?', options: ['B Permit', 'C Permit', 'L Permit', 'Any permit'], correct: 1 },
            { question: 'How many years of recent residence are required in the 5 years before application?', options: ['1 year', '2 years', '3 years', '5 years'], correct: 2 },
            { question: 'What is the correct permit progression for citizenship?', options: ['L to C to citizenship', 'L to B to C to citizenship', 'B to citizenship directly', 'Any path works'], correct: 1 }
          ]
        },
        exercises: [
          { title: '10-Year Timeline', description: 'Map your personal 10-year citizenship timeline starting from your arrival date, with milestones for each permit stage' },
          { title: 'Requirements Audit', description: 'Assess your current status against all LN Art. 9-12 requirements and identify gaps to address' }
        ],
        completed: false
      },
      {
        id: 'cit-02',
        title: 'Spouse Route to Swiss Citizenship',
        description: 'Master the facilitated naturalization pathway for spouses of Swiss citizens, reducing the citizenship timeline from 10 years to 5 years. Covers LN Art. 21 (spouse in Switzerland), LN Art. 22 (spouse abroad), union conjugale assessment, sham marriage scrutiny, common rejection reasons, and step-by-step SEM application procedure.',
        type: 'interactive',
        duration: '100-130 minutes',
        order: 2,
        // enhancedModule loaded lazily via loadEnhancedModule()
        quiz: {
          questions: [
            { question: 'How many years of residence does the spouse route require?', options: ['3 years', '5 years', '8 years', '10 years'], correct: 1 },
            { question: 'How long must you be married to a Swiss citizen for the reduced timeline?', options: ['1 year', '3 years', '5 years', 'Marriage alone is sufficient'], correct: 1 },
            { question: 'Does the spouse automatically get citizenship through marriage?', options: ['Yes, immediately', 'Yes, after 1 year', 'No, they must apply through simplified naturalization', 'No, marriage has no effect'], correct: 2 }
          ]
        },
        exercises: [
          { title: 'Spouse Route Eligibility Check', description: 'Verify whether you meet all requirements for simplified naturalization through marriage and identify any missing criteria' },
          { title: 'Documentation Preparation', description: 'Compile all documents needed for the spouse route: marriage certificate, residence history, integration proof, and language certificates' }
        ],
        completed: false
      },
      {
        id: 'cit-03',
        title: 'Third-Generation Accelerated Path',
        description: 'Master the accelerated naturalization pathway for third-generation immigrants born in Switzerland. Covers LN Art. 24-26 eligibility (must be under 25), parent and grandparent residence requirements, complete document checklist, eligibility decision tree, application procedure, and key pitfalls. In force since February 15, 2018.',
        type: 'interactive',
        duration: '90-115 minutes',
        order: 3,
        // enhancedModule loaded lazily via loadEnhancedModule()
        quiz: {
          questions: [
            { question: 'Who qualifies for the third-generation accelerated path?', options: ['Anyone born in Switzerland', 'People whose grandparent had a Swiss residence permit', 'People born in Switzerland with at least one grandparent who held Swiss residence', 'Third-generation EU citizens'], correct: 2 },
            { question: 'What is the residency requirement for the third-generation path?', options: ['5 years total', 'Born in Switzerland and 5 years of compulsory schooling', '10 years total', 'No residency requirement'], correct: 1 }
          ]
        },
        exercises: [
          { title: 'Eligibility Verification', description: 'Trace your family history to confirm third-generation eligibility and gather supporting documentation' }
        ],
        completed: false
      },
      {
        id: 'cit-04',
        title: 'Language Test Mastery: B1 Certification',
        description: 'Master Swiss language requirements for citizenship: understand OLN Art. 6 requirements, choose the right test (fide, Goethe, DELF, telc, TestDaF), prepare with proven strategies, and understand certificate equivalency. Includes fide test sample questions, full registration process, study resources list, and a 12-week preparation plan.',
        type: 'interactive',
        duration: '95-120 minutes',
        order: 4,
        // enhancedModule loaded lazily via loadEnhancedModule()
        quiz: {
          questions: [
            { question: 'What is the minimum language level for citizenship?', options: ['A2 speaking, A2 writing', 'B1 speaking, A2 writing', 'B1 speaking, B1 writing', 'B2 speaking, B1 writing'], correct: 1 },
            { question: 'Which language test is officially recognized for citizenship?', options: ['IELTS', 'fide test or equivalent', 'Goethe-Zertifikat only', 'Any online test'], correct: 1 },
            { question: 'Can you take the test in any of the four national languages?', options: ['Only German', 'Only the language of your canton', 'Any of the three main languages (DE/FR/IT)', 'Any language including English'], correct: 2 }
          ]
        },
        exercises: [
          { title: 'Practice Test', description: 'Take a fide practice test and assess your readiness. Identify specific areas (speaking, writing, reading, listening) where you need improvement.' },
          { title: 'Language Study Schedule', description: 'Create a structured study schedule targeting B1 certification within your timeline, including courses, self-study, and immersion activities' }
        ],
        completed: false
      },
      {
        id: 'cit-05',
        title: 'Integration Test Success',
        description: 'Master cantonal integration tests and naturalization interviews, understand test formats, prepare comprehensively, and pass on first attempt. Comprehensive guide to integration test content, interview preparation, cultural knowledge requirements, Swiss history and politics, and proven success strategies. Includes detailed analysis of test formats, common questions, preparation techniques, and practical tips.',
        type: 'interactive',
        duration: '85-110 minutes',
        order: 5,
        // enhancedModule loaded lazily via loadEnhancedModule()
        quiz: {
          questions: [
            { question: 'What topics does the integration test cover?', options: ['Only Swiss history', 'Geography, history, politics, and daily life', 'Language only', 'Employment law only'], correct: 1 },
            { question: 'How is the Swiss political system structured?', options: ['Presidential republic', 'Federal council with 7 members and direct democracy', 'Parliamentary monarchy', 'Single-party system'], correct: 1 },
            { question: 'What is a Volksinitiative (popular initiative)?', options: ['A political party', 'A citizens\' right to propose constitutional changes with 100,000 signatures', 'A government program', 'A cantonal election'], correct: 1 }
          ]
        },
        exercises: [
          { title: 'Practice Quiz', description: 'Complete the practice integration questions in this module and aim for 80%+ correct answers' },
          { title: 'Swiss Knowledge Map', description: 'Create a study sheet covering: the Federal Council, cantonal system, direct democracy tools, key historical dates, and your commune\'s specifics' }
        ],
        completed: false
      },
      {
        id: 'cit-06',
        title: 'Citizenship Application Submission',
        description: 'Master the complete citizenship application submission process from document assembly to final filing. Covers all required documents by category, cantonal fee tables for all 26 cantons, the three-level submission procedure (commune → canton → SEM), common rejection reasons with statistics, and a week-by-week preparation timeline. Based on LN Art. 13-19 and cantonal naturalization regulations.',
        type: 'interactive',
        duration: '75-100 minutes',
        order: 6,
        // enhancedModule loaded lazily via loadEnhancedModule()
        quiz: {
          questions: [
            { question: 'Where do you submit your citizenship application?', options: ['Federal SEM office', 'Your commune/municipality', 'The Swiss embassy', 'Online portal only'], correct: 1 },
            { question: 'How many levels of approval are required for ordinary naturalization?', options: ['1 (federal)', '2 (cantonal and federal)', '3 (commune, cantonal, and federal)', '4 levels'], correct: 2 },
            { question: 'What is the approximate processing time for a citizenship application?', options: ['3 months', '6-12 months', '1-2 years', '3-5 years'], correct: 2 }
          ]
        },
        exercises: [
          { title: 'Application Checklist', description: 'Compile the complete document package required by your commune for the citizenship application' },
          { title: 'Fee Calculation', description: 'Research and calculate all citizenship application fees at commune, cantonal, and federal levels for your specific location' }
        ],
        completed: false
      },
      {
        id: 'cit-07',
        title: 'Naturalization Interview Preparation',
        description: 'Master naturalization interview preparation with 30+ real sample questions by category (Swiss history, politics, geography, culture, daily life), model answers, canton-specific variations, scoring criteria, and a 6-week preparation plan. Covers interview formats across German, French, and Italian-speaking cantons, assessment areas, and proven techniques for confident performance.',
        type: 'interactive',
        duration: '90-120 minutes',
        order: 7,
        // enhancedModule loaded lazily via loadEnhancedModule()
        quiz: {
          questions: [
            { question: 'What is typically assessed in a naturalization interview?', options: ['Only language skills', 'Integration, knowledge of Switzerland, and local community involvement', 'Criminal record only', 'Financial status'], correct: 1 },
            { question: 'Who typically conducts the interview?', options: ['Federal officials', 'Commune citizenship commission members', 'Police officers', 'Immigration lawyers'], correct: 1 },
            { question: 'What local knowledge might you be asked about?', options: ['Federal parliament members only', 'Your commune name, mayor, local traditions, and nearby landmarks', 'Only national holidays', 'Swiss banking rules'], correct: 1 }
          ]
        },
        exercises: [
          { title: 'Mock Interview', description: 'Practice answering the sample interview questions provided in this module with a friend or family member' },
          { title: 'Local Knowledge Research', description: 'Learn about your commune: its mayor, population, key landmarks, local traditions/events, and political structure' }
        ],
        completed: false
      },
      {
        id: 'cit-08',
        title: 'Dual Citizenship Strategy',
        description: 'Master Swiss dual citizenship policies with a comprehensive 30+ country policy table, renunciation procedures by country, tax implications of holding multiple citizenships, military service obligations, voting rights comparison, and strategic planning for citizenship retention. Covers Swiss policy history, country-specific restrictions, and practical considerations for dual nationals.',
        type: 'interactive',
        duration: '80-100 minutes',
        order: 8,
        // enhancedModule loaded lazily via loadEnhancedModule()
        quiz: {
          questions: [
            { question: 'Does Switzerland allow dual citizenship?', options: ['No, never', 'Yes, since 1992', 'Only with EU countries', 'Only for birth citizens'], correct: 1 },
            { question: 'What should you check before applying for Swiss citizenship?', options: ['Swiss law only', 'Whether your home country allows dual citizenship', 'EU regulations', 'UN conventions'], correct: 1 },
            { question: 'If your home country does not allow dual citizenship, what happens?', options: ['You cannot get Swiss citizenship', 'You may need to renounce your original citizenship', 'Switzerland makes an exception', 'Nothing changes'], correct: 1 }
          ]
        },
        exercises: [
          { title: 'Dual Citizenship Research', description: 'Research your home country\'s laws on dual citizenship and determine whether you can hold both passports' },
          { title: 'Impact Analysis', description: 'List the practical implications of holding dual citizenship: tax obligations, military service, voting rights, and travel benefits' }
        ],
        completed: false
      },
      {
        id: 'cit-09',
        title: 'Facilitated Naturalization & Special Cases',
        description: 'Master the facilitated naturalization paths available under Swiss law: spouse of a Swiss citizen (LN Art. 21-22), third-generation foreigners (LN Art. 24-25), former Swiss citizens seeking reintegration (LN Art. 27-29), and stateless persons (LN Art. 23). Includes detailed eligibility criteria, processing time comparisons, required documentation, and canton-by-canton differences.',
        type: 'interactive',
        duration: '70-90 minutes',
        order: 9,
        // enhancedModule loaded lazily via loadEnhancedModule()
        quiz: {
          questions: [
            { question: 'Who can access simplified naturalization?', options: ['Anyone after 5 years', 'Spouses of Swiss citizens and third-generation residents', 'All EU citizens', 'Only refugees'], correct: 1 },
            { question: 'Can years between age 8-18 count double toward residency?', options: ['No', 'Yes, under LN Art. 10', 'Only for EU citizens', 'Only in certain cantons'], correct: 1 }
          ]
        },
        exercises: [
          { title: 'Pathway Assessment', description: 'Determine whether any expedited or simplified naturalization path applies to your specific situation' }
        ],
        completed: false
      },
      {
        id: 'cit-10',
        title: 'Oath Ceremony and Becoming Swiss',
        description: 'Master the final steps to Swiss citizenship: oath ceremony procedures by language region, post-naturalization checklist (passport, military registration, AHV, voting), full breakdown of citizenship rights and obligations, Swiss passport application guide, and what changes (and what does not) after becoming Swiss. Covers ceremonies across German, French, and Italian-speaking cantons.',
        type: 'interactive',
        duration: '65-85 minutes',
        order: 10,
        // enhancedModule loaded lazily via loadEnhancedModule()
        quiz: {
          questions: [
            { question: 'What happens at the oath ceremony?', options: ['You receive your passport', 'You formally pledge allegiance to the Swiss Confederation', 'You take a written test', 'You meet the Federal Council'], correct: 1 },
            { question: 'When does your Swiss citizenship officially begin?', options: ['After the oath ceremony', 'When SEM issues the federal naturalization decree', 'When you receive your passport', 'After 30 days waiting period'], correct: 1 },
            { question: 'What is the first thing you should do after becoming Swiss?', options: ['Book a vacation', 'Register for civil rights (voting, military obligations)', 'Nothing', 'Change your name'], correct: 1 }
          ]
        },
        exercises: [
          { title: 'Post-Citizenship Checklist', description: 'Prepare a checklist of everything you need to do after becoming Swiss: register for voting, update documents, obtain Swiss passport, and notify relevant authorities' },
          { title: 'Reflection Exercise', description: 'Write a brief personal statement about your immigration journey and what Swiss citizenship means to you -- this can also help prepare for the interview' }
        ],
        completed: false
      }
    ],
    resources: [
      { id: 'res-201', title: 'Citizenship Application Form', type: 'pdf', category: 'Forms' },
      { id: 'res-202', title: 'Integration Test Practice Exam', type: 'template', category: 'Exam Prep' },
      { id: 'res-203', title: 'Language B1 Study Guide', type: 'pdf', category: 'Language' },
      { id: 'res-204', title: 'Personal Timeline Template', type: 'template', category: 'Planning' }
    ],
    tools: [
      { id: 'tool-201', title: 'Citizenship Eligibility Calculator', description: 'Check your eligibility', type: 'calculator', url: '/tools/citizenship-checker' },
      { id: 'tool-202', title: '10-Year Progress Tracker', description: 'Track your journey', type: 'tracker', url: '/tools/citizenship-tracker' },
      { id: 'tool-203', title: 'Personal Application Coach', description: 'AI-powered coaching', type: 'generator', url: '/tools/app-coach' }
    ]
  }
}

// Export helper functions
export function getPackContent(packId: string): PackContent | undefined {
  return PACK_CONTENT[packId]
}

export function getModuleContent(packId: string, moduleId: string, isAdmin: boolean = false): Module | undefined {
  if (isAdmin) {
    for (const pack of Object.values(PACK_CONTENT)) {
      const module = pack.modules.find((m) => m.id === moduleId)
      if (module) return module
    }
    return undefined
  }

  const content = PACK_CONTENT[packId]
  if (!content) return undefined
  return content.modules.find((m) => m.id === moduleId)
}

export function getAllModules(packId: string): Module[] {
  const PACK_ORDER = ['free', 'immigration', 'advanced', 'citizenship']
  const userLevel = PACK_ORDER.indexOf(packId)
  if (userLevel === -1) return PACK_CONTENT[packId]?.modules || []
  return PACK_ORDER
    .slice(0, userLevel + 1)
    .flatMap(p => PACK_CONTENT[p]?.modules ?? [])
}

export function getModulesForPack(packId: string): Module[] {
  return PACK_CONTENT[packId]?.modules || []
}

/**
 * Get all modules from all packs (for admin access)
 */
export function getAllModulesForAdmin(): Module[] {
  const allModules: Module[] = []
  for (const pack of Object.values(PACK_CONTENT)) {
    allModules.push(...pack.modules)
  }
  // Sort by pack and order
  return allModules.sort((a, b) => {
    // Group by pack first (immigration, advanced, citizenship)
    const aPack = getModulePack(a.id)
    const bPack = getModulePack(b.id)
    if (aPack !== bPack) {
      const packOrder = { 'free': 0, 'immigration': 1, 'advanced': 2, 'citizenship': 3 }
      return (packOrder[aPack as keyof typeof packOrder] || 99) - (packOrder[bPack as keyof typeof packOrder] || 99)
    }
    return a.order - b.order
  })
}

/**
 * Helper to determine which pack a module belongs to
 */
export function getModulePack(moduleId: string): string {
  if (moduleId.startsWith('free-')) return 'free'
  if (moduleId.startsWith('imm-')) return 'immigration'
  if (moduleId.startsWith('adv-')) return 'advanced'
  if (moduleId.startsWith('cit-')) return 'citizenship'
  return 'unknown'
}

export function getProgressPercentage(modules: Module[]): number {
  if (modules.length === 0) return 0
  const completed = modules.filter(m => m.completed).length
  return Math.round((completed / modules.length) * 100)
}

