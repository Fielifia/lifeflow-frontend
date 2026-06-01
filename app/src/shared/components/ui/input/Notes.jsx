import { useEffect, useRef } from 'react'

/**
 * Description:
 * Note input with automatic height adjustment and character counter.
 * @param {object} props - Component props.
 * @param {string} props.value - Current note value.
 * @param {(value: string) => void} props.onChange - Change handler.
 * @param {string} [props.placeholder] - Placeholder text.
 * @param {number} [props.maxLength] - Maximum allowed characters.
 * @returns {import('react').ReactElement} Notes component.
 */
export default function Notes({
  value,
  onChange,
  placeholder = 'Notes...',
  maxLength = 500,
}) {
  const textareaRef = useRef(null)

  useEffect(() => {
    if (!textareaRef.current) {
      return
    }

    textareaRef.current.style.height = 'auto'
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
  }, [value])

  return (
    <div className="notes">
      <textarea
        ref={textareaRef}
        className="input-base textarea"
        value={value}
        placeholder={placeholder}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
      />

      <p className="notes-counter close muted">
        {value.length}/{maxLength}
      </p>
    </div>
  )
}
