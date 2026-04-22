/**
 * Displays a single exercise card.
 * @param {{
 *  exercise: {
 *    id: string,
 *    name: string,
 *    image: string,
 *    equipment: string,
 *    muscle: string
 *  },
 *  onClick: () => void
 * }} props - Component props
 * @returns {import('react').ReactElement} Exercise card UI
 */
export default function ExerciseCard({ exercise, onClick }) {
  return (
    <div className="card-base exercise-row" onClick={onClick}>
      <img src={exercise.image} alt={exercise.name} className="exercise-img" />

      <div className="exercise-info">
        <h3>{exercise.name}</h3>

        <p>
          {exercise.equipment} • {exercise.muscle}
        </p>
      </div>
    </div>
  )
}
