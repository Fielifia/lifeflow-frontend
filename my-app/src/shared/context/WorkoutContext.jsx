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
        ...rest,

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
