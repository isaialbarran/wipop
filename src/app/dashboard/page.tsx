'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { useAuth } from '@/components/Auth/AuthProvider'
import Header from '@/components/Header/Header'
import { Order, Package } from '@/types/database'
import styles from './page.module.css'

interface OrderWithPackage extends Order {
  packages: Package
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<OrderWithPackage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const supabase = createClient()

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            packages (*)
          `)
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false })

        if (error) {
          setError('Failed to load orders')
        } else {
          setOrders(data || [])
        }
      } catch {
        setError('Failed to load orders')
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading && !user) {
      router.push('/auth')
      return
    }

    if (user) {
      fetchOrders()
    }
  }, [user, authLoading, router, supabase])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return styles.statusCompleted
      case 'pending':
        return styles.statusPending
      case 'failed':
        return styles.statusFailed
      default:
        return styles.statusPending
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed'
      case 'pending':
        return 'Pending'
      case 'failed':
        return 'Failed'
      default:
        return 'Unknown'
    }
  }

  if (authLoading || loading) {
    return (
      <div>
        <Header />
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <Header />
        <div className={styles.error}>
          <h1>Error</h1>
          <p>{error}</p>
          <button onClick={() => router.push('/')} className={styles.button}>
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>My Dashboard</h1>
          <p className={styles.subtitle}>
            Welcome back, {user?.user_metadata?.full_name || user?.email}!
          </p>
        </div>

        {orders.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>
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
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
              </svg>
            </div>
            <h2>No Orders Yet</h2>
            <p>You haven&apos;t purchased any consulting packages yet.</p>
            <button
              onClick={() => router.push('/')}
              className={styles.primaryButton}
            >
              Browse Packages
            </button>
          </div>
        ) : (
          <div className={styles.orders}>
            <h2 className={styles.sectionTitle}>Your Orders</h2>
            <div className={styles.ordersList}>
              {orders.map((order) => (
                <div key={order.id} className={styles.orderCard}>
                  <div className={styles.orderHeader}>
                    <h3 className={styles.orderTitle}>
                      {order.packages.name}
                    </h3>
                    <span className={`${styles.status} ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  
                  <p className={styles.orderDescription}>
                    {order.packages.description}
                  </p>
                  
                  <div className={styles.orderDetails}>
                    <div className={styles.detail}>
                      <span className={styles.label}>Amount:</span>
                      <span className={styles.value}>€{order.amount.toFixed(2)}</span>
                    </div>
                    <div className={styles.detail}>
                      <span className={styles.label}>Order Date:</span>
                      <span className={styles.value}>
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {order.stripe_payment_intent_id && (
                      <div className={styles.detail}>
                        <span className={styles.label}>Payment ID:</span>
                        <span className={styles.value}>
                          {order.stripe_payment_intent_id.slice(-8)}
                        </span>
                      </div>
                    )}
                  </div>

                  {order.status === 'completed' && (
                    <div className={styles.orderActions}>
                      <button className={styles.actionButton}>
                        Access Package
                      </button>
                      <button className={styles.actionButton}>
                        Download Invoice
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
