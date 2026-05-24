import { Link } from 'react-router-dom'
import {
  Activity,
  Award,
  Clock3,
  Dumbbell,
  TrendingUp,
  Weight,
  Search,
  CalendarDays,
} from 'lucide-react'

import StatsGrid from '../../../shared/components/ui/statsgrid/StatsGrid'
import MonthlyGoal from './MonthlyGoals'
import RecentWorkoutCard from './RecentWorkoutCard'

import {
  formatDuration,
  formatNumber,
  formatWeight,
} from '../../../shared/utils/format'

/**
 * Dashboard main content.
 * @param {object} props - Component props
 * @param {object} props.stats - Dashboard statistics
 * @param {object} props.user - Current user
 * @param {Array<object>} props.recentWorkouts - Recent workouts
 * @returns {import('react').ReactElement} Dashboard UI
 */
export default function DashboardContent({ stats, user, recentWorkouts }) {
  const activityData = stats?.currentWeek?.activity ?? []

  const monthlyMinutes = stats?.currentMonth?.durationMinutes ?? 0

  const rawMax = Math.max(...activityData.map((d) => d.minutes), 1)

  const maxValue = Math.ceil(rawMax / 25) * 25

  const MAX_RECENT_WORKOUTS = 5

  const displayedWorkouts = recentWorkouts.slice(0, MAX_RECENT_WORKOUTS)

  const yAxisValues = Array.from({ length: 6 }, (_, i) =>
    Math.round((maxValue / 5) * (5 - i)),
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
      <StatsGrid
        items={[
          {
            icon: Dumbbell,
            label: 'Workouts',
            value: stats?.currentMonth?.workouts ?? 0,
            emphasis: 'large',
          },
          {
            icon: Activity,
            label: 'Total time',
            value: formatDuration(monthlyMinutes),
            emphasis: 'large',
          },
          {
            icon: TrendingUp,
            label: `Sets / ${formatNumber(stats?.currentMonth?.reps ?? 0)} Reps`,
            value: formatNumber(stats?.currentMonth?.sets ?? 0),
            emphasis: 'large',
          },
          {
            icon: Weight,
            label: 'Total volume',
            value: formatWeight(stats?.currentMonth?.volumeKg),
            emphasis: 'large',
          },
          {
            icon: Award,
            label: 'Personal Bests',
            value: stats?.currentMonth?.personalBests ?? 0,
          },
          {
            icon: Clock3,
            label: 'Days since last workout',
            value: stats?.daysSinceLastWorkout,
          },
        ]}
      />

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

            <p className="muted small center">Minutes active</p>
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

        <div className="grid-base quick-labels">
          <Link to="/exercises" className="card-base stat-card card-clickable">
            <div className="quick-label">
              <Search className="action-icon" />
              <span>Exercise Library</span>
            </div>
          </Link>

          <Link to="/calendar" className="card-base stat-card card-clickable">
            <div className="quick-label">
              <CalendarDays className="action-icon" />
              <span>Calendar</span>
            </div>
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

        {displayedWorkouts.map((workout) => (
          <Link key={workout._id} to={`/workouts/${workout._id}`}>
            <RecentWorkoutCard workout={workout} />
          </Link>
        ))}
      </div>
    </div>
  )
}
