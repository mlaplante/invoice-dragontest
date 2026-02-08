import styles from './howItWorks.module.scss'
import useTranslation from 'next-translate/useTranslation'

export default function HowItWorks() {
  const { t } = useTranslation('common')

  const steps = [
    {
      number: 1,
      title: t('step_1_title'),
      description: t('step_1_desc'),
    },
    {
      number: 2,
      title: t('step_2_title'),
      description: t('step_2_desc'),
    },
    {
      number: 3,
      title: t('step_3_title'),
      description: t('step_3_desc'),
    },
    {
      number: 4,
      title: t('step_4_title'),
      description: t('step_4_desc'),
    },
  ]

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>{t('how_it_works_title')}</h2>
        <div className={styles.stepsContainer}>
          {steps.map((step, index) => (
            <article key={step.number} className={styles.step}>
              <div className={styles.stepContent}>
                <div className={styles.number}>{step.number}</div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
              {index < steps.length - 1 && <div className={styles.arrow}>→</div>}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
