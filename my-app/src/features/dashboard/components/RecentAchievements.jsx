import {
  Play,
  CalendarCheck2,
  Trophy,
  Activity,
} from 'lucide-react'
  
  const ACHIEVEMENT_ICONS = {
    FIRST_WORKOUT: Play,
    CONSISTENCY_10: CalendarCheck2,
    NEW_PR: Trophy,
    GOAL_CRUSHER: Activity,
  }

  const achievements = [
    { type: 'FIRST_WORKOUT', title: 'First Workout' },
    { type: 'CONSISTENCY_10', title: 'Consistency Beginner' },
    { type: 'NEW_PR', title: 'New PR' },
    { type: 'GOAL_CRUSHER', title: 'Goal Crusher' },
  ]


{/* Achievements */}
      <div className="section">
        <h3>Recent Achievements – placeholders</h3>

        <div className="grid-base achievements-grid">
          {achievements.map((a) => {
            const Icon = ACHIEVEMENT_ICONS[a.type]

            return (
              <div key={a.type} className="card-base achievement-card">
                <div className="icon">{Icon && <Icon size={20} />}</div>
                <p className="achievement-title">{a.title}</p>
              </div>
            )
          })}
        </div>
      </div>
