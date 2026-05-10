import API from './api'

export const getOverviewStats = async () => {
  const response = await api.get('/stats/overview')

  return response.data
}
