import { useState } from 'react'
import { useTimer } from './useTimer'
import { useRestTimer } from './useRestTimer'
import { createWorkout } from '../../../api/workoutApi'

/**
 *
 * @param root0
 * @param root0.workout
 * @param root0.setWorkout
 * @param root0.navigate
 * @param root0.location
 */
export function useWorkoutLogic({ workout, setWorkout, navigate, location }) {
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

  // ===== SAFE START =====
  const safeStartPause = () => {
    if (!workout?.exercises?.length) return
    handleStartPause()
  }

  // ===== NAVIGATE TO LIBRARY =====
  const openLibrary = () => {
    navigate('/exercises?select=true', {
      state: {
        currentExercises: workout.exercises,
        from: location.pathname,
      },
    })
  }

  // ===== TOGGLE SET =====
  const toggleSetComplete = (exIndex, setIndex, checked) => {
    setWorkout((prev) => {
      const updated = [...prev.exercises]

      updated[exIndex].sets[setIndex] = {
        ...updated[exIndex].sets[setIndex],
        completed: checked,
      }

      if (checked) {
        const rest = workout.exercises[exIndex].restTime || 120
        startRest(rest)
      }

      return {
        ...prev,
        exercises: updated,
      }
    })
  }

  // ===== SAVE WORKOUT =====
  const saveWorkout = async () => {
    try {
      setSaving(true)
      setError('')
      setSuccess(false)

      const cleaned = workout.exercises
        .map((ex) => ({
          ...ex,
          sets: (ex.sets || []).filter((s) => s.completed),
        }))
        .filter((ex) => ex.sets.length > 0)

      if (cleaned.length === 0) {
        setError('Complete at least one set')
        return
      }

      const payload = {
        ...workout,
        exercises: cleaned,
        duration: elapsed,
        name: workout.name?.trim() || 'Workout',
      }

      localStorage.setItem('lastWorkout', JSON.stringify(workout))

      await createWorkout(payload)

      setSuccess(true)

      // reset state
      setWorkout({ name: 'Workout', exercises: [], notes: '' })
      resetTimer()
      resetRest()

      localStorage.removeItem('draftWorkout')
    } catch (err) {
      const msg =
        err.response?.data?.error || err.message || 'Could not save workout'

      setError(msg)
    } finally {
      setSaving(false)
    }
  }

  return {
    saving,
    success,
    error,

    status,
    elapsed,

    toggleSetComplete,

    restTime,
    setRestTime,
    restRemaining,
    isResting,
    skipRest: skip,

    handleStartPause: safeStartPause,
    adjustRest: adjust,
    openLibrary,
    saveWorkout,
  }
}
