import { buildPreviousExerciseData } from '../../features/workout/utils/buildPreviousExerciseData'
import { normalizeExercise } from '../utils/normalizeExercise'
import API from './api'

// ===== GET WORKOUTS =====

export const getWorkoutsApi = async () => {
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

export const createWorkoutApi = async (data) => {
  const res = await API.post('/workouts', data)
  return res.data
}

// ===== GET WORKOUT BY ID =====

export const getWorkoutByIdApi = async (id) => {
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

export const getPreviousExerciseApi = async (exerciseId) => {
  try {
    const res = await API.get(`/workouts/exercises/${exerciseId}/previous`)
    const data = buildPreviousExerciseData(res.data)
    return (
      data || {
        sets: [{ reps: 10, weight: 0, completed: false }],
        bestSet: { reps: 0, weight: 0 },
      }
    )
  } catch {
    return {
      sets: [{ reps: 10, weight: 0, completed: false }],
      bestSet: { reps: 0, weight: 0 },
    }
  }
}

// ===== UPDATE WORKOUT =====

export const updateWorkoutApi = async (id, data) => {
  const res = await API.put(`/workouts/${id}`, data)
  return res.data
}

// ===== DELETE WORKOUT =====

export const deleteWorkoutApi = async (id) => {
  const res = await API.delete(`/workouts/${id}`)
  return res.data
}

export const deleteAllWorkoutsApi = async () => {
  const res = await API.delete('/workouts')
  return res.data
}
