import { useEffect, useState } from 'react'

/**
 * Displays editable monthly workout goal.
 * @param {object} props - Component props.
 * @param {number} props.value - Monthly goal value.
 * @param {(value:number)=>void} props.onSave
 * Save handler.
 * @returns {import('react').ReactElement} Goal card UI.
 */
export default function GoalCard({ value, onSave }) {
  const [editing, setEditing] = useState(false)

  const [goal, setGoal] = useState(value)

  useEffect(() => {
    setGoal(value)
  }, [value])

  const handleSave = () => {
    const normalizedGoal = Number.isNaN(goal) ? 0 : goal

    if (normalizedGoal !== value) {
      onSave(normalizedGoal)
    }

    setEditing(false)
  }

  return (
    <div className="settings-row">
      <span>Monthly goal</span>

      {editing ? (
        <div className="profile-goal-field">
          <input
            type="number"
            min="0"
            autoFocus
            className="profile-goal-input"
            value={goal}
            onFocus={(e) => e.target.select()}
            onChange={(e) => {
              setGoal(Number(e.target.value))
            }}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.target.blur()
              }
            }}
          />

          <span className="muted small"> workouts</span>
        </div>
      ) : (
        <button
          type="button"
          className="btn btn-sm btn-secondary"
          onClick={() => setEditing(true)}
        >
          {goal} workouts
        </button>
      )}
    </div>
  )
}
