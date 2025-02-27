"use client"; // Necesario en App Router si usas useState y useEffect

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Reader from "../../components/Reader"; // Ajusta la ruta de Reader según corresponda
import styles from "./page.module.css"; // Ajusta el path a tu CSS

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
    <Reader>
      <div>
          <main>
          {loading ? (
            <p>Cargando productos...</p>
          ) : (
            <section id="search-results" className={styles.searchResults}>
              {filteredProducts.map((product) => (
                <article key={product.id} className={styles.product}>
                  <h4>{product.title}</h4>

                  {/* Link para ir a /subastas/[id] */}
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

                  {/* Botón "See Details" con <input type="button"> */}
                  <Link href={`/subastas/${product.id}`}>
                    <input
                      type="button"
                      value="See Details"
                      className={styles.detailsButton}
                    />
                  </Link>

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
    </Reader>
  );
}
