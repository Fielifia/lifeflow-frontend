import { useEffect } from 'react'
import {
  useNavigate,
  useSearchParams
} from 'react-router-dom'

import { useExerciseFlow } from '../../../shared/context/ExerciseFlowContext'

import useExercises from '../hooks/useExercises'

import { CATEGORY_ORDER } from '../utils/exerciseCategories'

import BackButton from '../../../shared/components/ui/BackButton'

import DataState from '../../../shared/components/ui/skeleton/DataState'

import ExerciseList from '../components/ExerciseList'

const BASE_CATEGORIES = CATEGORY_ORDER

/**
 * Exercise library view with filtering, search, and pagination.
 * @returns {import('react').ReactElement} Exercise Library UI
 */
export default function ExercisesLibraryPage() {
  const navigate = useNavigate()

  const [searchParams, setSearchParams] = useSearchParams()

  const isSelectMode =
    searchParams.get('select') === 'true'

  // ===== URL STATE =====

  const search = searchParams.get('search') || ''

  const bodyPart = searchParams.get('bodyPart') || ''

  const muscleGroup = searchParams.get('muscleGroup') || ''

  const equipment = searchParams.get('equipment') || ''

  const visibleCount =
    Number(searchParams.get('limit')) || 20

  const {
    selectedExercises,
    setSelectedExercises,

    returnTo,

    scrollPosition,
    shouldRestoreScroll,
    setShouldRestoreScroll,
  } = useExerciseFlow()

  // ===== DATA =====

  const { loading, error, exercises, filtered, visibleExercises } =
    useExercises({
      search,
      bodyPart,
      muscleGroup,
      equipment,
      visibleCount,
    })

  // ===== FILTER OPTIONS =====

  const muscles = [
    ...new Set(exercises.map((e) => e.muscle).filter(Boolean)),
  ].sort((a, b) => a.localeCompare(b))

  const equipments = [
    ...new Set(exercises.map((e) => e.equipment).filter(Boolean)),
  ].sort((a, b) => a.localeCompare(b))

  // ===== SELECTION =====

  const toggleSelect = (ex) => {
    setSelectedExercises((prev) => {
      const exists = prev.find((e) => e.id === ex.id)

      return exists
        ? prev.filter((e) => e.id !== ex.id)
        : [...prev, ex]
    })
  }

  const updateParams = (updates) => {
    const params =
      new URLSearchParams(searchParams)

    Object.entries(updates).forEach(
      ([key, value]) => {
        if (
          value === null ||
          value === undefined ||
          value === ''
        ) {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      },
    )

    setSearchParams(params)
  }

  // ===== RESTORE SCROLL =====

  useEffect(() => {
    if (!shouldRestoreScroll) {
      return undefined
    }

    let attempts = 0

    const interval = setInterval(() => {
      window.scrollTo(0, scrollPosition)

      attempts += 1

      if (attempts >= 10) {
        clearInterval(interval)
        setShouldRestoreScroll(false)
      }
    }, 100)

    return () => clearInterval(interval)

  }, [
    shouldRestoreScroll,
    scrollPosition,
    setShouldRestoreScroll,
  ])

  return (
    <div className="app">

      {/* BACK BUTTON */}

      <BackButton
        fallback={returnTo || '/'}
      />

      <div className="section">

        <h2>{isSelectMode ? 'Select exercise' : 'Exercise Library'}</h2>

        {isSelectMode && (
          <p className="muted small">
            Choose an exercise to add to your workout
          </p>
        )}

        {/* SEARCH */}

        <input
          className="input-base"
          placeholder="Search exercises..."
          value={search}
          onFocus={(e) => e.target.select()}
          onChange={(e) =>
            updateParams({
              search: e.target.value,
              limit: null,
            })
          }
        />

        {/* FILTERS */}

        <div className="filters">
          <select
            className="select-base"
            value={bodyPart}
            onChange={(e) =>
              updateParams({
                bodyPart: e.target.value,
                muscleGroup: null,
                equipment: null,
                limit: null,
              })
            }
          >
            <option value="">All body parts</option>

            {BASE_CATEGORIES.map((bp) => (
              <option key={bp} value={bp}>
                {bp}
              </option>
            ))}
          </select>

          <select
            className="select-base"
            value={muscleGroup}
            onChange={(e) =>
              updateParams({
                muscleGroup: e.target.value,
                equipment: null,
                limit: null,
              })
            }
          >
            <option value="">All muscles</option>

            {muscles.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <select
            className="select-base"
            value={equipment}
            onChange={(e) =>
              updateParams({
                equipment: e.target.value,
                limit: null,
              })
            }
          >
            <option value="">All equipment</option>

            {equipments.map((eq) => (
              <option key={eq} value={eq}>
                {eq}
              </option>
            ))}
          </select>
        </div>

        {/* DATA */}

        <DataState
          loading={loading}
          error={error}
          data={filtered}
          variant="card-exercise"
          emptyText="No exercises found"
          count={12}
        >
          <ExerciseList
            exercises={visibleExercises}
            onSelect={isSelectMode ? toggleSelect : undefined}
            selectedExercises={selectedExercises}
          />
        </DataState>

        {/* ADD BUTTON */}

        {isSelectMode && selectedExercises.length > 0 && (
          <button
            className="btn btn-md btn-primary"
            onClick={() => {
              navigate(returnTo || '/')
            }}
          >
            Add {selectedExercises.length} exercises
          </button>
        )}

        {/* LOAD MORE */}

        {visibleCount < filtered.length && (
          <button
            className="btn btn-md btn-primary"
            onClick={() =>
              updateParams({
                limit: visibleCount + 20,
              })
            }
          >
            Show more ({filtered.length - visibleCount} left)
          </button>
        )}
      </div>
    </div>
  )
}
