export const STORAGE_KEYS = {
  USER: 'user',
  DRAFT_WORKOUT: 'draftWorkout',
  DRAFT_TEMPLATE: 'draftTemplate',
}

// ===== WORKOUT DEFAULTS =====

// Default rest duration between sets (seconds)
export const DEFAULT_REST = 120

// Default exercise set structure
export const DEFAULT_SETS = [
  { reps: 8, weight: 0, completed: false },
  { reps: 8, weight: 0, completed: false },
]

// Empty workout draft state
export const EMPTY_WORKOUT = {
  name: 'Workout',
  exercises: [],
  defaultRestTime: null,
  restTimerEnabled: null,
  notes: '',
}

// Empty template draft state
export const EMPTY_TEMPLATE = {
  name: 'Template',
  exercises: [],
  notes: '',
}

// ===== TIMER LIMITS =====

// Maximum workout duration (3 hours)
export const MAX_DURATION = 180 * 60 // seconds

// Auto-pause inactivity limit (15 min)
export const INACTIVITY_LIMIT = 15 * 60 * 1000

// Warning shown before inactivity pause (2 min)
export const WARNING_TIME = 2 * 60 * 1000

export const ERROR_MESSAGES = {
  LOAD_DATA: 'Unable to load data. Please try again.',
  LOAD_WORKOUT: 'Unable to load workout.',
  LOAD_TEMPLATE: 'Unable to load template.',
  LOAD_TEMPLATES: 'Unable to load templates.',
  LOAD_EXERCISE: 'Unable to load exercise.',
  LOAD_STATISTICS: 'Unable to load statistics.',

  TEMPLATE_NOT_FOUND: 'Template not found.',
  WORKOUT_NOT_FOUND: 'Workout not found.',

  SAVE_WORKOUT: 'Unable to save workout. Please try again.',
  UPDATE_WORKOUT: 'Unable to update workout. Please try again.',
  DELETE_WORKOUT: 'Unable to delete workout. Please try again.',

  SAVE_TEMPLATE: 'Unable to save template. Please try again.',
  UPDATE_TEMPLATE: 'Unable to update template. Please try again.',
  DELETE_TEMPLATE: 'Unable to delete template. Please try again.',
}
