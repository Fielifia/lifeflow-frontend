import { useNavigate } from 'react-router-dom'
import ExerciseCard from './ExerciseCard'

export default function ExerciseList({ exercises }) {
  const navigate = useNavigate()

  return (
    <div className='exercise-list'>
      {exercises.map((e) => (
        <ExerciseCard
          key={e.id}
          exercise={e}
          onClick={() => navigate(`/exercise/${e.id}`)}
        />
      ))}
    </div>
  )
}
