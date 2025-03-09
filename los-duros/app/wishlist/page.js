"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.css";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    // Cuando se monta el componente, leemos la wishlist de localStorage
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(storedWishlist);
  }, []);

  // Eliminar un producto de la wishlist
  const handleRemove = (id) => {
    const updated = wishlist.filter((product) => product.id !== id);
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  return (
    <div>
      <header>
        <h1>Mi Wishlist</h1>
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
                    src={product.image}
                    alt={product.title}
                    className={styles.clickableImg}
                  />
                </Link>

                <p>{product.description}</p>
                <p>
                  <strong>Precio mínimo para la puja:</strong> {product.price}€
                </p>

                <Link href={`/subastas/${product.id}`}>
                  <button className={styles.btn}>See Details</button>
                </Link>

                {/* Botón para eliminar de la wishlist */}
                <button
                  onClick={() => handleRemove(product.id)}
                  className={styles.btn}
                >
                  Remove from Wishlist
                </button>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
