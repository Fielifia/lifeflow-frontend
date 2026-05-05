import API from './api'

export const getWorkouts = async () => {
  const res = await API.get('/workouts')
  return res.data
}

export const createWorkout = async (data) => {
  const res = await API.post('/workouts', data)
  return res.data
}

export const getWorkoutById = async (id) => {
  const res = await API.get(`/workouts/${id}`)
  return res.data
}

export const getPreviousExercise = async (exerciseId) => {
  const res = await API.get(`/workouts/exercises/${exerciseId}/previous`)
  return res.data
}
