import Link from 'next/link';
import styles from './header.module.scss';
import Logo from '../../assets/logo';

export default function Header(): JSX.Element {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/">
          <a>
            <Logo />
          </a>
        </Link>
      </div>
    </header>
  );
}
