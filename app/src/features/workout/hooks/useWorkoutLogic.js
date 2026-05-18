import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

import { useExerciseFlow } from '../../../shared/context/ExerciseFlowContext'
import { useExerciseMutations } from '../../../shared/hooks/useExerciseMutations'

import { appendExercisesToWorkout } from '../utils/appendExercisesToWorkout'

import { draftWorkoutStorage } from '../../../shared/utils/storage/draftStorage'

import { buildWorkoutExercise } from '../utils/buildWorkoutExercise'

import { useWorkoutContext } from '../../../shared/context/WorkoutContext'
import { EMPTY_WORKOUT } from '../../../shared/utils/constants'
import { saveWorkoutAsTemplate, saveWorkoutSession } from '../utils/workoutPersistence'

/**
 * Handles workout state, timers and actions.
 * @param {(path: string, options?: object) => void} navigate - Navigation function
 * @param workoutId - Workout id
 * @returns {{
 *  workout: object,
 * setWorkout: (updater: (prev: object) => object) => void,
 *  saving: boolean,
 *  success: boolean,
 *  error: string,
 *  status: string,
 *  elapsed: number,
 *  isEditingName: boolean,
 *  setIsEditingName: (value: boolean) => void,
 *  handleStartPause: () => void,
 *  openLibrary: () => void,
 *  exerciseActions: object,
 *  updateWorkoutNotes: (notes: string) => void,
 *  saveWorkout: () => Promise<void>
 * }} Workout logic API
 */
export function useWorkoutLogic(navigate, workoutId) {
  const location = useLocation()

  // ===== STATE =====

  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [isEditingName, setIsEditingName] = useState(false)

  const {
    selectedExercises,
    setSelectedExercises,

    setReturnTo,
  } = useExerciseFlow()

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

    selectedTemplate,
    setSelectedTemplate,

    registerActivity,
  } = useWorkoutContext()


  // ===== INIT =====

  const [workout, setWorkout] = useState(() => {
    return draftWorkoutStorage.get() || EMPTY_WORKOUT
  })

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

  // ===== LOAD TEMPLATE =====

  useEffect(() => {
    if (!selectedTemplate) return

    setWorkout({
      name: selectedTemplate.name,
      notes: '',
      exercises: selectedTemplate.exercises.map((ex) =>
        buildWorkoutExercise(ex, null, {
          resetCompleted: true,
        }),
      ),
    })

    setSelectedTemplate(null)
  }, [selectedTemplate, setSelectedTemplate, setWorkout])

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

  const openLibrary = () => {
    setReturnTo(location.pathname)

    navigate(`/workouts/${workoutId}/exercises?select=true`)
  }

  // ===== SAVE WORKOUT =====

  const saveWorkout = async () => {
    try {
      setSaving(true)
      setError('')
      setSuccess(false)

      const saved =
        await saveWorkoutSession({
          workout,
          elapsed,
        })

      setSuccess(true)

      navigate(`/workouts/${saved._id}`, {
        state: {
          returnTo: '/workouts',
        },
      })

      setWorkout(EMPTY_WORKOUT)

      resetTimer()
      resetRest()

      setIsEditingName(false)

      draftWorkoutStorage.clear()
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.message ||
        'Could not save workout',
      )
    } finally {
      setSaving(false)
    }
  }

  // ===== SAVE WORKOUT AS TEMPLATE =====

  const saveAsTemplate = async () => {
    try {
      await saveWorkoutAsTemplate({
        workout,
      })

      setSuccess(true)
    } catch (err) {
      setError(
        err.response?.data?.error ||
        'Could not save template',
      )
    }
  }

  // ===== DISCARD WORKOUT (CREATE) =====

  const discardWorkout = () => {
    const confirmed = window.confirm('Discard current workout?')

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
    success,
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
