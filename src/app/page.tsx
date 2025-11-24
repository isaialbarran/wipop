'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { Package } from '@/types/database'
import Header from '@/components/Header/Header'
import PackageCard from '@/components/PackageCard/PackageCard'
import { useAuth } from '@/components/Auth/AuthProvider'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

export default function HomePage() {
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const { data, error } = await supabase
          .from('packages')
          .select('*')
          .eq('is_active', true)
          .order('price', { ascending: true })

        if (error) {
          console.error('Error fetching packages:', error)
        } else {
          setPackages(data || [])
        }
      } catch (error) {
        console.error('Error fetching packages:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPackages()
  }, [supabase])

  const handlePurchase = async (packageId: string) => {
    if (!user) {
      router.push('/auth')
      return
    }

    // Navigate to checkout
    router.push(`/checkout/${packageId}`)
  }

  return (
    <div>
      <Header />
      
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <h1 className={styles.heroTitle}>
            Professional Consulting Services
          </h1>
          <p className={styles.heroSubtitle}>
            Transform your business with our expert consulting packages. 
            Choose the perfect plan to accelerate your growth and achieve your goals.
          </p>
          <a href="#packages" className={styles.heroButton}>
            View Packages
          </a>
        </div>
      </section>

      <section id="packages" className={styles.packages}>
        <div className={styles.packagesContainer}>
          <h2 className={styles.sectionTitle}>Our Consulting Packages</h2>
          <p className={styles.sectionSubtitle}>
            Select the package that best fits your business needs and budget
          </p>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              Loading packages...
            </div>
          ) : (
            <div className={styles.packagesGrid}>
              {packages.map((pkg, index) => (
                <PackageCard
                  key={pkg.id}
                  package={pkg}
                  onPurchase={handlePurchase}
                  isPopular={index === 1} // Make the middle package popular
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="about" className={styles.about}>
        <div className={styles.aboutContainer}>
          <div className={styles.aboutContent}>
            <h2>Why Choose Our Consulting Services?</h2>
            <p>
              With years of experience in business transformation, our team of experts 
              provides tailored solutions that drive real results. We combine strategic 
              thinking with practical implementation to help your business thrive.
            </p>
            <p>
              Our proven methodologies and industry expertise ensure that every 
              consulting engagement delivers measurable value and sustainable growth 
              for your organization.
            </p>
          </div>
          <div className={styles.aboutImage}>
            Professional Consulting
          </div>
        </div>
      </section>

      <section id="contact" className={styles.contact}>
        <div className={styles.contactContainer}>
          <div className={styles.contactContent}>
            <h2>Ready to Get Started?</h2>
            <p>
              Have questions about our consulting packages? Need a custom solution? 
              Our team is here to help you find the perfect consulting approach for your business.
            </p>
            <a href="mailto:contact@nodexservices.com" className={styles.contactButton}>
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}