import { useEffect } from 'react'
import { getOverviewStats } from '../../../shared/api/statsApi'

export const useDashboardStats = () => {
  useEffect(() => {
    const fetchStats = async () => {
      const data = await getOverviewStats()

      console.log(data)
    }

    fetchStats()
  }, [])
}
