import styles from './footer.module.scss'
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'

export default function Footer() {
  const { t } = useTranslation('common')

  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.linksSection}>
            <div className={styles.navigationLinks}>
              <Link href="/about" className={styles.link}>
                {t('footer_about')}
              </Link>
              <Link href="/privacy" className={styles.link}>
                {t('footer_privacy')}
              </Link>
              <Link href="/terms" className={styles.link}>
                {t('footer_terms')}
              </Link>
              <Link href="/contact" className={styles.link}>
                {t('footer_contact')}
              </Link>
            </div>

            <div className={styles.socialLinks}>
              <a
                href="https://github.com/mlaplante/invoice-dragontest"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                title="GitHub"
              >
                {t('footer_github')}
              </a>
            </div>
          </div>

          <div className={styles.copyright}>
            <p>
              © {currentYear} Invoice Dragon. {t('footer_copyright')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
