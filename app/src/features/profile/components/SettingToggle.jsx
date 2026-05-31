import Toggle from '../../../shared/components/ui/toggle/Toggle'

/**
 * Displays a toggle setting row.
 * @param {object} props - Component props.
 * @param {string} props.label - Setting label.
 * @param {boolean} props.checked - Toggle state.
 * @param {(checked:boolean)=>void} props.onChange
 * Toggle change handler.
 * @returns {import('react').ReactElement} Setting toggle row UI.
 */
export default function SettingToggle({ label, checked, onChange }) {
  return (
    <div className="settings-row">
      <button
        type="button"
        className="settings-toggle"
        onClick={() => onChange(!checked)}
      >
        <span>{label}</span>

        <Toggle active={checked} />
      </button>
    </div>
  )
}
