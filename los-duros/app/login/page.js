"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Reader from "../../components/Reader";
import styles from "./page.module.css";

export default function Login() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://das-p2-backend.onrender.com/api/users/login/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: username,
            password: password,
          }),
        }
      );

      if (!response.ok) {
        // Credenciales inválidas u otro error
        const errorData = await response.json();
        setErrorMsg(errorData.detail || "Error en login");
        return;
      }

      const data = await response.json();
      // data = { access: "...", username: "..." } (depende de tu backend)

      // Guardamos el token en localStorage
      localStorage.setItem("token", data.access);
      localStorage.setItem("username", data.username);

      // Redirige a la página principal (o donde prefieras)
      router.push("/");
    } catch (error) {
      console.error("Error en la petición:", error);
      setErrorMsg("Error de conexión con el servidor");
    }
  }

  return (
    <Reader>
      <main className={styles.mainLogin}>
        <h1>Formulario de Login</h1>
        <h2>Introduce tu usuario y contraseña</h2>

        <form onSubmit={handleSubmit}>
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
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

          <br />
          <a className={styles.linkRegistro} href="/registro">
            ¿No tiene cuenta?
          </a>
          <br />
          <br />

          <input className={styles.submitButton} type="submit" value="Enviar" />
        </form>
      </main>
    </Reader>
  );
}
