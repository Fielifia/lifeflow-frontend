import {
  useEffect,
  useRef,
  useState
} from 'react'

/**
 * Handles hold-to-trigger interactions.
 * @param {() => void} onComplete - Triggered after hold duration
 * @param {number} [duration=1000] - Hold duration in milliseconds
 * @returns {{
 *  holding: boolean,
 *  progress: number,
 *  startHold: (event: Event) => void,
 *  cancelHold: () => void,
 * }} Hold interaction state
 */
export function useHoldToDelete(
  onComplete,
  duration = 1000,
) {
  const [holding, setHolding] = useState(false)
  const [progress, setProgress] = useState(0)

  const timerRef = useRef(null)

  const reset = () => {
    setHolding(false)
    setProgress(0)
  }

  const cancelHold = () => {
    clearInterval(timerRef.current)
    reset()
  }

  const startHold = (e) => {
    if (['INPUT', 'BUTTON'].includes(e.target.tagName)) {
      return
    }

    setHolding(true)
    setProgress(0)

    const start = Date.now()

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - start

      const nextProgress =
        Math.min(elapsed / duration, 1)

      setProgress(nextProgress)

      if (nextProgress >= 1) {
        clearInterval(timerRef.current)

        onComplete()

        reset()
      }
    }, 16)
  }

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current)
    }
  }, [])

  return {
    holding,
    progress,
    startHold,
    cancelHold,
  }
}
