import { useProfileSettings } from '../hooks/useProfileSettings'

import { userStorage } from '../../../shared/utils/storage/userStorage'

import { useConfirm } from '../../../shared/hooks/useConfirm'

import DataState from '../../../shared/components/ui/skeleton/DataState'

import Header from '../../../shared/components/ui/Header'

import Button from '../../../shared/components/ui/button/Button'

import SettingInput from '../components/SettingInput'

import SettingToggle from '../components/SettingToggle'

import '../Profile.css'

/**
 * Displays the user profile and app settings page.
 * @returns {import('react').ReactElement} Profile page UI.
 */
export default function ProfilePage() {
  const { user, settings, loading, error, updateSettings, deleteAccount } =
    useProfileSettings()
  
  const confirm = useConfirm()

  const handleDeleteAccount = async () => {
    const confirmed = await confirm({
      title: 'Delete account?',
      text: 'This will permanently delete your account and all associated data.',
      confirmText: 'Delete account',
    })

    if (!confirmed) {
      return
    }

    await deleteAccount()

    userStorage.clear()

    window.location.href = '/login'
  }

  if (loading) {
    return (
      <DataState
        variant="card-template"
        loading={loading}
        error={error}
        data={user}
      />
    )
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

        <Button variant="danger" onClick={handleDeleteAccount}>
          Delete Account
        </Button>
      </div>
    </div>
  )
}
