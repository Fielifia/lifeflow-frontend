import { Info } from 'lucide-react'

import { useLocation, useNavigate } from 'react-router-dom'

import FavoriteButton from '../../../../shared/components/ui/button/FavoriteButton'

import './ExerciseCard.css'

/**
 * Displays a single exercise card.
 * @param {object} props - Component props
 * @param {object} props.exercise - Exercise data
 * @param {() => void} [props.onClick] - Select handler
 * @param {() => void} [props.onView] - View details handler
 * @param {boolean} [props.selected] - Whether exercise is selected
 * @param {'view' | 'select'} [props.mode] - Exercise card mode
 * @returns {import('react').ReactElement} Exercise card UI
 */
export default function ExerciseCard({
  exercise,
  onClick,
  onView,

  selected,
  mode = 'view',
}) {
  const location = useLocation()

  const navigate = useNavigate()

  const showDetailsButton = mode === 'select'

  const handleView = (e) => {
    e.stopPropagation()

    if (onView) {
      onView(exercise)
    } else {
      navigate(`/exercises/${exercise.id}${location.search}`)
    }
  }

  return (
    <div
      className={`card-base exercise-card ${selected ? 'is-selected' : ''}`}
      onClick={onClick}
    >
      {/* EXERCISE IMAGE */}

      <div className="exercise-img-wrapper">
        <img
          src={exercise.image}
          alt={exercise.name}
          className="exercise-img"
        />
      </div>

      {/* EXERCISE INFO */}

      <div className="exercise-card-content">
        <div className="exercise-info-wrapper">
          <div className="exercise-info">
            <h4 className="close">{exercise.name}</h4>

            <p className="muted close">
              {exercise.equipment} • {exercise.muscle}
            </p>
          </div>

          <div className="exercise-actions">
            {showDetailsButton && (
              <button className="details-btn" onClick={handleView}>
                <Info className="details-icon" />
              </button>
            )}
            <FavoriteButton exerciseId={exercise.id} />
          </div>
        </div>
      </div>
    </div>
  )
}
