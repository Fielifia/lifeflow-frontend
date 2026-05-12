import {
  Dumbbell,
  TrendingUp,
  Weight,
  Activity,
} from 'lucide-react'

import StatCard from '../components/StatCard'

import {
  formatDuration,
  formatNumber,
  formatWeight,
} from '../../../shared/utils/format'

export default function StatsHero({
  stats,
}) {
  return (
    <div className="grid-base stats-grid">
      <StatCard
        icon={Dumbbell}
        label="Workouts"
        value={stats?.workouts ?? 0}
        emphasis="large"
      />

      <StatCard
        icon={Activity}
        label="Total Time"
        value={formatDuration(
          stats?.durationMinutes ?? 0
        )}
        emphasis="large"
      />

      <StatCard
        icon={TrendingUp}
        label={`Sets / ${formatNumber(stats?.reps ?? 0)} reps`}
        value={`${formatNumber(
          stats?.sets ?? 0
        )}`}
      />

      <StatCard
        icon={Weight}
        label="Volume"
        value={formatWeight(
          stats?.volumeKg ?? 0
        )}
      />
    </div>
  )
}
