import { Link } from 'react-router-dom'
import {
  Dumbbell,
  TrendingUp,
  Weight,
  Activity,
} from 'lucide-react'

import StatCard from './StatCard'
import MonthlyGoal from './MonthlyGoals'
import RecentWorkoutCard from './RecentWorkoutCard'

import {
  formatDuration,
  formatNumber,
  formatWeight,
} from '../../../shared/utils/format'

export default function DashboardContent({
  stats,
  user,
  recentWorkouts,
}) {
  const activityData = stats?.currentWeek?.activity ?? []

  const monthlyMinutes =
    stats?.currentMonth?.durationMinutes ?? 0

  const rawMax = Math.max(
    ...activityData.map((d) => d.minutes),
    1
  )

  const maxValue = Math.ceil(rawMax / 25) * 25

  const yAxisValues = Array.from(
    { length: 6 },
    (_, i) => Math.round((maxValue / 5) * (5 - i))
  )

  const hasWorkouts = (stats?.allTime?.workouts ?? 0) > 0
  const hasActivity = activityData.some((d) => d.minutes > 0)

  return (
    <div className="section">
      {/* Welcome section */}
      <div className="header-section">
        <p className="welcome">
          {hasWorkouts ? 'Welcome back' : 'Welcome'}
          {user?.username ? `, ${user.username}` : ''}
        </p>
        <p className="quote">"Progress is built one rep at a time"</p>
      </div>

      {/* Stats cards */}
      <h3>This month</h3>
      <div className="grid-base stats-grid">
        <StatCard
          label="Workouts"
          value={
            <div className="stat-with-icon">
              <Dumbbell className="stat-icon" />
              <span>{stats?.currentMonth?.workouts ?? 0}</span>
            </div>
          }
        />

        <StatCard
          label="Total time"
          value={
            <div className="stat-with-icon">
              <Activity className="stat-icon" />
              <span>{formatDuration(monthlyMinutes)}</span>
            </div>
          }
        />

        <StatCard
          label={`Sets / ${formatNumber(stats?.currentMonth?.reps ?? 0)} Reps`}
          value={
            <div className="stat-with-icon">
              <TrendingUp className="stat-icon" />
              <span>{formatNumber(stats?.currentMonth?.sets ?? 0)}</span>
            </div>
          }
        />

        <StatCard
          label="Total volume"
          value={
            <div className="stat-with-icon">
              <Weight className="stat-icon" />
              <span>{formatWeight(stats?.currentMonth?.volumeKg)}</span>
            </div>
          }
        />
      </div>

      {/* Weekly activity */}
      <div className="section">
        <h3>Weekly Activity</h3>

        {hasActivity ? (
          <>
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

            <p className="muted small center">
              Minutes active
            </p>
          </>
        ) : (
          <div className="empty-state">
            <p className="muted small center">
              Complete a workout to see your weekly activity
            </p>
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="section">
        <h3>Quick Access</h3>

        <div className="grid-base stats-grid">
          <Link to="/exercises" className="card-base stat-card">
            <p className="quick-label">Exercise Library</p>
          </Link>

          <Link to="/calendar" className="card-base stat-card">
            <p className="quick-label">Calendar</p>
          </Link>
        </div>
      </div>

      {/* Monthly goal */}
      <div className="section">
        <MonthlyGoal
          current={stats?.currentMonth?.workouts ?? 0}
          target={null}
        />
      </div>

      {/* Recent Workouts */}
      <div className="section">
        <h3>Recent Workouts</h3>

        <div className="recent-workouts">
          {recentWorkouts.map((workout) => (
            <Link
              key={workout._id}
              to={`/workouts/${workout._id}`}
              state={{ returnTo: '/' }}
            >
              <RecentWorkoutCard workout={workout} />
            </Link>
          ))}
        </div>
      </div>

    </div>
  )
}
