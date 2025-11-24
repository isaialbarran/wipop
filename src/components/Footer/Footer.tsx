import Link from 'next/link'
import styles from './Footer.module.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.brand}>
            <h3 className={styles.logo}>InnovaGestion</h3>
            <p className={styles.tagline}>
              Innovación en Gestión Empresarial
            </p>
          </div>

          <div className={styles.links}>
            <div className={styles.linkGroup}>
              <h4 className={styles.linkTitle}>Navegación</h4>
              <Link href="/#cursos" className={styles.link}>
                Cursos
              </Link>
            </div>

            <div className={styles.linkGroup}>
              <h4 className={styles.linkTitle}>Legal</h4>
              <Link href="/privacy" className={styles.link}>
                Privacidad
              </Link>
              <Link href="/terms" className={styles.link}>
                Términos
              </Link>
            </div>

            <div className={styles.linkGroup}>
              <h4 className={styles.linkTitle}>Contacto</h4>
              <a href="mailto:contacto@innovagestion.com" className={styles.link}>
                contacto@innovagestion.com
              </a>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {currentYear} InnovaGestion. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
