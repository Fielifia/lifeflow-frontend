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
  const {
    user,
    settings,
    loading,
    error,
    updateSettings,
    updateUserInformation,
    deleteAccount,
    deleteWorkoutHistory,
    deleteTemplates,
  } = useProfileSettings()

  const confirm = useConfirm()

  // ===== HANDLERS =====

  // ===== DELETE WORKOUT HISTORY =====

  const handleDeleteWorkoutHistory = async () => {
    const confirmed = await confirm({
      title: 'Delete workout history?',
      text: 'This will permanently delete all your past workouts and cannot be undone.',
      confirmText: 'Delete history',
    })

    if (!confirmed) {
      return
    }

    await deleteWorkoutHistory()
  }

  // ===== DELETE TEMPLATES =====
  const handleDeleteTemplates = async () => {
    const confirmed = await confirm({
      title: 'Delete workout templates?',
      text: 'This will permanently delete all your workout templates and cannot be undone.',
      confirmText: 'Delete templates',
    })

    if (!confirmed) {
      return
    }

    await deleteTemplates()
  }

  // ===== DELETE ACCOUNT =====
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

  // ===== RENDER =====

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
        <Header subtitle={`${user.username}'s Profile`} />

        <div className="empty-state">
          <h3>Profile unavailable</h3>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <Header subtitle={`${user.username}'s Profile`} />

      <div className="profile-header">
        <h1>Profile</h1>
      </div>

      <div className="section">
        <h2>User Information</h2>
        <SettingInput
          label="Username"
          value={user.username}
          type="text"
          onSave={(value) => updateUserInformation({ username: value })}
        />
        <SettingInput
          label="Email"
          value={user.email}
          type="email"
          onSave={(value) => updateUserInformation({ email: value })}
        />
      </div>

      <div className="section">
        <h2>Workout Settings</h2>
        <div className="settings-list">
          <SettingInput
            label="Monthly goal"
            value={settings.monthlyGoal}
            suffix="workouts"
            type="number"
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
            type="number"
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

        <div className="danger-zone">
          <h2>Danger Zone</h2>
          <div className="danger-zone-actions">
            <Button
              variant="danger"
              size="sm"
              onClick={handleDeleteWorkoutHistory}
            >
              Delete Workout History
            </Button>

            <Button variant="danger" size="sm" onClick={handleDeleteTemplates}>
              Delete Workout Templates
            </Button>

            <Button
              variant="danger"
              size="sm"
              fullWidth
              onClick={handleDeleteAccount}
            >
              Delete My Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
