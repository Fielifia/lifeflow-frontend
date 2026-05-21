import { Activity, Award, Dumbbell, Repeat, TrendingUp, Weight } from 'lucide-react'

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

  return (

    <StatsGrid
      items={[
        {
          icon: Dumbbell,
          label: 'Workouts',
          value: stats?.workouts ?? 0,
          emphasis: 'large',
        },
        {
          icon: Activity,
          label: 'Total time',
          value: formatDuration(stats.durationMinutes),
          emphasis: 'large',
        },
        {
          icon: TrendingUp,
          label: 'Sets',
          value: formatNumber(stats?.sets ?? 0),
          emphasis: 'large',
        },
        {
          icon: Repeat,
          label: 'Reps',
          value: formatNumber(stats?.reps ?? 0),
          emphasis: 'large',
        },
        {
          icon: Weight,
          label: 'Total volume',
          value: formatWeight(stats?.volumeKg),
          emphasis: 'large',
        },
        {
          icon: Award,
          label: 'Personal Bests',
          value: stats?.personalBests ?? 0,
        },
      ]}
    />
  )
}
