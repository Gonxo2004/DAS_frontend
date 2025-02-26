import Link from "next/link";
import styles from "./mainnav.module.css";

function Navbar() {
  return (
    <nav className={styles.navbar}>
      <Link className={styles.home} href="/">
        <img className={styles.homeLogo} src="/imgs/home-logo.webp" alt="Home" />
      </Link>
      <Link href="/subastas">Más buscados</Link>
      <Link href="/registro">Registro</Link>
      <Link className={styles.active} href="/login">Login</Link>
    </nav>
  );
}

export default Navbar;
