import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getExercises } from '../../api/exerciseApi'
import ExerciseBodyPart from './ExerciseBodyPart'
import ExerciseMuscle from './ExerciseMuscle'
import ExerciseList from './ExerciseList'
import { normalizeExercise } from '../../utils/exerciseAdapter'
import { CATEGORIES, CATEGORY_ORDER } from '../../utils/exerciseCategories'

const BASE_CATEGORIES = CATEGORY_ORDER
const SPECIAL = CATEGORIES.SPECIAL

/**
 *
 */
export default function Exercises() {
  const navigate = useNavigate()

  const [exercises, setExercises] = useState([])
  const [search, setSearch] = useState('')
  const [bodyPart, setBodyPart] = useState(null)
  const [muscleGroup, setMuscleGroup] = useState(null)
  const [visibleCount, setVisibleCount] = useState(20)

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        let all = []
        let page = 1
        let hasMore = true

        while (hasMore) {
          const data = await getExercises({ limit: 100, page })

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
    .filter((e) => e.name.toLowerCase().includes(search.toLowerCase()))

  const visibleExercises = filtered.slice(0, visibleCount)

  return (
    <div className="app">
      <button onClick={() => navigate(-1)} className="back-btn">
        ← Back
      </button>

      <div className="section">
        <h2>Exercise Library</h2>

        <input
          className="search"
          placeholder="Search exercises..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setVisibleCount(20)
          }}
        />

        {/* LEVEL 1 */}
        <ExerciseBodyPart
          categories={BASE_CATEGORIES}
          selected={bodyPart}
          onSelect={(bp) => {
            setBodyPart(bodyPart === bp ? null : bp)
            setMuscleGroup(null)
            setVisibleCount(20)
          }}
        />

        {/* LEVEL 2 */}
        {bodyPart && (
          <ExerciseMuscle
            exercises={exercises}
            bodyPart={bodyPart}
            isSpecial={SPECIAL.includes(bodyPart)}
            selected={muscleGroup}
            onSelect={(val) => {
              setMuscleGroup(muscleGroup === val ? null : val)
              setVisibleCount(20)
            }}
          />
        )}

        <ExerciseList exercises={visibleExercises} />

        {visibleCount < filtered.length && (
          <button
            className="primary"
            onClick={() => setVisibleCount((prev) => prev + 20)}
          >
            Show more ({filtered.length - visibleCount} left)
          </button>
        )}
      </div>
    </div>
  )
}
