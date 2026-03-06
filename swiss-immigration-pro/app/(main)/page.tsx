import HeroSection from '@/components/home/HeroSection'
import FeaturesGrid from '@/components/home/FeaturesGrid'
import PathwayGrid from '@/components/home/PathwayGrid'
import JourneySection from '@/components/home/JourneySection'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import ProcessTimeline from '@/components/home/ProcessTimeline'
import CTASection from '@/components/home/CTASection'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#06060a] font-sans selection:bg-indigo-500/30 selection:text-white">
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
