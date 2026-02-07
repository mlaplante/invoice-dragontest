import { useState } from 'react'
import styles from './header.module.scss'
import Image from 'next/image'
import Link from 'next/link'
import logo from '../../assets/icons/logo.svg'
import LanguageSelector from '../Language/LanguageSelector'
import KeyboardShortcutsModal from '../KeyboardShortcutsModal/KeyboardShortcutsModal'
import useTranslation from 'next-translate/useTranslation'

const Header = () => {
  const { t } = useTranslation('common')
  const [showShortcuts, setShowShortcuts] = useState(false)

  return (
    <>
      <div className={styles.header}>
        <div className={styles.logoSection}>
          <Link className={styles.pageLogo} href="/" passHref={true}>
            <Image src={logo} alt="Page Logo" width={40} height={40} priority />
          </Link>
          <div className={styles.breadcrumbs}>
            <Link href="/">{t('home') || 'Home'}</Link>
            <span className={styles.separator}>›</span>
            <span className={styles.current}>{t('create_invoice') || 'Create Invoice'}</span>
          </div>
        </div>
        <div className={styles.aside}>
          <div className={styles.help}>
            <button
              title="Keyboard Shortcuts (Press ? for help)"
              className={styles.helpBtn}
              onClick={() => setShowShortcuts(true)}
              aria-label="Show keyboard shortcuts"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V144a8,8,0,0,1,16,0v24A8,8,0,0,1,144,176ZM112,108a16,16,0,1,1,16,16,8,8,0,0,1-16,0A16,16,0,0,1,112,108Z"></path>
              </svg>
            </button>
          </div>
          <div className={styles.lang}>
            <LanguageSelector />
          </div>
        </div>
      </div>
      <KeyboardShortcutsModal isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
    </>
  )
}

export default Header
