import DataState from '../../../shared/ui/DataState'
import DashboardContent from '../components/DashboardContent'
import { useDashboardStats } from '../hooks/useDashboardStats'

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'))

  const { stats, loading, error } = useDashboardStats()

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
        />
      </DataState>
    </div>
  )
}
