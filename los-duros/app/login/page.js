import React from "react";
import styles from "./page.module.css"; // Importamos los estilos locales
import "../globals.css"; // Importamos los estilos globales

function Login() {
  return (
    <div>
      <header>
        <nav className={styles.navbar}>
          <a className="home" href="./index.html">
            <img className={styles.homeLogo} src="/imgs/home-logo.webp" alt="Home" />
          </a>
          <a href="/resultados_busqueda">Más buscados</a>
          <a href="/registro">Registro</a>
          <a className={styles.active} href="/login">Login</a>
        </nav>
        <h1>SUBASTA LOS DUROS</h1>
      </header>

      <main className={styles.mainLogin}>
        <h1>Formulario de Login</h1>
        <h2>Introduce tu usuario y contraseña</h2>
        <form>
            <label className={styles.labelText} htmlFor="usuario">Usuario:</label>
            <input className={styles.inputField} type="text" id="usuario" name="usuario" placeholder="vinijr23" required />

            <label className={styles.labelText} htmlFor="contraseña">Contraseña:</label>
            <input className={styles.inputField} type="password" id="contraseña" name="contraseña" placeholder="Contraseña" required />

            <br />
            <br />
            <a href="/registro">¿No tiene cuenta?</a>
            <br />
            <br />

            {/* Solo un botón de envío */}
            <input className={styles.submitButton} type="submit" value="Enviar"/>
        </form>

        <br />
      </main>

      <footer>
        Creado por <b>Gonzalo Borrachero y Luis García</b> - <i>2025</i>
      </footer>
    </div>
  );
}

export default Login;
