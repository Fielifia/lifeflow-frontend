import { useEffect, useState } from 'react'
import { getRecentWorkouts } from '../../../shared/api/workoutApi'

export const useRecentWorkouts = () => {
  const [workouts, setWorkouts] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const data = await getRecentWorkouts()

        setWorkouts(data)
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error)
      } finally {
        setLoading(false)
      }
    }

    fetchWorkouts()
  }, [])

  return {
    workouts,
    loading,
  }
}
