import Script from 'next/script'
import Head from 'next/head'
import styles from '@/styles/Home.module.scss'
import HomePage from '../components/Home/HomePage'
import Header from '../components/Header/Header'
import FeaturesCards from '../components/FeaturesCards/FeaturesCards'
import HowItWorks from '../components/HowItWorks/HowItWorks'
import Footer from '../components/Footer/Footer'
import StructuredData from '../components/StructuredData/StructuredData'
import useTranslation from 'next-translate/useTranslation'

export default function Home() {
  const { t } = useTranslation('common')
  return (
    <>
      <StructuredData />
      <Head>
        <title>{t('invoice_dragon_title')}</title>
        <meta name="description" content={t('invoice_dragon_description')} />
        <meta property="og:title" content={t('invoice_dragon_title')} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/assets/icon.png" />
        <meta property="og:description" content={t('invoice_dragon_description')} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('invoice_dragon_title')} />
        <meta name="twitter:description" content={t('invoice_dragon_description')} />
        <meta name="application-name" content="Invoice Dragon" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <script
          async
          src="https://laplantedevanalytics.netlify.app/script.js"
          data-website-id="9b5a586a-b8e5-45f0-a511-ed98c6a8fa4d"
        ></script>
      </Head>
      <main className={styles.main}>
        <Header />
        <HomePage />
        <FeaturesCards />
        <HowItWorks />
        <Footer />
      </main>
    </>
  )
}
