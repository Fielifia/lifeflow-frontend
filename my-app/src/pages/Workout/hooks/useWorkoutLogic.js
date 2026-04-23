import { useState, useEffect } from 'react'
import { useTimer } from './useTimer'
import { useRestTimer } from './useRestTimer'

/**
 * Handles all workout logic (state, timers, actions).
 * @param {Function} navigate - React Router navigate
 * @param {object} location - React Router location
 * @returns {{
 *   workout: Object,
 *   saving: boolean,
 *   success: boolean,
 *   error: string,
 *
 *   status: string,
 *   elapsed: number,
 *
 *   restTime: number,
 *   setRestTime: Function,
 *   restRemaining: number,
 *   isResting: boolean,
 *   skipRest: Function,
 *
 *   customName: string,
 *   setCustomName: Function,
 *   isEditingName: boolean,
 *   setIsEditingName: Function,
 *
 *   handleStartPause: Function,
 *   adjustRest: Function,
 *
 *   openLibrary: Function,
 *   addSet: Function,
 *   updateSet: Function,
 *   removeExercise: Function,
 *   removeSet: Function,
 *   toggleSetComplete: Function,
 *   updateWorkoutNotes: Function,
 *
 *   saveWorkout: Function
 * }}
 */
export function useWorkoutLogic(navigate, location) {
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

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

  const [workout, setWorkout] = useState(() => {
    return (
      JSON.parse(localStorage.getItem('draftWorkout')) || {
        exercises: [],
        notes: '',
      }
    )
  })

  const [customName, setCustomName] = useState('')
  const [isEditingName, setIsEditingName] = useState(false)

  // ===== SAVE DRAFT =====
  useEffect(() => {
    localStorage.setItem('draftWorkout', JSON.stringify(workout))
  }, [workout])

  // ===== ADD EXERCISES =====
  useEffect(() => {
    const selected = location.state?.selectedExercises
    const lastWorkout = JSON.parse(localStorage.getItem('lastWorkout'))

    if (!selected || selected.length === 0) return

    const newExercises = selected.map((ex) => {
      const previous = lastWorkout?.exercises?.find(
        (e) => e.exerciseId === ex.id,
      )

      return {
        exerciseId: ex.id,
        name: ex.name,
        image: ex.image,
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

  const formatTime = (s) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const safeStartPause = () => {
    if (workout.exercises.length === 0) return
    handleStartPause()
  }

  const openLibrary = () => {
    navigate('/exercises?select=true', {
      state: { currentExercises: workout.exercises },
    })
  }

  const addSet = (index) => {
    const updated = [...workout.exercises]
    const last = updated[index].sets.slice(-1)[0]

    updated[index].sets.push(
      last
        ? { ...last, completed: false }
        : { reps: 8, weight: 0, completed: false },
    )

    setWorkout({ ...workout, exercises: updated })
  }

  const updateSet = (exIndex, setIndex, field, value) => {
    const updated = [...workout.exercises]
    updated[exIndex].sets[setIndex][field] = value
    setWorkout({ ...workout, exercises: updated })
  }

  const updateWorkoutNotes = (value) => {
    setWorkout({ ...workout, notes: value })
  }

  const removeExercise = (index) => {
    setWorkout({
      ...workout,
      exercises: workout.exercises.filter((_, i) => i !== index),
    })
  }

  const removeSet = (exIndex, setIndex) => {
    const updated = [...workout.exercises]
    if (updated[exIndex].sets.length === 1) return

    updated[exIndex].sets = updated[exIndex].sets.filter(
      (_, i) => i !== setIndex,
    )

    setWorkout({ ...workout, exercises: updated })
  }

  const toggleSetComplete = (exIndex, setIndex, checked) => {
    setWorkout((prev) => {
      const updated = [...prev.exercises]

      updated[exIndex].sets[setIndex] = {
        ...updated[exIndex].sets[setIndex],
        completed: checked,
      }

      if (checked) {
        startRest()
      }

      return {
        ...prev,
        exercises: updated,
      }
    })
  }

  const saveWorkout = async () => {
    try {
      setSaving(true)
      setError('')
      setSuccess(false)

      const token = JSON.parse(localStorage.getItem('user'))?.token

      const cleaned = workout.exercises
        .map((ex) => ({
          ...ex,
          sets: ex.sets.filter((s) => s.completed),
        }))
        .filter((ex) => ex.sets.length > 0)

      if (cleaned.length === 0) {
        setError('Complete at least one set')
        return
      }

      localStorage.setItem('lastWorkout', JSON.stringify(workout))

      const res = await fetch('http://localhost:5000/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...workout,
          exercises: cleaned,
          duration: elapsed,
        }),
      })

      if (!res.ok) throw new Error()

      setSuccess(true)

      setWorkout({ exercises: [], notes: '' })
      resetTimer()
      resetRest()

      setCustomName('')
      setIsEditingName(false)

      localStorage.removeItem('draftWorkout')
    } catch {
      setError('Could not save workout')
    } finally {
      setSaving(false)
    }
  }

  return {
    workout,
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

    customName,
    setCustomName,
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
    formatTime,
  }
}
