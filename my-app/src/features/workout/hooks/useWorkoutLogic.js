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
    let stored = null
    try {
      stored = JSON.parse(localStorage.getItem('draftWorkout'))
    } catch { }

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
    const mode = location.state?.mode

    if (!selected?.length || mode !== 'workout') return

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

    navigate(location.pathname, { replace: true, state: null })
  }, [
    location.state?.selectedExercises,
    location.state?.mode,
    location.pathname,
    navigate,
  ])

  // ===== LOAD WORKOUT FROM TEMPLATE =====
  useEffect(() => {
    const template = location.state?.template
    if (!template) return

    const workoutFromTemplate = {
      name: template.name,
      notes: '',
      exercises: template.exercises.map((ex) => ({
        ...ex,
        sets: ex.sets.map((s) => ({
          ...s,
          completed: false,
        })),
      })),
    }

    setWorkout(workoutFromTemplate)

    navigate(location.pathname, { replace: true, state: null })
  }, [location.state?.template, location.pathname, navigate])


  const workoutToTemplate = (workout) => ({
    name: workout.name || 'Template',
    exercises: workout.exercises.map((ex) => ({
      exerciseId: ex.exerciseId,
      name: ex.name,

      images: ex.images?.length ? ex.images : ex.image ? [ex.image] : [],

      notes: ex.notes || '',
      rest: ex.restTime ?? ex.rest ?? 120,

      sets: ex.sets.map((s) => ({
        reps: s.reps,
        weight: s.weight,
      })),
    })),
  })

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

  const addSet = (index) => {
    setWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex, i) => {
        if (i !== index) return ex

        const last = ex.sets.at(-1)

        const newSet = last
          ? { ...last, completed: false }
          : { reps: 8, weight: 0, completed: false }

        return {
          ...ex,
          sets: [...ex.sets, newSet],
        }
      }),
    }))
  }

  const updateSet = (exIndex, setIndex, field, value) => {
    setWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex, i) => {
        if (i !== exIndex) return ex

        return {
          ...ex,
          sets: ex.sets.map((set, j) => {
            if (j !== setIndex) return set

            return {
              ...set,
              [field]: value,
            }
          }),
        }
      }),
    }))
  }

  const removeExercise = (index) => {
    setWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== index),
    }))
  }

  const removeSet = (exIndex, setIndex) => {
    setWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex, i) => {
        if (i !== exIndex) return ex

        if (ex.sets.length === 1) return ex

        return {
          ...ex,
          sets: ex.sets.filter((_, j) => j !== setIndex),
        }
      }),
    }))
  }

  const toggleSetComplete = (exIndex, setIndex, checked) => {
    setWorkout((prev) => {
      const exercises = prev.exercises.map((ex, i) => {
        if (i !== exIndex) return ex

        return {
          ...ex,
          sets: ex.sets.map((set, j) => {
            if (j !== setIndex) return set

            return {
              ...set,
              completed: checked,
            }
          }),
        }
      })

      if (checked) {
        const rest = exercises[exIndex].restTime ?? restTime
        startRest(rest)
      }

      return {
        ...prev,
        exercises,
      }
    })
  }

  const updateExerciseRest = (index, value) => {
    setWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex, i) => {
        if (i !== index) return ex

        return {
          ...ex,
          restTime: value,
        }
      }),
    }))
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

      navigate('/workouts')
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
    workoutToTemplate,
  }
}
