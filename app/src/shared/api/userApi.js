import API from './api'

// ===== GET CURRENT USER =====

/**
 * Retrieves the current user's information from the API.
 * @returns {Promise<object>} User response
 */
export const getCurrentUserApi = async () => {
  const res = await API.get('/users/me')

  return res.data
}

// ===== UPDATE USER SETTINGS =====

/**
 * Updates user settings.
 * @param {object} [settings] - User settings
 * @returns {Promise<object>} User response
 */
export const updateUserSettingsApi = async (settings) => {
  const res = await API.patch('/users/settings', settings)

  return res.data
}

// ===== DELETE ACCOUNT =====
/**
 * Deletes the current user's account.
 * @returns {Promise<void>} Resolves when account is deleted
 */
export const deleteAccountApi = async () => {
  await API.delete('/users/me')
}
