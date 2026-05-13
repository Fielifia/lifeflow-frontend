import { createContext, useContext, useState } from 'react'

const ExerciseFlowContext = createContext()

export function ExerciseFlowProvider({ children }) {
  const [selectedExercises, setSelectedExercises] =
    useState([])

  return (
    <ExerciseFlowContext.Provider
      value={{
        selectedExercises,
        setSelectedExercises,
      }}
    >
      {children}
    </ExerciseFlowContext.Provider>
  )
}

export function useExerciseFlow() {
  return useContext(ExerciseFlowContext)
}
