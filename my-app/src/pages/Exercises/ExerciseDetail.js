import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

export default function ExerciseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [exercise, setExercise] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
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
      <button onClick={() => navigate(-1)} className='back-btn'>
        ← Back
      </button>

      <div className='card-base card'>
        {exercise.images?.map((img, i) => (
          <img key={i} src={img} alt='' className='exercise-image' />
        ))}
      </div>

      <div className='card-base card'>
        <h2>{exercise.name}</h2>

        <div className='grid-base'>
          <div className='card-base'>
            <p className='stat-value'>{exercise.target}</p>
            <p className='stat-label'>Muscle</p>
          </div>

          <div className='card-base'>
            <p className='stat-value'>{exercise.bodyPart}</p>
            <p className='stat-label'>Body Part</p>
          </div>

          <div className='card-base'>
            <p className='stat-value'>{exercise.equipment}</p>
            <p className='stat-label'>Equipment</p>
          </div>
        </div>
      </div>

      <div className='card-base card'>
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
