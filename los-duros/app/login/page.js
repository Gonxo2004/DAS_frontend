"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Reader from "../../components/Reader";
import styles from "./page.module.css";

export default function Login() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      router.push("/");
    }
  }, [router]);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      console.log("Enviando petición a la API...");

      // Asegúrate de tener configurada la variable NEXT_PUBLIC_API_URL
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      console.log("Respuesta recibida, status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error en login:", errorData);
        setErrorMsg(errorData.detail || "Error en login");
        return;
      }

      const data = await response.json();
      console.log("Datos de login recibidos:", data);

      // Guardamos el token y los datos del usuario en localStorage
      localStorage.setItem("token", data.access);
      localStorage.setItem("username", username);
      localStorage.setItem("refreshToken", data.refresh);

      console.log("Datos guardados en localStorage");

      // Redirige a la página principal y fuerza recarga para actualizar componentes
      window.location.reload();
      router.push("/");
    } catch (error) {
      console.error("Error en la petición:", error);
      setErrorMsg("Error de conexión con el servidor");
    }
  }

  if (isLoggedIn) {
    return null; // Puedes mostrar un spinner o un mensaje de carga si lo prefieres
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
            ¿No tienes cuenta?
          </a>
          <br />
          <br />

          <input className={styles.submitButton} type="submit" value="Enviar" />
        </form>
      </main>
    </Reader>
  );
}
