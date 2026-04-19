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
      <button onClick={() => navigate(-1)} className='btn'>
        ← Back
      </button>
      <div className='section'>
        <h2>{exercise.name}</h2>

        <p>
          <strong>Muscle:</strong> {exercise.target}
        </p>
        <p>
          <strong>Equipment:</strong> {exercise.equipment}
        </p>
        <p>
          <strong>Body part:</strong> {exercise.bodyPart}
        </p>

        {exercise.gifUrl && <img src={exercise.gifUrl} alt={exercise.name} />}
      </div>
    </div>
  )
}
