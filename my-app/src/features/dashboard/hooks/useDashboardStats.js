import { useEffect, useState } from 'react'
import { getOverviewStats } from '../../../shared/api/statsApi'

export const useDashboardStats = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getOverviewStats()

        setStats(data)
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return {
    stats,
    loading,
  }
}
