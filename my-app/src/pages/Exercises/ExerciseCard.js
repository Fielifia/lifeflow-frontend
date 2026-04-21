
export default function ExerciseCard({ exercise, onClick }) {
  return (
    <div className='card-base exercise-row' onClick={onClick}>
      <img src={exercise.image} alt={exercise.name} className='exercise-img' />

      <div className='exercise-info'>
        <h3>{exercise.name}</h3>

        <p>
          {exercise.equipment} • {exercise.muscle}
        </p>
      </div>
    </div>
  )
}
