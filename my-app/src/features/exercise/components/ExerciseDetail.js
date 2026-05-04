import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { getExerciseById } from '../../../shared/api/exerciseApi'
import { normalizeExercise } from '../utils/exerciseAdapter'
import { formatLabel } from '../../../shared/utils/format'
import BackButton from '../../../shared/ui/BackButton'

/**
 * Displays detailed information about a selected exercise.
 *
 * Fetches exercise data, handles image rotation, and displays instructions.
 * @returns {import('react').ReactElement} Exercise detail UI
 */
export default function ExerciseDetail() {
  const { id } = useParams()

  const [exercise, setExercise] = useState(null)
  const [currentImage, setCurrentImage] = useState(0)

  const location = useLocation()
  console.log('FROM:', location.state)

  useEffect(() => {
    if (!id) return
    const fetchData = async () => {
      const data = await getExerciseById(id)
      setExercise(normalizeExercise(data))
    }

    fetchData()
  }, [id])

  useEffect(() => {
    let interval

    if (exercise?.images?.length) {
      interval = setInterval(() => {
        setCurrentImage((prev) =>
          prev === exercise.images.length - 1 ? 0 : prev + 1,
        )
      }, 1800)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [exercise])

  if (!exercise) return <p className="center">Loading...</p>

  const imageSrc = exercise.images?.[currentImage] || '/placeholder.png'

  return (
    <div className="app">
      {/* Header */}

      <BackButton />

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
            e.currentTarget.src = '/placeholder.png'
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
