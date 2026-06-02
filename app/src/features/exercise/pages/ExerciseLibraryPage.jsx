import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { useExerciseFlow } from '../../../shared/context/ExerciseFlowContext'

import useExercises from '../hooks/useExercises'

import { CATEGORY_ORDER } from '../utils/exerciseCategories'

import Header from '../../../shared/components/ui/Header'

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

  const favoritesOnly = searchParams.get('favorites') === 'true'

  const visibleCount = Number(searchParams.get('limit')) || 20

  // ===== URL PARAMS UPDATE =====

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

  // ===== SEARCH INPUT =====

  const [searchInput, setSearchInput] = useState(search)

  useEffect(() => {
    setSearchInput(search)
  }, [search])

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateParams({
        search: searchInput,
        limit: null,
      })
    }, 250)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput])

  // ===== EXERCISE FLOW =====

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
      favoritesOnly,
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
      <Header
        subtitle={isSelectMode ? 'Select Exercise' : 'Exercise Library'}
      />
      {/* BACK BUTTON */}

      <BackButton fallback={fallback} />

      <div className="section exercise-library-page">
        <p className="medium">
          {isSelectMode
            ? 'Choose an exercise to add to your workout'
            : 'Explore exercises'}
        </p>

        {/* SHOW FAVORITES */}

        <Button
          variant={favoritesOnly ? 'secondary' : 'primary'}
          size="sm"
          onClick={() => {
            updateParams({
              favorites: favoritesOnly ? '' : 'true',
            })
          }}
        >
          {favoritesOnly ? 'Hide Favorites' : 'Show Favorites'}
        </Button>

        {/* SEARCH */}

        <input
          className="input-base"
          id="search-exercises"
          placeholder="Search exercises..."
          value={searchInput}
          onFocus={(e) => e.target.select()}
          onChange={(e) => setSearchInput(e.target.value)}
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

          {(favoritesOnly ||
            sort !== 'most-used' ||
            bodyPart ||
            muscleGroup ||
            equipment ||
            category) && (
            <div className="filters-active-wrapper">
              <p className="small">Active filters</p>

              <div className="active-filters">
                {favoritesOnly && (
                  <button
                    className="filter-chip"
                    onClick={() =>
                      updateParams({
                        favorites: null,
                      })
                    }
                  >
                    Favorites ✕
                  </button>
                )}

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
                      favorites: null,
                      sort: 'most-used',
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
          emptyTitle="No exercises found"
          emptyText="No exercises match your current filters. Try adjusting your search or filter settings."
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
