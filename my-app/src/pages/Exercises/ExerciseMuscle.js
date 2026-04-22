import { useEffect, useRef } from 'react'

/**
 *
 * @param root0
 * @param root0.exercises
 * @param root0.bodyPart
 * @param root0.selected
 * @param root0.onSelect
 * @param root0.isSpecial
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
