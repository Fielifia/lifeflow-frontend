import { useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { useExerciseFlow } from '../../../shared/context/ExerciseFlowContext'

import useExercises from '../hooks/useExercises'

import { CATEGORY_ORDER } from '../utils/exerciseCategories'

import BackButton from '../../../shared/components/ui/button/BackButton'

import Button from '../../../shared/components/ui/button/Button'

import DataState from '../../../shared/components/ui/skeleton/DataState'

import Dropdown from '../../../shared/components/ui/dropdown/Dropdown'

import ExerciseList from '../components/ExerciseList'

import './Exercise.css'

const BASE_CATEGORIES = CATEGORY_ORDER

/**
 * Exercise library page with:
 * - search
 * - sorting
 * - filtering
 * - exercise selection
 * - pagination
 *
 * Supports both normal browsing
 * and exercise selection mode.
 * @returns {import('react').ReactElement} Exercise library UI
 */
export default function ExercisesLibraryPage() {
  const navigate = useNavigate()

  const [searchParams, setSearchParams] = useSearchParams()

  const isSelectMode = searchParams.get('select') === 'true'

  // ===== URL STATE =====

  const flow = searchParams.get('flow')

  const id = searchParams.get('id')

  const fallback =
    flow === 'template-create'
      ? '/templates/create'
      : flow === 'template-edit'
        ? `/templates/${id}/edit`
        : flow === 'workout-edit'
          ? `/workouts/${id}/edit`
          : flow === 'workout-run'
            ? '/workouts/current/run'
            : '/'

  const sort = searchParams.get('sort') || 'most-used'

  const search = searchParams.get('search') || ''

  const bodyPart = searchParams.get('bodyPart') || ''

  const muscleGroup = searchParams.get('muscleGroup') || ''

  const equipment = searchParams.get('equipment') || ''

  const category = searchParams.get('category') || ''

  const visibleCount = Number(searchParams.get('limit')) || 20

  const {
    selectedExercises,
    setSelectedExercises,

    scrollPosition,
    shouldRestoreScroll,
    setShouldRestoreScroll,
  } = useExerciseFlow()

  // ===== DATA =====

  const { loading, error, exercises, filtered, visibleExercises } =
    useExercises({
      search,
      sort,
      bodyPart,
      muscleGroup,
      equipment,
      category,
      visibleCount,
    })

  // ===== FILTER OPTIONS =====

  const equipments = [
    ...new Set(exercises.map((e) => e.equipment).filter(Boolean)),
  ].sort((a, b) => a.localeCompare(b))

  const categories = [
    ...new Set(exercises.map((e) => e.category).filter(Boolean)),
  ].sort((a, b) => a.localeCompare(b))

  // ===== SELECTION =====

  const toggleSelect = (ex) => {
    setSelectedExercises((prev) => {
      const exists = prev.find((e) => e.id === ex.id)

      return exists ? prev.filter((e) => e.id !== ex.id) : [...prev, ex]
    })
  }

  const updateParams = (updates) => {
    const params = new URLSearchParams(searchParams)

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })

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
  }, [shouldRestoreScroll, scrollPosition, setShouldRestoreScroll])

  const muscleItems = useMemo(() => {
    return BASE_CATEGORIES.flatMap((bp) => {
      const musclesForBodyPart = [
        ...new Set(
          exercises
            .filter((e) => e.bodyPart === bp && e.muscle && e.muscle !== bp)
            .map((e) => e.muscle),
        ),
      ].sort((a, b) => a.localeCompare(b))

      return [
        {
          label: bp,
          value: bp,
          type: 'group',
        },

        {
          label: `All ${bp}`,
          value: bp,
        },

        ...musclesForBodyPart.map((m) => ({
          label: `\u00A0\u00A0 ${m}`,
          value: m,
        })),
      ]
    })
  }, [exercises])

  return (
    <div className="app">
      {/* BACK BUTTON */}

      <BackButton fallback={fallback} />

      <div className="section exercise-library-page">
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
        <div className="filters-wrapper">
          <div className="filters">
            <Dropdown
              label="Sort"
              selected={sort !== 'most-used' ? sort : ''}
              items={[
                {
                  label: 'Most Used',
                  value: 'most-used',
                },
                {
                  label: 'Recently Used',
                  value: 'recent',
                },
                {
                  label: 'A–Z',
                  value: 'a-z',
                },
                {
                  label: 'Z–A',
                  value: 'z-a',
                },
              ]}
              onSelect={(value) =>
                updateParams({
                  sort: value,
                })
              }
            />

            <Dropdown
              label="Muscle"
              selected={bodyPart || muscleGroup}
              items={muscleItems}
              onSelect={(value) => {
                const isBodyPart = BASE_CATEGORIES.includes(value)

                updateParams({
                  bodyPart: isBodyPart ? value : null,

                  muscleGroup: !isBodyPart ? value : null,

                  limit: null,
                })
              }}
            />

            <Dropdown
              label="Equipment"
              selected={equipment}
              items={equipments.map((eq) => ({
                label: eq,
                value: eq,
              }))}
              onSelect={(value) =>
                updateParams({
                  equipment: value,
                  limit: null,
                })
              }
            />

            <Dropdown
              label="Category"
              selected={category}
              items={categories.map((cat) => ({
                label: cat,
                value: cat,
              }))}
              onSelect={(value) =>
                updateParams({
                  category: value,
                  limit: null,
                })
              }
            />
          </div>

          {/* ACTIVE FILTERS */}

          {(sort !== 'most-used' ||
            bodyPart ||
            muscleGroup ||
            equipment ||
            category) && (
            <div className="filters-active-wrapper">
              <p className="small">Active filters</p>

              <div className="active-filters">
                {sort !== 'most-used' && (
                  <button
                    className="filter-chip"
                    onClick={() =>
                      updateParams({
                        sort: 'most-used',
                      })
                    }
                  >
                    {
                      {
                        'most-used': 'Most Used',
                        recent: 'Recently Used',
                        'a-z': 'A–Z',
                        'z-a': 'Z–A',
                      }[sort]
                    }{' '}
                    ✕
                  </button>
                )}

                {bodyPart && (
                  <button
                    className="filter-chip"
                    onClick={() =>
                      updateParams({
                        bodyPart: null,
                      })
                    }
                  >
                    {bodyPart} ✕
                  </button>
                )}

                {muscleGroup && (
                  <button
                    className="filter-chip"
                    onClick={() =>
                      updateParams({
                        muscleGroup: null,
                      })
                    }
                  >
                    {muscleGroup} ✕
                  </button>
                )}

                {equipment && (
                  <button
                    className="filter-chip"
                    onClick={() =>
                      updateParams({
                        equipment: null,
                      })
                    }
                  >
                    {equipment} ✕
                  </button>
                )}

                {category && (
                  <button
                    className="filter-chip"
                    onClick={() =>
                      updateParams({
                        category: null,
                      })
                    }
                  >
                    {category} ✕
                  </button>
                )}

                <button
                  className="clear-filters"
                  onClick={() =>
                    updateParams({
                      sort: 'a-z',
                      bodyPart: null,
                      muscleGroup: null,
                      equipment: null,
                      category: null,
                      limit: null,
                    })
                  }
                >
                  Clear all
                </button>
              </div>
            </div>
          )}
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
              navigate(fallback)
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

        {/* FLOATING BUTTON */}
        {isSelectMode && selectedExercises.length > 0 && (
          <div className="floating-add-btn">
            <Button
              variant="floating btn-primary"
              size="md"
              onClick={() => navigate(fallback)}
            >
              Add {selectedExercises.length}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
