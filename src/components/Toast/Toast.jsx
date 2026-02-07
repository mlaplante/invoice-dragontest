import { useEffect, useState } from 'react'
import styles from './toast.module.scss'

const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Wait for fade out animation
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓'
      case 'error':
        return '⚠'
      case 'loading':
        return '⏳'
      default:
        return 'i'
    }
  }

  return (
    <div
      className={`${styles.toast} ${styles[type]} ${isVisible ? styles.visible : ''}`}
      role="status"
    >
      <span className={styles.icon}>{getIcon()}</span>
      <span className={styles.message}>{message}</span>
    </div>
  )
}

export default Toast
