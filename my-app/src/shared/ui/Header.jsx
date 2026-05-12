import {
  User,
  UserCheck,
  UserLock,
  UserPlus
} from 'lucide-react'

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
        <h2 className="close">
          {title}
        </h2>

        {subtitle && (
          <p className="muted small close">
            {subtitle}
          </p>
        )}
      </div>

      <button
        className="btn-clean header-profile-btn"
        onClick={onProfileClick}
      >
        <Icon size={22} />
      </button>
    </div>
  )
}
