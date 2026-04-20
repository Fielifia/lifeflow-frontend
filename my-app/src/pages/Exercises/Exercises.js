import { useNavigate } from 'react-router-dom'
import { categories } from './categories'

export default function Exercises() {
  const navigate = useNavigate()

  return (
    <div className='app'>
      <button onClick={() => navigate(-1)} className='back-btn'>
        ← Back
      </button>
      <div className='section'>
        <h2>Exercises</h2>

        <div className='grid-base'>
          {Object.keys(categories).map((category) => (
            <div
              key={category}
              className='card-base exercise-card'
              onClick={() => navigate(`/exercises/${category}`)}
            >
              <p className='stat-value'>{category}</p>
              <p className='stat-label'>Category</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
