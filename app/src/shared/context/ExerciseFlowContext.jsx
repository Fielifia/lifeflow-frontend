import {
  createContext,
  useContext,
  useState
} from 'react'

/**
 * Context for managing selected exercises
 * across workout and template flows.
 */
const ExerciseFlowContext = createContext()

/**
 * Provides shared exercise flow state.
 * @param {object} props - Component props
 * @param {import('react').ReactNode} props.children - Child components
 * @returns {import('react').ReactElement} Exercise flow context provider
 */
export function ExerciseFlowProvider({ children }) {

  // ===== EXERCISE SELECTION =====

  const [selectedExercises, setSelectedExercises] = useState([])
  
  // ===== SCROLL =====
  
  const [scrollPosition, setScrollPosition] = useState(0)

  const [shouldRestoreScroll, setShouldRestoreScroll] = useState(false)

  // ===== EDITING STATE =====

  const [editingTemplate, setEditingTemplate] = useState(null)
 
  const [editingWorkout, setEditingWorkout] = useState(null)

  return (

    <ExerciseFlowContext.Provider
      value={{
        selectedExercises,
        setSelectedExercises,

        scrollPosition,
        setScrollPosition,

        shouldRestoreScroll,
        setShouldRestoreScroll,

        editingTemplate,
        setEditingTemplate,

        editingWorkout,
        setEditingWorkout,
      }}
    >
      
      {children}

    </ExerciseFlowContext.Provider>
  )
}

/**
 * Hook for accessing exercise flow context values.
 * @returns {object} Exercise flow context
 */
export function useExerciseFlow() {
  return useContext(ExerciseFlowContext)
}
