import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useExerciseFlow } from '../../../shared/context/ExerciseFlowContext'
import { getWorkoutsApi } from '../../../shared/api/workoutApi'
import DataState from '../../../shared/ui/DataState'
import Header from '../../../shared/ui/Header'
import WorkoutCard from '../components/WorkoutCard'

/**
 * Page for displaying user's workout history.
 *
 * Fetches workouts from API and renders a list of workout cards.
 * @returns {import('react').ReactElement} Workout history page UI
 */
export default function WorkoutHistoryPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const { setReturnTo } = useExerciseFlow()

  const [workouts, setWorkouts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getWorkoutsApi()
        setWorkouts(Array.isArray(data) ? data : data.results || [])
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetch()
  }, [])

  return (
    <div className="app">
      <Header
        title="Workout History"
        subtitle="Your completed sessions"
      />

      <DataState
        loading={loading}
        error={error}
        data={workouts}
        variant="card-workout"
        emptyText="No workouts yet"
      >
        <div className="page-section">
          {workouts.map((workout) => (
            <WorkoutCard
              key={workout._id}
              workout={workout}
              onClick={() => {
                setReturnTo(location.pathname)

                navigate(`/workouts/${workout._id}`)
              }
              }
            />
          ))}
        </div>
      </DataState>
    </div>
  )
}
