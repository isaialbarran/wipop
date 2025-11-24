'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/Auth/AuthProvider'
import LoginForm from '@/components/Auth/LoginForm'
import styles from './page.module.css'

export default function AuthPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  if (user) {
    return null // Will redirect
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Welcome to InnovaGestion</h1>
        <p className={styles.subtitle}>
          Sign in to your account or create a new one to get started
        </p>
        <LoginForm />
      </div>
    </div>
  )
}
