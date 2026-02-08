import styles from './dropdown.module.scss'
import currencies from '../../data/currencies.json'
import { useState, useRef } from 'react'

const Dropdown = ({ currencyCode, currencySymbol, onCurrencyModify }) => {
  const [isActive, setIsActive] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const containerRef = useRef(null)

  const selectedIndex = currencies.findIndex((c) => c.code === currencyCode)

  const handleClick = (currency) => {
    onCurrencyModify(currency)
    setIsActive(false)
    setHighlightedIndex(-1)
  }

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex((prev) =>
          prev < currencies.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : currencies.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0) {
          handleClick(currencies[highlightedIndex])
        }
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

  const handleOpen = () => {
    setIsActive(true)
    setHighlightedIndex(selectedIndex)
  }

  return (
    <div
      className={styles.dropdown}
      onKeyDown={handleKeyDown}
      ref={containerRef}
      role="listbox"
      tabIndex={0}
    >
      <button
        className={styles.dropdown__btn}
        onClick={handleOpen}
        aria-haspopup="listbox"
        aria-expanded={isActive}
      >
        <div className={styles.selected__currency}>
          <span className={styles.code}>{currencyCode} </span>
          <span>{currencySymbol}</span>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          viewBox="0 0 256 256"
        >
          <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"></path>
        </svg>
      </button>
      {isActive && (
        <ul className={styles.dropdown__content} role="listbox">
          {currencies.map((currency, index) => (
            <li
              key={index}
              role="option"
              aria-selected={currency.code === currencyCode}
              className={`${styles.dropdown__item} ${
                index === highlightedIndex ? styles.highlighted : ''
              } ${currency.code === currencyCode ? styles.accent : ''}`}
              onClick={() => handleClick(currency)}
            >
              <span className={styles.code}>{currency.code}</span>
              <span className={styles.symbol}>{currency.symbol}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Dropdown
