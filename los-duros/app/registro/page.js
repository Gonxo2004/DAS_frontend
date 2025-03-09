"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Reader from "../../components/Reader";
import styles from "./page.module.css";

const ciudadesPorComunidad = {
  "Andalucía": ["Sevilla", "Málaga", "Córdoba", "Granada", "Cádiz"],
  "Aragón": ["Zaragoza", "Huesca", "Teruel"],
  "Asturias": ["Oviedo", "Gijón", "Avilés"],
  "Canarias": ["Santa Cruz de Tenerife", "Las Palmas de Gran Canaria"],
  "Cantabria": ["Santander", "Torrelavega"],
  "Castilla-La Mancha": ["Albacete", "Ciudad Real", "Toledo"],
  "Castilla y León": ["Valladolid", "Burgos", "Salamanca", "León"],
  "Cataluña": ["Barcelona", "Tarragona", "Girona", "Lleida"],
  "Comunidad de Madrid": ["Madrid", "Alcalá de Henares", "Getafe", "Móstoles"],
  "Comunidad Valenciana": ["Valencia", "Alicante", "Castellón"],
  "Extremadura": ["Badajoz", "Cáceres", "Mérida"],
  "Galicia": ["Santiago de Compostela", "A Coruña", "Vigo"],
  "La Rioja": ["Logroño", "Calahorra"],
  "Murcia": ["Murcia", "Cartagena", "Lorca"],
  "Navarra": ["Pamplona", "Tudela"],
  "País Vasco": ["Bilbao", "San Sebastián", "Vitoria"],
};

