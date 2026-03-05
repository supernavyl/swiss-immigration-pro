import HeroSection from '@/components/home/HeroSection'
import FeaturesGrid from '@/components/home/FeaturesGrid'
import PathwayGrid from '@/components/home/PathwayGrid'
import JourneySection from '@/components/home/JourneySection'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import ProcessTimeline from '@/components/home/ProcessTimeline'
import CTASection from '@/components/home/CTASection'

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 font-sans selection:bg-blue-100 selection:text-blue-900 dark:selection:bg-blue-900 dark:selection:text-blue-100">
      <HeroSection />
      <FeaturesGrid />
      <PathwayGrid />
      <JourneySection />
      <TestimonialsSection />
      <ProcessTimeline />
      <CTASection />
    </div>
  )
}
