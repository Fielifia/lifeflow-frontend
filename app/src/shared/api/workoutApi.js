import { buildPreviousExerciseData } from '../../features/workout/utils/buildPreviousExerciseData'
import { normalizeExercise } from '../utils/normalizeExercise'
import API from './api'

// ===== GET WORKOUTS =====
export const getWorkouts = async () => {
  const res = await API.get('/workouts')

  return {
    ...res.data,

    results:
      res.data.results?.map((workout) => ({
        ...workout,

        exercises:
          workout.exercises?.map(
            normalizeExercise,
          ) || [],
      })) || [],
  }
}

// ===== CREATE WORKOUT =====
export const createWorkout = async (data) => {
  const res = await API.post('/workouts', data)
  return res.data
}

// ===== GET WORKOUT BY ID =====
export const getWorkoutById = async (id) => {
  const res = await API.get(`/workouts/${id}`)
  return {
    ...res.data,

    exercises:
      res.data.exercises?.map(
        normalizeExercise,
      ) || [],
  }
}

// ===== GET PREVIOUS EXERCISE DATA =====
export const getPreviousExercise = async (exerciseId) => {
  const res = await API.get(
    `/workouts/exercises/${exerciseId}/previous`,
  )

  return buildPreviousExerciseData(res.data)
}

// ===== UPDATE WORKOUTS =====
export const updateWorkout = async (id, data) => {
  const res = await API.put(`/workouts/${id}`, data)
  return res.data
}

// ===== DELETE WORKOUTS =====
export const deleteWorkout = async (id) => {
  const res = await API.delete(`/workouts/${id}`)
  return res.data
}
