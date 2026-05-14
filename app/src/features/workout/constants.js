export const DEFAULT_REST = 120

export const DEFAULT_SETS = [
  { reps: 8, weight: 0, completed: false },
  { reps: 8, weight: 0, completed: false },
]

export const EMPTY_WORKOUT = {
  name: 'Workout',
  exercises: [],
  notes: '',
}

export const MAX_DURATION = 180 * 60 // seconds
export const INACTIVITY_LIMIT = 15 * 60 * 1000
export const WARNING_TIME = 2 * 60 * 1000
