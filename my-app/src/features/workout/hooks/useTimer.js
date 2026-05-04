import { useState, useEffect } from 'react'

/**
 * Hook for managing workout timer state.
 *
 * Handles elapsed time, start/pause logic, and persistence via localStorage.
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

  const [offset, setOffset] = useState(0)
  const [pausedAt, setPausedAt] = useState(null)

  const [elapsed, setElapsed] = useState(0)

  // persist startTime
  useEffect(() => {
    localStorage.setItem('workoutStart', startTime)
  }, [startTime])

  // timer
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
  }, [status, startTime, offset])

  // actions
  const handleStartPause = () => {
    setStatus((prev) => {
      if (prev === 'running') {
        setPausedAt(Date.now())
        return 'paused'
      }

      if (prev === 'paused') {
        setOffset((prevOffset) => prevOffset + (Date.now() - pausedAt))
        setPausedAt(null)
        return 'running'
      }

      return 'running'
    })
  }

  const reset = () => {

    setStatus('idle')
    setStartTime()
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
