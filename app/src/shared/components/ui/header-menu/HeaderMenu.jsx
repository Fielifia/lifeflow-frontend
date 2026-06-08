import { useEffect, useRef, useState } from 'react'

import Button from '../button/Button'

import './HeaderMenu.css'

const isTouchDevice =
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(hover: none)').matches

/**
 * Header dropdown menu.
 *
 * Used for profile menu, notifications
 * and other header-based dropdowns.
 * @param {object} props - Component props.
 * @param {import('react').ReactNode} props.children
 * Menu content.
 * @param {import('react').ReactNode} props.trigger
 * Trigger button content.
 * @param {'left'|'right'} [props.align]
 * Dropdown alignment.
 * @returns {import('react').ReactElement}
 * Header menu UI.
 */
export default function HeaderMenu({ children, trigger, align = 'right' }) {
  const [open, setOpen] = useState(false)

  const menuRef = useRef(null)

  useEffect(() => {
    if (!open) {
      return undefined
    }

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('pointerdown', handleClickOutside)

    return () => {
      document.removeEventListener('pointerdown', handleClickOutside)
    }
  }, [open])

  return (
    <div
      className="header-menu"
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
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen((prev) => !prev)}
      >
        {trigger}
      </Button>

      {open && (
        <div
          className={`
            header-menu-dropdown
            ${align}
          `}
        >
          {children}
        </div>
      )}
    </div>
  )
}
