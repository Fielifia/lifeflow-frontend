import { useEffect, useState } from 'react'


import { useUser } from '../../../shared/context/UserContext'

import {
  deleteAccountApi,
  getCurrentUserApi,
  updateUserInformationApi,
  updateUserSettingsApi,
} from '../../../shared/api/userApi'

import { deleteAllWorkoutsApi } from '../../../shared/api/workoutApi'

import { deleteAllTemplatesApi } from '../../../shared/api/templateApi'

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
 *   updateSettings: (updates: object) => Promise<void>,
 *   updateUserInformation: (updates: object) => Promise<void>
 *   deleteWorkoutHistory: () => Promise<void>,
 *   deleteTemplates: () => Promise<void>,
 *   deleteAccount: () => Promise<void>,
 * }} Profile settings state and actions.
 */
export function useProfileSettings() {
  const { user, setUser } = useUser()

  const [settings, setSettings] = useState(null)

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState(null)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setError(null)

        const userData = await getCurrentUserApi()

        setUser((prev) => ({
          ...prev,
          ...userData,
        }))
        setSettings(userData.settings)
      } catch {
        setError('Unable to load profile')
      } finally {
        setLoading(false)
      }
    }
    

    loadSettings()
  }, [setUser])

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
   * Updates the current user's information.
   * @param {object} updates - User information updates.
   * @returns {Promise<void>} Resolves when information is updated.
   */
  const updateUserInformation = async (updates) => {
    const updated =
      await updateUserInformationApi(updates)

    setUser((prev) => ({
      ...prev,
      ...updated,
    }))
  }

  /**
   * Deletes the user's workout history.
   * @returns {Promise<void>} Resolves when history is deleted.
   */
  const deleteWorkoutHistory = async () => {
    await deleteAllWorkoutsApi()
  }

  /**
   * Deletes the user's workout templates.
   * @returns {Promise<void>} Resolves when templates are deleted.
   */
  const deleteTemplates = async () => {
    await deleteAllTemplatesApi()
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
    updateUserInformation,
    deleteAccount,
    deleteWorkoutHistory,
    deleteTemplates,
  }
}
