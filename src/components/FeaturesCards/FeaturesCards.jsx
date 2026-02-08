import styles from './featuresCards.module.scss'
import useTranslation from 'next-translate/useTranslation'

export default function FeaturesCards() {
  const { t } = useTranslation('common')

  const features = [
    {
      id: 'free',
      icon: '🎁',
      title: t('feature_free_title'),
      description: t('feature_free_desc'),
    },
    {
      id: 'fast',
      icon: '⚡',
      title: t('feature_fast_title'),
      description: t('feature_fast_desc'),
    },
    {
      id: 'no_account',
      icon: '🔓',
      title: t('feature_no_account_title'),
      description: t('feature_no_account_desc'),
    },
    {
      id: 'secure',
      icon: '🔒',
      title: t('feature_secure_title'),
      description: t('feature_secure_desc'),
    },
  ]

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>{t('features_title')}</h2>
        <div className={styles.grid}>
          {features.map((feature) => (
            <article key={feature.id} className={styles.card}>
              <div className={styles.icon}>{feature.icon}</div>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardDescription}>{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
