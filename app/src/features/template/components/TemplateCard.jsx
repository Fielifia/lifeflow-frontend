import { useStartWorkout } from '../../workout/hooks/useStartWorkout'
import TemplateControls from './TemplateControls'

export default function TemplateCard({ template, onClick }) {
  const exercises = template.exercises || []
  const { startWorkout } = useStartWorkout()

  return (
    <div className="card-base template-card clickable" onClick={onClick}>

      {/* HEADER */}
      <div className="template-card-header">
        <div className="template-card-header-content">
          <h3>{template.name}</h3>
          <p className="muted small">
            Last: X days ago
          </p>
        </div>

        <button className="btn-clean btn-dots">⋮</button>
      </div>

      <ul className="template-card-exercise-list">
        {exercises.slice(0, 3).map((ex, i) => (
          <li key={i}>{ex.name}</li>
        ))}
      </ul>

      {exercises.length > 2 && (
        <p className="muted small center">
          And {exercises.length - 2} more ..
        </p>
      )}

      <TemplateControls
        onStartWorkout={(e) => {
          e.stopPropagation()
          startWorkout({ template })
        }}
        hasExercises={exercises.length > 0}
      />
    </div>
  )
}
