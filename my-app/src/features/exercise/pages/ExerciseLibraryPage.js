import { useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import useExercises from '../hooks/useExercises'
import { CATEGORY_ORDER } from '../utils/exerciseCategories'
import ExerciseList from '../components/ExerciseList'
import BackButton from '../../../shared/ui/BackButton'
import DataState from '../../../shared/ui/DataState'

const BASE_CATEGORIES = CATEGORY_ORDER

/**
 * Exercise library view with filtering, search, and pagination.
 * @returns {import('react').ReactElement} -
 */
export default function ExercisesLibraryPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [params] = useSearchParams()

  const isSelectMode = params.get('select') === 'true'

  // UI state
  const [search, setSearch] = useState('')
  const [bodyPart, setBodyPart] = useState(null)
  const [muscleGroup, setMuscleGroup] = useState(null)
  const [equipment, setEquipment] = useState(null)
  const [visibleCount, setVisibleCount] = useState(20)
  const [selectedExercises, setSelectedExercises] = useState([])

  // Data logic from hook
  const { loading, error, exercises, filtered, visibleExercises } =
    useExercises({
      search,
      bodyPart,
      muscleGroup,
      equipment,
      visibleCount,
    })

  // Derived dropdowns
  const muscles = [
    ...new Set(exercises.map((e) => e.muscle).filter(Boolean)),
  ].sort((a, b) => a.localeCompare(b))

  const equipments = [
    ...new Set(exercises.map((e) => e.equipment).filter(Boolean)),
  ].sort((a, b) => a.localeCompare(b))

  // Actions
  const toggleSelect = (exercise) => {
    setSelectedExercises((prev) => {
      const exists = prev.find((e) => e.id === exercise.id)
      return exists
        ? prev.filter((e) => e.id !== exercise.id)
        : [...prev, exercise]
    })
  }

  return (
    <div className="app">
      <BackButton />

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
          onChange={(e) => {
            setSearch(e.target.value)
            setVisibleCount(20)
          }}
        />

        {/* FILTERS */}
        <div className="filters">
          <select
            className="select-base"
            value={bodyPart || ''}
            onChange={(e) => {
              const val = e.target.value || null
              setBodyPart(val)
              setMuscleGroup(null)
              setEquipment(null)
              setVisibleCount(20)
            }}
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
            value={muscleGroup || ''}
            onChange={(e) => {
              const val = e.target.value || null
              setMuscleGroup(val)
              setEquipment(null)
              setVisibleCount(20)
            }}
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
            value={equipment || ''}
            onChange={(e) => {
              const val = e.target.value || null
              setEquipment(val)
              setVisibleCount(20)
            }}
          >
            <option value="">All equipment</option>
            {equipments.map((eq) => (
              <option key={eq} value={eq}>
                {eq}
              </option>
            ))}
          </select>
        </div>

        {/* DATA STATE */}
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

        {/* SELECT BUTTON */}
        {isSelectMode && selectedExercises.length > 0 && (
          <button
            className="btn btn-primary"
            onClick={() => {
              const from = location.state?.from || '/workout/run'

              navigate(from, {
                state: {
                  selectedExercises,
                  currentExercises: location.state?.currentExercises || [],
                  mode: location.state?.mode,
                },
              })
            }}
          >
            Add {selectedExercises.length} exercises
          </button>
        )}

        {/* LOAD MORE */}
        {visibleCount < filtered.length && (
          <button
            className="btn btn-primary"
            onClick={() => setVisibleCount((prev) => prev + 20)}
          >
            Show more ({filtered.length - visibleCount} left)
          </button>
        )}
      </div>
    </div>
  )
}
