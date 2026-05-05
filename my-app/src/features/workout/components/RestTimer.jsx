import { useEffect, useRef } from 'react'

/**
 * Floating rest timer shown after completing a set.
 * @param {object} props - Component props
 * @param {boolean} props.isResting - If timer is active
 * @param {number} props.restRemaining - Seconds left
 * @param {(amount: number) => void} props.adjustRest - Adjust time (+/-)
 * @param {() => void} props.skipRest - Skip current rest
 * @param props.setFlash - Flash when rest is over
 * @returns {import('react').ReactElement|null} Rest timer UI or null
 */
export default function RestTimer({
  isResting,
  restRemaining,
  adjustRest,
  skipRest,
  setFlash,
}) {
  const prevTime = useRef(restRemaining)

  useEffect(() => {
    if (prevTime.current > 0 && restRemaining <= 0) {
      setFlash(true)
      setTimeout(() => setFlash(false), 300)
    }

    prevTime.current = restRemaining
  }, [restRemaining, setFlash])

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
