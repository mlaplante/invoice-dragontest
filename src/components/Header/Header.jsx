import styles from './header.module.scss'
import Image from 'next/image'
import Link from 'next/link'
import logo from '../../assets/icons/logo.svg'
import LanguageChange from '../Language/languageChange'

const Header = () => {
  return (
    <div className={styles.header}>
      <div>
        <Link className={styles.pageLogo} href="/" passHref={true}>
          <Image src={logo} alt="Page Logo" priority />
        </Link>
      </div>
      <div className={styles.aside}>
        <div className={styles.lang}>
          <LanguageChange />
        </div>
      </div>
    </div>
  )
}

export default Header
