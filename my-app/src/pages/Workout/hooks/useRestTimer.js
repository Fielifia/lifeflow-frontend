import { useState, useEffect } from 'react'

/**
 * Hook for rest timer between sets.
 *
 * Handles:
 * - Countdown timer
 * - Start / skip / adjust rest
 * @returns {{
 *   restTime: number,
 *   setRestTime: (value: number) => void,
 *   restRemaining: number,
 *   isResting: boolean,
 *   startRest: () => void,
 *   adjust: (amount: number) => void,
 *   skip: () => void,
 *   reset: () => void
 * }} Rest timer state and controls
 */
export function useRestTimer() {
  const [restTime, setRestTime] = useState(120)
  const [restRemaining, setRestRemaining] = useState(0)
  const [isResting, setIsResting] = useState(false)

  // countdown
  useEffect(() => {
    let interval

    if (isResting) {
      interval = setInterval(() => {
        setRestRemaining((prev) => {
          if (prev <= 1) {
            setIsResting(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isResting])

  /**
   * Start rest timer
   */
  const startRest = (time = restTime) => {
    setIsResting(false)
    setRestRemaining(0)

    setTimeout(() => {
      setRestRemaining(time)
      setIsResting(true)
    }, 0)
  }

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
    restTime,
    setRestTime,
    restRemaining,
    isResting,
    startRest,
    adjust,
    skip,
    reset,
  }
}
