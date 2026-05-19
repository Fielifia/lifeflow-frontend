import { useEffect, useRef, useState } from 'react'
import { useToast } from '../../../shared/context/ToastContext'
import {
  INACTIVITY_LIMIT,
  MAX_DURATION,
  WARNING_TIME
} from '../../../shared/utils/constants'

import { safeStorage } from '../../../shared/utils/storage/safeStorage'

const TIMER_STORAGE_KEY = 'workoutTimer'

/**
 * Hook for managing a workout timer with pause/resume,
 * inactivity detection, persistence and duration tracking.
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
 * - Timer persistence across refreshes
 *
 * @returns {{
 *   status:'idle'|'running'|'paused',
 *   elapsed:number,
 *   startTime:number|null,
 *   start:()=>void,
 *   handleStartPause:()=>void,
 *   reset:()=>void,
 *   stop:()=>void,
 *   adjustStartTime:(newStartTimestamp:number)=>void,
 *   registerActivity:()=>void
 * }} Workout timer state and controls
 */
export function useWorkoutTimer() {

  // ===== STATE =====

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

  // ===== RESTORE TIMER =====

  useEffect(() => {
    const saved = safeStorage.get(TIMER_STORAGE_KEY)

    if (!saved) {
      return
    }

    setStatus(saved.status || 'idle')
    setStartTime(saved.startTime || null)
    setOffset(saved.offset || 0)
    setPausedAt(saved.pausedAt || null)
    setLastActivity(saved.lastActivity || Date.now())
  }, [])

  // ===== PERSIST TIMER =====

  useEffect(() => {
    safeStorage.set(TIMER_STORAGE_KEY, {
      status,
      startTime,
      offset,
      pausedAt,
      lastActivity,
    })
  }, [
    status,
    startTime,
    offset,
    pausedAt,
    lastActivity,
  ])

  // ===== RECALCULATE ELAPSED =====

  /**
   * Recalculates elapsed duration when
   * start time or pause offset changes.
   */
  useEffect(() => {
    if (!startTime) {
      return
    }

    const seconds = Math.max(
      0,
      Math.floor(
        (Date.now() - startTime - offset) / 1000,
      ),
    )

    setElapsed(
      Math.min(seconds, MAX_DURATION),
    )
  }, [
    startTime,
    offset,
  ])

  // ===== MAIN TIMER LOOP =====

  /**
   * Main timer loop (runs only when status is "running").
   * Updates elapsed time every second and enforces max duration.
   */
  useEffect(() => {
    if (status !== 'running') {
      return undefined
    }

    intervalRef.current = setInterval(() => {
      if (!startTime) {
        return
      }

      const seconds = Math.max(
        0,
        Math.floor(
          (Date.now() - startTime - offset) / 1000,
        ),
      )

      if (seconds >= MAX_DURATION) {
        setElapsed(MAX_DURATION)

        setStatus('idle')

        clearInterval(intervalRef.current)

        alert('Workout reached 3 hours. Still active?')

        return
      }

      setElapsed(seconds)
    }, 1000)

    return () =>
      clearInterval(intervalRef.current)
  }, [
    status,
    startTime,
    offset,
  ])

  // ===== INACTIVITY DETECTION =====

  /**
   * Detects inactivity and pauses the timer if no activity
   * has been registered within the defined limit.
   */
  useEffect(() => {
    if (status !== 'running') {
      return undefined
    }

    inactivityRef.current = setInterval(() => {
      const inactiveFor =
        Date.now() - lastActivity

      if (
        !warnedRef.current &&
        inactiveFor >
        INACTIVITY_LIMIT - WARNING_TIME
      ) {
        toast.warning(
          'Inactive… pausing soon',
        )

        warnedRef.current = true
      }

      if (inactiveFor > INACTIVITY_LIMIT) {
        warnedRef.current = false

        toast.show({
          message: 'Paused due to inactivity',
        })

        setPausedAt(Date.now())

        setStatus('paused')
      }
    }, 10000)

    return () =>
      clearInterval(inactivityRef.current)
  }, [
    status,
    lastActivity,
    toast,
  ])

  // ===== ACTIVITY TRACKING =====

  /**
   * Registers user activity to prevent
   * inactivity auto-pause.
   */
  const registerActivity = () => {
    setLastActivity(Date.now())
  }

  /**
   * Registers user activity from global interactions
   * (click, keydown, touchstart)
   */
  useEffect(() => {
    if (status !== 'running') {
      return undefined
    }

    const handler = () => {
      setLastActivity(Date.now())
    }

    window.addEventListener(
      'click',
      handler,
    )

    window.addEventListener(
      'keydown',
      handler,
    )

    window.addEventListener(
      'touchstart',
      handler,
    )

    return () => {
      window.removeEventListener(
        'click',
        handler,
      )

      window.removeEventListener(
        'keydown',
        handler,
      )

      window.removeEventListener(
        'touchstart',
        handler,
      )
    }
  }, [status])

  // ===== START / PAUSE / RESUME =====

  /**
   * Handles start, pause and resume actions
   * depending on current timer state.
   */
  const handleStartPause = () => {
    if (status === 'running') {
      setPausedAt(Date.now())

      setStatus('paused')

      return
    }

    if (status === 'paused') {
      if (!pausedAt) {
        return
      }

      const now = Date.now()

      const pauseDuration =
        now - pausedAt

      setOffset((prev) =>
        prev + pauseDuration,
      )

      setPausedAt(null)

      setLastActivity(now)

      setStatus('running')

      return
    }

    if (status === 'idle') {
      const now = Date.now()

      setStartTime(now)

      setOffset(0)

      setPausedAt(null)

      setElapsed(0)

      setLastActivity(now)

      setStatus('running')
    }
  }

  // ===== START =====

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

  // ===== RESET =====

  /**
   * Resets the timer to its initial state.
   */
  const reset = () => {
    const now = Date.now()

    setStatus('idle')

    setStartTime(null)

    setOffset(0)

    setPausedAt(null)

    setElapsed(0)

    setLastActivity(now)

    safeStorage.remove(TIMER_STORAGE_KEY)
  }

  // ===== STOP =====

  /**
   * Stops the timer without resetting elapsed values.
   */
  const stop = () => {
    setStatus('idle')

    clearInterval(intervalRef.current)

    clearInterval(inactivityRef.current)
  }

  // ===== ADJUST START TIME =====

  /**
   * Adjusts the timer's start time.
   * @param {number} newStartTimestamp - New start time in ms timestamp
   */
  const adjustStartTime = (
    newStartTimestamp,
  ) => {
    const now = Date.now()

    const raw =
      now -
      newStartTimestamp -
      offset

    const seconds =
      Math.floor(raw / 1000)

    const clamped = Math.max(
      0,
      Math.min(
        seconds,
        MAX_DURATION,
      ),
    )

    const safeStart =
      now -
      clamped * 1000 -
      offset

    setStartTime(safeStart)

    setElapsed(clamped)
  }

  // ===== RETURN =====

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
