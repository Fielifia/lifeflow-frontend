import {
  LogOut,
  Settings,
  User,
  UserCheck,
  UserLock,
  UserPlus,
} from 'lucide-react'


import { userStorage } from '../../utils/storage/userStorage'

import { useConfirm } from '../../hooks/useConfirm'

import ActionMenu from './action-menu/ActionMenu'

/**
 * Shared app header.
 * @param {object} props - Component props
 * @param {string} [props.subtitle] - Header subtitle
 * @param {'guest'|'register'|'login'|'authenticated'} [props.variant] - Icon variant
 * @returns {import('react').ReactElement} Header
 */
export default function Header({ subtitle, variant = 'authenticated' }) {
  const confirm = useConfirm()

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

      {/* PROFILE MENU */}

      <ActionMenu
        variant="profile"
        triggerIcon={Icon}
        items={[
          {
            label: 'Profile',
            icon: Settings,
            onClick: () => (window.location.href = '/profile'),
          },

          {
            label: 'Log out',
            icon: LogOut,
            onClick: handleLogout,
          },
        ]}
      ></ActionMenu>
    </div>
  )
}
