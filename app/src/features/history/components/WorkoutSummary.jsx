import { Dumbbell, TrendingUp, Repeat, Weight, Award, BicepsFlexed } from 'lucide-react'

import StatsGrid from '../../../shared/components/ui/statsgrid/StatsGrid'
/**
 * Workout summary statistics cards.
 * @param {object} props - Component props
 * @param {number} props.exerciseCount - Total exercises
 * @param {number} props.totalSets - Total sets
 * @param {number} props.totalReps - Total reps
 * @param {number} props.totalVolume - Total training volume
 * @param {number} props.personalBests - Total personal bests
 * @param {Array<{ muscle: string, percentage: number, sets: number }>} [props.muscleSplit] - Workout muscle distribution
 * @returns {import('react').ReactElement} Workout summary UI
 */
export default function WorkoutSummary({
  exerciseCount,
  totalSets,
  totalReps,
  totalVolume,
  personalBests,
  muscleSplit = [],
}) {

  const primaryMuscle = muscleSplit.reduce(
    (highest, current) =>
      current.percentage > highest.percentage
        ? current
        : highest,
    muscleSplit[0]
  )

  const primaryMuscleValue = primaryMuscle
    ? `${primaryMuscle.muscle}`
    : '—'

  return (
    <>

      {/* EXERCISES */}

      <StatsGrid
        items={[
          {
            icon: Dumbbell,
            label: 'Exercises',
            value: exerciseCount,
            emphasis: 'large',
          },
          {
            icon: Weight,
            label: 'Total volume',
            value: totalVolume,
            emphasis: 'large',
          },
          {
            icon: TrendingUp,
            label: 'Sets',
            value: totalSets,
            emphasis: 'large',
          },
          {
            icon: Repeat,
            label: 'Reps',
            value: totalReps,
            emphasis: 'large',
          },
          {
            icon: Award,
            label: 'Personal Bests',
            value: personalBests,
          },
          {
            icon: BicepsFlexed,
            label: 'Primary Muscle',
            value: primaryMuscleValue,
          },
        ]}
      />

    </>
  )
}
