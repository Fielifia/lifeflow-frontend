import { Award } from 'lucide-react'
export default function MonthlyGoal({
  current,
  target,
}) {
  const progress = target
    ? Math.min((current / target) * 100, 100)
    : 0

  const remaining = Math.max(target - current, 0)

  return (
    <div className="section">
      <h3>Monthly Goal</h3>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="muted small">
        {!target
          ? 'Set a monthly goal to start tracking your progress'
          : remaining > 0
            ? `${remaining} workouts left to reach your goal`
            : (
              <span className="goal-complete">
                <Award size={14} />
                Monthly goal completed
              </span>
            )}
      </p>
    </div>
  )
}
