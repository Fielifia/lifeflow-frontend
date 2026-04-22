import Header from './Header'
/**
 * Dashboard view shown after successful login.
 * @param {{ setUser: (value: boolean) => void }} props - Function to update authentication state
 * @returns {import('react').ReactElement} The rendered dashboard UI
 */
export default function Dashboard({ setUser }) {
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

  return (
    <div className="app">
      {/* Header */}
      <Header setUser={setUser} />

      {/* Welcome section */}
      <div className="header-section">
        <p className="welcome">
          Welcome back{user?.username ? `, ${user.username}` : ''}
        </p>
        <p className="quote">&apos;Progress is built one rep at a time&apos;</p>
      </div>

      {/* Stats cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-value">18</p>
          <p className="stat-label">Workouts this month</p>
        </div>

        <div className="stat-card">
          <p className="stat-value">24</p>
          <p className="stat-label">Total hours this month</p>
        </div>

        <div className="stat-card">
          <p className="stat-value">342</p>
          <p className="stat-label">Sets / 4,256 reps</p>
        </div>

        <div className="stat-card">
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

        <div className="achievements-grid">
          {['First Workout', '7 Day Streak', '100kg Club', 'Early Bird'].map(
            (title) => (
              <div key={title} className="achievement-card">
                <div className="icon"></div>
                <p className="achievement-title">{title}</p>
                <p className="muted small">Achievement unlocked</p>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  )
}
