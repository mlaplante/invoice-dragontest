import { useState, useEffect } from 'react'
import useTranslation from 'next-translate/useTranslation'
import styles from './tipBanner.module.scss'

export default function TipBanner() {
  const { t } = useTranslation('common')
  const [currentTip, setCurrentTip] = useState(0)
  const [isDismissed, setIsDismissed] = useState(false)

  const tips = [t('tip_1'), t('tip_2'), t('tip_3'), t('tip_4'), t('tip_5')]

  useEffect(() => {
    // Load dismissed state from localStorage
    if (typeof window !== 'undefined') {
      const dismissed = localStorage.getItem('invoiceDragonTipBannerDismissed') === 'true'
      setIsDismissed(dismissed)

      // Set random tip on mount
      if (!dismissed) {
        setCurrentTip(Math.floor(Math.random() * tips.length))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleDismiss = () => {
    setIsDismissed(true)
    if (typeof window !== 'undefined') {
      localStorage.setItem('invoiceDragonTipBannerDismissed', 'true')
    }
  }

  if (isDismissed) return null

  return (
    <div className={`${styles.banner} ${styles.fadeIn}`} role="region" aria-label="Helpful tips">
      <div className={styles.content}>
        <span className={styles.icon}>💡</span>
        <p className={styles.text}>{tips[currentTip]}</p>
      </div>
      <button
        type="button"
        onClick={handleDismiss}
        className={styles.closeBtn}
        aria-label="Dismiss tip"
        title="Close"
      >
        ✕
      </button>
    </div>
  )
}
