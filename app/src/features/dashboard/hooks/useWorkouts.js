import { useEffect, useState } from 'react'
import { getWorkouts } from '../../../shared/api/workoutApi'

/**
 * Fetches paginated workouts for the authenticated user.
 * @param {{
 *  page?: number,
 *  limit?: number
 * }} options - Query options
 *
 * @returns {{
 *  workouts: Array<object>,
 *  total: number,
 *  loading: boolean,
 *  error: string | null
 * }} Workout state
 */
export const useWorkouts = ({
  page = 1,
  limit = 20,
} = {}) => {
  const [workouts, setWorkouts] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        setLoading(true)

        const data = await getWorkouts({
          page,
          limit,
        })

        setWorkouts(data.results)
        setTotal(data.total)
      } catch (err) {
        console.error(err)

        setError('Failed to fetch workouts')
      } finally {
        setLoading(false)
      }
    }

    fetchWorkouts()
  }, [page, limit])

  return {
    workouts,
    total,
    loading,
    error,
  }
}
