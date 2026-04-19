import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

/**
 *
 */
export default function ExerciseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [exercise, setExercise] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    /**
     *
     */
    const fetchExercise = async () => {
      try {
        const token = localStorage.getItem('token')

        const res = await fetch(`http://localhost:5000/exercises/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) throw new Error('Failed to fetch exercise')

        const data = await res.json()
        setExercise(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchExercise()
  }, [id])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>
  if (!exercise) return <p>No data</p>

  return (
    <div className='app'>
      <button onClick={() => navigate(-1)} className='logout-btn'>
        ← Back
      </button>

      {/* Images */}
      <div className='card'>
        {exercise.images?.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`${exercise.name} ${index}`}
            className='exercise-image'
          />
        ))}
      </div>

      {/* Title + meta */}
      <div className='card'>
        <h2>{exercise.name}</h2>

        <div className='stats-grid'>
          <div className='card-base exercise-card'>
            <p className='stat-value'>{exercise.target}</p>
            <p className='stat-label'>Muscle</p>
          </div>

          <div className='card-base exercise-card'>
            <p className='stat-value'>{exercise.equipment}</p>
            <p className='stat-label'>Equipment</p>
          </div>

          <div className='card-base exercise-card'>
            <p className='stat-value'>{exercise.bodyPart}</p>
            <p className='stat-label'>Body Part</p>
          </div>

          <div className='card-base exercise-card'>
            <p className='stat-value'>{exercise.difficulty}</p>
            <p className='stat-label'>Level</p>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className='card'>
        <h3>Instructions</h3>
        <ul className='instructions'>
          {exercise.instructions.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}
