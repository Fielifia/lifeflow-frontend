import { useState, useEffect } from 'react'

/**
 * Hook for managing workout timer state.
 *
 * Uses a persistent start timestamp and offset to track elapsed time.
 * @returns {{
 *   status: 'idle' | 'running' | 'paused',
 *   elapsed: number,
 *   handleStartPause: () => void,
 *   reset: () => void
 * }} Timer state and control functions
 */
export function useTimer() {
  const [status, setStatus] = useState('running')

  const [startTime, setStartTime] = useState(() => {
    const saved = localStorage.getItem('workoutStart')
    return saved ? Number(saved) : Date.now()
  })

  const [pausedAt, setPausedAt] = useState(null)
  const [offset, setOffset] = useState(0)
  const [elapsed, setElapsed] = useState(() => {
    return Math.floor((Date.now() - startTime - offset) / 1000)
  })

  useEffect(() => {
    const seconds = Math.floor((Date.now() - startTime - offset) / 1000)
    setElapsed(seconds)
  }, [startTime, offset])

  // persist startTime
  useEffect(() => {
    localStorage.setItem('workoutStart', startTime)
  }, [startTime])

  // timer
  useEffect(() => {
    let interval

    if (status === 'running') {
      interval = setInterval(() => {
        const seconds = Math.floor((Date.now() - startTime - offset) / 1000)
        setElapsed(seconds)
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [status, startTime, offset])

  // pause/resume
  const handleStartPause = () => {
    setStatus((prev) => {
      if (prev === 'running') {
        setPausedAt(Date.now())
        return 'paused'
      }

      if (prev === 'paused') {
        const pauseDuration = Date.now() - pausedAt
        setOffset((prevOffset) => prevOffset + pauseDuration)
        setPausedAt(null)
        return 'running'
      }

      return 'running'
    })
  }

  // reset
  const reset = () => {
    const now = Date.now()

    setStatus('idle')
    setStartTime(now)
    setOffset(0)
    setPausedAt(null)
    setElapsed(0)

    localStorage.removeItem('workoutStart')
  }

  return {
    status,
    elapsed,
    handleStartPause,
    reset,
  }
}
