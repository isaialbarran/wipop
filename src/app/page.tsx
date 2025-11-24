'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { Package } from '@/types/database'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
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
            Innovación en Gestión Empresarial
          </h1>
          <p className={styles.heroSubtitle}>
            Transformamos tu negocio con nuestros cursos especializados.
            Elige el curso perfecto para acelerar tu crecimiento y alcanzar tus objetivos.
          </p>
          <a href="#cursos" className={styles.heroButton}>
            Ver Cursos
          </a>
        </div>
      </section>

      <section id="cursos" className={styles.packages}>
        <div className={styles.packagesContainer}>
          <h2 className={styles.sectionTitle}>Nuestros Cursos</h2>
          <p className={styles.sectionSubtitle}>
            Selecciona el curso que mejor se adapte a tus necesidades y objetivos de aprendizaje
          </p>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              Cargando cursos...
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
            <h2>¿Por qué elegir nuestros cursos?</h2>
            <p>
              Con años de experiencia en formación empresarial, nuestro equipo de expertos
              ofrece cursos especializados que generan resultados reales. Combinamos
              conocimiento teórico con aplicación práctica para ayudarte a alcanzar tus metas profesionales.
            </p>
            <p>
              Nuestros programas de formación probados y experiencia en la industria aseguran que cada
              curso entregue valor medible y desarrollo profesional continuo
              para ti y tu organización.
            </p>
          </div>
          <div className={styles.aboutImage}>
            Formación Profesional
          </div>
        </div>
      </section>

      <section id="contact" className={styles.contact}>
        <div className={styles.contactContainer}>
          <div className={styles.contactContent}>
            <h2>¿Listo para comenzar?</h2>
            <p>
              ¿Tienes preguntas sobre nuestros cursos? ¿Necesitas información personalizada?
              Nuestro equipo está aquí para ayudarte a encontrar el curso perfecto para tu desarrollo profesional.
            </p>
            <a href="mailto:contacto@innovagestion.com" className={styles.contactButton}>
              Contáctanos
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}