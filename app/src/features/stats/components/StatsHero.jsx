import { Dumbbell, Activity, TrendingUp, Weight, Award, Clock3 } from 'lucide-react'

import StatsGrid from '../../../shared/components/ui/statsgrid/StatsGrid'
import { formatDuration, formatNumber, formatWeight } from '../../../shared/utils/format'

/**
 * Statistics overview metrics.
 * @param {object} props - Component props
 * @param {object} props.stats - Filtered statistics
 * @returns {import('react').ReactElement} Statistics hero UI
 */
export default function StatsHero({
  stats,
}) {

  const monthlyMinutes =
    stats?.currentMonth?.durationMinutes ?? 0

  return (

    <StatsGrid
      items={[
        {
          icon: Dumbbell,
          label: 'Workouts',
          value: stats?.currentMonth?.workouts ?? 0,
          emphasis: 'large',
        },
        {
          icon: Activity,
          label: 'Total time',
          value: formatDuration(monthlyMinutes),
          emphasis: 'large',
        },
        {
          icon: TrendingUp,
          label: `Sets / ${formatNumber(stats?.currentMonth?.reps ?? 0)} Reps`,
          value: formatNumber(stats?.currentMonth?.sets ?? 0),
          emphasis: 'large',
        },
        {
          icon: Weight,
          label: 'Total volume',
          value: formatWeight(stats?.currentMonth?.volumeKg),
          emphasis: 'large',
        },
        {
          icon: Award,
          label: 'Personal Bests',
          value: stats?.currentMonth?.personalBests ?? 0,
        },
        {
          icon: Clock3,
          label: 'Days since last workout',
          value: stats?.daysSinceLastWorkout,
        },
      ]}
    />
  )
}
