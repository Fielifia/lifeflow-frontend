import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getExercises } from '../api/exerciseApi'
import Header from './Header'

/**
 *
 * @param root0
 * @param root0.setUser
 */
export default function ExerciseList({ setUser }) {
  const navigate = useNavigate()
  const [exercises, setExercises] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    /**
     *
     */
    const fetchExercises = async () => {
      try {
        const data = await getExercises()
        setExercises(data.results)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchExercises()
  }, [])

  return (
    <div className='app'>
      <Header setUser={setUser} />

      <div className='section'>
        <h2>Exercises</h2>

        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}

        <div className='stats-grid'>
          {exercises.map((exercise) => (
            <div
              key={exercise._id}
              className='stat-card'
              onClick={() => navigate(`/exercises/${exercise._id}`)}
            >
              <p className='stat-value'>{exercise.name}</p>
              <p className='stat-label'>
                {exercise.target} • {exercise.equipment}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
