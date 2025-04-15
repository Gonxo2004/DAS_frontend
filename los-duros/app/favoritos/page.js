"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.css";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      // Cargamos la wishlist solo si el usuario está logueado
      const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      setWishlist(storedWishlist);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Función para eliminar un producto de la wishlist
  const handleRemove = (id) => {
    const updated = wishlist.filter((product) => product.id !== id);
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  if (!isLoggedIn) {
    return (
      <div>
        <header>
          <h1>Mi Wishlist</h1>
        </header>
        <main>
          <p>Debes estar logueado para tener tu wishlist.</p>
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
        <h1>Mis Favoritos</h1>
        {/* Botón para volver a Subastas */}
        <Link href="/subastas">
          <button className={styles.btn}>Ir a Subastas</button>
        </Link>
      </header>

      <main>
        {wishlist.length === 0 ? (
          <p>No hay productos en tu wishlist.</p>
        ) : (
          <section className={styles.searchResults}>
            {wishlist.map((product) => (
              <article key={product.id} className={styles.product}>
                <h4>{product.title}</h4>
                <Link href={`/subastas/${product.id}`}>
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className={styles.clickableImg}
                  />
                </Link>
                <p>{product.description}</p>
                <p>
                  <strong>Precio inicial:</strong> {product.price}€
                </p>
                <Link href={`/subastas/${product.id}`}>
                  <button className={styles.btn}>Ver más</button>
                </Link>
                {/* Botón para eliminar de la wishlist */}
                <button
                  onClick={() => handleRemove(product.id)}
                  className={styles.btn}
                >
                  Eliminar de favoritos
                </button>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
