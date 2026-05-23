import {
  User,
  UserCheck,
  UserLock,
  UserPlus
} from 'lucide-react'

import { userStorage } from '../../utils/storage/userStorage'

/**
 * Shared app header.
 * @param {object} props - Component props
 * @param {string} props.title - Header title
 * @param {string} [props.subtitle] - Header subtitle
 * @param {'guest'|'register'|'login'|'authenticated'} [props.variant] - Icon variant
 * @param {() => void} [props.onProfileClick] - Profile button click handler
 * @returns {import('react').ReactElement} Header
 */
export default function Header({
  title,
  subtitle,
  variant = 'authenticated',
  onProfileClick,
}) {
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
        <h1 className="close">{title}</h1>

        {subtitle && <p className="body muted close">{subtitle}</p>}
      </div>

      {/* PROFILE BUTTON */}

      <button
        className="icon-btn"
        onClick={() => {
          if (onProfileClick) {
            onProfileClick()
            return
          }

          const confirmed = window.confirm('Log out?')

          if (!confirmed) {
            return
          }

          localStorage.removeItem('user')
          userStorage.clear()

          window.location.href = '/login'
        }}
      >
        <Icon className="profile-icon" />
      </button>
    </div>
    
  )
}
