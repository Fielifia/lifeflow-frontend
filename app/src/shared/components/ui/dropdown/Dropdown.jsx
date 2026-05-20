// shared/components/ui/dropdown/Dropdown.jsx

import {
  useEffect,
  useRef,
  useState,
} from 'react'

import { ChevronDown, Check } from 'lucide-react'

/**
 * Reusable custom dropdown component.
 * @param {object} props - Component props
 * @param {string} props.label - Default dropdown label
 * @param {Array<{
 *   label: string,
 *   value: string,
 *   type?: 'group'
 * }>} props.items - Dropdown items
 * @param {string} [props.selected] - Selected value
 * @param {(value: string) => void} props.onSelect - Select callback
 * @param {string} [props.className] - Additional class names
 * @returns {import('react').ReactElement} Dropdown UI
 */
export default function Dropdown({
  label,
  items,
  selected,
  onSelect,
  className = '',
}) {
  const [isOpen, setIsOpen] =
    useState(false)

  const dropdownRef = useRef(null)

  // ===== CLOSE ON OUTSIDE CLICK =====

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener(
      'mousedown',
      handleClickOutside,
    )

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside,
      )
    }
  }, [])

  return (
    <div
      className={`dropdown ${className}`}
      ref={dropdownRef}
    >
      {/* TRIGGER */}

      <button
        type="button"
        className={`
          dropdown-trigger
          ${selected ? 'active' : ''}
        `}
        onClick={() =>
          setIsOpen((prev) => !prev)
        }
      >
        <span>{label}</span>

        <ChevronDown
          size={16}
          className={`
            dropdown-icon
            ${isOpen ? 'open' : ''}
          `}
        />
      </button>

      {/* MENU */}

      {isOpen && (
        <div className="dropdown-menu">

          {items.map((item) => {

            // ===== GROUP =====

            if (item.type === 'group') {
              return (
                <div
                  key={item.value}
                  className="dropdown-group"
                >
                  {item.label}
                </div>
              )
            }

            // ===== ITEM =====

            const isSelected =
              selected === item.value

            return (
              <button
                key={item.value}
                type="button"
                className={`
                  dropdown-item
                  ${isSelected ? 'selected' : ''}
                `}
                onClick={() => {
                  onSelect(item.value)
                  setIsOpen(false)
                }}
              >
                <span>
                  {item.label}
                </span>

                {isSelected && (
                  <Check size={16} />
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
