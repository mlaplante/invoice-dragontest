import useTranslation from 'next-translate/useTranslation'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import styles from './languageSelector.module.scss'

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
]

const LanguageSelector = () => {
  const { lang } = useTranslation('common')
  const router = useRouter()
  const [isActive, setIsActive] = useState(false)
  const dropdownRef = useRef(null)

  const currentLanguage = languages.find((l) => l.code === lang) || languages[0]

  const handleChangeLanguage = (code) => {
    const { pathname, asPath } = router
    router.push(pathname, asPath, { locale: code })
    setIsActive(false)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsActive(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={styles.container} ref={dropdownRef}>
      <div
        className={`${styles.selector} ${isActive ? styles.active : ''}`}
        onClick={() => setIsActive(!isActive)}
        aria-haspopup="listbox"
        aria-expanded={isActive}
        aria-label="Select Language"
      >
        <span className={styles.globe}>🌐</span>
        <span className={styles.current}>
          {currentLanguage.code} ({currentLanguage.name})
        </span>
        <svg
          className={`${styles.chevron} ${isActive ? styles.rotate : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 256 256"
        >
          <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
        </svg>
      </div>

      {isActive && (
        <div className={styles.dropdown} role="listbox">
          {languages.map((language) => (
            <div
              key={language.code}
              className={`${styles.item} ${language.code === lang ? styles.selected : ''}`}
              onClick={() => handleChangeLanguage(language.code)}
              role="option"
              aria-selected={language.code === lang}
            >
              <span className={styles.flag}>{language.flag}</span>
              <span className={styles.name}>{language.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default LanguageSelector
