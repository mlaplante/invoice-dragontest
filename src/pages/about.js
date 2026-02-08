import Head from 'next/head'
import useTranslation from 'next-translate/useTranslation'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import styles from '@/styles/ContentPage.module.scss'

export default function About() {
  const { t } = useTranslation('common')

  return (
    <div className={styles.wrapper}>
      <Head>
        <title>{t('footer_about')} - Invoice Dragon</title>
      </Head>
      <Header currentPage={t('footer_about')} />
      <main className={styles.main}>
        <h1 className={styles.title}>{t('about_title')}</h1>
        <div className={styles.content}>
          <p>{t('about_content_1')}</p>
          <p>{t('about_content_2')}</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
