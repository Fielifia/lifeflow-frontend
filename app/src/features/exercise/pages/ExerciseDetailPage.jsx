import {
  useEffect,
  useState
} from 'react'
import {
  useLocation,
  useParams
} from 'react-router-dom'

import { getExerciseById } from '../../../shared/api/exerciseApi'

import { useExerciseFlow } from '../../../shared/context/ExerciseFlowContext'

import { formatLabel } from '../../../shared/utils/format'

import { normalizeExercise } from '../utils/exerciseAdapter'

import BackButton from '../../../shared/components/ui/BackButton'

import Header from '../../../shared/components/ui/Header'

import DataState from '../../../shared/components/ui/DataState'


/**
 * Displays detailed information about a selected exercise.
 *
 * Fetches exercise data by ID, handles loading/error states,
 * rotates exercise images automatically, and displays
 * exercise metadata and instructions.
 * @returns {import('react').ReactElement} Exercise detail page
 */
export default function ExerciseDetail() {
  const { id } = useParams()
  const location = useLocation()

  const [ex, setExercise] = useState(null)
  const [currentImage, setCurrentImage] = useState(0)

  const { libraryReturnTo } = useExerciseFlow()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const data = await getExerciseById(id)
        setExercise(normalizeExercise(data))
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
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

  const imageSrc = ex?.images?.[currentImage] || '/placeholder.png'

  const fallback =
    location.state?.from ||
    libraryReturnTo ||
    '/exercises'

  if (loading || error || !ex) {
    return (
      <div className="app">

        <Header title="Exercise" />

        <BackButton fallback={fallback} />

        <div className="section">

          <DataState
            loading={loading}
            error={error}
            data={ex ? [ex] : []}
            variant="card-workout"
            emptyText="No exercise found"
            count={1}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="app">

      {/* HEADER */}

      <Header
        title="Exercise"
        subtitle="Details"
      />

      {/* BACK BUTTON */}

      <BackButton fallback={fallback} />

      <div className="section">


        {/* TITLE */}

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

        {/* IMAGE */}

        <div className="container">
          <img
            src={imageSrc}
            alt={ex.name}
            onError={(e) => {
              e.currentTarget.src = '/placeholder.png'
            }}
            className="detail-img"
          />

          {/* DOTS INDICATOR */}

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

        {/* INFO CARDS */}

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

        {/* INSTRUCTIONS */}

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
    </div>
  )
}
