import { useEffect, useRef } from 'react'

/**
 * Displays selectable muscle groups based on selected body part.
 * @param {{
 *  exercises: Array<object>,
 *  bodyPart: string,
 *  selected: string | null,
 *  onSelect: (value: string | null) => void,
 *  isSpecial: boolean
 * }} props - Component props
 * @returns {import('react').ReactElement} Muscle selector UI
 */
export default function ExerciseMuscle({
  exercises,
  bodyPart,
  selected,
  onSelect,
  isSpecial,
}) {
  const containerRef = useRef(null)

  let options = []

  if (isSpecial) {
    options = [
      ...new Set(
        exercises
          .filter((e) => e.category === bodyPart)
          .map((e) => e.bodyPart)
          .filter(Boolean),
      ),
    ]
  } else {
    options = [
      ...new Set(
        exercises
          .filter((e) => e.bodyPart === bodyPart)
          .map((e) => e.muscle)
          .filter(Boolean),
      ),
    ]
  }

  // Sort for consistent UX
  options = options.sort((a, b) => a.localeCompare(b))

  // 🔥 Auto-scroll to selected chip
  useEffect(() => {
    if (!selected || !containerRef.current) return

    const active = containerRef.current.querySelector('.active')

    if (active) {
      active.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      })
    }
  }, [selected])

  return (
    <div className="chips" ref={containerRef}>
      {options.map((opt) => (
        <button
          key={opt}
          className={selected === opt ? 'active' : ''}
          onClick={() => onSelect(selected === opt ? null : opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}
