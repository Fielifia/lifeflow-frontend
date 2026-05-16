import {
  User,
  UserCheck,
  UserLock,
  UserPlus
} from 'lucide-react'
import { userStorage } from '../utils/storage/userStorage'

/**
 * Shared app header.
 * @param {object} props - Component props
 * @param {string} props.title - Header title
 * @param {string} [props.subtitle] - Header subtitle
 * @param {'guest' | 'login' | 'authenticated'} [props.variant] - Header profile icon variant
 * @param {() => void} [props.onProfileClick] - 
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
      <div className="header-content">
        <h1 className="close">
          {title}
        </h1>

        {subtitle && (
          <p className="muted medium close">
            {subtitle}
          </p>
        )}
      </div>

      <button
        className="btn-clean header-profile-btn"
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
        <Icon size={22} />
      </button>
    </div>
  )
}
