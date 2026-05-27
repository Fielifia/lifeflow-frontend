import {
  User,
  UserCheck,
  UserLock,
  UserPlus,
  LogOut,
  Settings,
} from 'lucide-react'

import { useNavigate } from 'react-router-dom'

import { userStorage } from '../../utils/storage/userStorage'

import { useConfirm } from '../../hooks/useConfirm'

import ActionMenu from './action-menu/ActionMenu'

import Button from './button/Button'

/**
 * Shared app header.
 * @param {object} props - Component props
 * @param {string} props.title - Header title
 * @param {string} [props.subtitle] - Header subtitle
 * @param {'guest'|'register'|'login'|'authenticated'} [props.variant] - Icon variant
 * @returns {import('react').ReactElement} Header
 */
export default function Header({ title, subtitle, variant = 'authenticated' }) {
  const confirm = useConfirm()

  const navigate = useNavigate()

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

    userStorage.clear()

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
        <h1 className="close">{title}</h1>

        {subtitle && <p className="body muted close">{subtitle}</p>}
      </div>

      {/* PROFILE MENU */}

      <ActionMenu
        variant="profile"
        triggerIcon={Icon}
        items={[
          {
            label: 'Profile',
            icon: Settings,
            onClick: () => navigate('/profile'),
          },

          {
            label: 'Log out',
            icon: LogOut,
            variant: 'danger',
            onClick: handleLogout,
          },
        ]}
      >
        <Button variant="ghost" size="icon">
          <Icon className="profile-icon" />
        </Button>
      </ActionMenu>
    </div>
  )
}
