import { useNavigate } from 'react-router-dom'
import ExerciseCard from './components/ExerciseCard'

/**
 * Displays a list of exercise cards.
 *
 * Navigates to exercise detail when a card is clicked.
 * @param {{
 *  exercises: Array<{ id: string }>
 * }} props - List of exercises to display
 * @returns {import('react').ReactElement} Exercise list UI
 */
export default function ExerciseList({
  exercises,
  onSelect,
  selectedExercises = [],
}) {
  const navigate = useNavigate()

  return (
    <div className="exercise-list">
      {exercises.map((e) => {
        const isSelected = selectedExercises.some((ex) => ex.id === e.id)

        console.log(e)
        return (
          <ExerciseCard
            key={e.id}
            exercise={e}
            selected={isSelected}
            onClick={() => {
              if (onSelect) {
                onSelect(e)
              } else {
                navigate(`/exercise/${e.id}`)
              }
            }}
          />
        )
      })}
    </div>
  )
}
