/**
 * Workout summary statistics cards.
 *
 * @param {object} props - Component props
 * @param {number} props.exerciseCount - Total exercises
 * @param {number} props.totalSets - Total sets
 * @param {number} props.totalReps - Total reps
 * @param {number} props.totalVolume - Total training volume
 * @returns {import('react').ReactElement} Workout summary UI
 */
export default function WorkoutSummary({
  exerciseCount,
  totalSets,
  totalReps,
  totalVolume,
  personalBests,
}) {
  return (
    <div className="workout-summary-grid">
      <div className="card-base">
        <p className="stat-label">Exercises</p>
        <h3>{exerciseCount}</h3>
      </div>

      <div className="card-base">
        <p className="stat-label">Sets</p>
        <h3>{totalSets}</h3>
      </div>

      <div className="card-base">
        <p className="stat-label">Reps</p>
        <h3>{totalReps}</h3>
      </div>

      <div className="card-base">
        <p className="stat-label">Volume</p>
        <h3>{totalVolume} kg</h3>
      </div>

      <div className="card-base">
        <p className="stat-label">PBs</p>
        <h3>{personalBests}</h3>
      </div>
    </div>
  )
}
