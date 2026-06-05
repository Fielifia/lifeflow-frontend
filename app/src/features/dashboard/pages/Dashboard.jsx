import '../Dashboard.css'
import Header from '../../../shared/components/ui/Header'
import DashboardSkeleton from '../../../shared/components/ui/skeleton/DashboardSkeleton'
import { useUser } from '../../../shared/context/UserContext'
import DashboardContent from '../components/DashboardContent'
import { useOverviewStats } from '../hooks/useOverviewStats'
import { useWorkouts } from '../hooks/useWorkouts'

/**
 * Dashboard page.
 * @returns {import('react').ReactElement} Dashboard page UI
 */
export default function Dashboard() {
  const { user } = useUser()

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
      <Header />

      <DashboardContent stats={stats} user={user} recentWorkouts={workouts} />
    </div>
  )
}
