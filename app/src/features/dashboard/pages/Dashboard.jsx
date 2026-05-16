import DataState from '../../../shared/components/ui/DataState'
import Header from '../../../shared/components/ui/Header'
import { userStorage } from '../../../shared/utils/storage/userStorage'
import DashboardContent from '../components/DashboardContent'
import { useOverviewStats } from '../hooks/useOverviewStats'
import { useWorkouts } from '../hooks/useWorkouts'

/**
 * Dashboard page.
 * @returns {import('react').ReactElement} Dashboard page UI
 */
export default function Dashboard() {
  const user = userStorage.get()

  const { stats, loading, error } = useOverviewStats()

  const { workouts } = useWorkouts({ limit: 3 })

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
          recentWorkouts={workouts}
        />
      </DataState>
    </div>
  )
}
