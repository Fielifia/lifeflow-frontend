import API from './api'

export const getOverviewStats = async () => {
  const response = await API.get('/stats/overview')

  return response.data
}

export const getStatistics = async (range) => {
  const res = await API.get('/stats', {
    params: { range },
  })

  return res.data
}
