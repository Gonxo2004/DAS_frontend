"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./mainnav.module.css"; // Tus estilos

function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  // Función para actualizar el estado del login
  const updateLoginStatus = () => {
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);
  };

  useEffect(() => {
    // Comprueba si existe un token en localStorage al montar el componente
    updateLoginStatus();

    // Agrega listener para el evento "logout" (o cualquier otro evento personalizado que uses)
    window.addEventListener("logout", updateLoginStatus);

    // Limpia el listener al desmontar
    return () => {
      window.removeEventListener("logout", updateLoginStatus);
    };
  }, []);

  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <Link className={styles.home} href="/">
          <img
            className={styles.homeLogo}
            alt="Home"
            src="/imgs/logo.webp"
            width={200}
            height={100}
          />
        </Link>
        <Link href="/subastas">Productos destacados</Link>
        {/* Si el usuario no está logueado, mostramos Registro y Login */}
        {!loggedIn && (
          <>
            <Link href="/registro">Registro</Link>
            <Link href="/login">Login</Link>
          </>
        )}
        {loggedIn && (
          <Link href="/usuario" className={styles.accountLink}>
            Mi cuenta
          </Link>
        )}
      </div>

      <div className={styles.center}>
        {/* Formulario GET apunta a /subastas con ?search=... */}
        <form action="/subastas" method="get">
          <input
            type="text"
            name="search"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchBar}
          />
          <button type="submit" className={styles.searchButton}>
            🔍
          </button>
        </form>
      </div>

      <div className={styles.right}>
        {/* Enlace a la Wishlist */}
        <Link href="/wishlist" className={styles.wishlistLink}>
          Wishlist
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
