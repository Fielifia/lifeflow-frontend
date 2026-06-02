import { useEffect, useState } from 'react'

import { useOverviewStats } from '../../../features/dashboard/hooks/useOverviewStats'
import { getWorkoutsApi } from '../../../shared/api/workoutApi'

import { ERROR_MESSAGES } from '../../../shared/utils/constants/constants'

import { useWorkoutManager } from '../hooks/useWorkoutManager'

import Header from '../../../shared/components/ui/Header'

import HistorySummary from '../components/HistorySummary'

import WorkoutList from '../components/WorkoutList'

/**
 * Page for displaying user's workout history.
 * Fetches workouts from API and renders workout history.
 * @returns {import('react').ReactElement} Workout history page UI
 */
export default function WorkoutHistoryPage() {
  const { stats } = useOverviewStats()

  const [workouts, setWorkouts] = useState([])

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState(null)

  const { deleteWorkout } = useWorkoutManager()

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true)

        setError(null)

        const data = await getWorkoutsApi()

        setWorkouts(Array.isArray(data) ? data : data.results || [])
      } catch (err) {
        setError(ERROR_MESSAGES.LOAD_WORKOUT)
      } finally {
        setLoading(false)
      }
    }

    fetch()
  }, [])

  const handleDeleteWorkout = async (id) => {
    const deleted = await deleteWorkout(id)

    if (!deleted) {
      return
    }

    setWorkouts((prev) => prev.filter((workout) => workout._id !== id))
  }

  return (
    <div className="app">
      {/* HEADER */}

      <Header subtitle="Your completed sessions" />

      {/* CURRENT WEEK SUMMARY */}

      <HistorySummary stats={stats} recentWorkouts={workouts} />

      {/* WORKOUTS */}

      <WorkoutList
        workouts={workouts}
        loading={loading}
        error={error}
        limit={10}
        onDeleteWorkout={handleDeleteWorkout}
      />
    </div>
  )
}
