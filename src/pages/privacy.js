import Head from 'next/head'
import useTranslation from 'next-translate/useTranslation'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import styles from '@/styles/ContentPage.module.scss'

export default function Privacy() {
  const { t } = useTranslation('common')

  return (
    <div className={styles.wrapper}>
      <Head>
        <title>{t('footer_privacy')} - Invoice Dragon</title>
      </Head>
      <Header currentPage={t('footer_privacy')} />
      <main className={styles.main}>
        <h1 className={styles.title}>{t('privacy_title')}</h1>
        <div className={styles.content}>
          <p>{t('privacy_content_1')}</p>
          <p>{t('privacy_content_2')}</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
