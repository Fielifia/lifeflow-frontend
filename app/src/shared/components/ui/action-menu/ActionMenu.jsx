import {
  useEffect,
  useRef,
  useState,
} from 'react'

import { EllipsisVertical } from 'lucide-react'

import Toggle from '../toggle/Toggle'

import './ActionMenu.css'

// ===== DEVICE DETECTION =====

const isTouchDevice =
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(hover: none)').matches

/**
 * Action menu item configuration.
 * @typedef {object} ActionMenuItem
 * @property {string} [id] - Unique item id
 * @property {string} [label] - Item label
 * @property {string} [subtitle] - Optional subtitle
 * @property {() => void} [onClick] - Click handler
 * @property {(value:boolean) => void} [onChange]
 * Toggle change handler
 * @property {boolean} [value] - Toggle value
 * @property {'toggle'} [type] - Item type
 * @property {boolean} [danger] - Danger styling
 * @property {boolean} [divider] - Divider item
 * @property {boolean} [disabled] - Disabled state
 * @property {boolean} [closeOnClick]
 * Whether menu closes after click
 * @property {import('lucide-react').LucideIcon} [icon]
 * Item icon
 */

/**
 * Dropdown action menu for contextual actions.
 * @param {object} props - Component props
 * @param {ActionMenuItem[]} props.items - Menu actions
 * @param {'default'|'profile'} [props.variant]
 * Menu trigger variant
 * @param {import('lucide-react').LucideIcon} [props.triggerIcon]
 * Trigger button icon
 * @param {'left'|'right'} [props.align]
 * Dropdown alignment
 * @param {(open:boolean)=>void} [props.onOpenChange]
 * Open state callback
 * @returns {import('react').ReactElement} Action menu UI
 */
export default function ActionMenu({
  items = [],
  variant = 'default',
  triggerIcon: TriggerIcon = EllipsisVertical,
  align = 'right',
  onOpenChange,
}) {
  const [open, setOpen] = useState(false)

  const menuRef = useRef(null)

  // ===== CLOSE ON OUTSIDE CLICK =====

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener(
      'click',
      handleClickOutside
    )

    return () => {
      document.removeEventListener(
        'click',
        handleClickOutside
      )
    }
  }, [])

  // ===== OPEN STATE CALLBACK =====

  useEffect(() => {
    onOpenChange?.(open)
  }, [open, onOpenChange])

  return (
    <div
      className="action-menu"
      ref={menuRef}
      onMouseEnter={() => {
        if (!isTouchDevice) {
          setOpen(true)
        }
      }}
      onMouseLeave={() => {
        if (!isTouchDevice) {
          setOpen(false)
        }
      }}
    >
      <button
        type="button"
        className={`
          action-menu-icon-button
          action-menu-${variant}
        `}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={(e) => {
          e.stopPropagation()

          setOpen((prev) => !prev)
        }}
      >
        <TriggerIcon className="action-menu-icon" />
      </button>

      {open && (
        <div
          role="menu"
          className={`action-menu-dropdown ${align}`}
          onClick={(e) => e.stopPropagation()}
        >
          {items.map((item, i) => {
            // ===== DIVIDER =====

            if (item.divider) {
              return (
                <div
                  role="separator"
                  key={`divider-${i}`}
                  className="action-menu-divider"
                />
              )
            }

            // ===== ITEM =====

            return (
              <button
                type="button"
                role={item.type === 'toggle' ? 'switch' : 'menuitem'}
                aria-checked={item.type === 'toggle' ? item.value : undefined}
                disabled={item.disabled}
                key={item.id || item.label || i}
                className={`
                  action-menu-item
                  ${item.danger ? 'danger' : ''}
                  ${item.disabled ? 'disabled' : ''}
                `}
                onClick={(e) => {
                  e.stopPropagation()

                  if (item.disabled) {
                    return
                  }

                  if (item.type === 'toggle') {
                    item.onChange?.(!item.value)
                  } else {
                    item.onClick?.()
                  }

                  if (item.closeOnClick !== false) {
                    setOpen(false)
                  }
                }}
              >
                <div className="action-menu-item-content">
                  {/* ICON */}

                  {item.icon && <item.icon className="icon-small" />}

                  {/* TEXT */}

                  <div className="action-menu-text">
                    <span>{item.label}</span>

                    {item.subtitle && (
                      <span className="action-menu-subtitle">
                        {item.subtitle}
                      </span>
                    )}
                  </div>

                  {/* TOGGLE */}

                  {item.type === 'toggle' && <Toggle active={item.value} />}
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
