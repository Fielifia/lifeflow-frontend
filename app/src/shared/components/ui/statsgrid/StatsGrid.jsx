import StatsGrid from '../../../shared/components/ui/StatsGrid'
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



  return (
    <>

      {/* EXERCISES */}

      <StatsGrid
        items={[
          {
            label: 'Exercises',
            value: exerciseCount,
          },
          {
            label: 'Sets',
            value: totalSets,
          },
          {
            label: 'Reps',
            value: totalReps,
          },
          {
            label: 'Volume',
            value: `${totalVolume} kg`,
          },
          {
            label: 'Personal Best',
            value: `${personalBests}`,
          },
          {
            label: 'Muscle Split',
            value: `${muscleSplit}`,
          },
        ]}
      />

    </>
  )
}
