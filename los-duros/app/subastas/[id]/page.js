"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar"; // Ajusta la ruta según tu estructura
import styles from "./page.module.css";

export default function SearchResults() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Realiza la petición a la API cuando se monta el componente
  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <header>
        <Navbar />
        <h1>Detalles de Búsqueda</h1>
      </header>

      <main>
        {loading ? (
          <p>Cargando productos...</p>
        ) : (
          <section id="search-results" className={styles.searchResults}>
            {products.map((product) => (
              <article key={product.id} className={styles.product}>
                <h4>{product.title}</h4>
                <img
                  src={product.image}
                  alt={product.title}
                  onClick={() => window.location.assign(`/product/${product.id}`)}
                />
                <p>{product.description}</p>
                <p>
                  <strong>Precio mínimo para la puja:</strong> {product.price}€
                </p>
                <input
                  type="button"
                  value="See Details"
                  onClick={() => window.location.assign(`/product/${product.id}`)}
                />
                <input
                  type="button"
                  value="Add to Wishlist"
                  onClick={() => console.log("Added to wishlist:", product.id)}
                />
              </article>
            ))}
          </section>
        )}
      </main>

      <footer>
        Creado por <b>Gonzalo Borrachero y Luis García</b> - <i>2025</i>
      </footer>
    </div>
  );
}
