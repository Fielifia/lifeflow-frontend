import { Award, BarChart3, Dumbbell, Repeat, Trophy } from 'lucide-react'

import StatsGrid from '../../../shared/components/ui/statsgrid/StatsGrid'

import {
  formatDate,
  formatNumber,
  formatWeight,
} from '../../../shared/utils/format'

/**
 * Exercise and performance insights.
 *
 * Displays workout records, top exercises,
 * and strength highlights.
 * @param {object} props - Component props
 * @param {object} props.stats - Statistics data
 * @returns {import('react').ReactElement} Exercise insights UI
 */
export default function ExerciseInsights({ stats }) {
  const items = [
    {
      icon: Dumbbell,

      label: 'Most Common Exercise',

      value: stats?.mostCommonExercise
        ? `${stats.mostCommonExercise.name}`
        : '—',

      subvalue: stats?.mostCommonExercise
        ? `${stats.mostCommonExercise.count} workouts`
        : null,

      valueSize: 'xs',

      gridSpan: 2,
    },

    {
      icon: Trophy,

      label: 'Best Volume Session',

      value: stats?.bestVolumeSession
        ? formatWeight(stats.bestVolumeSession.volume)
        : '—',

      subvalue: stats?.bestVolumeSession
        ? `${stats.bestVolumeSession.workoutName} • ${formatDate(
          stats.bestVolumeSession.startTime,
        )}`
        : null,

      valueSize: 'sm',
    },

    {
      icon: Award,

      label: 'Max Weight',

      value: stats?.maxWeight ? formatWeight(stats.maxWeight.weight) : '—',

      subvalue: stats?.maxWeight
        ? `${stats.maxWeight.exercise} • ${formatDate(
          stats.maxWeight.startTime,
        )}`
        : null,

      valueSize: 'sm',
    },

    {
      icon: Repeat,

      label: 'Most Reps in Set',

      value: stats?.maxReps ? `${formatNumber(stats.maxReps.reps)} reps` : '—',

      subvalue: stats?.maxReps
        ? `${stats.maxReps.exercise} • ${formatDate(stats.maxReps.startTime)}`
        : null,

      valueSize: 'sm',
    },

    {
      icon: BarChart3,

      label: 'Estimated 1RM',

      value: stats?.bestEstimated1RM
        ? formatWeight(stats.bestEstimated1RM.estimated1RM)
        : '—',

      subvalue: stats?.bestEstimated1RM
        ? `${stats.bestEstimated1RM.exercise} • ${stats.bestEstimated1RM.weight}kg × ${stats.bestEstimated1RM.reps}`
        : null,

      valueSize: 'sm',
    },
  ]

  return (
    <div className="section">
      <h3>Exercise Insights</h3>

      <StatsGrid items={items} />
    </div>
  )
}
