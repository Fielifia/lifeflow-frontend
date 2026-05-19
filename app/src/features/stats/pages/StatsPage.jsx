import { useState } from 'react'

import DataState from '../../../shared/components/ui/DataState'
import Header from '../../../shared/components/ui/Header'

import StatsHeader from '../components/StatsHeader'
import StatsHero from '../components/StatsHero'

import { useStatistics } from '../hooks/useStatistics'

/**
 * Statistics and progress page.
 * @returns {import('react').ReactElement} Statistics page UI
 */
export default function StatsPage() {
  const [range, setRange] = useState('1m')

  const {
    stats,
    loading,
    error,
  } = useStatistics(range)

  return (
    <div className="app">
      <Header
        title="Statistics"
        subtitle="Your progress"
      />

      <div className="section">

        <StatsHeader
          selectedRange={range}
          onChangeRange={setRange}
        />
        <p className="quote">"Every workout is a step closer to your best self"</p>
        <DataState
          loading={loading}
          error={error}
          data={stats}
          variant="card-template"
          emptyText="No statistics yet"
          count={1}
        >

          <StatsHero
            stats={stats}
          />

        </DataState>

      </div>
    </div>
  )
}
