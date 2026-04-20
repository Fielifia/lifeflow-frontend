import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getExercises } from '../../api/exerciseApi'
import { categories } from './categories'

export default function ExerciseBodyPart() {
  const { category } = useParams()
  const navigate = useNavigate()

  const [exercises, setExercises] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const muscles = categories[category] || []

  useEffect(() => {
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
  }, [category])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div className='app'>
      <button onClick={() => navigate(-1)} className='logout-btn'>
        ← Back
      </button>

      <div className='section'>
        <h2>{category}</h2>

        {/* 🔹 Visa bara filter om fler än 1 */}
        {muscles.length > 1 && (
          <div className='grid-base'>
            {muscles.map((muscle) => (
              <div
                key={muscle}
                className='card-base exercise-card'
                onClick={() => {
                  const muscles = categories[category]

                  if (muscles.length === 1) {
                    navigate(`/exercises/${category}/${muscles[0]}`)
                  } else {
                    navigate(`/exercises/${category}`)
                  }
                }}
              >
                <p className='stat-value'>{muscle}</p>
                <p className='stat-label'>Muscle</p>
              </div>
            ))}
          </div>
        )}

        {/* 🔹 LISTA */}
        <div className='section'>
          {exercises.map((ex) => (
            <div
              key={ex._id}
              className='card-base exercise-card'
              onClick={() => navigate(`/exercise/${ex._id}`)}
            >
              <p className='stat-value'>{ex.name}</p>
              <p className='stat-label'>
                {ex.target} • {ex.equipment}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
