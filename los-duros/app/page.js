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
    if (token && storedFirstName) {
      setIsLoggedIn(true);
      setFirstName(storedFirstName);
    }
  }, []);



  return (
    <>
      <section className={styles.heroSection}>
        <div className={styles.overlay}>
          <div className={styles.hero}>
            <h1 className={styles.heroTitle}>
              {isLoggedIn && firstName
                ? `¡Hola, ${firstName}!`
                : "Bienvenido a Los Duros"}
            </h1>
            <p className={styles.heroSubtitle}>
              Descubre subastas únicas al mejor precio.
            </p>
            <Link href="/subastas" className={styles.button}>
              Ver Subastas
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}