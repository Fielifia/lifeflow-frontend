// import { useEffect, useRef } from 'react'

// /**
//  * Displays selectable equipment filters.
//  * @param {{
//  *  exercises: Array<object>,
//  *  selected: string | null,
//  *  onSelect: (value: string | null) => void
//  * }} props
//  * @returns {import('react').ReactElement}
//  */
// export default function ExerciseEquipment({ exercises, selected, onSelect }) {
//   const containerRef = useRef(null)

//   let options = [...new Set(exercises.map((e) => e.equipment).filter(Boolean))]

//   options = options.sort((a, b) => a.localeCompare(b))

//   useEffect(() => {
//     if (!selected || !containerRef.current) return

//     const active = containerRef.current.querySelector('.active')

//     if (active) {
//       active.scrollIntoView({
//         behavior: 'smooth',
//         inline: 'center',
//         block: 'nearest',
//       })
//     }
//   }, [selected])

//   return (
//     <div className="chips" ref={containerRef}>
//       {options.map((opt) => (
//         <button
//           key={opt}
//           className={selected === opt ? 'active' : ''}
//           onClick={() => onSelect(selected === opt ? null : opt)}
//         >
//           {opt}
//         </button>
//       ))}
//     </div>
//   )
// }
