import API from './api'

export const getOverviewStats = async () => {
  const response = await API.get('/stats/overview')

  return response.data
}
