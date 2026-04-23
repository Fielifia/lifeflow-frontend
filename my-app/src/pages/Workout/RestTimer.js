/**
 * Floating rest timer shown after completing a set.
 * @param {object} props
 * @param {boolean} props.isResting - If timer is active
 * @param {number} props.restRemaining - Seconds left
 * @param {(amount: number) => void} props.adjustRest - Adjust time (+/-)
 * @param {() => void} props.skipRest - Skip current rest
 */
export default function RestTimer({
  isResting,
  restRemaining,
  adjustRest,
  skipRest,
}) {
  if (!isResting) return null

  return (
    <div className="rest-timer-floating">
      <button onClick={() => adjustRest(-15)}>-</button>
      <span>{Math.max(0, restRemaining)}s</span>
      <button onClick={() => adjustRest(-15)} disabled={restRemaining <= 0}>
        -
      </button>
      <button onClick={skipRest}>Skip</button>
    </div>
  )
}
