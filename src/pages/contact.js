import Head from 'next/head'
import useTranslation from 'next-translate/useTranslation'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import styles from '@/styles/ContentPage.module.scss'

export default function Contact() {
  const { t } = useTranslation('common')

  return (
    <div className={styles.wrapper}>
      <Head>
        <title>{t('footer_contact')} - Invoice Dragon</title>
      </Head>
      <Header currentPage={t('footer_contact')} />
      <main className={styles.main}>
        <h1 className={styles.title}>{t('contact_title')}</h1>
        <div className={styles.content}>
          <p>{t('contact_content_1')}</p>
          <p>
            {t('contact_content_2')}{' '}
            <a
              href="https://github.com/mlaplante/invoice-dragontest"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#3b82f6', textDecoration: 'underline' }}
            >
              GitHub
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
