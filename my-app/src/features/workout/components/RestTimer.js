import { useEffect, useRef } from 'react'

/**
 * Floating rest timer shown after completing a set.
 * @param {object} props - Component props
 * @param {boolean} props.isResting - If timer is active
 * @param {number} props.restRemaining - Seconds left
 * @param {(amount: number) => void} props.adjustRest - Adjust time (+/-)
 * @param {() => void} props.skipRest - Skip current rest
 * @returns {import('react').ReactElement|null} Rest timer UI or null
 */
export default function RestTimer({
  isResting,
  restRemaining,
  adjustRest,
  skipRest,
}) {
  const wasResting = useRef(false)

  useEffect(() => {
    if (wasResting.current && !isResting && restRemaining === 0) {
      alert('Dags för nästa set')
    }

    wasResting.current = isResting
  }, [isResting, restRemaining])

  if (!isResting) return null

  return (
    <div className="rest-timer-floating">
      <button onClick={() => adjustRest(-15)}>-</button>

      <span>{Math.max(0, restRemaining)}s</span>

      <button onClick={() => adjustRest(15)}>+</button>

      <button onClick={skipRest}>Skip</button>
    </div>
  )
}
