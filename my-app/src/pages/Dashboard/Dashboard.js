import { Link } from 'react-router-dom'
import {Play, CalendarCheck2, Trophy, Activity} from 'lucide-react'

/**
 * Dashboard view displaying user statistics and quick navigation.
 * @returns {import('react').ReactElement} Dashboard UI
 */
export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'))
  const maxValue = 120

  const data = [
    { day: 'Mon', value: 40 },
    { day: 'Tue', value: 60 },
    { day: 'Wed', value: 50 },
    { day: 'Thu', value: 90 },
    { day: 'Fri', value: 70 },
    { day: 'Sat', value: 110 },
    { day: 'Sun', value: 80 },
  ]

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
        <div className="card-base stat-card">
          <p className="stat-value">18</p>
          <p className="stat-label">Workouts this month</p>
        </div>

        <div className="card-base stat-card">
          <p className="stat-value">24</p>
          <p className="stat-label">Total hours this month</p>
        </div>

        <div className="card-base stat-card">
          <p className="stat-value">342</p>
          <p className="stat-label">Sets / 4,256 reps</p>
        </div>

        <div className="card-base stat-card">
          <p className="stat-value">12.4k</p>
          <p className="stat-label">Total volume (kg)</p>
        </div>
      </div>

      {/* Weekly activity */}
      <div className="section">
        <h3>Weekly Activity</h3>

        <div className="chart">
          <div className="y-axis">
            <span>120</span>
            <span>100</span>
            <span>80</span>
            <span>60</span>
            <span>40</span>
            <span>20</span>
            <span>0</span>
          </div>

          <div className="graph">
            {data.map((d) => (
              <div key={d.day} className="column">
                <div
                  className="bar"
                  style={{
                    height: `${(d.value / maxValue) * 120}px`,
                  }}
                ></div>
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
