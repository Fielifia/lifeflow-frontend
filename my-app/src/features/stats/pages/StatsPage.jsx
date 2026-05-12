import { useState } from 'react'

import Header from '../../../shared/ui/Header'

import StatsHeader from '../components/StatsHeader'
import StatsHero from '../components/StatsHero'

import { useStatistics } from '../hooks/useStatistics'

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

      <p className="quote">"Every workout is a step closer to your best self"</p>

      <StatsHero
        stats={stats}
      />
    </div>
  )
}
