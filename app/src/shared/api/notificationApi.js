import API from './api'

// ===== GET NOTIFICATIONS =====
export const getNotificationsApi = async () => {
  const res = await API.get(
    '/notifications'
  )

  return res.data
}
