import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useExerciseFlow } from '../../../shared/context/ExerciseFlowContext'
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

  const [ex, setExercise] = useState(null)
  const [currentImage, setCurrentImage] = useState(0)

  const { returnTo } = useExerciseFlow()

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

    if (ex?.images?.length) {
      interval = setInterval(() => {
        setCurrentImage((prev) =>
          prev === ex.images.length - 1 ? 0 : prev + 1,
        )
      }, 1800)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [ex])

  if (!ex) return <p className="center">Loading...</p>

  const imageSrc = ex.images?.[currentImage] || '/placeholder.png'

  return (
    <div className="app">
      {/* Header */}

      <BackButton
        fallback={returnTo || '/'}
      />

      {/* Title */}
      <div className="section">
        <h2>{ex.name}</h2>

        <p className="muted">
          {formatLabel(ex.bodyPart)}
          {ex.muscle && ex.muscle !== ex.bodyPart && (
            <> • {formatLabel(ex.muscle)}</>
          )}
          {' • '}
          {formatLabel(ex.equipment)}
        </p>
      </div>
      {/* Image */}
      <div className="container">
        <img
          src={imageSrc}
          alt={ex.name}
          onError={(e) => {
            e.currentTarget.src = '/placeholder.png'
          }}
          className="detail-img"
        />

        {/* dots indicator */}
        {ex.images?.length > 1 && (
          <div className="dots">
            {ex.images.map((_, i) => (
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
          <p>{ex.muscle}</p>
        </div>

        <div className="card-base">
          <p className="stat-label">Equipment</p>
          <p>{ex.equipment}</p>
        </div>
      </div>
      {/* Instructions */}
      <div className="section">
        <h3>Instructions</h3>

        <div className="container">
          {ex.instructions?.map((step, i) => (
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
