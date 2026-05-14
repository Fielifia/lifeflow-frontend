import { useNavigate, useLocation } from 'react-router-dom'
import ExerciseCard from './ExerciseCard'
import { useExerciseFlow } from '../../../shared/context/ExerciseFlowContext'

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

  const {
    setReturnTo,
    setScrollPosition,
    setShouldRestoreScroll,
  } = useExerciseFlow()

  return (
    <div className="exercise-list">
      {exercises.map((e) => {
        const isSelected = selectedExercises.some((ex) => ex.id === e.id)

        return (
          <ExerciseCard
            key={e.id}
            exercise={e}
            selected={isSelected}
            mode={onSelect ? 'select' : 'view'}
            onClick={() => {
              if (onSelect) {
                onSelect(e)
              } else {
                setReturnTo(`${location.pathname}${location.search}`)
                setScrollPosition(window.scrollY)
                setShouldRestoreScroll(true)

                navigate(`/exercises/${e.id}`)
              }
            }}
            onView={() => {
              setReturnTo(`${location.pathname}${location.search}`)
              setScrollPosition(window.scrollY)
              setShouldRestoreScroll(true)

              navigate(`/exercises/${e.id}`)
            }}
          />
        )
      })}
    </div>
  )
}
