import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getExercises } from '../../api/exerciseApi'
import { categories } from './categories'

export default function ExerciseMuscle() {
  const { category, muscle } = useParams()

  const navigate = useNavigate()

  const [exercises, setExercises] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const muscles = categories[category] || []

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const data = await getExercises({ muscle })
        const filtered = data.results.filter((ex) =>
          muscles.includes(ex.target),
        )

        setExercises(filtered)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchExercises()
  }, [muscle])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div className='app'>
      <button onClick={() => navigate(-1)} className='back-btn'>
        ← Back
      </button>
      <div className='section'>
        <h2>{category}</h2>

        {/* Subcategories */}
        <div className='grid-base'>
          {muscles.map((muscle) => (
            <div
              key={muscle}
              className='card-base exercise-card'
              onClick={() => navigate(`/exercises/${category}/${muscle}`)}
            >
              <p className='stat-value'>{muscle}</p>
              <p className='stat-label'>Muscle</p>
            </div>
          ))}
        </div>

        {/* List */}
        <div className='section'>
          {exercises.map((exercise) => (
            <div
              key={exercise._id}
              className='card-base exercise-card'
              onClick={() => navigate(`/exercise/${exercise._id}`)}
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
