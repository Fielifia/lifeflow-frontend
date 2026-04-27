import { useNavigate, useLocation } from 'react-router-dom'
import ExerciseCard from './ExerciseCard'

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
