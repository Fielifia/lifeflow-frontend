import DataState from '../../../shared/ui/DataState'
import DashboardContent from '../components/DashboardContent'
import { useDashboardStats } from '../hooks/useDashboardStats'
import { useRecentWorkouts } from '../hooks/useRecentWorkouts'

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'))

  const { stats, loading, error } = useDashboardStats()

  const {
    workouts: recentWorkouts,
  } = useRecentWorkouts()

  return (
    <div className="app">
      <DataState
        loading={loading}
        error={error}
        data={stats}
        variant="card"
        emptyText="No statistics available yet"
      >
        <DashboardContent
          stats={stats}
          user={user}
          recentWorkouts={recentWorkouts}
        />
      </DataState>
    </div>
  )
}
