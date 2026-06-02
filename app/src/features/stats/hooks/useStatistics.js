import { useEffect, useState } from 'react'

import { getStatistics } from '../../../shared/api/statsApi'

import { ERROR_MESSAGES } from '../../../shared/utils/constants/constants'

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
        setError(ERROR_MESSAGES.LOAD_STATISTICS)
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
