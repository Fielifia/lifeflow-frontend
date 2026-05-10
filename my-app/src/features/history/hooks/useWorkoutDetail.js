import { useEffect, useMemo, useState } from 'react'
import { getWorkoutById } from '../../../shared/api/workoutApi'

export function useWorkoutDetail(id) {
  const [workout, setWorkout] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        setLoading(true)

        const data = await getWorkoutById(id)

        setWorkout(data)
      } catch {
        setError('Could not load workout')
      } finally {
        setLoading(false)
      }
    }

    fetchWorkout()
  }, [id])

  const stats = useMemo(() => {
    if (!workout) return null

    const totalSets = workout.exercises.reduce(
      (sum, ex) => sum + ex.sets.length,
      0,
    )

    const totalReps = workout.exercises.reduce(
      (sum, ex) =>
        sum +
        ex.sets.reduce((repSum, set) => repSum + (Number(set.reps) || 0), 0),
      0,
    )

    const totalVolume = workout.exercises.reduce(
      (sum, ex) =>
        sum +
        ex.sets.reduce(
          (setSum, set) =>
            setSum + (Number(set.weight) || 0) * (Number(set.reps) || 0),
          0,
        ),
      0,
    )

    return {
      totalSets,
      totalReps,
      totalVolume,
    }
  }, [workout])

  return {
    workout,
    loading,
    error,
    stats,
  }
}
