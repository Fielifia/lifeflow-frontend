import { useEffect, useState } from 'react'
import { getWorkouts } from '../../../shared/api/workoutApi'
import DataState from '../../../shared/ui/DataState'
import WorkoutCard from '../components/WorkoutCard'

/**
 * Page for displaying user's workout history.
 *
 * Fetches workouts from API and renders a list of workout cards.
 * @returns {import('react').ReactElement} Workout history page UI
 */
export default function WorkoutHistoryPage() {
  const [workouts, setWorkouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true)
        const data = await getWorkouts()
        setWorkouts(Array.isArray(data) ? data : data.results || [])
      } catch (err) {
        setError('Failed to load workouts')
      } finally {
        setLoading(false)
      }
    }

    fetch()
  }, [])

  return (
    <div className="app">

      <h2>Workout History</h2>

      <DataState
        loading={loading}
        error={error}
        data={workouts}
        emptyText="No workouts yet"
      >
        <div className="page-section">
          {workouts.map((w) => (
            <WorkoutCard key={w._id} workout={w} />
          ))}
        </div>
      </DataState>
    </div>
  )
}
