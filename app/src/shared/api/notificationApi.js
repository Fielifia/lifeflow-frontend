import API from './api'

// ===== GET =====

export const getNotificationsApi = async () => {
  const res = await API.get('/notifications')

  return res.data
}

// ===== MARK READ =====

export const markNotificationAsReadApi = async (
  notificationId
) => {
  const res = await API.patch(
    `/notifications/${notificationId}/read`
  )

  return res.data
}

// ===== MARK ALL READ =====

export const markAllNotificationsAsReadApi =
  async () => {
    const res = await API.patch(
      '/notifications/read-all'
    )

    return res.data
  }

// ===== DELETE =====

export const deleteNotificationApi = async (
  notificationId
) => {
  await API.delete(
    `/notifications/${notificationId}`
  )
}
