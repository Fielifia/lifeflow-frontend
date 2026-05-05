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
        status: timer.status,
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
        registerActivity: timer.registerActivity,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  )
}

export function useWorkoutContext() {
  return useContext(WorkoutContext)
}
