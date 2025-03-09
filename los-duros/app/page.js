"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  const [firstName, setFirstName] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedFirstName = localStorage.getItem("username");
    console.log("Token:", token, "First Name:", storedFirstName);
    if (token && storedFirstName) {
      setIsLoggedIn(true);
      setFirstName(storedFirstName);
    }
  }, []);

  return (
    <div>
      <main className={styles.content}>
        {isLoggedIn && firstName && (
          <div className={styles.welcomeMessage}>
            <h2>Bienvenido/a de nuevo {firstName}!</h2>
          </div>
        )}
        <section className={styles.categorias}>
          <h2>Explora por Categorías</h2>
          <br />
          <div className={styles["categoria-grid"]}>
            <Link
              href="/subastas?category=electronics"
              className={styles["categoria-item"]}
            >
              <img src="/imgs/tecnologia.png" alt="Electrónica" />
              <br />
              <span>Electrónica</span>
            </Link>
            <Link
              href="/subastas?category=jewelery"
              className={styles["categoria-item"]}
            >
              <img src="/imgs/joyas.png" alt="Joyas" />
              <br />
              <span>Joyas</span>
            </Link>
            <Link
              href="/subastas?category=men%27s%20clothing"
              className={styles["categoria-item"]}
            >
              <img src="/imgs/ropa-hombre.png" alt="Ropa de Hombre" />
              <br />
              <span>Ropa de Hombre</span>
            </Link>
            <Link
              href="/subastas?category=women%27s%20clothing"
              className={styles["categoria-item"]}
            >
              <img src="/imgs/ropa-mujer.png" alt="Ropa de Mujer" />
              <br />
              <span>Ropa de Mujer</span>
            </Link>
            <Link
              href="/subastas?category=moda"
              className={styles["categoria-item"]}
            >
              <img src="/imgs/chico-chica.png" alt="Moda Mixta" />
              <br />
              <span>Moda (H/M)</span>
            </Link>
            {/* Filtros de Rango de Precios */}
            <section className={styles.filtros}>
              <h2>Filtrar por Rango de Precios</h2>
              <br />
              <div className={styles["categoria-grid"]}>
                <Link
                  href="/subastas?priceMin=0&priceMax=50"
                  className={styles["categoria-item"]}
                >
                  <br />
                  <span>€0 - €50</span>
                </Link>
                <Link
                  href="/subastas?priceMin=50&priceMax=100"
                  className={styles["categoria-item"]}
                >
                  <br />
                  <span>€50 - €100</span>
                </Link>
                <Link
                  href="/subastas?priceMin=100&priceMax=200"
                  className={styles["categoria-item"]}
                >
                  <br />
                  <span>€100 - €200</span>
                </Link>
                <Link
                  href="/subastas?priceMin=200"
                  className={styles["categoria-item"]}
                >
                  <br />
                  <span>€200+</span>
                </Link>
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}
