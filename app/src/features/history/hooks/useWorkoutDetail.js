import { useEffect, useMemo, useState } from 'react'
import { getWorkoutByIdApi } from '../../../shared/api/workoutApi'
import { ERROR_MESSAGES } from '../../../shared/utils/constants/constants'
import { calculateWorkoutStats } from '../../../shared/utils/calculateWorkoutStats'

/**
 * Fetches a completed workout and calculates summary statistics.
 *
 * Handles:
 * - Fetching workout by ID
 * - Loading and error state
 * - Derived workout statistics
 *
 * Statistics include:
 * - Total sets
 * - Total reps
 * - Total training volume
 * @param {string} id - Workout ID
 * @returns {{
 *   workout: object | null,
 *   loading: boolean,
 *   error: string | null,
 *   stats: {
 *     totalSets: number,
 *     totalReps: number,
 *     totalVolume: number,
 *   } | null
 * }} Workout detail state and calculated workout statistics.
 */
export function useWorkoutDetail(id) {
  const [workout, setWorkout] = useState(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        setLoading(true)
        setError(null)

        const data = await getWorkoutByIdApi(id)

        setWorkout(data)
      } catch {
        setError(ERROR_MESSAGES.LOAD_WORKOUT)
      } finally {
        setLoading(false)
      }
    }

    fetchWorkout()
  }, [id])

  const stats = useMemo(() => {
    if (!workout) return null

    return calculateWorkoutStats(workout)
  }, [workout])

  return {
    workout,
    loading,
    error,
    stats,
  }
}
