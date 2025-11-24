'use client'

import { useState } from 'react'
import { Package } from '@/types/database'
import styles from './PackageCard.module.css'

interface PackageCardProps {
  package: Package
  onPurchase: (packageId: string) => void
  isPopular?: boolean
}

export default function PackageCard({ package: pkg, onPurchase, isPopular = false }: PackageCardProps) {
  const [loading, setLoading] = useState(false)

  const handlePurchase = async () => {
    setLoading(true)
    try {
      await onPurchase(pkg.id)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`${styles.card} ${isPopular ? styles.popular : ''}`}>
      {isPopular && (
        <div className={styles.popularBadge}>
          Most Popular
        </div>
      )}
      
      <div className={styles.header}>
        <h3 className={styles.name}>{pkg.name}</h3>
        <p className={styles.description}>{pkg.description}</p>
      </div>

      <div className={styles.price}>
        <div className={styles.priceAmount}>
          <span className={styles.priceCurrency}>€</span>
          {pkg.price}
        </div>
        <div className={styles.pricePeriod}>one-time payment</div>
      </div>

      <div className={styles.features}>
        <ul className={styles.featuresList}>
          {pkg.features.map((feature, index) => (
            <li key={index} className={styles.feature}>
              <svg
                className={styles.checkIcon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={handlePurchase}
        disabled={loading}
        className={`${styles.button} ${isPopular ? styles.popularButton : ''}`}
      >
        {loading ? 'Processing...' : 'Purchase Package'}
      </button>
    </div>
  )
}
