"use client";
import React from "react";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div>
      <main className={styles.content}>
        <section className={styles.categorias}>
          <h2>Explora por Categorías</h2><br></br>
          <div className={styles["categoria-grid"]}>
            <a href="/subastas" className={styles["categoria-item"]}>
              <img src="/imgs/tecnologia.png" alt="Electrónica" />
              <br />
              <span>Electrónica</span>
            </a>
            <a href="/subastas" className={styles["categoria-item"]}>
              <img src="/imgs/hogar.avif" alt="Electrónica" />
              <br />
              <span>Hogar</span>
            </a>
            <a href="/subastas" className={styles["categoria-item"]}>
              <img src="/imgs/moda.png" alt="Electrónica" />
              <br />
              <span>Moda</span>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
