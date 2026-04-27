import API from './api'

export const getExercises = async (params = {}) => {
  const res = await API.get('/exercises', { params })
  return res.data
}

export const getExerciseById = async (id) => {
  const res = await API.get(`/exercises/${id}`)
  return res.data
}
