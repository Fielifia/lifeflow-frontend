import Header from '../../../shared/components/ui/Header'
import DashboardSkeleton from '../../../shared/components/ui/skeleton/DashboardSkeleton'
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

  if (loading) {
    return (
      <DashboardSkeleton
        loading={loading}
        error={error}
        data={stats}
        variant="dashboard"
      />
    )
  }

  return (
    <div className="app">
      <Header title="LifeFlow Fitness" />

      <DashboardContent stats={stats} user={user} recentWorkouts={workouts} />
    </div>
  )
}
