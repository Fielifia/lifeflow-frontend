import { useState } from 'react'
import {
  useLocation,
  useNavigate
} from 'react-router-dom'

import { useExerciseFlow } from '../../../shared/context/ExerciseFlowContext'

import WorkoutCard from './WorkoutCard'

/**
 * Displays a list of workouts.
 * @param {object} props - Component props
 * @param {Array<object>} props.workouts - Workout list
 * @param {(id: string) => void} [props.onDeleteWorkout] - Deletes workout
 * @param {number} [props.limit=10] - Visible workout increment count
 * @returns {import('react').ReactElement} Workout list UI
 */
export default function WorkoutList({
  workouts = [],
  limit = 10,
  onDeleteWorkout,
}) {

  const navigate = useNavigate()
  const location = useLocation()

  const { setReturnTo } = useExerciseFlow()

  const [search, setSearch] = useState('')

  const [visibleCount, setVisibleCount] = useState(limit)

  const filteredWorkouts = workouts.filter((workout) =>
    workout.name.toLowerCase().includes(search.toLowerCase()),
  )

  const visible = filteredWorkouts.slice(0, visibleCount)

  return (
    <div className="section">

      {/* SEARCH */}

      <input
        className="input-base"
        placeholder="Search workouts..."
        value={search}
        onFocus={(e) => e.target.select()}
        onChange={(e) => {
          setSearch(e.target.value)
          setVisibleCount(limit)
        }}
      />

      {/* WORKOUTS */}

      <div className="section">
        {visible.map((workout) => (
          <WorkoutCard
            key={workout._id}
            workout={workout}
            onDeleteWorkout={onDeleteWorkout}
            onClick={() => {
              setReturnTo(location.pathname)

              navigate(`/workouts/${workout._id}`)
            }}
          />
        ))}
      </div>

      {/* SHOW MORE */}

      {visibleCount < filteredWorkouts.length && (
        <button
          className="btn btn-md btn-primary"
          onClick={() => setVisibleCount((prev) => prev + limit)}
        >
          Show more (+{Math.min(limit, filteredWorkouts.length - visibleCount)})
        </button>
      )}
    </div>
  )
}
