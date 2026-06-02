import {
  useEffect,
  useRef,
  useState
} from 'react'

import { arrayMove } from '@dnd-kit/sortable'

import { createWorkoutApi } from '../../../shared/api/workoutApi'

import { ERROR_MESSAGES } from '../../../shared/utils/constants/constants'

import { createTemplateApi, updateTemplateApi } from '../../../shared/api/templateApi'

import { useExerciseFlow } from '../../../shared/context/ExerciseFlowContext'

import { useToast } from '../../../shared/context/ToastContext'

import { useConfirm } from '../../../shared/hooks/useConfirm'

import { useExerciseMutations } from '../../../shared/hooks/useExerciseMutations'

import { appendExercisesToWorkout } from '../utils/appendExercisesToWorkout'

import { draftWorkoutStorage } from '../../../shared/utils/storage/draftStorage'

import { buildWorkoutPayload } from '../utils/buildWorkoutPayload'

import { buildTemplatePayload } from '../../template/utils/buildTemplatePayload'

import { useWorkoutContext } from '../../../shared/context/WorkoutContext'

import { EMPTY_WORKOUT } from '../../../shared/utils/constants/constants'


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
 * workout: {
 *    defaultRestTime?: number | null,
 *    restTimerEnabled?: boolean | null,
 *    exercises: object[],
 *    notes: string,
 *    name: string,
 *  },
 *
 *  setWorkout: import('react').Dispatch<
 *    import('react').SetStateAction<object>
 *  >,
 * 
 *  defaultRestTime: number,
 *
 *  updateDefaultRestTime: (
 *    value: number
 *  ) => void,
 *
 *  status: 'idle' | 'running' | 'paused',
 *  elapsed: number,
 *  startTime: number | null,
 * 
 *  completedSets: number,
 *  totalVolume: number,
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
 * 
 *    reorderExercises: (
 *      oldIndex: number,
 *      newIndex: number
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

  const updateDefaultRestTime = (value) => {
    setWorkout((prev) => ({
      ...prev,

      defaultRestTime: value,

      exercises: prev.exercises.map((ex) => ({
        ...ex,
        restTime: value,
      })),
    }))
  }

  const {

    selectedExercises,
    setSelectedExercises,

    setShouldRestoreScroll,
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
        defaultRestTime: workout.defaultRestTime,
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

  // ===== REORDER EXERCISES =====

  /**
   * Reorders exercises in workout state.
   * @param {number} oldIndex - Original exercise index.
   * @param {number} newIndex - Target exercise index.
   */
  const reorderExercises = (oldIndex, newIndex) => {
    setWorkout((prev) => ({
      ...prev,

      exercises: arrayMove(
        prev.exercises,
        oldIndex,
        newIndex,
      ),
    }))
  }

  // ===== COMPLETED SETS =====

  const completedSets =
    workout.exercises.reduce(
      (sum, ex) =>
        sum +
        ex.sets.filter((set) => set.completed).length,
      0,
    )

  // ===== TOTAL VOLUME FROM COMPLETED SETS =====

  const totalVolume =
    workout.exercises.reduce(
      (sum, ex) =>
        sum +
        ex.sets.reduce((setSum, set) => {
          if (!set.completed) {
            return setSum
          }

          return (
            setSum +
            (Number(set.weight) || 0) *
            (Number(set.reps) || 0)
          )
        }, 0),
      0,
    )

  // ===== EXERCISE ACTIONS =====

  const exerciseActions = {
    addSet,
    updateSet,
    removeSet,
    removeExercise,
    toggleSetComplete,
    updateExerciseRest,
    updateExerciseNotes,
    reorderExercises,
  }

  const updateWorkoutNotes = (notes) =>
    setWorkout((prev) => ({ ...prev, notes }))

  // ===== OPEN LIBRARY FLOW =====

  const openLibrary = () => {
    draftWorkoutStorage.set(workout)

    setShouldRestoreScroll(false)

    navigate(
      '/exercises?select=true&flow=workout-run'
    )
  }

  // ===== SAVE WORKOUT =====

  const saveWorkout = async () => {
    try {

      const hasTemplateChanges =
        JSON.stringify(
          buildTemplatePayload(workout),
        ) !== JSON.stringify(
          workout.templateSnapshot,
        )

      let shouldUpdateTemplate = false

      if (
        workout.sourceTemplateId &&
        hasTemplateChanges
      ) {
        shouldUpdateTemplate =
          await confirm({
            title: 'Update template?',
            description:
              'You changed this workout template during the session.',
            confirmText: 'Update Template',
            cancelText: 'Keep Original',
          })
      }

      const hasCompletedSets =
        workout.exercises.some((ex) =>
          ex.sets?.some((set) => set.completed),
        )

      if (!hasCompletedSets) {
        toast.error('Complete at least one set')
        return
      }

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

      if (shouldUpdateTemplate) {
        await updateTemplateApi(
          workout.sourceTemplateId,
          buildTemplatePayload(workout),
        )

        toast.success(
          'Workout and template updated',
        )
      } else {
        toast.success('Workout saved')
      }

      await delay(300)

      navigate(
        `/workouts/${saved._id}?from=workouts`
      )

      setWorkout(EMPTY_WORKOUT)

      resetTimer()
      resetRest()


      draftWorkoutStorage.clear()
    } catch (err) {
      setError(err?.message || ERROR_MESSAGES.SAVE_WORKOUT)
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
      setError(ERROR_MESSAGES.SAVE_TEMPLATE)
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


    draftWorkoutStorage.clear()

    navigate('/workouts')
  }

  // ===== RETURN =====

  return {
    workout,
    setWorkout,

    status,
    elapsed,

    completedSets,
    totalVolume,

    startTime,
    adjustStartTime,
    handleStartPause,

    defaultRestTime: workout.defaultRestTime ?? 120,
    updateDefaultRestTime,

    saving,
    error,

    openLibrary,

    exerciseActions,
    updateWorkoutNotes,

    saveWorkout,
    saveAsTemplate,

    discardWorkout,
  }
}
