import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useStartWorkout } from '../../workout/hooks/useStartWorkout'
import {
  formatDate,
  formatDuration
} from '../../../shared/utils/format'

import ActionMenu from '../../../shared/components/ui/action-menu/ActionMenu'
import WorkoutControls from '../../../shared/components/WorkoutControls'

/**
 * Displays a summary card for a workout.
 * @param {{ workout: { _id: string, name?: string, createdAt: string, duration: number, exercises: Array } }} props - Component props
 * @returns {import('react').ReactElement} Workout card UI
 */
export default function WorkoutCard({
  workout,
  onClick,
  onDeleteWorkout
}) {

  const navigate = useNavigate()

  const { startWorkout } = useStartWorkout()

  const exercises = workout.exercises || []

  const menuItems = [
    {
      label: 'Open',
      onClick: () => onClick(),
    },
    {
      label: 'Edit',
      onClick: () => navigate(`/workouts/${workout._id}/edit`),
    },
    {
      label: 'Delete',
      danger: true,
      onClick: () => onDeleteWorkout(workout._id),
    },
  ]

  const [menuOpen, setMenuOpen] = useState(false)

  return (

    <div
      className={`
      card-base
      workout-card
      ${!menuOpen ? 'card-clickable' : ''}
      ${menuOpen ? 'menu-open' : ''}
    `}
      onClick={() => {
        if (menuOpen) {
          return
        }

        onClick()
      }}
      onMouseDown={(e) => {
        if (menuOpen) {
          e.preventDefault()
        }
      }}
    >

      {/* HEADER */}

      <div className="workout-card-header">
        <div className="workout-card-header-content">
          <h4>{workout.name}</h4>

          <p className="muted small">
            {formatDuration(Math.round((workout.duration || 0) / 60))} •{' '}
            {formatDate(workout.date)}
          </p>
        </div>

        {/* ACTION MENU */}

        <ActionMenu items={menuItems} onClickChange={setMenuOpen} />
      </div>

      {/* EXERCISE PREVIEW */}

      <ul className="workout-card-exercise-list">
        {exercises.slice(0, 3).map((ex, i) => (
          <li key={i}>{ex.name}</li>
        ))}
      </ul>

      {exercises.length > 2 && (
        <p className="muted small center">And {exercises.length - 2} more ..</p>
      )}

      {/* ACTION */}

      <WorkoutControls
        variant="card"
        onStartWorkout={(e) => {
          e.stopPropagation()
          startWorkout({ workout })
        }}
        hasExercises={exercises.length > 0}
      />

    </div>
  )
}
