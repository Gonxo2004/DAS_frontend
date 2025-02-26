"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.css"; 
import "../globals.css"; 



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
  // Estados
  const [comunidad, setComunidad] = useState("");
  const [ciudades, setCiudades] = useState([]);

  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [fname, setFname] = useState("");
  const [sname, setSname] = useState("");
  const [dni, setDni] = useState("");
  const [fechanac, setFechanac] = useState("");
  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [direccion, setDireccion] = useState("");

  // Efectos
  useEffect(() => {
    const lista = ciudadesPorComunidad[comunidad] || [];
    setCiudades(lista);
  }, [comunidad]);

  useEffect(() => {
    if (pass1 && pass2 && pass1 !== pass2) {
      setErrorMsg("Las contraseñas no coinciden");
    } else {
      setErrorMsg("");
    }
  }, [pass1, pass2]);

  function handleSubmit(e) {
    if (pass1 !== pass2) {
      e.preventDefault();
      alert("Error: Las contraseñas no coinciden.");
    }
  }

  return (
    <div>
      <header>
        <nav className={styles.navbar}>
          <a className="home" href="./index.html">
            <img className={styles.homeLogo} src="/imgs/home-logo.webp" alt="Home" />
          </a>
          <a href="/resultados_busqueda">Más buscados</a>
          <a className={styles.active} href="/registro">Registro</a>
          <a href="/login">Login</a>
        </nav>
        <h1>SUBASTA LOS DUROS</h1>
      </header>

      <main className={styles.mainRegistro}>
        <h1>Formulario de registro</h1>
        <h3>Por favor, rellena los siguientes datos para registrarte</h3>

        <fieldset>
          <form onSubmit={handleSubmit}>
            {/* Nombre */}
            <div className={styles.formGroup}>
              <label className={styles.labelText} htmlFor="fname">
                Nombre:
              </label>
              <input
                className={styles.inputField}
                type="text"
                id="fname"
                name="fname"
                placeholder="Vinicius"
                required
                value={fname}
                onChange={(e) => setFname(e.target.value)}
              />
            </div>

            {/* Apellidos */}
            <div className={styles.formGroup}>
              <label className={styles.labelText} htmlFor="sname">
                Apellidos:
              </label>
              <input
                className={styles.inputField}
                type="text"
                id="sname"
                name="sname"
                placeholder="Junior"
                required
                value={sname}
                onChange={(e) => setSname(e.target.value)}
              />
            </div>

            {/* DNI */}
            <div className={styles.formGroup}>
              <label className={styles.labelText} htmlFor="dni">
                DNI/NIE:
              </label>
              <input
                className={styles.inputField}
                type="text"
                id="dni"
                name="dni"
                placeholder="12345678A"
                required
                value={dni}
                onChange={(e) => setDni(e.target.value)}
              />
            </div>

            {/* Fecha de nacimiento */}
            <div className={styles.formGroup}>
              <label className={styles.labelText} htmlFor="fechanac">
                Fecha de nacimiento:
              </label>
              <input
                className={styles.inputField}
                type="date"
                id="fechanac"
                name="fechanac"
                required
                value={fechanac}
                onChange={(e) => setFechanac(e.target.value)}
              />
            </div>

            {/* Usuario */}
            <div className={styles.formGroup}>
              <label className={styles.labelText} htmlFor="usuario">
                Usuario:
              </label>
              <input
                className={styles.inputField}
                type="text"
                id="usuario"
                name="usuario"
                placeholder="vinijrcrack123"
                required
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
              />
            </div>

            {/* Email */}
            <div className={styles.formGroup}>
              <label className={styles.labelText} htmlFor="email">
                Correo electrónico:
              </label>
              <input
                className={styles.inputField}
                type="email"
                id="email"
                name="email"
                placeholder="vinijr23@gmail.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Dirección (full-width) */}
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.labelText} htmlFor="direccion">
                Dirección:
              </label>
              <input
                className={styles.inputField}
                type="text"
                id="direccion"
                name="direccion"
                placeholder="c/ Alberto Aguilera 23, Piso 3, 3º A"
                required
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
              />
            </div>

            {/* Comunidad */}
            <div className={styles.formGroup}>
              <label className={styles.labelText} htmlFor="comunidad">
                Comunidad Autónoma:
              </label>
              <select
                className={styles.inputField}
                id="comunidad"
                name="comunidad"
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

            {/* Ciudad */}
            <div className={styles.formGroup}>
              <label className={styles.labelText} htmlFor="ciudad">
                Ciudad:
              </label>
              <select
                className={styles.inputField}
                id="ciudad"
                name="ciudad"
                required
                disabled={!ciudades.length}
              >
                <option value="">-- Selecciona tu ciudad --</option>
                {ciudades.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Contraseña */}
            <div className={styles.formGroup}>
              <label className={styles.labelText} htmlFor="contraseña">
                Contraseña:
              </label>
              <input
                className={styles.inputField}
                type="password"
                id="contraseña"
                name="contraseña"
                minLength={8}
                required
                value={pass1}
                onChange={(e) => setPass1(e.target.value)}
              />
            </div>

            {/* Confirmación de contraseña */}
            <div className={styles.formGroup}>
              <label className={styles.labelText} htmlFor="contraseña2">
                Confirmación contraseña:
              </label>
              <input
                className={styles.inputField}
                type="password"
                id="contraseña2"
                name="contraseña2"
                minLength={8}
                required
                value={pass2}
                onChange={(e) => setPass2(e.target.value)}
              />
              <p id="error_msg" style={{ color: "red" }}>{errorMsg}</p>
            </div>

            {/* Imagen */}
            <div className={styles.formGroup}>
              <label className={styles.labelText} htmlFor="myfile">
                Imagen:
              </label>
              <input className={styles.inputField} type="file" id="myfile" name="myfile" />
            </div>

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

      <footer>
        Creado por <b>Gonzalo Borrachero y Luis García</b> - <i>2025</i>
      </footer>
    </div>
  );
}
