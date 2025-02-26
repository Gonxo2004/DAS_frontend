"use client";

import React from "react";
import Reader from "../../components/Reader";
import styles from "./page.module.css";

function Login() {
  return (
    <Reader>
      <main className={styles.mainLogin}>
        <h1>Formulario de Login</h1>
        <h2>Introduce tu usuario y contraseña</h2>
        <form>
          <label className={styles.labelText} htmlFor="usuario">
            Usuario:
          </label>
          <input
            className={styles.inputField}
            type="text"
            id="usuario"
            name="usuario"
            placeholder="vinijr23"
            required
          />

          <label className={styles.labelText} htmlFor="contraseña">
            Contraseña:
          </label>
          <input
            className={styles.inputField}
            type="password"
            id="contraseña"
            name="contraseña"
            placeholder="Contraseña"
            required
          />

          <br /><br />
          <a className={styles.linkRegistro} href="/registro">
            ¿No tiene cuenta?
          </a>
          <br /><br />

          <input
            className={styles.submitButton}
            type="submit"
            value="Enviar"
          />
        </form>
      </main>
    </Reader>
  );
}

export default Login;
