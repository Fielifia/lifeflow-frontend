import { useEffect, useRef, useState } from 'react'
import API from '../../../shared/api/api'
import { useWorkoutContext } from '../../../shared/context/WorkoutContext'
import { mapWorkoutToTemplate } from '../../template/utils/mapWorkoutToTemplate'
import { DEFAULT_REST, DEFAULT_SETS, EMPTY_WORKOUT } from '../constants.js'
import { cleanWorkoutForSave } from '../utils/cleanWorkoutForSave'
import { detectPersonalBest } from '../utils/detectPersonalBest'
import { workoutMutation } from '../utils/workoutMutations'
import { usePreviousExercise } from './usePreviousExercise'


/**
 * Handles workout state, timers and actions.
 * @param {(path: string, options?: object) => void} navigate - Navigation function
 * @param {{ state?: object, pathname: string }} location - Current route info
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
export function useWorkoutLogic(navigate, location, workoutId) {
  // ===== STATE =====
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [isEditingName, setIsEditingName] = useState(false)

  const { setActiveWorkout } = useWorkoutContext()
  const [pbs, setPbs] = useState({})

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

  const { getPreviousSets } = usePreviousExercise()

  // ===== INIT =====
  const [workout, setWorkout] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('draftWorkout'))
      return {
        name: stored?.name?.trim() || 'Workout',
        exercises: stored?.exercises || [],
        notes: stored?.notes || '',
      }
    } catch {
      return EMPTY_WORKOUT
    }
  })

  // ===== SAVE DRAFT =====
  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem('draftWorkout', JSON.stringify(workout))
    }, 500)

    return () => clearTimeout(timeout)
  }, [workout])

  // ===== ADD FROM LIBRARY =====
  useEffect(() => {
    const selected = location.state?.selectedExercises
    const mode = location.state?.mode

    if (!selected?.length || mode !== 'workout' || hasAddedRef.current) return

    hasAddedRef.current = true

    const run = async () => {
      const results = await Promise.all(
        selected.map(async (ex) => {
          let sets = DEFAULT_SETS.map((s) => ({ ...s }))

          const prev = await getPreviousSets(ex.id || ex.exerciseId)

          if (prev) {
            sets = prev.map((s) => ({
              reps: s.reps,
              weight: s.weight,
              completed: false,
              prevReps: s.reps,
              prevWeight: s.weight,
            }))
          }

          return {
            ...ex,
            exerciseId: ex.id || ex.exerciseId,
            restTime: ex.restTime ?? DEFAULT_REST,
            sets,
          }
        }),
      )

      setWorkout((prev) => ({
        ...prev,
        exercises: [
          ...prev.exercises,
          ...results.filter(
            (newEx) =>
              !prev.exercises.some(
                (existing) => existing.exerciseId === newEx.exerciseId,
              ),
          ),
        ],
      }))

    }

    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state?.selectedExercises])

  // ===== LOAD TEMPLATE =====
  useEffect(() => {
    const template = location.state?.template
    if (!template) return

    setWorkout({
      name: template.name,
      notes: '',
      exercises: template.exercises.map((ex) => ({
        ...ex,
        sets: ex.sets.map((s) => ({ ...s, completed: false })),
      })),
    })

  }, [location.state, navigate, location.pathname])

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

  // ===== MUTATION WRAPPERS =====
  const addSet = (index) =>
    setWorkout((prev) => workoutMutation.addSet(prev, index))

  const updateSet = (exIndex, setIndex, field, value) =>
    setWorkout((prev) =>
      workoutMutation.updateSet(prev, exIndex, setIndex, field, value),
    )

  const removeSet = (exIndex, setIndex) =>
    setWorkout((prev) => workoutMutation.removeSet(prev, exIndex, setIndex))

  const removeExercise = (index) =>
    setWorkout((prev) => workoutMutation.removeExercise(prev, index))

  const updateExerciseRest = (index, value) =>
    setWorkout((prev) => workoutMutation.updateExerciseRest(prev, index, value))

  const updateExerciseNotes = (index, notes) =>
    setWorkout((prev) =>
      workoutMutation.updateExerciseNotes(prev, index, notes),
    )

  const toggleSetComplete = (exIndex, setIndex, checked) => {
    const ex = workout.exercises[exIndex]
    const rest = ex.restTime

    setWorkout((prev) => {
      const exercises = prev.exercises.map((ex, i) => {
        if (i !== exIndex) return ex

        return {
          ...ex,
          sets: ex.sets.map((set, j) => {
            if (j !== setIndex) return set
            return { ...set, completed: checked }
          }),
        }
      })

      const updatedWorkout = { ...prev, exercises }
      setPbs(detectPersonalBest(updatedWorkout))

      return updatedWorkout
    })

    if (checked) {
      startRest(rest)
      registerActivity()
    }
  }

  const updateWorkoutNotes = (notes) =>
    setWorkout((prev) => ({ ...prev, notes }))

  const openLibrary = () => {
    navigate(`/workouts/${workoutId}/exercises`, {
      replace: true,
      state: {
        currentExercises: workout.exercises,
        returnTo: location.pathname,
        mode: 'workout',
      },
    })
  }

  // ===== SAVE =====
  const saveWorkout = async () => {
    try {
      setSaving(true)
      setError('')
      setSuccess(false)

      const cleaned = cleanWorkoutForSave(workout)

      if (!cleaned.length) {
        setError('Complete at least one set')
        return
      }

      const payload = {
        ...workout,
        name: workout.name?.trim() || 'Workout',
        exercises: cleaned,
        duration: elapsed,
        notes: workout.notes,
      }

      const saved = await API.post('/workouts', payload)

      setSuccess(true)

      navigate(`/workouts/${saved.data._id}`)

      setWorkout(EMPTY_WORKOUT)
      resetTimer()
      resetRest()
      setIsEditingName(false)
      setActiveWorkout(null)

      localStorage.removeItem('draftWorkout')
    } catch (err) {
      setError(err.response?.data?.error || 'Could not save workout')
    } finally {
      setSaving(false)
    }
  }

  const saveAsTemplate = async () => {
    try {
      const template = mapWorkoutToTemplate(workout)
      await API.post('/templates', template)
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.error || 'Could not save template')
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

    localStorage.removeItem('draftWorkout')

    navigate('/dashboard')
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
    pbs,

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
