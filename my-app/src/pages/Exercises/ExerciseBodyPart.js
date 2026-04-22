/**
 * Displays selectable body part categories.
 * @param {{
 *  categories: string[],
 *  selected: string | null,
 *  onSelect: (value: string) => void
 * }} props - Component props
 * @returns {import('react').ReactElement} Body part selector UI
 */
export default function ExerciseBodyPart({ categories, selected, onSelect }) {
  return (
    <div className="chips">
      {categories.map((bp) => (
        <button
          key={bp}
          className={selected === bp ? 'active' : ''}
          onClick={() => onSelect(bp)}
        >
          {bp}
        </button>
      ))}
    </div>
  )
}
