import { useState, useEffect } from 'react'

import { STORAGE_KEYS } from '../../../shared/utils/constants'

import { safeStorage } from '../../../shared/utils/storage/safeStorage'

const restCompleteAudio = new Audio('/sounds/rest-complete.mp3')

/**
 * Plays feedback when rest timer completes.
 * @param {object} options - Feedback options
 * @param {boolean} options.soundEnabled - Enables sound feedback
 * @param {boolean} options.vibrationEnabled - Enables vibration feedback
 */
function playRestCompleteFeedback({
  soundEnabled = true,
  vibrationEnabled = true,
} = {}) {
  if (vibrationEnabled && navigator.vibrate) {
    navigator.vibrate([200, 100, 200])
  }

  if (soundEnabled) {
    restCompleteAudio.play().catch(() => {
      // Ignore autoplay/audio errors.
    })
  }
}

/**
 * Hook for managing rest timer state and controls between sets.
 * Includes persistence, countdown logic, and completion feedback.
 * @param {object} options - Hook options
 * @param {() => void} options.onComplete - Called when timer finishes
 * @param {boolean} options.soundEnabled - Enables sound feedback
 * @param {boolean} options.vibrationEnabled - Enables vibration feedback
 * @returns {{
 *  restRemaining: number,
 *  isResting: boolean,
 *  startRest: (duration?: number) => void,
 *  adjust: (amount: number) => void,
 *  skip: () => void,
 *  reset: () => void
 * }} Rest timer state and controls
 */
export function useRestTimer({
  onComplete,
  soundEnabled = true,
  vibrationEnabled = true,
} = {}) {
  const [restRemaining, setRestRemaining] = useState(0)
  const [isResting, setIsResting] = useState(false)
  const [restEndTime, setRestEndTime] = useState(null)

  /**
   * Restores active timer from storage on mount.
   */
  useEffect(() => {
    const savedEndTime = safeStorage.get(
      STORAGE_KEYS.REST_TIMER_END,
    )

    if (!savedEndTime) {
      return
    }

    const remaining = Math.max(
      0,
      Math.ceil((savedEndTime - Date.now()) / 1000),
    )

    if (remaining > 0) {
      setRestEndTime(savedEndTime)
      setRestRemaining(remaining)
      setIsResting(true)
    } else {
      safeStorage.remove(STORAGE_KEYS.REST_TIMER_END)
    }
  }, [])

  /**
   * Handles rest timer countdown.
   */
  useEffect(() => {
    let interval

    if (isResting && restEndTime) {
      interval = setInterval(() => {
        const remaining = Math.max(
          0,
          Math.ceil((restEndTime - Date.now()) / 1000),
        )

        setRestRemaining(remaining)

        if (remaining <= 0) {
          setIsResting(false)
          setRestEndTime(null)

          safeStorage.remove(STORAGE_KEYS.REST_TIMER_END)

          console.log('PLAY SOUND')
          playRestCompleteFeedback({
            soundEnabled,
            vibrationEnabled,
          })

          if (onComplete) {
            onComplete()
          }
        }
      }, 250)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [
    isResting,
    restEndTime,
    onComplete,
    soundEnabled,
    vibrationEnabled,
  ])

  /**
   * Starts the rest timer.
   * @param {number} duration - Rest duration in seconds
   */
  const startRest = (duration) => {
    if (!duration) {
      return
    }

    const endTime = Date.now() + duration * 1000

    safeStorage.set(
      STORAGE_KEYS.REST_TIMER_END,
      endTime,
    )

    setRestEndTime(endTime)
    setRestRemaining(duration)
    setIsResting(true)
  }

  /**
   * Adjusts remaining rest time.
   * @param {number} amount - Seconds to add or subtract
   */
  const adjust = (amount) => {
    setRestRemaining((prev) => {
      const updated = Math.max(0, prev + amount)

      const updatedEndTime = Date.now() + updated * 1000

      setRestEndTime(updatedEndTime)

      safeStorage.set(
        STORAGE_KEYS.REST_TIMER_END,
        updatedEndTime,
      )

      return updated
    })
  }

  /**
   * Skips the current rest timer.
   */
  const skip = () => {
    safeStorage.remove(STORAGE_KEYS.REST_TIMER_END)

    setIsResting(false)
    setRestEndTime(null)
    setRestRemaining(0)
  }

  /**
   * Resets the timer completely.
   */
  const reset = () => {
    safeStorage.remove(STORAGE_KEYS.REST_TIMER_END)

    setIsResting(false)
    setRestEndTime(null)
    setRestRemaining(0)
  }

  return {
    restRemaining,
    isResting,
    startRest,
    adjust,
    skip,
    reset,
  }
}
