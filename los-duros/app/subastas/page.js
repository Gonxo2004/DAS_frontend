"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./page.module.css"; // O el CSS que estés usando

export default function SearchResults() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // Estado para la búsqueda

  // Llamada a la API cuando se monta el componente
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

  // Filtra los productos según el texto de búsqueda
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <header>
        <nav className={styles.navbar}>
          <Link className={styles.home} href="/">
            <img
              className={styles.homeLogo}
              src="/imgs/home-logo.webp"
              alt="Home"
            />
          </Link>
          <Link className={styles.active} href="/resultados_busqueda">
            Más buscados
          </Link>
          <Link href="/registro">Registro</Link>
          <Link href="/login">Login</Link>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Buscar..."
              className={styles.searchBar}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className={styles.searchButton}>
              🔍
            </button>
          </div>
        </nav>
        <h1>Detalles de Búsqueda</h1>
      </header>

      <main>
        {loading ? (
          <p>Cargando productos...</p>
        ) : (
          <section id="search-results" className={styles.searchResults}>
            {filteredProducts.map((product) => (
              <article key={product.id} className={styles.product}>
                <h4>{product.title}</h4>
                <img
                  src={product.image}
                  alt={product.title}
                  onClick={() =>
                    window.location.assign(`/product/${product.id}`)
                  }
                />
                <p>{product.description}</p>
                <p>
                  <strong>Precio mínimo para la puja:</strong> {product.price}€
                </p>
                <input
                  type="button"
                  value="See Details"
                  onClick={() =>
                    window.location.assign(`/product/${product.id}`)
                  }
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
