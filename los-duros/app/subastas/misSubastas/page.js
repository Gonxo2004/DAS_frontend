"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.css";

export default function MisSubastasPage() {
  const [subastas, setSubastas] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      const storedSubastas = JSON.parse(localStorage.getItem("subastas")) || [];
      setSubastas(storedSubastas);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Función para eliminar una subasta
  const handleRemove = (id) => {
    const updated = subastas.filter((auction) => auction.id !== id);
    setSubastas(updated);
    localStorage.setItem("subastas", JSON.stringify(updated));
  };

  if (!isLoggedIn) {
    return (
      <div>
        <header>
          <h1>Mis Subastas Públicas</h1>
        </header>
        <main>
          <p>Debes estar logueado para ver tus subastas.</p>
          <Link href="/login">
            <button className={styles.btn}>Inicia sesión</button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div>
      <header>
        <h1>Mis Subastas Públicas</h1>
        <div className={styles.buttonGroup}>
          <Link href="/subastas">
            <button className={styles.btn}>Volver al catálogo de subastas</button>
          </Link>
          {/* Botón añadido para crear una nueva subasta */}
          <Link href="/subastas/crear">
            <button className={styles.btn}>Añadir Subasta</button>
          </Link>
        </div>
      </header>
      <main>
        {subastas.length === 0 ? (
          <p>No has creado ninguna subasta aún.</p>
        ) : (
          <section className={styles.searchResults}>
            {subastas.map((auction) => (
              <article key={auction.id} className={styles.product}>
                <h4>{auction.titulo}</h4>
                <img
                  src={auction.imagen}
                  alt={auction.titulo}
                  className={styles.clickableImg}
                />
                <p>{auction.descripcion}</p>
                <p>
                  <strong>Precio de salida:</strong> {auction.precioSalida}€
                </p>
                <div className={styles.buttonGroup}>
                  {/* Enlace a la página de edición */}
                  <Link href={`/subastas/${auction.id}/editar`}>
                    <button className={styles.btn}>Editar Subasta</button>
                  </Link>
                  <button
                    onClick={() => handleRemove(auction.id)}
                    className={styles.btn}
                  >
                    Eliminar Subasta
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
