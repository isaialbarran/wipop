import Link from 'next/link'
import styles from './Footer.module.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.brand}>
            <div className={styles.logo}>
              <svg
                className={styles.logoIcon}
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 2L38 12V28L20 38L2 28V12L20 2Z"
                  stroke="url(#footerGradient)"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M20 10L30 16V24L20 30L10 24V16L20 10Z"
                  fill="url(#footerGradient)"
                />
                <circle
                  cx="20"
                  cy="20"
                  r="4"
                  fill="white"
                />
                <defs>
                  <linearGradient id="footerGradient" x1="2" y1="2" x2="38" y2="38" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#06b6d4" />
                    <stop offset="1" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
              <span>InnovaGestion</span>
            </div>
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
