import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useStartWorkout } from '../../workout/hooks/useStartWorkout'

import ActionMenu from '../../../shared/components/ui/action-menu/ActionMenu'
import WorkoutControls from '../../../shared/components/WorkoutControls'

/**
 * Displays a workout template preview card.
 *
 * Shows template name, exercise preview list,
 * and quick actions such as starting a workout.
 * @param {object} props - Component props
 * @param {object} props.template - Template data
 * @param {() => void} [props.onClick] - Opens template details
 * @param {(id: string) => void} [props.onDeleteTemplate] - Deletes template
 * @returns {import('react').ReactElement} Template card UI
 */
export default function TemplateCard({
  template,
  onClick,
  onDeleteTemplate
}) {

  const navigate = useNavigate()

  const { startWorkout } = useStartWorkout()

  const exercises = template.exercises || []

  const menuItems = [
    {
      label: 'Open',
      onClick: () => onClick(),
    },
    {
      label: 'Edit',
      onClick: () => navigate(`/templates/${template._id}/edit`),
    },
    {
      label: 'Delete',
      danger: true,
      onClick: () => onDeleteTemplate(template._id),
    },
  ]

  const [menuOpen, setMenuOpen] = useState(false)

  return (

    <div
      className={`
      card-base
      template-card
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

      {/* TEMPLATE HEADER */}

      <div className="template-card-header">
        <div className="template-card-header-content">
          <h3>{template.name}</h3>

          <p className="muted small">Last: X days ago</p>
        </div>

        {/* ACTION MENU */}

        <ActionMenu items={menuItems} onClickChange={setMenuOpen} />
      </div>

      {/* EXERCISE PREVIEW */}

      <ul className="template-card-exercise-list">
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
          startWorkout({ template })
        }}
        hasExercises={exercises.length > 0}
      />

    </div>
  )
}
