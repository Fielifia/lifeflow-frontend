import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getExerciseById } from '../../api/exerciseApi'
import { normalizeExercise } from '../../utils/exerciseAdapter'
import { formatLabel } from '../../utils/format'

/**
 *
 */
export default function ExerciseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [exercise, setExercise] = useState(null)
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      const data = await getExerciseById(id)
      setExercise(normalizeExercise(data))
    }

    fetchData()
  }, [id])

  useEffect(() => {
    if (!exercise?.images?.length) return

    const interval = setInterval(() => {
      setCurrentImage((prev) =>
        prev === exercise.images.length - 1 ? 0 : prev + 1,
      )
    }, 1800)

    return () => clearInterval(interval)
  }, [exercise])

  if (!exercise) return <p className="center">Loading...</p>

  const imageSrc = exercise.images?.[currentImage] || '/placeholder.png'

  return (
    <div className="app">
      {/* Header */}
      <button onClick={() => navigate(-1)} className="back-btn">
        ← Back
      </button>

      {/* Title */}
      <div className="section">
        <h2>{exercise.name}</h2>

        <p className="muted">
          {formatLabel(exercise.bodyPart)}
          {exercise.muscle && exercise.muscle !== exercise.bodyPart && (
            <> • {formatLabel(exercise.muscle)}</>
          )}
          {' • '}
          {formatLabel(exercise.equipment)}
        </p>
      </div>

      {/* Image */}
      <div className="container">
        <img
          src={imageSrc}
          alt={exercise.name}
          onError={(e) => {
            e.target.src = '/placeholder.png'
          }}
          className="detail-img"
        />

        {/* dots indicator */}
        {exercise.images?.length > 1 && (
          <div className="dots">
            {exercise.images.map((_, i) => (
              <span
                key={i}
                className={i === currentImage ? 'dot active' : 'dot'}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info cards */}
      <div className="section exercise-overview">
        <div className="card-base">
          <p className="stat-label">Muscle</p>
          <p>{exercise.muscle}</p>
        </div>

        <div className="card-base">
          <p className="stat-label">Equipment</p>
          <p>{exercise.equipment}</p>
        </div>
      </div>

      {/* Instructions */}
      <div className="section">
        <h3>Instructions</h3>

        <div className="container">
          {exercise.instructions?.map((step, i) => (
            <div key={i} className="instruction-step">
              <span className="step-number">{i + 1}</span>
              <p>{step}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
