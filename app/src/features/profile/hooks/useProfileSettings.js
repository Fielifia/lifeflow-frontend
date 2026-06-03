import { useEffect, useState } from 'react'

import {
  getCurrentUserApi,
  updateUserSettingsApi,
  deleteAccountApi,
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

  const [error, setError] = useState(null)

  const loadSettings = async () => {
    try {
      setError(null)

      const userData =
        await getCurrentUserApi()

      setUser(userData)
      setSettings(userData.settings)
    } catch {
      setError('Unable to load profile')
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

  /**
   * Deletes the user's account.
   * @returns {Promise<void>} Resolves when account is deleted.
   */
  const deleteAccount = async () => {
    await deleteAccountApi()
  }

  return {
    user,
    settings,
    loading,
    error,
    updateSettings,
    deleteAccount,
  }
}
