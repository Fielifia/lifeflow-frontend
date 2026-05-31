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
