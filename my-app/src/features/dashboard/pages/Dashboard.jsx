import { Link } from 'react-router-dom'
import { Play, CalendarCheck2, Trophy, Activity } from 'lucide-react'
import StatCard from '../components/StatCard'
import { useDashboardStats } from '../hooks/useDashboardStats'

/**
 * Dashboard view displaying user statistics and quick navigation.
 * @returns {import('react').ReactElement} Dashboard UI
 */
export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'))

  const { stats, loading } = useDashboardStats()

  const activityData = stats?.currentWeek.activity ?? []

  const rawMax = Math.max(
    ...activityData.map((d) => d.minutes),
    1
  )

  const maxValue = Math.ceil(rawMax / 25) * 25

  const yAxisValues = Array.from(
    { length: 6 },
    (_, i) => Math.round((maxValue / 5) * (5 - i))
  )

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


  if (loading) return <p>Loading...</p>

  return (
    <div className="app">
      {/* Welcome section */}
      <div className="header-section">
        <p className="welcome">
          Welcome back{user?.username ? `, ${user.username}` : ''}
        </p>
        <p className="quote">"Progress is built one rep at a time"</p>
      </div>

      {/* Stats cards */}
      <div className="grid-base stats-grid">
        <StatCard
          label="Workouts this month"
          value={stats?.currentMonth.workouts ?? 0}
        />

        <StatCard
          label="Total minutes this month"
          value={stats?.currentMonth.durationMinutes ?? 0}
        />

        <StatCard
          label="Sets / Reps"
          value={`${stats?.currentMonth.sets ?? 0} / ${stats?.currentMonth.reps ?? 0}`}
        />

        <StatCard
          label="Total volume (kg)"
          value={`${stats?.currentMonth.volumeKg ?? 0}`}
        />
      </div>

      {/* Weekly activity */}
      <div className="section">
        <h3>Weekly Activity</h3>

        <div className="chart">
          <div className="y-axis">
            {yAxisValues.map((value) => (
              <span key={value}>{value}</span>
            ))}
          </div>

          <div className="graph">
            {activityData.map((d) => (
              <div
                key={d.day}
                className="column"
                title={`${d.minutes} min active`}
              >

                <div
                  className="bar"
                  style={{
                    height: `${(d.minutes / maxValue) * 120}px`,
                  }}
                />

                <span className="label">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="muted small center">Minutes active</p>
      </div>

      {/* Quick actions */}
      <div className="section">
        <h3>Quick Access</h3>

        <div className="grid-base stats-grid">
          <Link to="/exercises" className="card-base stat-card">
            <p className="quick-label">Exercises</p>
          </Link>

          <Link to="/calendar" className="card-base stat-card">
            <p className="quick-label">Calendar</p>
          </Link>
        </div>
      </div>

      {/* Monthly goal */}
      <div className="section">
        <h3>Monthly Goal</h3>
        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
        <p className="muted small">6 more to reach your milestone!</p>
      </div>

      {/* Achievements */}
      <div className="section">
        <h3>Recent Achievements</h3>

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
    </div>
  )
}
