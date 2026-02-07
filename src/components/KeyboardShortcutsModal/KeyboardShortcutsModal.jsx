import { useEffect } from 'react'
import useTranslation from 'next-translate/useTranslation'
import styles from './keyboardShortcutsModal.module.scss'

export default function KeyboardShortcutsModal({ isOpen, onClose }) {
  const { t } = useTranslation('common')

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  // Determine if on Mac or Windows for display
  const isMac = typeof navigator !== 'undefined' && navigator.platform.toLowerCase().includes('mac')
  const ctrlKey = isMac ? '⌘' : 'Ctrl'

  const shortcuts = [
    {
      key: `${ctrlKey}+P`,
      description: t('shortcut_preview') || 'Toggle Preview',
    },
    {
      key: `${ctrlKey}+D`,
      description: t('shortcut_download') || 'Download PDF',
    },
    {
      key: 'Esc',
      description: t('shortcut_close') || 'Close Dialogs',
    },
    {
      key: '?',
      description: t('shortcut_help') || 'Show Help',
    },
  ]

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>{t('keyboard_shortcuts') || 'Keyboard Shortcuts'}</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close keyboard shortcuts"
            title="Close (Esc)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 256 256"
            >
              <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
            </svg>
          </button>
        </div>

        <div className={styles.shortcutsList}>
          {shortcuts.map((shortcut, index) => (
            <div key={index} className={styles.shortcutItem}>
              <kbd className={styles.key}>{shortcut.key}</kbd>
              <span className={styles.description}>{shortcut.description}</span>
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <p className={styles.hint}>{t('keyboard_hints') || 'Press Esc to close'}</p>
        </div>
      </div>
    </>
  )
}
