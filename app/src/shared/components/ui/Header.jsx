import {
  LogOut,
  Settings,
  User,
  UserCheck,
  UserLock,
  UserPlus,
  Bell,
} from 'lucide-react'

import { useUser } from '../../context/UserContext'

import { useConfirm } from '../../hooks/useConfirm'

import { useNotifications } from '../../../features/notifications/hooks/useNotifications'

import HeaderMenu from './header-menu/HeaderMenu'

/**
 * Shared app header.
 * @param {object} props - Component props
 * @param {string} [props.subtitle] - Header subtitle
 * @param {'guest'|'register'|'login'|'authenticated'} [props.variant] - Icon variant
 * @returns {import('react').ReactElement} Header
 */
export default function Header({ subtitle, variant = 'authenticated' }) {
  const confirm = useConfirm()
  const { setUser } = useUser()
  const { notifications } = useNotifications()

  /**
   * Handles logout flow.
   * @returns {Promise<void>} Resolves when logout completes.
   */
  const handleLogout = async () => {
    const confirmed = await confirm({
      title: 'Log out?',
      confirmText: 'Log out',
    })

    if (!confirmed) {
      return
    }

    setUser(null)
    window.location.href = '/login'
  }

  const ICONS = {
    guest: User,
    register: UserPlus,
    login: UserLock,
    authenticated: UserCheck,
  }

  const Icon = ICONS[variant] || User

  return (
    <div className="header">
      {/* HEADER CONTENT */}

      <div className="header-content">
        <h1
          className="close header-title-link"
          onClick={() => {
            window.location.href = '/'
          }}
        >
          LifeFlow Fitness
        </h1>

        {subtitle && <p className="body muted close">{subtitle}</p>}
      </div>

      <div className="header-buttons">
        {/* NOTIFICATIONS */}

        <HeaderMenu
          trigger={
            <>
              <Bell />

              {notifications.length > 0 && (
                <span className="notification-badge">
                  {notifications.length}
                </span>
              )}
            </>
          }
        >
          <div className="notification-panel">
            <h3>Notifications</h3>

            {notifications.length === 0 ? (
              <p>No notifications</p>
            ) : (
              notifications.map((notification) => (
                <div key={notification._id} className="notification-item">
                  <strong>{notification.title}</strong>

                  <p>{notification.message}</p>
                </div>
              ))
            )}
          </div>
        </HeaderMenu>

        {/* PROFILE MENU */}

        {variant === 'authenticated' ? (
          <HeaderMenu trigger={<Icon className="header-icon" />}>
            <div className="profile-menu">
              <button
                type="button"
                className="header-menu-item"
                onClick={() => {
                  window.location.href = '/profile'
                }}
              >
                <Settings className="icon-small" />
                <span>Profile</span>
              </button>

              <button
                type="button"
                className="header-menu-item"
                onClick={handleLogout}
              >
                <LogOut className="icon-small" />
                <span>Log out</span>
              </button>
            </div>
          </HeaderMenu>
        ) : (
          <Icon className="header-icon" />
        )}
      </div>
    </div>
  )
}
