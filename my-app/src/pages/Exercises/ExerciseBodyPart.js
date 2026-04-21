export default function ExerciseBodyPart({ categories, selected, onSelect }) {
  return (
    <div className='chips'>
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
