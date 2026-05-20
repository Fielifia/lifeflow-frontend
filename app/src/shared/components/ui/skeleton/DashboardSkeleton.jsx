/**
 * Dashboard loading skeleton.
 * Mirrors the real dashboard layout.
 * @returns {import('react').ReactElement} Dashboard skeleton UI
 */
export default function DashboardSkeleton() {
  return (
    <div className="app">
      <div className="section dashboard-skeleton">

        {/* Welcome */}

        <div className="header-section">
          <p className="welcome">Welcome back</p>

          <div className="skeleton skeleton-quote" />
        </div>

        {/* Stats */}

        <div className="section">
          <h3>This month</h3>

          <div className="grid-base stats-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="skeleton skeleton-stat-card"
              />
            ))}
          </div>
        </div>

        {/* Weekly activity */}

        <div className="section">
          <h3>Weekly Activity</h3>

          <div className="chart">
            <div className="y-axis">
              {Array.from({ length: 6 }).map((_, i) => (
                <span key={i}> </span>
              ))}
            </div>

            <div className="graph">
              <div className="column">
                <div className="skeleton skeleton-bar h-20" />
                <span className="label">Mon</span>
              </div>

              <div className="column">
                <div className="skeleton skeleton-bar h-50" />
                <span className="label">Tue</span>
              </div>

              <div className="column">
                <div className="skeleton skeleton-bar h-80" />
                <span className="label">Wed</span>
              </div>

              <div className="column">
                <div className="skeleton skeleton-bar h-35" />
                <span className="label">Thu</span>
              </div>

              <div className="column">
                <div className="skeleton skeleton-bar h-100" />
                <span className="label">Fri</span>
              </div>

              <div className="column">
                <div className="skeleton skeleton-bar h-45" />
                <span className="label">Sat</span>
              </div>

              <div className="column">
                <div className="skeleton skeleton-bar h-70" />
                <span className="label">Sun</span>
              </div>
            </div>
          </div>

          <p className="muted small center">
            Minutes active
          </p>
        </div>

        {/* Quick access */}

        <div className="section">
          <h3>Quick Access</h3>

          <div className="grid-base stats-grid">
            <div className="skeleton skeleton-quick-card">
              <p className="quick-label">Exercise Library</p>
            </div>

            <div className="skeleton skeleton-quick-card">
              <p className="quick-label">Calendar</p>
            </div>
          </div>
        </div>

        {/* Monthly goal */}

        <div className="section">
          <h3>Monthly Goal</h3>

          <div className="progress-bar">
            <div className="skeleton skeleton-goal-fill" />
          </div>

          <div className="skeleton skeleton-goal-text" />
        </div>

        {/* Recent workouts */}
        
        <div className="section">
          <h3>Recent Workouts</h3>

          <div className="recent-workouts">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="skeleton skeleton-workout-card"
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
