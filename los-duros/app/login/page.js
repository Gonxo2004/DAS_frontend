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
      console.log("Enviando petición a la API...");
  
      const response = await fetch(
        "https://das-p2-backend.onrender.com/api/users/login/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );
  
      console.log("Respuesta recibida, status:", response.status);
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error en login:", errorData);
        setErrorMsg(errorData.detail || "Error en login");
        return;
      }
  
      const data = await response.json();
      console.log("Datos de login recibidos:", data);
  
      // Guardamos el token y los datos de usuario en localStorage
      localStorage.setItem("token", data.access);
      localStorage.setItem("username", data.username);
      // Aseguramos almacenar el first_name para el mensaje de bienvenida
      localStorage.setItem("first_name", data.first_name);
  
      console.log("Datos guardados en localStorage");
  
      // Redirige a la página principal y fuerza recarga para actualizar componentes
      router.push("/");
      window.location.reload();
  
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
