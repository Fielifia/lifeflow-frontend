import { useStartWorkout } from '../../workout/hooks/useStartWorkout'
import TemplateControls from './TemplateControls'

export default function TemplateCard({ template, onClick }) {
  const exercises = template.exercises || []
  const { startWorkout } = useStartWorkout()

  return (
    <div className="card-base template-card clickable" onClick={onClick}>
      <div className="template-header">
        <div>
          <h3>{template.name}</h3>
          <p className="muted small">
            {exercises.length} exercises • Last: – days ago
          </p>
        </div>

        <button className="btn-clean btn-dots">⋮</button>
      </div>

      <ul className="template-list">
        {exercises.slice(0, 4).map((ex, i) => (
          <li key={i}>{ex.name}</li>
        ))}
      </ul>

      <TemplateControls
        onStartWorkout={(e) => {
          e.stopPropagation()
          startWorkout({ template })
        }}
      />
    </div>
  )
}
