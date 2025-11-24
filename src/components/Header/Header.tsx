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
          NodeX Services
        </Link>

        <nav className={styles.nav}>
          <Link href="/#packages" className={styles.navLink}>
            Packages
          </Link>
          <Link href="/#about" className={styles.navLink}>
            About
          </Link>
          <Link href="/#contact" className={styles.navLink}>
            Contact
          </Link>
        </nav>

        <div className={styles.authSection}>
          {user ? (
            <UserMenu />
          ) : (
            <>
              <Link href="/auth" className={styles.signInButton}>
                Sign In
              </Link>
              <Link href="/auth" className={styles.signUpButton}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
