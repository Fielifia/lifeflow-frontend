import { useState } from 'react'

import ActionMenu from '../ui/action-menu/ActionMenu'

import WorkoutControls from '../ui/WorkoutControls/WorkoutControls'

/**
 * Shared preview card for workouts and templates.
 *
 * Displays title, optional subtitle,
 * exercise preview list, action menu,
 * and workout controls.
 * @param {object} props - Component props
 * @param {string} props.title - Card title
 * @param {string} [props.subtitle] - Optional subtitle
 * @param {Array<object>} [props.exercises] - Exercise preview list
 * @param {Array<object>} props.menuItems - Action menu items
 * @param {() => void} props.onClick - Card click handler
 * @param {(event: MouseEvent) => void} props.onStartWorkout - Start workout handler
 * @param {boolean} props.hasExercises - Whether exercises exist
 * @returns {import('react').ReactElement} Workout preview card
 */
export default function WorkoutPreviewCard({
  title,
  subtitle,
  exercises = [],
  menuItems = [],
  onClick,
  onStartWorkout,
  hasExercises,
}) {
  const hasMenu = menuItems.length > 0

  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div
      className={`
        card-base
        preview-card
        ${!menuOpen ? 'card-clickable' : ''}
        ${menuOpen ? 'menu-open' : ''}
      `}
      onClick={() => {
        if (menuOpen || !onClick) {
          return
        }

        onClick()
      }}
    >
      {/* HEADER */}

      <div className="preview-card-header">
        <div className="preview-card-header-content">
          <h2 className="close">{title}</h2>

          {subtitle && <p className="muted md close">{subtitle}</p>}
        </div>

        {/* ACTION MENU */}

        {hasMenu && (
          <ActionMenu items={menuItems} onOpenChange={setMenuOpen} />
        )}
      </div>

      {/* EXERCISE PREVIEW */}

      <ul className="preview-card-exercise-list">
        {exercises.slice(0, 3).map((exercise, i) => (
          <li key={i}>{exercise.name}</li>
        ))}
      </ul>

      {/* MORE EXERCISES */}

      {exercises.length > 3 && (
        <p className="muted small center close">
          And {exercises.length - 3} more...
        </p>
      )}

      {/* ACTIONS */}

      <WorkoutControls
        variant="card"
        onStartWorkout={onStartWorkout}
        hasExercises={hasExercises}
      />
    </div>
  )
}
