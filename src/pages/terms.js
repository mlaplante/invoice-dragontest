import Head from 'next/head'
import useTranslation from 'next-translate/useTranslation'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import styles from '@/styles/ContentPage.module.scss'

export default function Terms() {
  const { t } = useTranslation('common')

  return (
    <div className={styles.wrapper}>
      <Head>
        <title>{t('footer_terms')} - Invoice Dragon</title>
      </Head>
      <Header currentPage={t('footer_terms')} />
      <main className={styles.main}>
        <h1 className={styles.title}>{t('terms_title')}</h1>
        <div className={styles.content}>
          <p>{t('terms_content_1')}</p>
          <p>{t('terms_content_2')}</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
