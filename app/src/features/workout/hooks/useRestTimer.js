import { useState, useEffect } from 'react'

/**
 * Hook for rest timer between sets.
 * @returns {{
 *  setRestTime: (value: number) => void,
 *  restRemaining: number,
 *  isResting: boolean,
 *  startRest: (time?: number) => void,
 *  adjust: (amount: number) => void,
 *  skip: () => void,
 *  reset: () => void
 * }} Rest timer state and controls
 */
export function useRestTimer({
  onComplete,
} = {}) {
  const [restRemaining, setRestRemaining] = useState(0)
  const [isResting, setIsResting] = useState(false)

  // countdown
  useEffect(() => {
    let interval

    if (isResting) {
      interval = setInterval(() => {
        setRestRemaining((prev) => {
          return Math.max(0, prev - 1)
        })
      }, 1000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isResting])

  /**
   * Start rest timer
   * @param {number} duration - Workout duration
   */
  const startRest = (duration) => {
    if (!duration) return

    setIsResting(false)
    setRestRemaining(0)

    setTimeout(() => {
      setRestRemaining(duration)
      setIsResting(true)
    }, 0)
  }

  useEffect(() => {
    if (
      isResting &&
      restRemaining === 0
    ) {
      setIsResting(false)

      navigator.vibrate([200, 100, 200])

      const audio = new Audio(
        '/sounds/rest-complete.mp3',
      )

      audio.play().catch(() => {
        // Ignore autoplay/audio errors.
      })

      if (onComplete) {
        onComplete()
      }
    }
  }, [
    isResting,
    restRemaining,
    onComplete,
  ])

  /**
   * Adjust remaining rest time (+/- seconds)
   * @param {number} amount - Seconds to add or subtract
   */
  const adjust = (amount) => {
    setRestRemaining((prev) => Math.max(0, prev + amount))
  }

  /**
   * Skip current rest
   */
  const skip = () => {
    setIsResting(false)
    setRestRemaining(0)
  }

  /**
   * Reset timer completely (used after save)
   */
  const reset = () => {
    setIsResting(false)
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
