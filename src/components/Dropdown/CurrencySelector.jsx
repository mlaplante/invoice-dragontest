import styles from './dropdown.module.scss'
import currencies from '../../data/currencies.json'
import { useState, useRef, useEffect } from 'react'

const CurrencySelector = ({ currencyCode, currencySymbol, onCurrencyModify }) => {
  const [isActive, setIsActive] = useState(false)
  const dropdownRef = useRef(null)

  const handleClick = (currency) => {
    onCurrencyModify(currency)
    setIsActive(false)
  }

  // Close dropdown when clicking outside
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
    <div className={styles.dropdown} ref={dropdownRef}>
      <p className={styles.label}>💱 Currency</p>
      <div
        className={`${styles.dropdown__btn} ${isActive ? styles.active : ''}`}
        onClick={() => setIsActive(!isActive)}
        aria-haspopup="listbox"
        aria-expanded={isActive}
      >
        <div className={styles.selected__currency}>
          <span className={styles.code}>{currencyCode}</span>
          <span className={styles.symbol}>{currencySymbol}</span>
        </div>
        <svg
          className={`${styles.chevron} ${isActive ? styles.rotate : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          viewBox="0 0 256 256"
        >
          <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
        </svg>
      </div>
      {isActive && (
        <div className={styles.dropdown__content} role="listbox">
          {currencies.map((currency, index) => (
            <div
              className={`${styles.dropdown__item} ${currency.code === currencyCode ? styles.accent : ''}`}
              key={index}
              onClick={() => handleClick(currency)}
              role="option"
              aria-selected={currency.code === currencyCode}
            >
              <span className={styles.code}>{currency.code}</span>
              <span className={styles.symbol}>{currency.symbol}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CurrencySelector
