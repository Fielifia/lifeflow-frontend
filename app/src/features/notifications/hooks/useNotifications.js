import { useEffect, useState } from 'react'

import { useUser }
  from '../../../shared/context/UserContext'

import {
  getNotificationsApi,
  markAllNotificationsAsReadApi,
  markNotificationAsReadApi,
  deleteNotificationApi,
} from '../../../shared/api/notificationApi'

export const useNotifications = () => {
  const { user } = useUser()

  const [notifications, setNotifications] =
    useState([])

  useEffect(() => {
    if (!user) {
      setNotifications([])
      return
    }

    const fetchNotifications =
      async () => {
        const data =
          await getNotificationsApi()

        setNotifications(data)
      }

    fetchNotifications()
  }, [user])

  const markAsRead = async (notificationId) => {
    const updated =
      await markNotificationAsReadApi(
        notificationId
      )

    setNotifications((prev) =>
      prev.map((notification) =>
        notification._id === notificationId
          ? updated
          : notification
      )
    )
  }

  const markAllAsRead = async () => {
    await markAllNotificationsAsReadApi()

    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        read: true,
      }))
    )
  }

  const removeNotification = async (
    notificationId
  ) => {
    await deleteNotificationApi(
      notificationId
    )

    setNotifications((prev) =>
      prev.filter(
        (notification) =>
          notification._id !== notificationId
      )
    )
  }

  return {
    notifications,
    markAsRead,
    markAllAsRead,
    removeNotification,
  }
}
