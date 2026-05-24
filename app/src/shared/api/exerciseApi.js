import API from './api'

/**
 * Retrieves favorite exercises from the API.
 * @returns {Promise<object>} Exercise response
 */
export const getFavoriteExercisesApi = async () => {
  const res = await API.get('/exercises/favorites')

  return res.data
}

/**
 * Adds favorite exercises.
 * @param {object} [id] - Exercise id
 * @returns {Promise<object>} Exercise response
 */
export const addFavoriteExerciseApi = async (id) => {
  const res = await API.post(`/exercises/${id}/favorite`)

  return res.data
}

/**
 * Removes favorite exercises.
 * @param {object} [id] - Exercise id
 * @returns {Promise<object>} Exercise response
 */
export const removeFavoriteExerciseApi = async (id) => {
  const res = await API.delete(`/exercises/${id}/favorite`)

  return res.data
}

/**
 * Retrieves exercises from the API.
 * @param {object} [params] - Query parameters
 * @returns {Promise<object>} Exercise response
 */
export const getExercisesApi = async (params = {}) => {
  const res = await API.get('/exercises', { params })
  return res.data
}

/**
 * Retrieves a single exercise by id.
 * @param {string} id - Exercise id
 * @returns {Promise<object>} Exercise data
 */
export const getExerciseByIdApi = async (id) => {
  const res = await API.get(`/exercises/${id}`)
  return res.data
}
