import {
  useEffect,
  useRef,
  useState
} from 'react'

import { createWorkoutApi } from '../../../shared/api/workoutApi'

import { createTemplateApi } from '../../../shared/api/templateApi'

import { useExerciseFlow } from '../../../shared/context/ExerciseFlowContext'

import { useToast } from '../../../shared/context/ToastContext'

import { useConfirm } from '../../../shared/hooks/useConfirm'

import { useExerciseMutations } from '../../../shared/hooks/useExerciseMutations'

import { appendExercisesToWorkout } from '../utils/appendExercisesToWorkout'

import { draftWorkoutStorage } from '../../../shared/utils/storage/draftStorage'

import { buildWorkoutPayload } from '../utils/buildWorkoutPayload'

import { buildTemplatePayload } from '../../template/utils/buildTemplatePayload'

import { useWorkoutContext } from '../../../shared/context/WorkoutContext'

import { EMPTY_WORKOUT } from '../../../shared/utils/constants'


/**
 * Handles active workout session state,
 * timers, persistence and exercise flow logic.
 *
 * Responsibilities:
 * - managing active workout state
 * - initializing workouts from templates/workout history
 * - handling temporary exercise library flow state
 * - persisting workout draft state
 * - handling workout timers and rest timers
 * - managing exercise mutations and completion logic
 * - saving workouts and templates
 * - discarding active workout sessions
 * @param {string} workoutId - Workout id
 * @param {(path: string, options?: object) => void} navigate
 * React Router navigation function.
 * Current workout route id.
 * @returns {{
 *  workout: object,
 *
 *  setWorkout: import('react').Dispatch<
 *    import('react').SetStateAction<object>
 *  >,
 *
 *  status: 'idle' | 'running' | 'paused',
 *  elapsed: number,
 *  startTime: number | null,
 *
 *  adjustStartTime: (
 *    offsetMs: number
 *  ) => void,
 *
 *  handleStartPause: () => void,
 *
 *  saving: boolean,
 *  error: string | null,
 *
 *  isEditingName: boolean,
 *
 *  setIsEditingName: import('react').Dispatch<
 *    import('react').SetStateAction<boolean>
 *  >,
 *
 *  openLibrary: () => void,
 *
 *  exerciseActions: {
 *    addSet: (
 *      index: number
 *    ) => void,
 *
 *    updateSet: (
 *      exIndex: number,
 *      setIndex: number,
 *      field: string,
 *      value: string | number | boolean
 *    ) => void,
 *
 *    removeSet: (
 *      exIndex: number,
 *      setIndex: number
 *    ) => void,
 *
 *    removeExercise: (
 *      index: number
 *    ) => void,
 *
 *    toggleSetComplete: (
 *      exIndex: number,
 *      setIndex: number,
 *      checked: boolean
 *    ) => void,
 *
 *    updateExerciseRest: (
 *      index: number,
 *      value: number
 *    ) => void,
 *
 *    updateExerciseNotes: (
 *      index: number,
 *      notes: string
 *    ) => void,
 *  },
 *
 *  updateWorkoutNotes: (
 *    notes: string
 *  ) => void,
 *
 *  saveWorkout: () => Promise<void>,
 *
 *  saveAsTemplate: () => Promise<void>,
 *
 *  discardWorkout: () => void,
 * }}
 * Workout logic state and actions.
 */
