import { useEffect, useState } from 'react'
import { getOverviewStats } from '../../../shared/api/statsApi'
import { ERROR_MESSAGES } from '../../../shared/utils/constants/constants'

export const useOverviewStats = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {

        const data = await getOverviewStats()

        setStats(data)
      } catch (error) {
        setError(ERROR_MESSAGES.LOAD_DATA)
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
