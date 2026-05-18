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

      <div className="workout-summary-grid">
        <div className="card-base">
          <p className="stat-label">Exercises</p>
          <h3>{exerciseCount}</h3>
        </div>

        {/* SETS */}

        <div className="card-base">
          <p className="stat-label">Sets</p>
          <h3>{totalSets}</h3>
        </div>

        {/* REPS */}

        <div className="card-base">
          <p className="stat-label">Reps</p>
          <h3>{totalReps}</h3>
        </div>

        {/* VOLUME */}

        <div className="card-base">
          <p className="stat-label">Volume</p>
          <h3>{totalVolume} kg</h3>
        </div>

        {/* PBs */}

        <div className="card-base">
          <p className="stat-label">PBs</p>
          <h3>{personalBests}</h3>
        </div>

        {/* MUSCLE SPLIT */}

        {muscleSplit.length > 0 && (
          <div className="card-base">
            <p className="stat-label">Muscle Split</p>

            <div className="muscle-split-list">
              {muscleSplit.map((m) => (
                <div key={m.muscle} className="muscle-split-row">
                  <span>{m.muscle}</span>

                  <span>
                    {m.sets} sets • {m.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </>
  )
}