export function useWorkoutLogic(workoutId, navigate) {

  // ===== STATE =====

  const [saving, setSaving] = useState(false)

  const [error, setError] = useState(null)

  const [isEditingName, setIsEditingName] = useState(false)

  const {

    selectedExercises,
    setSelectedExercises,

  } = useExerciseFlow()

  const toast = useToast()

  const hasAddedRef = useRef(false)

  const {
    status,
    elapsed,

    startTime,
    adjustStartTime,
    handleStartPause,

    resetTimer,
    startRest,
    resetRest,

    registerActivity,
  } = useWorkoutContext()

  const confirm = useConfirm()

  // ===== INIT =====

  const [workout, setWorkout] = useState(() => {
    return draftWorkoutStorage.get() || EMPTY_WORKOUT
  })

  // ===== HELPERS =====

  const delay = (ms) =>
    new Promise((resolve) =>
      setTimeout(resolve, ms)
    )

  // ===== SAVE DRAFT =====

  useEffect(() => {
    const timeout = setTimeout(() => {
      draftWorkoutStorage.set(workout)
    }, 500)

    return () => clearTimeout(timeout)
  }, [workout])

  // ===== ADD FROM LIBRARY =====

  useEffect(() => {
    if (!selectedExercises?.length || hasAddedRef.current) {
      return
    }

    hasAddedRef.current = true

    const run = async () => {
      await appendExercisesToWorkout({
        exercises: selectedExercises,
        setWorkout,
      })

      setSelectedExercises([])
      hasAddedRef.current = false
    }

    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedExercises])

  const {
    addSet,
    updateSet,
    removeSet,
    removeExercise,
    toggleSetComplete,
    updateExerciseRest,
    updateExerciseNotes,
  } = useExerciseMutations(setWorkout, {
    onSetCompleted: (rest) => {
      startRest(rest)
      registerActivity()
    },
  })

  // ===== EXERCISE ACTIONS =====

  const exerciseActions = {
    addSet,
    updateSet,
    removeSet,
    removeExercise,
    toggleSetComplete,
    updateExerciseRest,
    updateExerciseNotes,
  }

  const updateWorkoutNotes = (notes) =>
    setWorkout((prev) => ({ ...prev, notes }))

  // ===== OPEN LIBRARY FLOW =====

  const openLibrary = () => {
    navigate(
      '/exercises?select=true&flow=workout-run'
    )
  }

  // ===== SAVE WORKOUT =====

  const saveWorkout = async () => {
    try {
      const hasCompletedSets =
        workout.exercises.some((ex) =>
          ex.sets?.some((set) => set.completed),
        )

      if (!hasCompletedSets) {
        toast.error('Complete at least one set')
        return
      }

      setSaving(true)
      setSaving(true)
      setError(null)

      const payload =
        buildWorkoutPayload(
          workout,
          elapsed,
          startTime,
        )

      const saved =
        await createWorkoutApi(payload)

      toast.success('Workout saved')

      await delay(300)

      navigate(
        `/workouts/${saved._id}?from=workouts`
      )

      setWorkout(EMPTY_WORKOUT)

      resetTimer()
      resetRest()

      setIsEditingName(false)

      draftWorkoutStorage.clear()
    } catch (err) {
      setError(err?.message || 'Could not save workout')
    } finally {
      setSaving(false)
    }
  }

  // ===== SAVE WORKOUT AS TEMPLATE =====

  const saveAsTemplate = async () => {
    try {
      setSaving(true)
      setError(null)

      await createTemplateApi(
        buildTemplatePayload(workout),
      )

      toast.success('Template created')

      await delay(300)

    } catch (err) {
      setError('Could not save template')
    } finally {
      setSaving(false)
    }
  }

  // ===== DISCARD WORKOUT (CREATE) =====

  const discardWorkout = async () => {

    const confirmed = await confirm({
      title: 'Discard current workout?',
      description: 'Your active workout will be lost.',
      confirmText: 'Discard',
      variant: 'danger',
    })

    if (!confirmed) {
      return
    }

    setWorkout(EMPTY_WORKOUT)

    resetTimer()
    resetRest()

    setIsEditingName(false)

    draftWorkoutStorage.clear()

    navigate('/workouts')
  }

  // ===== RETURN =====

  return {
    workout,
    setWorkout,

    status,
    elapsed,
    startTime,
    adjustStartTime,
    handleStartPause,

    saving,
    error,

    isEditingName,
    setIsEditingName,

    openLibrary,

    exerciseActions,
    updateWorkoutNotes,

    saveWorkout,
    saveAsTemplate,

    discardWorkout,
  }
}
