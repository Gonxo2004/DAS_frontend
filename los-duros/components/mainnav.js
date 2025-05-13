"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./mainnav.module.css";

function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const updateLoginStatus = () => {
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);
  };

  useEffect(() => {

    updateLoginStatus();

    window.addEventListener("logout", updateLoginStatus);

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
        {!loggedIn && (
          <>
            <Link href="/registro">Registro</Link>
            <Link href="/login">Login</Link>
          </>
        )}
        {loggedIn && (
          <>
            <Link href="/perfil" className={styles.accountLink}>
              Mi cuenta
            </Link>
          </>
        )}
      </div>

      <div className={styles.center}>
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
      <Link href="/subastas/misPujas" className={styles.myAuctionsLink}>
          Mis Pujas
        </Link>
        <Link href="/subastas/misSubastas" className={styles.myAuctionsLink}>
          Mis Subastas
        </Link>
        <Link href="/favoritos" className={styles.wishlistLink}>
          Favoritos
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
