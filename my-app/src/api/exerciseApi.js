/**
 * API module for exercise-related requests.
 *
 * Handles fetching exercises with filters, pagination,
 * and authentication.
 * @module api/exerciseApi
 */

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'

/**
 * Fetch exercises with optional filters and pagination.
 * @param {object} params - Query parameters
 * @param {string} [params.category] - Filter by category
 * @param {string} [params.muscle] - Filter by muscle
 * @param {string} [params.search] - Search by name
 * @param {number} [params.page] - Page number
 * @param {number} [params.limit] - Items per page
 * @returns {Promise<{
 *   results: Array,
 *   total: number,
 *   page: number,
 *   limit: number
 * }>}
 */
export const getExercises = async (params = {}) => {
  const query = new URLSearchParams(params).toString()

  const storedUser = JSON.parse(localStorage.getItem('user'))
  const token = storedUser?.token

  const res = await fetch(`${API_URL}/exercises?${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    throw new Error('Failed to fetch exercises')
  }

  return res.json()
}

export const getExerciseById = async (id) => {
  const storedUser = JSON.parse(localStorage.getItem('user'))
  const token = storedUser?.token

  const res = await fetch(`${API_URL}/exercises/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    throw new Error('Failed to fetch exercise')
  }

  return res.json()
}
