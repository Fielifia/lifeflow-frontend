import {
  useEffect,
  useRef,
  useState

} from 'react'

import { EllipsisVertical } from 'lucide-react'

/**
 * Dropdown action menu for contextual actions.
 * @param {object} props - Component props
 * @param {Array<{
 *  label:string,
 *  onClick?:()=>void,
 *  icon?:import('lucide-react').LucideIcon,
 *  danger?:boolean
 * }>} props.items - Menu actions
 * @param {(open:boolean)=>void} [props.onClickChange] - Open state callback
 * @returns {import('react').ReactElement} Action menu UI
 */
export default function ActionMenu({ items = [], onClickChange }) {

  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  // ===== CLOSE ON OUTSIDE CLICK =====

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)

    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  // ===== OPEN STATE CALLBACK =====

  useEffect(() => {
    onClickChange?.(open)
  }, [open, onClickChange])


  // ===== DEVICE DETECTION =====
  
  const isTouchDevice = window.matchMedia('(hover: none)').matches

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
        className={`btn btn-dots ${open ? 'hidden' : ''}`}
        onClick={(e) => {
          e.stopPropagation()
          setOpen((prev) => !prev)
        }}
      >
        <EllipsisVertical className="action-menu-dots" />
      </button>

      {open && (
        <div
          className="action-menu-dropdown"
          onClick={(e) => e.stopPropagation()}
        >
          {items.map((item) => (
            <button
              type="button"
              key={item.label}
              className={`action-menu-item ${item.danger ? 'danger' : ''}`}
              onClick={(e) => {
                e.stopPropagation()

                item.onClick?.()

                setOpen(false)
              }}
            >
              <div className="action-menu-item-content">
                {item.icon && <item.icon className="icon-small" />}
                <span>{item.label}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
