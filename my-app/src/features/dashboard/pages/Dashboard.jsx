import DataState from '../../../shared/ui/DataState'
import Header from '../../../shared/ui/Header'
import DashboardContent from '../components/DashboardContent'
import { useOverviewStats } from '../hooks/useOverviewStats'
import { useRecentWorkouts } from '../hooks/useRecentWorkouts'

/**
 * Dashboard page.
 * @returns {import('react').ReactElement} Dashboard page UI
 */
export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'))

  const { stats, loading, error } = useOverviewStats()

  const {
    workouts: recentWorkouts,
  } = useRecentWorkouts()

  return (
    <div className="app">
      <Header
        title="LifeFlow Fitness"
      />
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
