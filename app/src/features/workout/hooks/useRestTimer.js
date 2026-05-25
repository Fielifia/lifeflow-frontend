import { useEffect, useState } from 'react'

/**
 * Hook for managing rest timer state between sets.
 * Supports countdown, persistence, completion feedback,
 * and timer recovery after refresh.
 * @param {object} [options] - Hook options
 * @param {() => void} [options.onComplete]
 * Called when the timer finishes
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

  useEffect(() => {
    const saved =
      localStorage.getItem('restEndTime')

    if (!saved) {
      return
    }

    const remaining = Math.ceil(
      (Number(saved) - Date.now()) / 1000,
    )

    if (remaining > 0) {
      setRestRemaining(remaining)
      setIsResting(true)
    } else {
      localStorage.removeItem(
        'restEndTime',
      )
    }
  }, [])

  /**
   * Start rest timer
   * @param {number} duration - Workout duration
   */
  const startRest = (duration) => {

    if (!duration) return

    const endTime =
      Date.now() + duration * 1000

    localStorage.setItem(
      'restEndTime',
      String(endTime),
    )

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

      if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200])
      }

      const audio = new Audio(
        '/sounds/rest-complete.mp3',
      )

      audio.play().catch(() => {
        // Ignore autoplay/audio errors.
      })

      if (onComplete) {
        onComplete()
      }

      localStorage.removeItem(
        'restEndTime',
      )
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
    setRestRemaining((prev) => {
      const updated = Math.max(
        0,
        prev + amount,
      )

      const endTime =
        Date.now() + updated * 1000

      localStorage.setItem(
        'restEndTime',
        String(endTime),
      )

      return updated
    })
  }

  /**
   * Skip current rest
   */
  const skip = () => {
    setIsResting(false)
    setRestRemaining(0)

    localStorage.removeItem(
      'restEndTime',
    )
  }

  /**
   * Reset timer completely (used after save)
   */
  const reset = () => {
    setIsResting(false)
    setRestRemaining(0)

    localStorage.removeItem(
      'restEndTime',
    )
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
