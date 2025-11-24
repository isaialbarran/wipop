'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from './AuthProvider'
import styles from './UserMenu.module.css'

export default function UserMenu() {
  const { user, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  if (!user) return null

  const handleSignOut = async () => {
    await signOut()
    setIsOpen(false)
  }

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase()
  }

  return (
    <div className={styles.menu} ref={dropdownRef}>
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={styles.avatar}>
          {getInitials(user.email || '')}
        </div>
        <span className={styles.name}>
          {user.user_metadata?.full_name || user.email}
        </span>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <button
            className={styles.dropdownItem}
            onClick={() => {
              setIsOpen(false)
              // Navigate to dashboard
              window.location.href = '/dashboard'
            }}
          >
            Dashboard
          </button>
          <button
            className={`${styles.dropdownItem} ${styles.signOut}`}
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}
