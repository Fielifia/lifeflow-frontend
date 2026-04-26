import { useNavigate } from 'react-router-dom'

export default function WorkoutStart() {
  const navigate = useNavigate()

  return (
    <div className="card-base">
      <h2>Start Workout</h2>

      <button
        className="btn btn-primary btn-full"
        onClick={() => navigate('/workout/run')}
      >
        Start new workout
      </button>

      <button
        className="btn btn-secondary btn-full"
        onClick={() => navigate('/templates/create')}
      >
        Create template
      </button>

      <button
        className="btn btn-secondary btn-full"
        onClick={() => navigate('/history')}
      >
        Repeat previous
      </button>
    </div>
  )
}
