import { useState, useRef, useEffect } from 'react'
import styles from './moreMenu.module.scss'
import useTranslation from 'next-translate/useTranslation'
import Settings from './Settings/Settings'

const MoreMenu = ({ onClearData, onLoadExampleData, onSettingsChange }) => {
  const [isActive, setIsActive] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
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

  const handleSettingsClick = () => {
    setIsActive(false)
    setShowSettings(true)
  }

  const handleKeyDown = (e) => {
    const menuItems = 3 // Load Example, Settings, Clear Data
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex((prev) =>
          prev < menuItems - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : menuItems - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex === 0) handleExampleClick()
        else if (highlightedIndex === 1) handleSettingsClick()
        else if (highlightedIndex === 2) handleClearClick()
        break
      case 'Escape':
        e.preventDefault()
        setIsActive(false)
        setHighlightedIndex(-1)
        break
      case 'Tab':
        setIsActive(false)
        setHighlightedIndex(-1)
        break
      default:
        break
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsActive(false)
        setHighlightedIndex(-1)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div
      className={styles.container}
      ref={menuRef}
      onKeyDown={handleKeyDown}
      role="menu"
    >
      <button
        className={`${styles.menuBtn} ${isActive ? styles.active : ''}`}
        onClick={() => {
          setIsActive(!isActive)
          setHighlightedIndex(-1)
        }}
        aria-label="More options"
        aria-haspopup="true"
        aria-expanded={isActive}
      >
        <span className={styles.dots}>⋮</span>
        <span className={styles.btnText}>More</span>
      </button>

      {isActive && (
        <div className={styles.dropdown} role="menu">
          <button
            className={`${styles.menuItem} ${
              highlightedIndex === 0 ? styles.highlighted : ''
            }`}
            onClick={handleExampleClick}
            role="menuitem"
          >
            <span className={styles.icon}>📝</span> {t('load_example_data') || 'Load Example Data'}
          </button>
          <button
            className={`${styles.menuItem} ${
              highlightedIndex === 1 ? styles.highlighted : ''
            }`}
            onClick={handleSettingsClick}
            role="menuitem"
          >
            <span className={styles.icon}>⚙️</span> {t('settings') || 'Settings'}
          </button>
          <div className={styles.divider}></div>
          <button
            className={`${styles.menuItem} ${styles.danger} ${
              highlightedIndex === 2 ? styles.highlighted : ''
            }`}
            onClick={handleClearClick}
            role="menuitem"
          >
            <span className={styles.icon}>🗑️</span> {t('clear_saved_data')}
          </button>
        </div>
      )}

      <Settings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onSettingsChange={onSettingsChange}
      />
    </div>
  )
}
export default MoreMenu
