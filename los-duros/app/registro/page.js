"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Reader from "../../components/Reader";
import styles from "./page.module.css";

// Mapeo de comunidades -> ciudades
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
  const [errorMsg, setErrorMsg] = useState("");

  // Campos que vamos a mandar al backend
  const [fname, setFname] = useState("");
  const [sname, setSname] = useState("");
  const [fechanac, setFechanac] = useState("");
  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");

  // Campos que NO se envían al backend pero que mantienes en el formulario
  const [dni, setDni] = useState("");
  const [direccion, setDireccion] = useState("");

  // Para la ciudad seleccionada
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState("");

  // Actualiza la lista de ciudades al cambiar la comunidad
  useEffect(() => {
    const lista = ciudadesPorComunidad[comunidad] || [];
    setCiudades(lista);
    setCiudadSeleccionada("");
  }, [comunidad]);

  // Comprueba que las contraseñas coincidan
  useEffect(() => {
    if (pass1 && pass2 && pass1 !== pass2) {
      setErrorMsg("Las contraseñas no coinciden");
    } else {
      setErrorMsg("");
    }
  }, [pass1, pass2]);

  async function handleSubmit(e) {
    e.preventDefault();

    // Validamos comunidad y ciudad
    if (!comunidad) {
      alert("Selecciona tu comunidad autónoma");
      return;
    }
    if (!ciudadSeleccionada) {
      alert("Selecciona tu ciudad");
      return;
    }

    // Validamos contraseñas
    if (pass1 !== pass2) {
      alert("Error: Las contraseñas no coinciden.");
      return;
    }

    // Construimos el body para el backend
    const body = {
      username: usuario,
      email: email,
      password: pass1,
      first_name: fname,
      last_name: sname,
      birth_date: fechanac, // YYYY-MM-DD
      locality: comunidad,
      municipality: ciudadSeleccionada,
    };

    console.log("Enviando body:", body);

    try {
      const response = await fetch(
        "https://das-p2-backend.onrender.com/api/users/register/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );  
      // Elimina solo items específicos:
      localStorage.removeItem("token");
      localStorage.removeItem("username");

      // O bien, limpia todo el localStorage (cuidado, esto borra todo)
      localStorage.clear();


      if (!response.ok) {
        // Leemos el contenido de error
        const errorText = await response.text();
        console.error(
          "Error al registrar:",
          "Status:",
          response.status,
          "Body:",
          errorText
        );

        // Posible parse de JSON
        try {
          const maybeJson = JSON.parse(errorText);
          console.error("Error parseado como JSON:", maybeJson);
        } catch (parseError) {
          console.warn("No se pudo parsear como JSON:", parseError);
        }

        alert("No se pudo registrar. Mira la consola para más detalle.");
        return;
      }

      const newUser = await response.json();
      console.log("Usuario creado:", newUser);

      // Redirige al login
      router.push("/login");
    } catch (error) {
      console.error("Error en la petición:", error);
      alert("Error de conexión con el servidor");
    }
  }

  return (
    <Reader>
      <main className={styles.mainRegistro}>
        <h1>Formulario de registro</h1>
        <h3>Por favor, rellena los siguientes datos para registrarte</h3>
        <fieldset>
          <form onSubmit={handleSubmit}>
            {/* Nombre */}
            <div className={styles.formGroup}>
              <label htmlFor="fname" className={styles.labelText}>
                Nombre:
              </label>
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

            {/* Apellidos */}
            <div className={styles.formGroup}>
              <label htmlFor="sname" className={styles.labelText}>
                Apellidos:
              </label>
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

            {/* DNI (no se envía) */}
            <div className={styles.formGroup}>
              <label htmlFor="dni" className={styles.labelText}>
                DNI/NIE:
              </label>
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

            {/* Fecha de nacimiento */}
            <div className={styles.formGroup}>
              <label htmlFor="fechanac" className={styles.labelText}>
                Fecha de nacimiento:
              </label>
              <input
                className={styles.inputField}
                type="date"
                id="fechanac"
                required
                value={fechanac}
                onChange={(e) => setFechanac(e.target.value)}
              />
            </div>

            {/* Usuario */}
            <div className={styles.formGroup}>
              <label htmlFor="usuario" className={styles.labelText}>
                Usuario:
              </label>
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

            {/* Email */}
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.labelText}>
                Correo electrónico:
              </label>
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

            {/* Dirección (no se envía) */}
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label htmlFor="direccion" className={styles.labelText}>
                Dirección:
              </label>
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

            {/* Comunidad */}
            <div className={styles.formGroup}>
              <label htmlFor="comunidad" className={styles.labelText}>
                Comunidad Autónoma:
              </label>
              <select
                className={styles.inputField}
                id="comunidad"
                required
                value={comunidad}
                onChange={(e) => setComunidad(e.target.value)}
              >
                <option value="">-- Selecciona tu comunidad --</option>
                {Object.keys(ciudadesPorComunidad).map((com) => (
                  <option key={com} value={com}>
                    {com}
                  </option>
                ))}
              </select>
            </div>

            {/* Ciudad */}
            <div className={styles.formGroup}>
              <label htmlFor="ciudad" className={styles.labelText}>
                Ciudad:
              </label>
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
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Contraseña */}
            <div className={styles.formGroup}>
              <label htmlFor="contraseña" className={styles.labelText}>
                Contraseña:
              </label>
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

            {/* Confirmación de contraseña */}
            <div className={styles.formGroup}>
              <label htmlFor="contraseña2" className={styles.labelText}>
                Confirmación contraseña:
              </label>
              <input
                className={styles.inputField}
                type="password"
                id="contraseña2"
                minLength={8}
                required
                value={pass2}
                onChange={(e) => setPass2(e.target.value)}
              />
              <p id="error_msg" style={{ color: "red" }}>{errorMsg}</p>
            </div>

            {/* Imagen (no se envía) */}
            <div className={styles.formGroup}>
              <label htmlFor="myfile" className={styles.labelText}>
                Imagen:
              </label>
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
                <img
                  src="/imgs/flecha.png"
                  alt="flecha"
                  width="30"
                  height="30"
                />
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
