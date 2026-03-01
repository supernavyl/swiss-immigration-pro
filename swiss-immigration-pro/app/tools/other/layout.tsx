import { Metadata } from 'next'
import { ClientLayout } from '@/components/providers/ClientLayout'

export const metadata: Metadata = {
  title: 'International Citizens Swiss Immigration | Third-Country Nationals | Global Pathways',
  description: 'Complete Swiss immigration guide for international citizens from Asia, Africa, Middle East, South America. Navigate quota system, work permits, student visas, family reunification. Expert guidance for third-country nationals from India, China, Brazil, Nigeria, UAE and 190+ countries.',
  keywords: 'international Swiss immigration, third country nationals Switzerland, Indian Swiss visa, Chinese Swiss work permit, African Swiss immigration, Asian professionals Switzerland, South American Swiss visa, Middle East Swiss immigration, global Swiss work permit, non-EU Swiss residence',
  openGraph: {
    title: 'International Citizens | Swiss Immigration - Global Pathways',
    description: 'Comprehensive guidance for third-country nationals seeking Swiss residency. Multiple pathways, expert support, 190+ countries served.',
    type: 'website',
    url: 'https://swissimmigrationpro.com/other',
  },
  alternates: {
    canonical: '/other',
  },
}

export default function OtherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientLayout>{children}</ClientLayout>
}

