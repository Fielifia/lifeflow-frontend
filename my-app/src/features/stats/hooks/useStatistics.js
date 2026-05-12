import { useEffect, useState } from 'react'
import { getStatistics } from '../../../shared/api/statsApi'

export const useStatistics = (range) => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)

        const data = await getStatistics(range)

        setStats(data)
      } catch {
        setError('Failed to load statistics')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [range])

  return {
    stats,
    loading,
    error,
  }
}
