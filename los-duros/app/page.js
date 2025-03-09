"use client";
import React from "react";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div>
      <main className={styles.content}>
        <section className={styles.categorias}>
          <h2>Explora por Categorías</h2>
          <br />
          <div className={styles["categoria-grid"]}>
            
            {/* Category: electronics */}
            <Link
              href="/subastas?category=electronics"
              className={styles["categoria-item"]}
            >
              <img src="/imgs/tecnologia.png" alt="Electrónica" />
              <br />
              <span>Electrónica</span>
            </Link>

            {/* Category: jewelery (La API lo maneja como joyería.
                En tu ejemplo lo usaste como Hogar, pero aquí lo mostramos tal cual. */}
            <Link
              href="/subastas?category=jewelery"
              className={styles["categoria-item"]}
            >
              <img src="/imgs/joyas.png" alt="Joyas" />
              <br />
              <span>Joyas</span>
            </Link>

            {/* Category: men's clothing (si quieres usar "moda" o "ropa hombre", puedes cambiar el texto) */}
            <Link
              href="/subastas?category=men%27s%20clothing"
              className={styles["categoria-item"]}
            >
              <img src="/imgs/ropa-hombre.png" alt="Ropa de Hombre" />
              <br />
              <span>Ropa de Hombre</span>
            </Link>

            {/* Category: women's clothing */}
            <Link
              href="/subastas?category=women%27s%20clothing"
              className={styles["categoria-item"]}
            >
              <img src="/imgs/ropa-mujer.png" alt="Ropa de Mujer" />
              <br />
              <span>Ropa de Mujer</span>
            </Link>

            {/* Si quieres seguir mostrando tu "Modas" genérico que filtre hombre y mujer a la vez,
                puedes añadirlo así (luego lo mapearás en tu página de subastas): */}
            <Link
              href="/subastas?category=moda"
              className={styles["categoria-item"]}
            >
              <img src="/imgs/chico-chica.png" alt="Moda Mixta" />
              <br />
              <span>Moda (H/M)</span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