export default function Registro() {
  const router = useRouter();

  // Estados para el formulario
  const [comunidad, setComunidad] = useState("");
  const [ciudades, setCiudades] = useState([]);

  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  
  // Aquí acumularemos mensajes de error para mostrarlos en el UI (contraseñas o errores del servidor)
  const [errorMsg, setErrorMsg] = useState("");

  // Campos que se mandan al backend
  const [fname, setFname] = useState("");
  const [sname, setSname] = useState("");
  const [fechanac, setFechanac] = useState("");
  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");

  // Otros campos del formulario (no se envían)
  const [dni, setDni] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState("");

  useEffect(() => {
    const lista = ciudadesPorComunidad[comunidad] || [];
    setCiudades(lista);
    setCiudadSeleccionada("");
  }, [comunidad]);

  useEffect(() => {
    if (pass1 && pass2 && pass1 !== pass2) {
      setErrorMsg("Las contraseñas no coinciden");
    } else {
      setErrorMsg("");
    }
  }, [pass1, pass2]);

  async function handleSubmit(e) {
    e.preventDefault();

    // Limpiamos errores previos antes de realizar validaciones
    setErrorMsg("");

    if (!comunidad) {
      setErrorMsg("Selecciona tu comunidad autónoma");
      return;
    }
    if (!ciudadSeleccionada) {
      setErrorMsg("Selecciona tu ciudad");
      return;
    }
    if (pass1 !== pass2) {
      setErrorMsg("Error: Las contraseñas no coinciden.");
      return;
    }

    const body = {
      username: usuario,
      email: email,
      password: pass1,
      first_name: fname,
      last_name: sname,
      birth_date: fechanac,
      locality: comunidad,
      municipality: ciudadSeleccionada,
    };

    try {
      const response = await fetch(
        "https://das-p2-backend.onrender.com/api/users/register/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      // Limpiamos el localStorage para borrar datos anteriores
      localStorage.clear();

      if (!response.ok) {
        // Intentamos parsear el JSON de error
        try {
          const errorData = await response.json();
          
          // errorData puede tener múltiples campos: password, username, etc.
          // Convertimos todo en un único string para mostrarlo
          const mensajes = Object.values(errorData)
            .flat()
            .join(". ");

          setErrorMsg(mensajes || "No se pudo registrar (Error desconocido).");
        } catch (jsonErr) {
          // Si no era JSON, leemos el texto en crudo
          const errorText = await response.text();
          setErrorMsg(errorText || "No se pudo registrar (Error desconocido).");
        }
        return;
      }

      // Si llega aquí, es que todo fue bien
      const newUser = await response.json();
      // Redireccionamos al login (ya no mostramos nada por consola)
      router.push("/login");
    } catch (error) {
      // Error de conexión
      setErrorMsg("Error de conexión con el servidor");
    }
  }

  return (
    <Reader>
      <main className={styles.mainRegistro}>
        <h1>Formulario de registro</h1>
        <h3>Por favor, rellena los siguientes datos para registrarte</h3>

        {/* Muestra el mensaje de error si existe */}
        {errorMsg && (
          <div style={{ color: "red", marginBottom: "1rem" }}>
            {errorMsg}
          </div>
        )}

        <fieldset>
          <form onSubmit={handleSubmit}>
            {/* Campo: Nombre */}
            <div className={styles.formGroup}>
              <label htmlFor="fname" className={styles.labelText}>Nombre:</label>
              <input
                className={styles.inputField}
                type="text"
                id="fname"
                placeholder="Vinicius"
                required
                value={fname}
                onChange={(e) => setFname(e.target.value)}
              />
            </div>

            {/* Campo: Apellidos */}
            <div className={styles.formGroup}>
              <label htmlFor="sname" className={styles.labelText}>Apellidos:</label>
              <input
                className={styles.inputField}
                type="text"
                id="sname"
                placeholder="Junior"
                required
                value={sname}
                onChange={(e) => setSname(e.target.value)}
              />
            </div>

            {/* Campo: DNI */}
            <div className={styles.formGroup}>
              <label htmlFor="dni" className={styles.labelText}>DNI/NIE:</label>
              <input
                className={styles.inputField}
                type="text"
                id="dni"
                placeholder="12345678A"
                required
                value={dni}
                onChange={(e) => setDni(e.target.value)}
              />
            </div>

            {/* Campo: Fecha de nacimiento */}
            <div className={styles.formGroup}>
              <label htmlFor="fechanac" className={styles.labelText}>Fecha de nacimiento:</label>
              <input
                className={styles.inputField}
                type="date"
                id="fechanac"
                required
                value={fechanac}
                onChange={(e) => setFechanac(e.target.value)}
              />
            </div>

            {/* Campo: Usuario */}
            <div className={styles.formGroup}>
              <label htmlFor="usuario" className={styles.labelText}>Usuario:</label>
              <input
                className={styles.inputField}
                type="text"
                id="usuario"
                placeholder="vinijrcrack123"
                required
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
              />
            </div>

            {/* Campo: Email */}
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.labelText}>Correo electrónico:</label>
              <input
                className={styles.inputField}
                type="email"
                id="email"
                placeholder="correo@gmail.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Campo: Dirección */}
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label htmlFor="direccion" className={styles.labelText}>Dirección:</label>
              <input
                className={styles.inputField}
                type="text"
                id="direccion"
                placeholder="c/ Alberto Aguilera 23"
                required
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
              />
            </div>

            {/* Campo: Comunidad */}
            <div className={styles.formGroup}>
              <label htmlFor="comunidad" className={styles.labelText}>Comunidad Autónoma:</label>
              <select
                className={styles.inputField}
                id="comunidad"
                required
                value={comunidad}
                onChange={(e) => setComunidad(e.target.value)}
              >
                <option value="">-- Selecciona tu comunidad --</option>
                {Object.keys(ciudadesPorComunidad).map((com) => (
                  <option key={com} value={com}>{com}</option>
                ))}
              </select>
            </div>

            {/* Campo: Ciudad */}
            <div className={styles.formGroup}>
              <label htmlFor="ciudad" className={styles.labelText}>Ciudad:</label>
              <select
                className={styles.inputField}
                id="ciudad"
                required
                disabled={!ciudades.length}
                value={ciudadSeleccionada}
                onChange={(e) => setCiudadSeleccionada(e.target.value)}
              >
                <option value="">-- Selecciona tu ciudad --</option>
                {ciudades.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Campo: Contraseña */}
            <div className={styles.formGroup}>
              <label htmlFor="contraseña" className={styles.labelText}>Contraseña:</label>
              <input
                className={styles.inputField}
                type="password"
                id="contraseña"
                minLength={8}
                required
                value={pass1}
                onChange={(e) => setPass1(e.target.value)}
              />
            </div>

            {/* Campo: Confirmación de Contraseña */}
            <div className={styles.formGroup}>
              <label htmlFor="contraseña2" className={styles.labelText}>Confirmación contraseña:</label>
              <input
                className={styles.inputField}
                type="password"
                id="contraseña2"
                minLength={8}
                required
                value={pass2}
                onChange={(e) => setPass2(e.target.value)}
              />
              {/* Error (contraseña) */}
              {errorMsg && (
                <p id="error_msg" style={{ color: "red", marginTop: "0.5rem" }}>
                  {errorMsg}
                </p>
              )}
            </div>

            {/* Campo: Imagen (no se envía) */}
            <div className={styles.formGroup}>
              <label htmlFor="myfile" className={styles.labelText}>Imagen:</label>
              <input
                className={styles.inputField}
                type="file"
                id="myfile"
                name="myfile"
              />
            </div>

            {/* Acciones del formulario */}
            <div className={styles.formActions}>
              <Link href="/login">
                <img src="/imgs/flecha.png" alt="flecha" width="30" height="30" />
              </Link>
              <input className={styles.submitButton} type="submit" value="Enviar" />
              <input className={styles.submitButton} type="reset" value="Reset" />
            </div>
          </form>
        </fieldset>
      </main>
    </Reader>
  );
}
