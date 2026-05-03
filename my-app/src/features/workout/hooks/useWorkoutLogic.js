import { useEffect, useState } from 'react'
import { useRef } from 'react'
import API from '../../../shared/api/api'
import { mapWorkoutToTemplate } from '../../template/utils/mapWorkoutToTemplate'
import { cleanWorkoutForSave } from '../utils/cleanWorkoutForSave'
import { detectPersonalBest } from '../utils/detectPersonalBest'
import { workoutMutation } from '../utils/workoutMutations'
import { useRestTimer } from './useRestTimer'
import { useTimer } from './useTimer'
import { usePreviousExercise } from './usePreviousExercise'

/**
 * Handles workout state, timers and actions.
 * @param {(path: string, options?: object) => void} navigate - Navigation function
 * @param {{ state?: object, pathname: string }} location - Current route info
 * @returns {{
 *  workout: object,
 * setWorkout: (updater: (prev: object) => object) => void,
 *  saving: boolean,
 *  success: boolean,
 *  error: string,
 *  status: string,
 *  elapsed: number,
 *  restTime: number,
 *  setRestTime: (value: number) => void,
 *  restRemaining: number,
 *  isResting: boolean,
 *  skipRest: () => void,
 *  updateExerciseRest: (index: number, value: number) => void,
 *  isEditingName: boolean,
 *  setIsEditingName: (value: boolean) => void,
 *  handleStartPause: () => void,
 *  adjustRest: (amount: number) => void,
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
export function useWorkoutLogic(navigate, location) {
  // ===== STATE =====
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [isEditingName, setIsEditingName] = useState(false)

  const { status, elapsed, handleStartPause, reset: resetTimer, start } = useTimer()

  const [pbs, setPbs] = useState({})

  const hasAddedRef = useRef(false)

  const DEFAULT_SETS = [
    { reps: 8, weight: 0, completed: false },
    { reps: 8, weight: 0, completed: false },
    { reps: 8, weight: 0, completed: false },
  ]

  const {
    restTime,
    setRestTime,
    restRemaining,
    isResting,
    adjust,
    skip,
    reset: resetRest,
    startRest,
  } = useRestTimer()

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
      return { name: 'Workout', exercises: [], notes: '' }
    }
  })

  useEffect(() => {
    if (status === 'idle') {
      start()
    }
  }, [])

  // ===== SAVE DRAFT =====
  useEffect(() => {
    localStorage.setItem('draftWorkout', JSON.stringify(workout))
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

      navigate(location.pathname, { replace: true, state: null })
    }

    run()
  }, [location.state])

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

    navigate(location.pathname, { replace: true, state: null })
  }, [location.state, navigate, location.pathname])

  const handleAddExercise = async (exercise) => {
    let sets = DEFAULT_SETS.map((s) => ({ ...s }))

    const previousSets = await getPreviousSets(
      exercise.id || exercise.exerciseId,
    )

    if (previousSets) {
      sets = previousSets.map((s) => ({
        reps: s.reps,
        weight: s.weight,
        completed: false,
        prevReps: s.reps,
        prevWeight: s.weight,
      }))
    }

    setWorkout((prev) => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        {
          ...exercise,
          exerciseId: exercise.id || exercise.exerciseId,
          sets,
        },
      ],
    }))
  }

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

  const toggleSetComplete = (exIndex, setIndex, checked) => {
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
      const rest = workout.exercises[exIndex].restTime ?? restTime
      startRest(rest)
    }
  }

  const updateWorkoutNotes = (notes) =>
    setWorkout((prev) => ({ ...prev, notes }))

  // ===== HELPERS =====
  const safeStartPause = () => {
    if (!workout.exercises.length) return
    handleStartPause()
  }

  const openLibrary = () => {
    navigate('/exercises?select=true', {
      state: {
        currentExercises: workout.exercises,
        from: location.pathname,
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

      localStorage.setItem('lastWorkout', JSON.stringify(workout))

      await API.post('/workouts', {
        ...workout,
        name: workout.name?.trim() || 'Workout',
        exercises: cleaned,
        duration: elapsed,
      })

      setSuccess(true)

      setWorkout({ name: 'Workout', exercises: [], notes: '' })
      resetTimer()
      resetRest()
      setIsEditingName(false)

      localStorage.removeItem('draftWorkout')
      navigate('/workouts')
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

  return {
    workout,
    setWorkout,

    saving,
    success,
    error,

    status,
    elapsed,

    restTime,
    setRestTime,
    restRemaining,
    isResting,
    skipRest: skip,
    updateExerciseRest,
    handleAddExercise,
    pbs,

    isEditingName,
    setIsEditingName,

    handleStartPause: safeStartPause,
    adjustRest: adjust,

    openLibrary,
    addSet,
    updateSet,
    removeExercise,
    removeSet,
    toggleSetComplete,
    updateWorkoutNotes,

    saveWorkout,
    saveAsTemplate,
  }
}
