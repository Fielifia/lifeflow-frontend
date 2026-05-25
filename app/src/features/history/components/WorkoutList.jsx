import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useStartWorkout } from '../../workout/hooks/useStartWorkout'

import { formatDate, formatDuration } from '../../../shared/utils/format'

import DataState from '../../../shared/components/ui/skeleton/DataState'

import WorkoutPreviewCard from '../../../shared/components/cards/WorkoutPreviewCard'
// import WorkoutCard from './WorkoutCard'

/**
 * Displays a searchable list of workouts
 * with incremental loading.
 * @param {object} props - Component props
 * @param {Array<object>} props.workouts - Workout list
 * @param {boolean} props.loading - Loading state
 * @param {string|null} props.error - Error message
 * @param {number} props.limit - Number of workouts shown per increment
 * @param {(id: string) => void} [props.onDeleteWorkout] - Deletes a workout
 * @returns {import('react').ReactElement} Workout list UI
 */
export default function WorkoutList({
  workouts = [],
  loading,
  error,
  limit = 10,
  onDeleteWorkout,
}) {
  const navigate = useNavigate()

  const { startWorkout } = useStartWorkout()

  const [search, setSearch] = useState('')

  const [visibleCount, setVisibleCount] = useState(limit)

  const filteredWorkouts = workouts.filter((workout) =>
    workout.name.toLowerCase().includes(search.toLowerCase()),
  )

  const visible = filteredWorkouts.slice(0, visibleCount)

  return (
    <div className="section">
      <h3>My Workouts</h3>

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

      <DataState
        loading={loading}
        error={error}
        data={workouts}
        variant="card-workout"
        emptyText="No workouts yet"
        count={5}
      >
        <div className="section">
          {visible.map((workout) => {
            const menuItems = [
              {
                label: 'Open',
                onClick: () => navigate(`/workouts/${workout._id}`),
              },
              {
                label: 'Edit',
                onClick: () => navigate(`/workouts/${workout._id}/edit`),
              },
              {
                label: 'Delete',
                danger: true,
                onClick: () => void onDeleteWorkout(workout._id),
              },
            ]

            return (
              <WorkoutPreviewCard
                key={workout._id}
                title={workout.name}
                subtitle={`
        ${formatDuration(
                Math.round((workout.duration || 0) / 60),
              )} • ${formatDate(workout.startTime)}
      `}
                exercises={workout.exercises}
                menuItems={menuItems}
                onClick={() => navigate(`/workouts/${workout._id}`)}
                onStartWorkout={(e) => {
                  e.stopPropagation()

                  startWorkout({ workout })
                }}
                hasExercises={workout.exercises?.length > 0}
              />
            )
          })}
        </div>
      </DataState>

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
