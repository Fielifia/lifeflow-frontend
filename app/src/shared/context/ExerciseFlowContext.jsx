import { createContext, useContext, useState } from 'react'

/**
 * Context for managing selected exercises
 * across workout and template flows.
 */
const ExerciseFlowContext = createContext()

/**
 * Provides shared exercise flow state.
 * @param {object} props - Component props
 * @param {import('react').React.ReactNode} props.children - Child components
 * @returns {import('react').ReactElement} Exercise flow context provider
 */
export function ExerciseFlowProvider({ children }) {
  const [selectedExercises, setSelectedExercises] =
    useState([])

  const [returnTo, setReturnTo] = useState('/')

  return (
    <ExerciseFlowContext.Provider
      value={{
        selectedExercises,
        setSelectedExercises,

        returnTo,
        setReturnTo,
      }}
    >
      {children}
    </ExerciseFlowContext.Provider>
  )
}

/**
 * Hook for accessing exercise flow context.
 * @returns {{
 *   selectedExercises: Array,
 *   setSelectedExercises: import('react').Dispatch<import('react').SetStateAction<Array>>,
 *   returnTo: string,
 *   setReturnTo: import('react').Dispatch<import('react').SetStateAction<string>>
 * }} Exercise flow context values
 */
export function useExerciseFlow() {
  return useContext(ExerciseFlowContext)
}
