import { useState, useRef, useEffect } from 'react'
import styles from './moreMenu.module.scss'
import useTranslation from 'next-translate/useTranslation'

const MoreMenu = ({ onClearData, onLoadExampleData }) => {
  const [isActive, setIsActive] = useState(false)
  const menuRef = useRef(null)
  const { t } = useTranslation('common')

  const handleClearClick = () => {
    setIsActive(false)
    onClearData()
  }

  const handleExampleClick = () => {
    setIsActive(false)
    onLoadExampleData()
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsActive(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={styles.container} ref={menuRef}>
      <button
        className={`${styles.menuBtn} ${isActive ? styles.active : ''}`}
        onClick={() => setIsActive(!isActive)}
        aria-label="More options"
        aria-haspopup="true"
        aria-expanded={isActive}
      >
        <span className={styles.dots}>⋮</span>
        <span className={styles.btnText}>More</span>
      </button>

      {isActive && (
        <div className={styles.dropdown}>
          <button className={styles.menuItem} onClick={handleExampleClick}>
            <span className={styles.icon}>📝</span> {t('load_example_data') || 'Load Example Data'}
          </button>
          <button className={styles.menuItem} onClick={() => {}}>
            <span className={styles.icon}>⚙️</span> {t('settings') || 'Settings'}
          </button>
          <div className={styles.divider}></div>
          <button className={`${styles.menuItem} ${styles.danger}`} onClick={handleClearClick}>
            <span className={styles.icon}>🗑️</span> {t('clear_saved_data')}
          </button>
        </div>
      )}
    </div>
  )
}
export default MoreMenu
