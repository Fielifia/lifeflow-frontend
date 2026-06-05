import { useEffect, useState } from 'react'

import { getNotificationsApi }
  from '../../../shared/api/notificationApi'

export const useNotifications = () => {
  const [notifications, setNotifications] =
    useState([])

  useEffect(() => {
    const fetchNotifications =
      async () => {
        const data =
          await getNotificationsApi()

        setNotifications(data)
      }

    fetchNotifications()
  }, [])

  return {
    notifications,
  }
}
