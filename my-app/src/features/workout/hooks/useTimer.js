import { useState, useEffect, useRef } from 'react'

const MAX_DURATION = 180 * 60 // seconds
const INACTIVITY_LIMIT = 10 * 60 * 1000 // ms

/**
 * Hook for managing a workout timer with pause/resume,
 * inactivity detection, and duration tracking.
 *
 * The timer is based on:
 * - startTime (timestamp when workout started)
 * - offset (accumulated paused time)
 *
 * Features:
 * - Explicit start (start)
 * - Pause / resume (handleStartPause)
 * - Stop without reset (stop)
 * - Full reset (reset)
 * - Inactivity auto-pause
 * - Activity tracking
 * - Max duration cap (3 hours)
 *
 * @returns {{
 *   status: 'idle' | 'running' | 'paused' | 'stopped',
 *   elapsed: number,
 *   startTime: number,
 *   start: () => void,
 *   handleStartPause: () => void,
 *   reset: () => void,
 *   stop: () => void,
 *   adjustStartTime: (timestamp: number) => void,
 *   registerActivity: () => void
 * }} Timer state and control functions
 */
export function useTimer() {
  const [status, setStatus] = useState('idle')

  const [startTime, setStartTime] = useState(Date.now())
  const [offset, setOffset] = useState(0)

  const [pausedAt, setPausedAt] = useState(null)
  const [elapsed, setElapsed] = useState(0)
  const [lastActivity, setLastActivity] = useState(Date.now())

  const intervalRef = useRef(null)
  const inactivityRef = useRef(null)

  // useEffect(() => {
  //   const now = Date.now()
  //   setStartTime(now)
  //   setOffset(0)
  //   setElapsed(0)
  // }, [])
  
  /**
   * Recalculate elapsed time when base timing values change.
   */
  useEffect(() => {
    const seconds = Math.floor((Date.now() - startTime - offset) / 1000)
    setElapsed(Math.max(0, Math.min(seconds, MAX_DURATION)))
  }, [startTime, offset])

  /**
   * Main timer loop (runs only when status is "running").
   * Updates elapsed time every second and enforces max duration.
   */
  useEffect(() => {
    if (status === 'running') {
      intervalRef.current = setInterval(() => {
        const seconds = Math.floor((Date.now() - startTime - offset) / 1000)

        if (seconds >= MAX_DURATION) {
          setElapsed(MAX_DURATION)
          setStatus('stopped')
          clearInterval(intervalRef.current)
          alert('Workout reached 3 hours. Still active?')
          return
        }

        setElapsed(seconds)
      }, 1000)

      return () => clearInterval(intervalRef.current)
    }

    return () => { }
  }, [status, startTime, offset])

  /**
   * Detects inactivity and pauses the timer if no activity
   * has been registered within the defined limit.
   */
  useEffect(() => {
    if (status !== 'running') {
      return () => { }
    }

    inactivityRef.current = setInterval(() => {
      const inactiveFor = Date.now() - lastActivity

      if (status === 'running' && inactiveFor > INACTIVITY_LIMIT) {
        setStatus('paused')
      }
    }, 60000)

    return () => clearInterval(inactivityRef.current)
  }, [status, lastActivity])


  /**
   * Track activity
   */
  const registerActivity = () => {
    setLastActivity(Date.now())
  }

  /**
   * Toggles between running and paused states.
   * Also handles restarting from idle/stopped state.
   */
  const handleStartPause = () => {
    setStatus((prev) => {
      if (prev === 'running') {
        setPausedAt(Date.now())
        return 'paused'
      }

      if (prev === 'paused' && pausedAt) {
        const pauseDuration = Date.now() - pausedAt
        setOffset((prevOffset) => prevOffset + pauseDuration)
        setPausedAt(null)
        return 'running'
      }

      if (prev === 'idle' || prev === 'stopped') {
        const now = Date.now()
        setStartTime(now)
        setOffset(0)
        setPausedAt(null)
        setElapsed(0)
        return 'running'
      }

      return prev
    })
  }

  const start = () => {
    const now = Date.now()

    setStartTime(now)
    setOffset(0)
    setPausedAt(null)
    setElapsed(0)
    setLastActivity(now)
    setStatus('running')
  }

  /**
   * Resets the timer completely and clears persisted state.
   */
  const reset = () => {
    const now = Date.now()

    setStatus('idle')
    setStartTime(now)
    setOffset(0)
    setPausedAt(null)
    setElapsed(0)
    setLastActivity(now)

  }

  /**
   * Stops the timer without resetting values.
   * Useful when saving or discarding a workout.
   */
  const stop = () => {
    setStatus('stopped')
    clearInterval(intervalRef.current)
    clearInterval(inactivityRef.current)
  }

  /**
   * Adjust the timer's start time.
   * @param newStartTimestamp - New start time
   */
  const adjustStartTime = (newStartTimestamp) => {
    const now = Date.now()

    const newElapsed = Math.floor((now - newStartTimestamp - offset) / 1000)
    const clamped = Math.max(0, Math.min(newElapsed, MAX_DURATION))

    const correctedStart = now - clamped * 1000 - offset

    setStartTime(correctedStart)
  }

  return {
    status,
    start,
    elapsed,
    startTime,
    adjustStartTime,
    handleStartPause,
    reset,
    stop,
    registerActivity,
  }
}
