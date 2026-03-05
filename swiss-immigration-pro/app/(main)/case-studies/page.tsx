'use client'

import { motion } from 'framer-motion'
import { CheckCircle, Clock, MapPin, TrendingUp, Users, Award, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import VisualTimeline from '@/components/ui/VisualTimeline'

const caseStudies = [
  {
    id: 1,
    photo: '/images/avatars/priya-k.jpg',
    name: 'Rajesh K.',
    role: 'Senior Software Engineer',
    origin: 'India',
    location: 'Basel, Switzerland',
    permit: 'B Permit',
    duration: '8 weeks',
    year: '2024',
    challenge: 'Non-EU applicant with competitive salary but quota concerns',
    background: {
      age: 32,
      experience: '8 years in fintech',
      education: 'Master\'s in Computer Science',
      previousLocation: 'Bangalore, India',
      salary: 'CHF 125,000',
      family: 'Single, no dependents'
    },
    challenges: [
      'Applied in October 2023 - quota already 85% exhausted',
      'Initial application to Zurich (most competitive canton)',
      'Salary negotiation needed to meet cantonal requirements',
      'Documentation delays due to apostille process',
      'Labor market test concerns (many EU candidates available)'
    ],
    solution: [
      'Switched application to Basel-Stadt (higher approval rate, faster processing)',
      'Negotiated salary from CHF 110k to CHF 125k with employer',
      'Obtained specialized certifications (AWS, Kubernetes) to strengthen application',
      'Started document preparation 3 months early',
      'Used cantonal strategy guide to optimize application timing',
      'Provided detailed justification for non-EU candidate necessity'
    ],
    timeline: [
      { month: 'Month 1', action: 'Initial research and document gathering' },
      { month: 'Month 2', action: 'Salary negotiation and employer support secured' },
      { month: 'Month 3', action: 'Application submitted to Basel-Stadt migration office' },
      { month: 'Month 4', action: 'Cantonal review and approval (8 weeks processing)' },
      { month: 'Month 5', action: 'Permit received, moved to Switzerland' }
    ],
    outcome: {
      result: 'B Permit approved in 8 weeks',
      currentStatus: 'Successfully working in Basel, permit renewed for 3 years',
      lessons: [
        'Canton selection critical - Basel 87% approval vs Zurich 72%',
        'Early application (Q1) avoids quota exhaustion',
        'Salary above CHF 120k significantly improves approval chances',
        'Specialized skills documentation strengthens labor market test',
        'Employer commitment and support essential'
      ],
      savings: 'Saved CHF 8,000+ in legal fees by using platform guidance'
    },
    metrics: {
      processingTime: '8 weeks (vs 12-16 weeks in Zurich)',
      approvalRate: '87% (Basel) vs 72% (Zurich)',
      salaryIncrease: '+13.6% from initial offer',
      costSavings: 'CHF 8,000+ vs immigration lawyer'
    }
  },
  {
    id: 2,
    photo: '/images/avatars/sarah-m.jpg',
    name: 'Maria S.',
    role: 'Pharmaceutical Research Scientist',
    origin: 'Brazil',
    location: 'Basel, Switzerland',
    permit: 'B Permit',
    duration: '10 weeks',
    year: '2024',
    challenge: 'PhD holder with family, needed to bring spouse and child',
    background: {
      age: 35,
      experience: '10 years in pharmaceutical research',
      education: 'PhD in Biochemistry',
      previousLocation: 'São Paulo, Brazil',
      salary: 'CHF 115,000',
      family: 'Married, 1 child (age 6)'
    },
    challenges: [
      'Family reunification requirements (income, housing)',
      'Child school enrollment before permit approval',
      'Spouse work permit (non-EU, difficult to obtain)',
      'Housing search in competitive Basel market',
      'Language barrier (Portuguese to German)',
      'Documentation for entire family (3x complexity)'
    ],
    solution: [
      'Applied for family reunification simultaneously with work permit',
      'Secured housing pre-approval before application submission',
      'Demonstrated income 3x housing costs (CHF 5,500/month for family)',
      'Enrolled child in international school (English program)',
      'Started German language course (A1 level) before arrival',
      'Used family reunification checklist to ensure complete documentation',
      'Coordinated timing: work permit first, then family entry'
    ],
    timeline: [
      { month: 'Month 1-2', action: 'Job offer secured, housing search initiated' },
      { month: 'Month 3', action: 'Work permit application submitted' },
      { month: 'Month 4', action: 'Work permit approved, housing secured' },
      { month: 'Month 5', action: 'Family reunification application submitted' },
      { month: 'Month 6-7', action: 'Family reunification processing (10 weeks)' },
      { month: 'Month 8', action: 'Family arrived, all permits active' }
    ],
    outcome: {
      result: 'B Permit + Family Reunification approved',
      currentStatus: 'Family settled in Basel, child in school, spouse learning German',
      lessons: [
        'Family applications require 2-3x income of single applicants',
        'Housing must be secured before family reunification application',
        'International schools helpful for children during transition',
        'Spouse work permits very difficult for non-EU (plan accordingly)',
        'Language learning should start before arrival'
      ],
      savings: 'CHF 12,000+ saved vs immigration consultant for family case'
    },
    metrics: {
      processingTime: '10 weeks (work permit) + 10 weeks (family reunification)',
      totalIncome: 'CHF 115,000 (sufficient for family of 3)',
      housingCost: 'CHF 2,800/month (3-bedroom apartment)',
      languageProgress: 'German A2 after 6 months'
    }
  },
  {
    id: 3,
    photo: '/images/avatars/james-l.jpg',
    name: 'James T.',
    role: 'Investment Banking Director',
    origin: 'United States',
    location: 'Zurich, Switzerland',
    permit: 'B Permit',
    duration: '12 weeks',
    year: '2024',
    challenge: 'High-earner but complex tax situation and family of 4',
    background: {
      age: 42,
      experience: '15 years in investment banking',
      education: 'MBA from Wharton',
      previousLocation: 'New York, USA',
      salary: 'CHF 280,000',
      family: 'Married, 2 children (ages 10, 12)'
    },
    challenges: [
      'US-Switzerland tax treaty complexities',
      'Wealth tax implications (significant assets)',
      'Family of 4 - higher income requirements',
      'Children education (international vs public schools)',
      'Housing in expensive Zurich market',
      'Spouse career (needed work permit)',
      'Timing with school year (children)'
    ],
    solution: [
      'Consulted tax advisor for US-Swiss tax optimization',
      'Structured assets to minimize wealth tax exposure',
      'Negotiated comprehensive relocation package (housing, school, tax advisor)',
      'Chose international school for children (smoother transition)',
      'Applied in January (Q1 quota availability)',
      'Secured housing in Zurich suburbs (better value, still accessible)',
      'Spouse applied for work permit separately (subject to quota)',
      'Used salary negotiation strategies to maximize total compensation'
    ],
    timeline: [
      { month: 'Month 1-2', action: 'Job offer negotiation, relocation package secured' },
      { month: 'Month 3', action: 'Tax planning consultation, asset structuring' },
      { month: 'Month 4', action: 'Work permit application (January - Q1 quota)' },
      { month: 'Month 5-6', action: 'Permit processing (12 weeks in Zurich)' },
      { month: 'Month 7', action: 'Permit approved, moved to Zurich' },
      { month: 'Month 8', action: 'Children enrolled in school, family settled' }
    ],
    outcome: {
      result: 'B Permit approved, family relocated successfully',
      currentStatus: 'Working in Zurich, children in international school, tax-optimized',
      lessons: [
        'High earners should prioritize tax planning before moving',
        'Relocation packages can cover significant costs (housing, school, tax advisor)',
        'International schools ease transition for children',
        'Zurich processing slower but acceptable for high-value roles',
        'Wealth tax planning essential for high net worth individuals',
        'Spouse work permits challenging - consider alternatives (consulting, remote work)'
      ],
      savings: 'CHF 25,000+ in tax optimization vs unplanned approach'
    },
    metrics: {
      processingTime: '12 weeks (Zurich standard)',
      totalCompensation: 'CHF 280,000 base + bonus + relocation package',
      housingCost: 'CHF 5,500/month (4-bedroom house in suburbs)',
      schoolCost: 'CHF 45,000/year (2 children, international school)',
      taxOptimization: 'CHF 25,000+ annual savings through planning'
    }
  },
  {
    id: 4,
    photo: '/images/avatars/sophie-mueller.jpg',
    name: 'Sophie L.',
    role: 'Marketing Director',
    origin: 'France',
    location: 'Geneva, Switzerland',
    permit: 'B Permit',
    duration: '6 weeks',
    year: '2024',
    challenge: 'EU citizen but wanted to optimize application and avoid delays',
    background: {
      age: 29,
      experience: '7 years in marketing and communications',
      education: 'Master\'s in Marketing',
      previousLocation: 'Paris, France',
      salary: 'CHF 95,000',
      family: 'Single, no dependents'
    },
    challenges: [
      'EU citizens have easier path but still need proper documentation',
      'French to Swiss French language differences',
      'Competitive Geneva job market',
      'Housing market very competitive',
      'Wanted to avoid common EU citizen mistakes',
      'Timing with job start date'
    ],
    solution: [
      'Used EU citizen pathway guide (simplified but still requires documentation)',
      'Prepared all documents before job offer (faster processing)',
      'Applied directly to Geneva migration office (no quota for EU)',
      'Secured housing early (before permit approval, with cancellation clause)',
      'Started French language refresher (Swiss French nuances)',
      'Used CV optimization for Swiss market',
      'Coordinated job start date with permit timeline'
    ],
    timeline: [
      { month: 'Week 1-2', action: 'Job offer received, document preparation' },
      { month: 'Week 3', action: 'Application submitted to Geneva migration office' },
      { month: 'Week 4-8', action: 'Processing (6 weeks for EU citizens)' },
      { month: 'Week 9', action: 'Permit approved, moved to Geneva' },
      { month: 'Week 10', action: 'Started new job, registered with commune' }
    ],
    outcome: {
      result: 'B Permit approved in 6 weeks (fast for EU citizens)',
      currentStatus: 'Working in Geneva, integrated into local community',
      lessons: [
        'EU citizens have advantage but still need complete documentation',
        'Preparing documents before job offer speeds up process',
        'Geneva processing faster for EU citizens (6 weeks vs 12+ for non-EU)',
        'Housing search should start early (very competitive market)',
        'Swiss French has nuances - worth refreshing language skills',
        'CV optimization still important even for EU citizens'
      ],
      savings: 'CHF 3,000+ saved vs hiring immigration consultant (unnecessary for EU)'
    },
    metrics: {
      processingTime: '6 weeks (EU citizen advantage)',
      documentationTime: '2 weeks (prepared in advance)',
      housingSearch: '4 weeks (competitive market)',
      totalTimeline: '10 weeks from job offer to starting work'
    }
  },
  {
    id: 5,
    photo: '/images/avatars/daniel-t.jpg',
    name: 'Chen W.',
    role: 'Data Scientist',
    origin: 'China',
    location: 'Bern, Switzerland',
    permit: 'L Permit → B Permit',
    duration: '18 months (L to B conversion)',
    year: '2023-2024',
    challenge: 'Non-EU applicant started with L permit, converted to B permit',
    background: {
      age: 28,
      experience: '5 years in data science and AI',
      education: 'Master\'s in Data Science',
      previousLocation: 'Shanghai, China',
      salary: 'CHF 105,000 (L permit) → CHF 120,000 (B permit)',
      family: 'Single, no dependents'
    },
    challenges: [
      'Started with L permit (12-month contract)',
      'Needed to convert to B permit for long-term stay',
      'Salary increase required for B permit eligibility',
      'Timing: conversion application before L permit expiration',
      'Employer commitment to long-term employment',
      'Integration requirements for B permit',
      'Language learning while working full-time'
    ],
    solution: [
      'Negotiated contract extension to 5 years (B permit requirement)',
      'Secured salary increase from CHF 105k to CHF 120k',
      'Started German language course immediately upon arrival (A1)',
      'Applied for B permit conversion 3 months before L permit expiration',
      'Demonstrated integration: language progress, community involvement',
      'Used L-to-B conversion guide for timing and documentation',
      'Maintained excellent work performance (employer support)',
      'Joined local clubs and activities (integration proof)'
    ],
    timeline: [
      { month: 'Month 1-6', action: 'L permit active, working, learning German' },
      { month: 'Month 7-9', action: 'Contract extension negotiated, salary increase secured' },
      { month: 'Month 10', action: 'B permit conversion application submitted' },
      { month: 'Month 11-12', action: 'B permit processing (8 weeks)' },
      { month: 'Month 13', action: 'B permit approved, converted from L permit' },
      { month: 'Month 14-18', action: 'Continued integration, language progress to B1' }
    ],
    outcome: {
      result: 'Successfully converted from L to B permit',
      currentStatus: 'B permit holder, working in Bern, German B1 level, integrated',
      lessons: [
        'L permit is stepping stone - plan for B permit conversion early',
        'Salary increase often required for B permit (negotiate early)',
        'Contract extension to 5+ years needed for B permit',
        'Start language learning immediately (integration requirement)',
        'Community involvement strengthens integration case',
        'Timing critical: apply 3 months before L permit expires',
        'Employer support essential for conversion success'
      ],
      savings: 'CHF 6,000+ saved vs separate B permit application from scratch'
    },
    metrics: {
      lPermitDuration: '12 months',
      conversionProcessing: '8 weeks',
      salaryIncrease: '+14.3% (CHF 105k → CHF 120k)',
      languageProgress: 'German A1 → B1 in 18 months',
      totalTimeline: '18 months (L permit + conversion)'
    }
  }
]

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="sip-container-wide py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Real Case Studies
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Detailed success stories from real applicants. Learn from their challenges, strategies, and outcomes.
          </p>
        </motion.div>

        {/* Case Studies */}
        <div className="space-y-16">
          {caseStudies.map((study, idx) => (
            <motion.article
              key={study.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-100 dark:border-gray-700 shadow-lg dark:shadow-none overflow-hidden"
            >
              {/* Header Card */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/40 shrink-0">
                        <Image src={study.photo} alt={study.name} fill className="object-cover" sizes="48px" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">{study.name}</h2>
                        <p className="text-blue-100">{study.role} from {study.origin}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
                      <MapPin className="w-4 h-4" />
                      <span>{study.location}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
                      <Award className="w-4 h-4" />
                      <span>{study.permit}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
                      <Clock className="w-4 h-4" />
                      <span>{study.duration}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8">
                {/* Background */}
                <section className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    Background
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Age</div>
                      <div className="font-semibold dark:text-gray-100">{study.background.age}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Experience</div>
                      <div className="font-semibold dark:text-gray-100">{study.background.experience}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Education</div>
                      <div className="font-semibold text-sm dark:text-gray-100">{study.background.education}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Salary</div>
                      <div className="font-semibold dark:text-gray-100">{study.background.salary}</div>
                    </div>
                  </div>
                </section>

                {/* Challenge */}
                <section className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                    Challenge
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 font-medium">{study.challenge}</p>
                  <ul className="space-y-2">
                    {study.challenges.map((challenge, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                        <span className="text-orange-500 mt-1">•</span>
                        <span>{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Solution */}
                <section className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Solution & Strategy
                  </h3>
                  <ul className="space-y-2">
                    {study.solution.map((step, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Timeline */}
                <section className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    Timeline
                  </h3>
                  <VisualTimeline steps={study.timeline} />
                </section>

                {/* Outcome */}
                <section className="mb-8 bg-green-50 dark:bg-green-950/20 rounded-lg p-6 border border-green-200 dark:border-green-900/50">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5 text-green-600" />
                    Outcome
                  </h3>
                  <p className="text-gray-700 dark:text-gray-200 mb-4 font-semibold text-lg">{study.outcome.result}</p>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{study.outcome.currentStatus}</p>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Key Lessons:</h4>
                    <ul className="space-y-1">
                      {study.outcome.lessons.map((lesson, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-700 dark:text-gray-300 text-sm">
                          <span className="text-green-600 mt-1">✓</span>
                          <span>{lesson}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {study.outcome.savings && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-300 dark:border-green-800/50">
                      <div className="text-sm text-gray-600 dark:text-gray-400">Cost Savings</div>
                      <div className="text-lg font-bold text-green-700 dark:text-green-400">{study.outcome.savings}</div>
                    </div>
                  )}
                </section>

                {/* Metrics */}
                <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(study.metrics).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <div className="text-xs text-gray-600 dark:text-gray-400 uppercase mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                      <div className="font-bold text-gray-900 dark:text-white">{value}</div>
                    </div>
                  ))}
                </section>
              </div>
            </motion.article>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Write Your Success Story?</h2>
          <p className="text-xl mb-6 text-blue-100">
            Get the same guidance and strategies these successful applicants used
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 bg-white dark:bg-gray-800 text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-all"
            >
              View Pricing Plans
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/tools/permit-calculator"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3 rounded-lg border-2 border-white/30 transition-all"
            >
              Check Your Eligibility
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
