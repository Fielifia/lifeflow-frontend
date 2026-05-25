import { Award, Dumbbell } from 'lucide-react'

import StatsGrid from '../../../shared/components/ui/statsgrid/StatsGrid'

/**
 * Statistics overview metrics.
 * @param {object} props - Component props
 * @param {object} props.stats - Filtered statistics
 * @returns {import('react').ReactElement} Statistics hero UI
 */
export default function StatsHero({ stats }) {
  return (
    <div className="section">
      <StatsGrid
        items={[
          {
            icon: Dumbbell,
            label: 'Workouts this week',
            value: stats?.currentWeek?.workouts ?? 0,
            emphasis: 'large',
            valueSize: 'xl',
          },
          {
            icon: Award,
            label: 'PBs this week',
            value: stats?.currentWeek?.personalBests ?? 0,
            valueSize: 'xl',
          },
        ]}
      />
    </div>
  )
}
