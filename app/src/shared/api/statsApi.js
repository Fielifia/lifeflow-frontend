import API from './api'

/**
 * Retrieves dashboard overview statistics.
 * @returns {Promise<object>} Overview statistics
 */
export const getOverviewStats = async () => {
  const response = await API.get('/stats/overview')

  return response.data
}

/**
 * Retrieves workout statistics for a given range.
 * @param {string} range - Statistics time range
 * @returns {Promise<object>} Statistics response
 */
export const getStatistics = async (range) => {
  const res = await API.get('/stats', {
    params: { range },
  })

  return res.data
}
