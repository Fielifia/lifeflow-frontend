import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useExerciseMutations } from '../../../shared/hooks/useExerciseMutations.js'
import { appendExercisesToWorkout } from '../utils/appendExercisesToWorkout.js'
import { buildWorkoutExercise } from '../utils/buildWorkoutExercise.js'
import { saveWorkoutAsTemplate, saveWorkoutSession } from '../utils/workoutPersistence.js'

import { useExerciseFlow } from '../../../shared/context/ExerciseFlowContext'
import { useWorkoutContext } from '../../../shared/context/WorkoutContext'
import { draftWorkoutStorage } from '../../../shared/utils/storage/draftStorage.js'
import { EMPTY_WORKOUT } from '../constants.js'

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
 *  updateExerciseRest: (index: number, value: number) => void,
 *  isEditingName: boolean,
 *  setIsEditingName: (value: boolean) => void,
 *  handleStartPause: () => void,
 *  openLibrary: () => void,
 *  addSet: (index: number) => void,
 *  updateSet: (exIndex: number, setIndex: number, field: string, value: number | '') => void,
 *  removeExercise: (index: number) => void,
 *  removeSet: (exIndex: number, setIndex: number) => void,
 *  toggleSetComplete: (exIndex: number, setIndex: number, checked: boolean) => void,
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

    setActiveWorkout,

    selectedTemplate,
    setSelectedTemplate,

    registerActivity,
  } = useWorkoutContext()


  // ===== INIT =====
  const {
    activeWorkout: workout,
    setActiveWorkout: setWorkout,
  } = useWorkoutContext()

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
  }, [selectedTemplate, setSelectedTemplate])

  useEffect(() => {
    if (status === 'running' || status === 'paused') {
      setActiveWorkout({
        id: workoutId,
        name: workout.name,
        status,
        elapsed,
        startTime,
        exercises: workout.exercises,
      })
    } else {
      setActiveWorkout(null)
    }
  }, [
    status,
    elapsed,
    startTime,
    workout.name,
    workout.exercises,
    setActiveWorkout,
    workoutId,
  ])

  const {
    addSet,
    updateSet,
    removeSet,
    removeExercise,
    updateExerciseRest,
    updateExerciseNotes,
    toggleSetComplete,
  } = useExerciseMutations(setWorkout, {
    onSetCompleted: (rest) => {
      startRest(rest)
      registerActivity()
    },
  })

  const updateWorkoutNotes = (notes) =>
    setWorkout((prev) => ({ ...prev, notes }))

  const openLibrary = () => {
    setReturnTo(location.pathname)

    navigate(`/workouts/${workoutId}/exercises?select=true`)
  }

  // ===== SAVE =====
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

      setActiveWorkout(null)

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

  // ===== SAVE AS TEMPLATE =====
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

  const discardWorkout = () => {
    const confirmed = window.confirm('Discard current workout?')

    if (!confirmed) {
      return
    }

    setWorkout(EMPTY_WORKOUT)

    resetTimer()
    resetRest()

    setIsEditingName(false)

    setActiveWorkout(null)

    draftWorkoutStorage.clear()

    navigate('/workouts')
  }

  return {
    workout,
    setWorkout,

    // Timer
    status,
    elapsed,
    startTime,
    adjustStartTime,
    handleStartPause,

    saving,
    success,
    error,

    updateExerciseNotes,
    updateExerciseRest,

    isEditingName,
    setIsEditingName,

    openLibrary,
    addSet,
    updateSet,
    removeExercise,
    removeSet,
    toggleSetComplete,
    updateWorkoutNotes,

    saveWorkout,
    saveAsTemplate,

    discardWorkout,
  }
}
