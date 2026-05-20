import API from './api'

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
