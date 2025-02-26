"use client";

import React from "react";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div>
      <header className={styles.eslogan}>
        <h1>PUJA FUERTE Y GANA DURO</h1>
      </header>

      <nav className={styles.navbar}>
        <Link className={styles.home} href="/">
          <img className={styles.homeLogo} src="/imgs/home-logo.webp" alt="Home" />
        </Link>
        <Link href="/subastas">Más buscados</Link>
        <Link href="/registro">Registro</Link>
        <Link href="/login">Login</Link>

        <div className={styles.content}>
          <input type="text" placeholder="Buscar..." className={styles["search-bar"]} />
          <button type="submit" className={styles["search-button"]}>
            🔍
          </button>
        </div>
      </nav>

      <main className={styles.content}>
        <section className={styles.categorias}>
          <h2>Explora por Categorías</h2>
          <div className={styles["categoria-grid"]}>
            <a href="#" className={styles["categoria-item"]}>
              <img src="/imgs/categorias/electronica.png" alt="Electrónica" />
              <br />
              <span>Electrónica</span>
            </a>
          </div>
        </section>
      </main>

      <footer>
        Creado por <b>Gonzalo Borrachero y Luis García</b> - <i>2025</i>
      </footer>
    </div>
  );
}
