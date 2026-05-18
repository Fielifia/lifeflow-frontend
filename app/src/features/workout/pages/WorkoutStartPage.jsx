import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { useExerciseFlow } from '../../../shared/context/ExerciseFlowContext'
import { useStartWorkout } from '../hooks/useStartWorkout'

import { getTemplatesApi } from '../../../shared/api/templateApi'
import DataState from '../../../shared/components/ui/DataState'
import Header from '../../../shared/components/ui/Header'
import { useWorkoutContext } from '../../../shared/context/WorkoutContext'
import {
  draftWorkoutStorage,
  hasTemplateDraftContent,
  hasWorkoutDraftContent,
} from '../../../shared/utils/storage/draftStorage'
import TemplateList from '../../template/components/TemplateList'

/**
 * Entry page for starting workouts.
 * @returns {import('react').ReactElement} Workout start page UI
 */
export default function WorkoutStartPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const { setReturnTo } = useExerciseFlow()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [templates, setTemplates] = useState([])

  const { draftTemplate } = useWorkoutContext()
  const { startWorkout } = useStartWorkout()

  const workout = draftWorkoutStorage.get()
  const hasWorkoutDraft = hasWorkoutDraftContent(workout)

  const hasTemplateDraft = hasTemplateDraftContent(draftTemplate)

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true)
        setError(null)

        const data = await getTemplatesApi({ limit: 5 })

        setTemplates(data.results || [])
      } catch (err) {
        console.error(err)
        setError('Failed to load templates')
      } finally {
        setLoading(false)
      }
    }

    fetchTemplates()
  }, [])

  return (
    <div className="app">
      <Header title="Start Workout" subtitle="Build your next session" />

      <div className="section">
        <div className="hero-actions">
          
          {/* START / CONTINUE WORKOUT */}
          <button
            className="btn hero-btn hero-btn-primary"
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
          </button>

          {/* TEMPLATE */}
          <button
            className="btn hero-btn hero-btn-secondary"
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
          </button>
        </div>

        <div className="section template">
          <DataState
            loading={loading}
            error={error}
            data={templates}
            variant="card-template"
            emptyText="No templates found"
            count={4}
          >
            <TemplateList templates={templates.slice(0, 3)} />
          </DataState>
        </div>
      </div>
    </div>
  )
}
