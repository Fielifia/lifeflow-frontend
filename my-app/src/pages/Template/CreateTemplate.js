import WorkoutEditor from '../Workout/WorkoutEditor'
import { createTemplate } from '../../api/templateApi'
import { useNavigate } from 'react-router-dom'

/**
 *
 */
export default function CreateTemplate() {
  const navigate = useNavigate()

  const handleSaveTemplate = async (workout) => {
    try {

      await createTemplate({
        name: workout.name || 'Workout',
        exercises: workout.exercises,
      })

      navigate('/templates')
    } catch (err) {
      console.error(err)
      alert(err.message || 'Failed to create template')
    }
  }

  return <WorkoutEditor mode="template" onSaveTemplate={handleSaveTemplate} />
}
