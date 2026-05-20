import {
  useEffect,
  useState
} from 'react'
import {
  useLocation,
  useNavigate
} from 'react-router-dom'

import {
  deleteTemplateApi,
  getTemplatesApi,
} from '../../../shared/api/templateApi'

import { useExerciseFlow } from '../../../shared/context/ExerciseFlowContext'

import { useStartWorkout } from '../hooks/useStartWorkout'

import { useWorkoutContext } from '../../../shared/context/WorkoutContext'

import {
  draftWorkoutStorage,
  hasTemplateDraftContent,
  hasWorkoutDraftContent,
} from '../../../shared/utils/storage/draftStorage'

import Button from '../../../shared/components/ui/button/Button'


import Header from '../../../shared/components/ui/Header'

import TemplateList from '../../template/components/TemplateList'

/**
 * Entry page for starting workouts.
 * @returns {import('react').ReactElement} Workout start page UI
 */
export default function WorkoutStartPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const { setReturnTo } = useExerciseFlow()

  const { draftTemplate } = useWorkoutContext()

  const { startWorkout } = useStartWorkout()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [templates, setTemplates] = useState([])

  const workout = draftWorkoutStorage.get()

  const hasWorkoutDraft = hasWorkoutDraftContent(workout)

  const hasTemplateDraft = hasTemplateDraftContent(draftTemplate)

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true)
        setError(null)

        const data = await getTemplatesApi({ limit: 100 })

        setTemplates(Array.isArray(data) ? data : data.results || [])
      } catch (err) {
        console.error(err)
        setError('Failed to load templates')
      } finally {
        setLoading(false)
      }
    }

    fetchTemplates()
  }, [])

  const handleDeleteTemplate = async (id) => {
    const confirmed = window.confirm('Delete this template?')

    if (!confirmed) {
      return
    }

    try {
      await deleteTemplateApi(id)

      setTemplates((prev) => prev.filter((template) => template._id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="app">

      <Header title="Start Workout" subtitle="Build your next session" />

      <div className="section">

        <div className="hero-actions">


          {/* START / CONTINUE WORKOUT */}

          <Button
            variant="cta"
            onClick={() => {
              if (!hasWorkoutDraft) {
                startWorkout({})
                return
              }

              navigate('/workouts/current/run')
            }}
          >
            <span className="hero-icon">▷</span>

            <span>
              {hasWorkoutDraft
                ? `Continue ${workout.name || 'Workout'}`
                : 'Start Empty Workout'}
            </span>
          </Button>

          {/* CREATE TEMPLATE */}

          <Button
            variant="cta"
            onClick={() => {
              setReturnTo(location.pathname)

              navigate('/templates/create')
            }}
          >
            <span className="hero-icon">+</span>

            <span>
              {hasTemplateDraft
                ? `Continue ${draftTemplate.name || 'Template'}`
                : 'New Workout Template'}
            </span>
          </Button>


        </div>

      </div>

      <div className="section template">

        {/* TEMPLATE LIST */}

        <TemplateList
          templates={templates}
          loading={loading}
          error={error}
          limit={5}
          onDeleteTemplate={handleDeleteTemplate}
        />

      </div>
    </div>
  )
}
