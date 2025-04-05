"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.css"; // Usa este nuevo CSS

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

  // Función para eliminar una subasta (opcional)
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
        <Link href="/subastas">
          <button className={styles.btn}>Volver a Subastas</button>
        </Link>
      </header>
      <main>
        {subastas.length === 0 ? (
          <p>No has creado ninguna subasta aún.</p>
        ) : (
          <section className={styles.searchResults}>
            {subastas.map((auction) => (
              <article key={auction.id} className={styles.product}>
                <h4>{auction.titulo}</h4>
                <Link href={`/subastas/${auction.id}`}>
                  <img
                    src={auction.imagen}
                    alt={auction.titulo}
                    className={styles.clickableImg}
                  />
                </Link>
                <p>{auction.descripcion}</p>
                <p>
                  <strong>Precio de salida:</strong> {auction.precioSalida}€
                </p>
                <Link href={`/subastas/${auction.id}`}>
                  <button className={styles.btn}>Ver Detalles</button>
                </Link>
                {/* Botón para eliminar la subasta (opcional) */}
                <button onClick={() => handleRemove(auction.id)} className={styles.btn}>
                  Eliminar Subasta
                </button>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
