import { type Metadata } from 'next'
import dynamic from 'next/dynamic'

export const metadata: Metadata = {
  title: 'Virtual Lawyer | Swiss Immigration Pro',
  description:
    'AI-powered Swiss immigration legal guidance trained on official law and all 26 cantonal regulations.',
}

const SwissVirtualLawyer = dynamic(
  () => import('@/components/lawyer/SwissVirtualLawyer'),
  { ssr: false },
)

export default function LawyerPage() {
  return <SwissVirtualLawyer />
}
