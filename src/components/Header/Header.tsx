'use client'

import Link from 'next/link'
import { useAuth } from '@/components/Auth/AuthProvider'
import UserMenu from '@/components/Auth/UserMenu'
import styles from './Header.module.css'

export default function Header() {
  const { user } = useAuth()

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <svg
            className={styles.logoIcon}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 2L38 12V28L20 38L2 28V12L20 2Z"
              stroke="url(#gradient)"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M20 10L30 16V24L20 30L10 24V16L20 10Z"
              fill="url(#gradient)"
            />
            <circle
              cx="20"
              cy="20"
              r="4"
              fill="white"
            />
            <defs>
              <linearGradient id="gradient" x1="2" y1="2" x2="38" y2="38" gradientUnits="userSpaceOnUse">
                <stop stopColor="#06b6d4" />
                <stop offset="1" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          <span>InnovaGestion</span>
        </Link>

        <nav className={styles.nav}>
          <Link href="/#cursos" className={styles.navLink}>
            Cursos
          </Link>
        </nav>

        <div className={styles.authSection}>
          {user ? (
            <UserMenu />
          ) : (
            <>
              <Link href="/auth" className={styles.signInButton}>
                Iniciar Sesión
              </Link>
              <Link href="/auth" className={styles.signUpButton}>
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
