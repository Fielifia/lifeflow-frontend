import {
  Award,
  Dumbbell,
} from 'lucide-react'

import StatCard from '../../../shared/components/ui/statsgrid/StatCard'


/**
 * Statistics overview metrics.
 * @param {object} props - Component props
 * @param {object} props.stats - Filtered statistics
 * @returns {import('react').ReactElement} Statistics hero UI
 */
export default function StatsHero({ stats }) {
  return (
    <div className="grid-base history-grid">
      <StatCard
        icon={Dumbbell}
        label="Workouts this week"
        value={stats?.currentWeek?.workouts ?? 0}
        emphasis="large"
      />

      <StatCard
        icon={Award}
        label="Personal Bests this week"
        value={stats?.currentWeek?.personalBests ?? 0}
      />
    </div>
  )
}
