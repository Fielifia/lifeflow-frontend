import { useState } from 'react'

import { Bell } from 'lucide-react'

import '../Notification.css'

import Button from '../../../shared/components/ui/button/Button'

import { useNotifications } from '../hooks/useNotifications'

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const { notifications } = useNotifications()

  return (
    <div>
      <Button className="btn-icon btn-ghost" onClick={() => setIsOpen(!isOpen)}>
        <Bell />

        <span>{notifications.length}</span>
      </Button>

      {isOpen && (
        <div className="notification-dropdown">
          <h3>Notifications</h3>

          {notifications.map((notification) => (
            <div key={notification._id}>
              <strong>{notification.title}</strong>

              <p>{notification.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
