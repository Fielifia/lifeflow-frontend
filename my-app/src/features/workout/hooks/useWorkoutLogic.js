import { useEffect, useState } from 'react'
import API from '../../../shared/api/api'
import { useRestTimer } from './useRestTimer'
import { useTimer } from './useTimer'

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

  const { status, elapsed, handleStartPause, reset: resetTimer } = useTimer()

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

  // ===== INIT WORKOUT =====
  const [workout, setWorkout] = useState(() => {
    const stored = JSON.parse(localStorage.getItem('draftWorkout'))

    return {
      name: stored?.name?.trim() || 'Workout',
      exercises: stored?.exercises || [],
      notes: stored?.notes || '',
    }
  })

  // ===== SAVE DRAFT =====
  useEffect(() => {
    localStorage.setItem('draftWorkout', JSON.stringify(workout))
  }, [workout])

  // ===== ADD EXERCISES FROM LIBRARY =====
  useEffect(() => {
    const selected = location.state?.selectedExercises
    if (!selected?.length) return

    const lastWorkout = JSON.parse(localStorage.getItem('lastWorkout'))

    const newExercises = selected.map((ex) => {
      const previous = lastWorkout?.exercises?.find(
        (e) => e.exerciseId === ex.id,
      )

      return {
        exerciseId: ex.id,
        name: ex.name,
        image: ex.image,
        restTime: previous?.restTime ?? 60,
        sets: previous
          ? previous.sets.map((s) => ({
            reps: s.reps,
            weight: s.weight,
            completed: false,
          }))
          : [
            { reps: 8, weight: 0, completed: false },
            { reps: 8, weight: 0, completed: false },
          ],
      }
    })

    setWorkout((prev) => ({
      ...prev,
      exercises: [
        ...prev.exercises,
        ...newExercises.filter(
          (ex) => !prev.exercises.some((e) => e.exerciseId === ex.exerciseId),
        ),
      ],
    }))

    window.history.replaceState({}, '')
  }, [location.state])

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
      },
    })
  }

  // ===== MUTATIONS (RENARE) =====
  const updateExercises = (updater) => {
    setWorkout((prev) => ({
      ...prev,
      exercises: updater(prev.exercises),
    }))
  }

  const addSet = (index) => {
    updateExercises((exercises) => {
      const updated = [...exercises]
      const last = updated[index].sets.at(-1)

      updated[index].sets = [
        ...updated[index].sets,
        last
          ? { ...last, completed: false }
          : { reps: 8, weight: 0, completed: false },
      ]

      return updated
    })
  }

  const updateSet = (exIndex, setIndex, field, value) => {
    updateExercises((exercises) => {
      const updated = [...exercises]
      updated[exIndex].sets[setIndex] = {
        ...updated[exIndex].sets[setIndex],
        [field]: value,
      }
      return updated
    })
  }

  const removeExercise = (index) => {
    updateExercises((exercises) => exercises.filter((_, i) => i !== index))
  }

  const removeSet = (exIndex, setIndex) => {
    updateExercises((exercises) => {
      const updated = [...exercises]

      if (updated[exIndex].sets.length === 1) return updated

      updated[exIndex].sets = updated[exIndex].sets.filter(
        (_, i) => i !== setIndex,
      )

      return updated
    })
  }

  const toggleSetComplete = (exIndex, setIndex, checked) => {
    updateExercises((exercises) => {
      const updated = [...exercises]

      updated[exIndex].sets[setIndex] = {
        ...updated[exIndex].sets[setIndex],
        completed: checked,
      }

      if (checked) {
        const rest = updated[exIndex].restTime ?? restTime
        startRest(rest)
      }

      return updated
    })
  }

  const updateExerciseRest = (index, value) => {
    updateExercises((exercises) => {
      const updated = [...exercises]
      updated[index] = {
        ...updated[index],
        restTime: value,
      }
      return updated
    })
  }

  const updateWorkoutNotes = (notes) => {
    setWorkout((prev) => ({ ...prev, notes }))
  }

  // ===== SAVE =====
  const saveWorkout = async () => {
    try {
      setSaving(true)
      setError('')
      setSuccess(false)

      const cleaned = workout.exercises
        .map((ex) => ({
          ...ex,
          sets: ex.sets.filter((s) => s.completed),
        }))
        .filter((ex) => ex.sets.length > 0)

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

      // RESET
      setWorkout({
        name: 'Workout',
        exercises: [],
        notes: '',
      })

      resetTimer()
      resetRest()
      setIsEditingName(false)

      localStorage.removeItem('draftWorkout')
    } catch (err) {
      setError(err.response?.data?.error || 'Could not save workout')
    } finally {
      setSaving(false)
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
  }
}
