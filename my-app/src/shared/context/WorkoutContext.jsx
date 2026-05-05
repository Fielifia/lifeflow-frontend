import { createContext, useContext, useState } from 'react'
import { useTimer } from '../../features/workout/hooks/useTimer'
import { useRestTimer } from '../../features/workout/hooks/useRestTimer'

const WorkoutContext = createContext()

export function WorkoutProvider({ children }) {
  const timer = useTimer()
  const rest = useRestTimer()

  const [activeWorkout, setActiveWorkout] = useState(null)

  return (
    <WorkoutContext.Provider
      value={{
        ...timer,

        restTime: rest.restTime,
        setRestTime: rest.setRestTime,
        restRemaining: rest.restRemaining,
        isResting: rest.isResting,

        startRest: rest.startRest,
        adjustRest: rest.adjust,
        skipRest: rest.skip,
        resetRest: rest.reset,

        activeWorkout,
        setActiveWorkout,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  )
}

export function useWorkoutContext() {
  return useContext(WorkoutContext)
}
