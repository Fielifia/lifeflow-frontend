import { useNavigate, useLocation } from 'react-router-dom'
import ExerciseCard from './ExerciseCard'

/**
 * Displays a list of exercises.
 * @param {{
 *  exercises: Array<{ id: string }>,
 *  onSelect?: (exercise: object) => void,
 *  selectedExercises?: Array<{ id: string }>
 * }} props - Component props
 * @returns {import('react').ReactElement} Exercise list UI
 */
export default function ExerciseList({
  exercises,
  onSelect,
  selectedExercises = [],
}) {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="exercise-list">
      {exercises.map((e) => {
        const isSelected = selectedExercises.some((ex) => ex.id === e.id)

        return (
          <ExerciseCard
            key={e.id}
            exercise={e}
            selected={isSelected}
            onClick={() => {
              if (onSelect) {
                onSelect(e)
              } else {
                navigate(`/exercise/${e.id}`, {
                  state: { from: location.pathname },
                })
              }
            }}
          />
        )
      })}
    </div>
  )
}
