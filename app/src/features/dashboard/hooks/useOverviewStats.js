import { useEffect, useState } from 'react'
import { getOverviewStats } from '../../../shared/api/statsApi'

export const useOverviewStats = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log('FETCH START')
        
        const data = await getOverviewStats()
        console.log('FETCH DONE')

        setStats(data)
      } catch (error) {
        setError('Failed to fetch dashboard stats')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return {
    stats,
    loading,
    error,
  }
}
