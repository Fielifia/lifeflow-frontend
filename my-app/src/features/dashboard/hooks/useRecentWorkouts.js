import { useEffect, useState } from 'react'
import { getRecentWorkouts } from '../../../shared/api/workoutApi'

export const useRecentWorkouts = () => {
  const [workouts, setWorkouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const data = await getRecentWorkouts()

        setWorkouts(data)
      } catch (error) {
        setError('Failed to fetch recent workouts')
      } finally {
        setLoading(false)
      }
    }

    fetchWorkouts()
  }, [])

  return {
    workouts,
    loading,
    error,
  }
}
