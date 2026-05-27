import { useEffect, useState } from 'react'

import {
  getCurrentUserApi,
  updateUserSettingsApi,
} from '../../../shared/api/userApi'

/**
 * Loads and updates user profile settings.
 * @returns {{
 *   user: {
 *     username: string,
 *     email: string
 *   }|null,
 *   settings: {
 *     monthlyGoal: number,
 *     defaultRestTime: number,
 *     restTimerEnabled: boolean,
 *     soundEnabled: boolean
 *   }|null,
 *   loading: boolean,
 *   updateSettings: (updates: object) => Promise<void>
 * }} Profile settings state and actions.
 */
export function useProfileSettings() {
  const [user, setUser] = useState(null)

  const [settings, setSettings] = useState(null)

  const [loading, setLoading] = useState(true)

  const loadSettings = async () => {
    try {
      const userData =
        await getCurrentUserApi()

      setUser(userData)

      setSettings(userData.settings)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSettings()
  }, [])

  /**
   * Updates user settings.
   * @param {object} updates - Settings updates.
   * @returns {Promise<void>} Resolves when settings are updated.
   */
  const updateSettings = async (updates) => {
    const updated =
      await updateUserSettingsApi(updates)

    setSettings(updated)
  }

  return {
    user,
    settings,
    loading,
    updateSettings,
  }
}
