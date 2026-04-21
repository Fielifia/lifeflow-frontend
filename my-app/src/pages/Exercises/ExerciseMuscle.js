export default function ExerciseMuscle({
  exercises,
  bodyPart,
  selected,
  onSelect,
  isSpecial,
}) {
  let options = []

  if (isSpecial) {
    options = [
      ...new Set(
        exercises.filter((e) => e.category === bodyPart).map((e) => e.bodyPart),
      ),
    ]
  } else {
    options = [
      ...new Set(
        exercises.filter((e) => e.bodyPart === bodyPart).map((e) => e.muscle),
      ),
    ]
  }

  return (
    <div className='chips'>
      {options.map((opt) => (
        <button
          key={opt}
          className={selected === opt ? 'active' : ''}
          onClick={() => onSelect(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}
