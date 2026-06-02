import { useProfileSettings } from '../hooks/useProfileSettings'

import DataState from '../../../shared/components/ui/skeleton/DataState'

import Header from '../../../shared/components/ui/Header'

import SettingInput from '../components/SettingInput'

import SettingToggle from '../components/SettingToggle'

import '../Profile.css'

/**
 * Displays the user profile and app settings page.
 * @returns {import('react').ReactElement} Profile page UI.
 */
export default function ProfilePage() {
  const { user, settings, loading, error, updateSettings } = useProfileSettings()

  if (loading) {
    return <DataState variant='card-template' loading={loading} error={error} data={user} />
  }

  if (!user || !settings) {
    return (
      <div className="app">
        <Header subtitle="Profile" />

        <div className="empty-state">
          <h3>Profile unavailable</h3>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <Header subtitle="Profile" />

      <div className="profile-header">
        <div>
          <h1>{user.username}</h1>

          <p className="muted">{user.email}</p>
        </div>
      </div>

      <h2>Workout Settings</h2>
      <div className="section">
        <div className="settings-list">
          <SettingInput
            label="Monthly goal"
            value={settings.monthlyGoal}
            suffix="workouts"
            onSave={(value) =>
              updateSettings({
                monthlyGoal: value,
              })
            }
          />

          <SettingInput
            label="Default rest time"
            value={settings.defaultRestTime}
            suffix="s"
            onSave={(value) =>
              updateSettings({
                defaultRestTime: value,
              })
            }
          />

          <SettingToggle
            label="Rest timer"
            checked={settings.restTimerEnabled}
            onChange={(checked) =>
              updateSettings({
                restTimerEnabled: checked,
              })
            }
          />

          <SettingToggle
            label="Sound effects"
            checked={settings.soundEnabled}
            onChange={(checked) =>
              updateSettings({
                soundEnabled: checked,
              })
            }
          />
        </div>
      </div>
    </div>
  )
}
