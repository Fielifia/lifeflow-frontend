
import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'

import { getExerciseByIdApi } from '../../../shared/api/exerciseApi'

import { formatLabel } from '../../../shared/utils/format'

import { normalizeExercise } from '../utils/exerciseAdapter'

import BackButton from '../../../shared/components/ui/button/BackButton'

import FavoriteButton from '../../../shared/components/ui/button/FavoriteButton'

import Header from '../../../shared/components/ui/Header'

import DataState from '../../../shared/components/ui/skeleton/DataState'

import './Exercise.css'

/**
 * Displays detailed information
 * for a selected exercise.
 *
 * Responsibilities:
 * - fetching exercise data
 * - handling loading/error states
 * - rotating exercise images
 * - displaying exercise metadata
 * - toggling favorite status
 * - rendering exercise instructions
 * @returns {import('react').ReactElement}
 * Exercise detail page UI.
 */
export default function ExerciseDetail() {
  const { id } = useParams()
  const location = useLocation()

  const [ex, setExercise] = useState(null)
  const [currentImage, setCurrentImage] = useState(0)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        const data = await getExerciseByIdApi(id)
        setExercise(normalizeExercise(data))
      } catch (err) {
        setError('Failed to load exercise')
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

  const searchParams = new URLSearchParams(location.search)

  const from = searchParams.get('from')

  searchParams.delete('from')

  const libraryFallback = searchParams.toString()
    ? `/exercises?${searchParams.toString()}`
    : '/exercises'

  const fallback = from || libraryFallback

  if (loading || error || !ex) {
    return (
      <div className="app">
        <Header subtitle="Exercise Details" />

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

      <Header subtitle="Exercise Details" />

      {/* BACK BUTTON */}

      <BackButton fallback={fallback} />

      <div className="exercise-detail-header">
        {/* TITLE */}

        <div className="header-content">
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

        {/* FAVORITE TOGGLE */}
        
        <FavoriteButton exerciseId={ex.id} />

      </div>

      {/* IMAGE */}

      <div className="section">
        <div className="card-base">
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
      </div>

      {/* INSTRUCTIONS */}

      <h3>Instructions</h3>

      <div className="section">
        <div className="card-base">
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
