import styles from "./footer.module.css";
import Link from "next/link";

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.info}>
          <p>Creado por <b>Gonzalo Borrachero y Luis García</b> - <i>2025</i></p>
          <p>📍 Calle Alberto Aguilera 23, Madrid, España</p>
          <p>📧 <a href="mailto:contacto@losduros.com">contacto@losduros.com</a></p>
        </div>

        <div className={styles.links}>
          <Link href="/about">Sobre nosotros</Link>
          <Link href="/privacy">Política de privacidad</Link>
          <Link href="/terms">Términos y condiciones</Link>
        </div>

        <div className={styles.social}>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">🐦 Twitter</a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">🔗 LinkedIn</a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">🐙 GitHub</a>
        </div>
      </div>
      
    </footer>
  );
}
export default Footer;
