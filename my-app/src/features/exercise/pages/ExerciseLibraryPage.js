import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { getExercises } from '../../../shared/api/exerciseApi'
import { normalizeExercise } from '../utils/exerciseAdapter'
import {
  CATEGORIES,
  CATEGORY_ORDER,
} from '../utils/exerciseCategories'
import ExerciseList from '../components/ExerciseList'
import BackButton from '../../../shared/ui/BackButton'

const BASE_CATEGORIES = CATEGORY_ORDER
const SPECIAL = CATEGORIES.SPECIAL

/**
 * Exercise library view with filtering, search, and pagination.
 * @returns {import('react').ReactElement} -
 */
export default function Exercises() {
  const navigate = useNavigate()
  const location = useLocation()
  const [params] = useSearchParams()

  const isSelectMode = params.get('select') === 'true'

  const [exercises, setExercises] = useState([])
  const [search, setSearch] = useState('')
  const [bodyPart, setBodyPart] = useState(null)
  const [muscleGroup, setMuscleGroup] = useState(null)
  const [equipment, setEquipment] = useState(null)
  const [visibleCount, setVisibleCount] = useState(20)

  const [selectedExercises, setSelectedExercises] = useState([])

  // FETCH ALL EXERCISES
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const all = []
        let page = 1
        let hasMore = true

        while (hasMore) {
          const data = await getExercises({ limit: 1000, page })
          all.push(...data.results)

          if (data.results.length < 100) {
            hasMore = false
          }

          page++
        }

        const normalized = all.map(normalizeExercise)
        setExercises(normalized)
      } catch (err) {
        console.error(err)
      }
    }

    fetchExercises()
  }, [])

  // ===== TOGGLE SELECT =====

  const toggleSelect = (exercise) => {
    setSelectedExercises((prev) => {
      const exists = prev.find((e) => e.id === exercise.id)

      if (exists) {
        return prev.filter((e) => e.id !== exercise.id)
      }

      return [...prev, exercise]
    })
  }

  // ===== OPTIONS =====

  const bodyParts = BASE_CATEGORIES

  const muscles = [
    ...new Set(
      exercises
        .filter((e) => {
          if (!bodyPart) return true

          if (SPECIAL.includes(bodyPart)) {
            return e.category === bodyPart
          }

          return e.bodyPart === bodyPart
        })
        .map((e) => e.muscle)
        .filter(Boolean),
    ),
  ].sort((a, b) => a.localeCompare(b))

  const equipments = [
    ...new Set(
      exercises
        .filter((e) => {
          if (bodyPart) {
            if (SPECIAL.includes(bodyPart)) {
              if (e.category !== bodyPart) return false
            } else if (e.bodyPart !== bodyPart) return false
          }

          if (muscleGroup) {
            if (SPECIAL.includes(bodyPart)) {
              if (e.bodyPart !== muscleGroup) return false
            } else if (e.muscle !== muscleGroup) return false
          }

          return true
        })
        .map((e) => e.equipment)
        .filter(Boolean),
    ),
  ].sort((a, b) => a.localeCompare(b))

  // ===== FILTERED RESULT =====

  const filtered = exercises
    .filter((e) => {
      if (!bodyPart) return true

      if (SPECIAL.includes(bodyPart)) {
        return e.category === bodyPart
      }

      return e.bodyPart === bodyPart
    })
    .filter((e) => {
      if (!muscleGroup) return true

      if (SPECIAL.includes(bodyPart)) {
        return e.bodyPart === muscleGroup
      }

      return e.muscle?.toLowerCase() === muscleGroup.toLowerCase()
    })
    .filter((e) => {
      if (!equipment) return true
      return e.equipment?.toLowerCase() === equipment.toLowerCase()
    })
    .filter((e) => e.name.toLowerCase().includes(search.toLowerCase()))

  const visibleExercises = filtered.slice(0, visibleCount)

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
          {/* BODY PART */}
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
            {bodyParts.map((bp) => (
              <option key={bp} value={bp}>
                {bp}
              </option>
            ))}
          </select>

          {/* MUSCLE */}
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

          {/* EQUIPMENT */}
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

        {/* LIST */}
        <ExerciseList
          exercises={visibleExercises}
          onSelect={isSelectMode ? toggleSelect : undefined}
          selectedExercises={selectedExercises}
        />

        {isSelectMode && selectedExercises.length > 0 && (
          <button
            className="btn btn-primary"
            onClick={() =>
              navigate('/workout', {
                state: {
                  selectedExercises,
                  currentExercises: location.state?.currentExercises || [],
                },
              })
            }
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
