'use client'

import { useRouter } from 'next/navigation'
import Header from '@/components/Header/Header'
import styles from './page.module.css'

export default function CheckoutCancelPage() {
  const router = useRouter()

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.cancelIcon}>
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          
          <h1 className={styles.title}>Payment Cancelled</h1>
          <p className={styles.message}>
            Your payment was cancelled. No charges have been made to your account.
            You can try again anytime or explore our other consulting packages.
          </p>
          
          <div className={styles.actions}>
            <button
              onClick={() => router.push('/')}
              className={styles.primaryButton}
            >
              Back to Packages
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className={styles.secondaryButton}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
