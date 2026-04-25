import { useState, useEffect } from 'react'

/**
 * Hook for workout timer (elapsed time + start/pause)
 * @returns {{
 *   status: string,
 *   elapsed: number,
 *   handleStartPause: () => void,
 *   reset: () => void
 * }} Timer state and controls
 */
export function useTimer() {
  const [status, setStatus] = useState('idle')
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    let interval

    if (status === 'running') {
      interval = setInterval(() => {
        setElapsed((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [status])

  const handleStartPause = () => {
    if (status === 'idle') setStatus('running')
    else if (status === 'running') setStatus('paused')
    else setStatus('running')
  }

  const reset = () => {
    setStatus('idle')
    setElapsed(0)
  }

  return {
    status,
    elapsed,
    handleStartPause,
    reset,
  }
}
