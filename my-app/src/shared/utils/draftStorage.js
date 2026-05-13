// shared/utils/draftStorage.js

export const draftWorkoutStorage = {
  get() {
    try {
      return JSON.parse(
        localStorage.getItem('draftWorkout'),
      )
    } catch {
      return null
    }
  },

  set(data) {
    localStorage.setItem(
      'draftWorkout',
      JSON.stringify(data),
    )
  },

  clear() {
    localStorage.removeItem('draftWorkout')
  },
}

export const draftTemplateStorage = {
  get() {
    try {
      return JSON.parse(
        localStorage.getItem('draftTemplate'),
      )
    } catch {
      return null
    }
  },

  set(data) {
    localStorage.setItem(
      'draftTemplate',
      JSON.stringify(data),
    )
  },

  clear() {
    localStorage.removeItem('draftTemplate')
  },
}
