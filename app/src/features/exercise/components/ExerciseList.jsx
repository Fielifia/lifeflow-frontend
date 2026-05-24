import {
  useLocation,
  useNavigate,
} from 'react-router-dom'

import { useExerciseFlow }
  from '../../../shared/context/ExerciseFlowContext'

import ExerciseCard from './ExerciseCard/ExerciseCard'

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
    setScrollPosition,
    setShouldRestoreScroll,
  } = useExerciseFlow()

  // ===== NAVIGATE TO DETAIL =====

  const openExercise = (exerciseId) => {

    setScrollPosition(window.scrollY)

    setShouldRestoreScroll(true)

    navigate(
      `/exercises/${exerciseId}${location.search}`
    )
  }

  return (
    <div className="exercise-list">

      {exercises.map((e) => {

        const isSelected =
          selectedExercises.some(
            (ex) => ex.id === e.id,
          )

        return (

          <ExerciseCard
            key={e.id}
            exercise={e}
            selected={isSelected}
            mode={onSelect ? 'select' : 'view'}

            onClick={() => {
              if (onSelect) {
                onSelect(e)
                return
              }

              openExercise(e.id)
            }}

            onView={() => {
              openExercise(e.id)
            }}
          />
        )
      })}

    </div>
  )
}
