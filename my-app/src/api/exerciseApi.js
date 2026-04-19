/**
 * API module for making HTTP requests to the backend server.
 *
 * This module uses Axios to create a pre-configured instance for making API calls.
 *
 * @module api/exerciseApi
 */
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'

/**
 * Fetches exercises from the backend API with optional query parameters.
 *
 * @param {object} params - Query parameters for filtering exercises.
 * @returns {Promise<Array>} A promise resolving to the list of exercises.
 */
export const getExercises = async (params = {}) => {
  const query = new URLSearchParams(params).toString()

  const token = localStorage.getItem('token') // 🔥 här är fixen

  const response = await fetch(`${API_URL}/exercises?${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch exercises')
  }

  return response.json()
}
