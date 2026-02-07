import styles from './header.module.scss'
import Image from 'next/image'
import Link from 'next/link'
import logo from '../../assets/icons/logo.svg'
import LanguageSelector from '../Language/LanguageSelector'

const Header = () => {
  return (
    <div className={styles.header}>
      <div className={styles.logoSection}>
        <Link className={styles.pageLogo} href="/" passHref={true}>
          <Image src={logo} alt="Page Logo" priority />
        </Link>
      </div>
      <div className={styles.aside}>
        <div className={styles.lang}>
          <LanguageSelector />
        </div>
      </div>
    </div>
  )
}

export default Header
