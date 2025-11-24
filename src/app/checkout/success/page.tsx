'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Header from '@/components/Header/Header'
import Stripe from 'stripe'
import styles from './page.module.css'

function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<Stripe.Checkout.Session | null>(null)
  const [error, setError] = useState('')

  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch(`/api/checkout-session?session_id=${sessionId}`)
        const data = await response.json()
        
        if (data.error) {
          setError(data.error)
        } else {
          setSession(data.session)
        }
      } catch {
        setError('Failed to verify payment')
      } finally {
        setLoading(false)
      }
    }

    if (sessionId) {
      fetchSession()
    } else {
      setError('No session ID provided')
      setLoading(false)
    }
  }, [sessionId])

  if (loading) {
    return (
      <div>
        <Header />
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Verifying your payment...</p>
        </div>
      </div>
    )
  }

  if (error || !session) {
    return (
      <div>
        <Header />
        <div className={styles.error}>
          <h1>Payment Verification Failed</h1>
          <p>{error || 'Unable to verify your payment'}</p>
          <button onClick={() => router.push('/dashboard')} className={styles.button}>
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.successIcon}>
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
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22,4 12,14.01 9,11.01" />
            </svg>
          </div>
          
          <h1 className={styles.title}>Payment Successful!</h1>
          <p className={styles.message}>
            Thank you for your purchase. Your consulting package has been activated 
            and you can now access it from your dashboard.
          </p>
          
          <div className={styles.details}>
            <div className={styles.detail}>
              <span className={styles.label}>Amount Paid:</span>
              <span className={styles.value}>
                €{((session.amount_total || 0) / 100).toFixed(2)}
              </span>
            </div>
            <div className={styles.detail}>
              <span className={styles.label}>Payment Method:</span>
              <span className={styles.value}>
                {session.payment_method_types[0]?.toUpperCase()}
              </span>
            </div>
          </div>
          
          <div className={styles.actions}>
            <button
              onClick={() => router.push('/dashboard')}
              className={styles.primaryButton}
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => router.push('/')}
              className={styles.secondaryButton}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div>
        <Header />
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading...</p>
        </div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  )
}
