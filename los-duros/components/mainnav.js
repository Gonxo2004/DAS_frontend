"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./mainnav.module.css"; // Tus estilos

function Navbar() {
  // Estado para el input, si quieres controlarlo
  const [searchTerm, setSearchTerm] = useState("");

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
        <Link href="/registro">Registro</Link>
        <Link href="/login">Login</Link>
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
        <Link href="/usuario">
        <img
            className={styles.user}
            alt="User"
            src="/imgs/user.png"
            width={50}
            height={50}
          />
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
