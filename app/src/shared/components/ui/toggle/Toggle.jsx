import './Toggle.css'

/**
 * Displays a small toggle switch.
 * @param {object} props - Component props.
 * @param {boolean} props.active - Toggle state.
 * @returns {import('react').ReactElement} Toggle UI.
 */
export default function Toggle({ active }) {
  return (
    <div
      className={`
        toggle
        ${active ? 'active' : ''}
      `}
    />
  )
}
