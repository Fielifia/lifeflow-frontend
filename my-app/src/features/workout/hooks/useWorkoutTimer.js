import { useState, useEffect, useRef } from 'react'
import { useToast } from '../../../shared/context/ToastContext'

const MAX_DURATION = 180 * 60 // seconds
const INACTIVITY_LIMIT = 10 * 1000 // ms
const WARNING_TIME = 5 * 1000

/**
 * Hook for managing a workout timer with pause/resume,
 * inactivity detection, and duration tracking.
 *
 * The timer is based on:
 * - startTime (timestamp when workout started)
 * - offset (total time spent paused, in ms)
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
 *   startTime: number | null,
 *   start: () => void,
 *   handleStartPause: () => void,
 *   reset: () => void,
 *   stop: () => void,
 * adjustStartTime: (newStartTimestamp: number) => void,
 *   registerActivity: () => void
 * }}
 */
export function useWorkoutTimer() {
  const [status, setStatus] = useState('idle')

  const [startTime, setStartTime] = useState(null)
  const [offset, setOffset] = useState(0)

  const [pausedAt, setPausedAt] = useState(null)
  const [elapsed, setElapsed] = useState(0)
  const [lastActivity, setLastActivity] = useState(Date.now())

  const intervalRef = useRef(null)
  const inactivityRef = useRef(null)
  const warnedRef = useRef(false)
  const toast = useToast()

  /**
   * Recalculate elapsed time when base timing values change.
   */
  useEffect(() => {
    if (!startTime) return

    const seconds = Math.max(
      0,
      Math.floor((Date.now() - startTime - offset) / 1000),
    )

    setElapsed(Math.min(seconds, MAX_DURATION))
  }, [startTime, offset])

  /**
   * Main timer loop (runs only when status is "running").
   * Updates elapsed time every second and enforces max duration.
   */
  useEffect(() => {
    if (status === 'running') {
      intervalRef.current = setInterval(() => {
        if (!startTime) return

        const seconds = Math.max(
          0,
          Math.floor((Date.now() - startTime - offset) / 1000),
        )

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
    return undefined
  }, [status, startTime, offset])

  /**
   * Detects inactivity and pauses the timer if no activity
   * has been registered within the defined limit.
   */
  useEffect(() => {
    if (status !== 'running') return undefined

    inactivityRef.current = setInterval(() => {
      const inactiveFor = Date.now() - lastActivity

      if (!warnedRef.current && inactiveFor > INACTIVITY_LIMIT - WARNING_TIME) {
        toast.warning('Inactive… pausing soon')
        warnedRef.current = true
      }

      if (inactiveFor > INACTIVITY_LIMIT) {
        warnedRef.current = false
        toast.show({ message: 'Paused due to inactivity' })
        setPausedAt(Date.now())
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
   * Registers user activity from global interactions
   * (click, keydown, touchstart)
   */
  useEffect(() => {
    if (status !== 'running') return undefined

    const handler = () => registerActivity()

    window.addEventListener('click', handler)
    window.addEventListener('keydown', handler)
    window.addEventListener('touchstart', handler)

    return () => {
      window.removeEventListener('click', handler)
      window.removeEventListener('keydown', handler)
      window.removeEventListener('touchstart', handler)
    }
  }, [status])

  /**
   * Detects inactivity and pauses the timer if no activity
   * has been registered within the defined limit.
   * Shows a warning toast shortly before pausing.
   */
  const handleStartPause = () => {
    if (status === 'running') {
      setPausedAt(Date.now())
      setStatus('paused')
      return
    }

    if (status === 'paused') {
      if (!pausedAt) return

      const now = Date.now()
      const pauseDuration = now - pausedAt

      setOffset((prev) => prev + pauseDuration)
      setPausedAt(null)
      setLastActivity(now)
      setStatus('running')
      return
    }

    if (status === 'idle' || status === 'stopped') {
      const now = Date.now()

      setStartTime(now)
      setOffset(0)
      setPausedAt(null)
      setElapsed(0)
      setLastActivity(now)
      setStatus('running')
    }
  }

  /**
   * Starts the timer from zero.
   */
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
    setStartTime(null)
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
   * @param {number} newStartTimestamp - New start time in ms timestamp
   */
  const adjustStartTime = (newStartTimestamp) => {
    const now = Date.now()

    const raw = now - newStartTimestamp - offset

    const seconds = Math.floor(raw / 1000)

    const clamped = Math.max(0, Math.min(seconds, MAX_DURATION))

    const safeStart = now - clamped * 1000 - offset

    setStartTime(safeStart)
    setElapsed(clamped)
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
