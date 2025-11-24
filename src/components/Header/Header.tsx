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
          InnovaGestion
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
