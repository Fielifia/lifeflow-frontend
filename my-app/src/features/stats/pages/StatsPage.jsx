import { useState } from 'react'
import { useStatistics } from '../hooks/useStatistics'
import Header from '../../../shared/ui/Header'
import StatsHeader from '../components/StatsHeader'
import StatsHero from '../components/StatsHero'

export default function StatsPage() {
  const [range, setRange] = useState('1m')

  const {
    stats,
    // loading,
    // error,
  } = useStatistics(range)

  return (
    <div className="app">
      <Header
        title="Statistics"
        subtitle="Your progress"
      />
      <StatsHeader
        selectedRange={range}
        onChangeRange={setRange}
      />

      <StatsHero
        stats={stats}
        selectedRange={range}
      />

      {/* <HeroMetrics /> */}
    </div>
  )
}
