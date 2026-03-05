import HomeAmbience from '@/components/home/HomeAmbience'
import HeroSection from '@/components/home/HeroSection'
import SectionDivider from '@/components/home/SectionDivider'
import FeaturesGrid from '@/components/home/FeaturesGrid'
import PathwayGrid from '@/components/home/PathwayGrid'
import JourneySection from '@/components/home/JourneySection'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import ProcessTimeline from '@/components/home/ProcessTimeline'
import CTASection from '@/components/home/CTASection'

export default function Home() {
  return (
    <HomeAmbience>
      <HeroSection />
      <SectionDivider variant="wave" className="fill-slate-50 dark:fill-slate-900/30 bg-white dark:bg-slate-950" />
      <FeaturesGrid />
      <SectionDivider variant="diagonal" className="fill-white dark:fill-slate-950 bg-slate-50/50 dark:bg-slate-900/30" />
      <PathwayGrid />
      <SectionDivider variant="curve" className="fill-slate-900 bg-white dark:bg-slate-950" />
      <JourneySection />
      <SectionDivider variant="peak" className="fill-white dark:fill-slate-950 bg-slate-900" />
      <TestimonialsSection />
      <ProcessTimeline />
      <CTASection />
    </HomeAmbience>
  )
}
