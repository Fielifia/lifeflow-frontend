import { createContext, useContext, useEffect, useState } from 'react'
import { EMPTY_WORKOUT } from '../../features/workout/constants'
import { useRestTimer } from '../../features/workout/hooks/useRestTimer'
import { useWorkoutTimer } from '../../features/workout/hooks/useWorkoutTimer'
import { draftWorkoutStorage} from '../utils/storage/draftStorage'

const WorkoutContext = createContext()

/**
 * Accesses workout context values.
 * @returns {object} Workout context
 */
export function useWorkoutContext() {
  return useContext(WorkoutContext)
}

/**
 * Workout context provider.
 * @param {object} props - Component props
 * @param {import('react').ReactNode} props.children - Provider children
 * @returns {import('react').ReactElement} Workout provider UI
 */
export function WorkoutProvider({ children }) {
  const timer = useWorkoutTimer()
  const rest = useRestTimer()

  const [activeWorkout, setActiveWorkout] = useState(() => {
    return draftWorkoutStorage.get() || EMPTY_WORKOUT
  })

  useEffect(() => {
    draftWorkoutStorage.set(activeWorkout)
  }, [activeWorkout])

  const [selectedTemplate, setSelectedTemplate] =
    useState(null)

  const [selectedWorkout, setSelectedWorkout] =
    useState(null)

  return (
    <WorkoutContext.Provider
      value={{
        status: timer.status,
        start: timer.start,
        elapsed: timer.elapsed,
        startTime: timer.startTime,
        adjustStartTime: timer.adjustStartTime,
        handleStartPause: timer.handleStartPause,
        resetTimer: timer.reset,

        restRemaining: rest.restRemaining,
        isResting: rest.isResting,
        startRest: rest.startRest,
        adjustRest: rest.adjust,
        skipRest: rest.skip,
        resetRest: rest.reset,

        activeWorkout,
        setActiveWorkout,

        selectedTemplate,
        setSelectedTemplate,

        selectedWorkout,
        setSelectedWorkout,
        
        registerActivity: timer.registerActivity,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  )
}
