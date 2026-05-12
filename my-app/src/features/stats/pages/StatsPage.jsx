import Header from '../../../shared/ui/Header'
import StatsHero from '../components/StatsHero'
// import HeroMetrics from '../components/HeroMetrics'

export default function StatsPage() {
  return (
    <div className="app">
      <Header
        title="Statistics"
        subtitle="Your progress"
      />
      <StatsHero />

      {/* <HeroMetrics /> */}
    </div>
  )
}
