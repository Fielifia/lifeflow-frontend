import { useNavigate } from 'react-router-dom'
import ExerciseCard from './ExerciseCard'

/**
 * Displays a list of exercise cards.
 *
 * Navigates to exercise detail when a card is clicked.
 * @param {{
 *  exercises: Array<{ id: string }>
 * }} props - List of exercises to display
 * @returns {import('react').ReactElement} Exercise list UI
 */
export default function ExerciseList({ exercises }) {
  const navigate = useNavigate()

  return (
    <div className="exercise-list">
      {exercises.map((e) => (
        <ExerciseCard
          key={e.id}
          exercise={e}
          onClick={() => navigate(`/exercise/${e.id}`)}
        />
      ))}
    </div>
  )
}
