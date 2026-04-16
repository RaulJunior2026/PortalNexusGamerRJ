import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/">
          NEXUS<span className={styles.logoAccent}>GAMER</span>
        </Link>
      </div>

      <ul className={styles.navLinks}>
        <li><Link href="/noticias" className={styles.navItem}>Notícias</Link></li>
        <li><Link href="/promocoes" className={styles.navItem}>Promoções 🔥</Link></li>
        <li><Link href="/reviews" className={styles.navItem}>Reviews</Link></li>
        <li><Link href="/esports" className={styles.navItem}>eSports</Link></li>
        <li><Link href="/plataformas" className={styles.navItem}>Plataformas</Link></li>
      </ul>

      <button className={styles.searchBtn}>🔍 Buscar</button>
    </nav>
  );
}
