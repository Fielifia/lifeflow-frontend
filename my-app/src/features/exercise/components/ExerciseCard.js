import { useNavigate } from 'react-router-dom'
import { Check, Eye } from 'lucide-react'
/**
 * Displays a single exercise card.
 * @param {{
 *  exercise: {
 *    id: string,
 *    name: string,
 *    image: string,
 *    equipment: string,
 *    muscle: string
 *  },
 *  onClick: () => void
 * }} props - Component props
 * @returns {import('react').ReactElement} Exercise card UI
 */
export default function ExerciseCard({
  exercise,
  onClick,
  onView,
  selected,
  mode = 'view',
}) {
  const navigate = useNavigate()
  const showDetailsButton = mode === 'select'

  const handleView = (e) => {
    e.stopPropagation()

    if (onView) {
      onView(exercise)
    } else {
      navigate(`/exercises/${exercise.id}`)
    }
  }

  return (
    <div
      className={`card-base exercise-card ${selected ? 'is-selected' : ''}`}
      onClick={onClick}
    >
      {selected && (
        <span className="selected-badge">
          <Check />
        </span>
      )}

      <div className="exercise-img-wrapper">
        <img
          src={exercise.image}
          alt={exercise.name}
          className="exercise-img"
        />
      </div>

      <div className="exercise-info">
        <h3>{exercise.name}
          {showDetailsButton && (
            <button className="details-btn" onClick={handleView}>
              <Eye className="details-icon" />
            </button>
          )}
        </h3>
        <p>
          {exercise.equipment} • {exercise.muscle}{' '}
        </p>
      </div>
    </div>
  )
}
