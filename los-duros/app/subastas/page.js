"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";
import Reader from "../../components/Reader";

export default function SearchResults() {
  // Lee el valor de 'search' de la URL (e.g. ?search=zapatos)
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Filtra los productos con el texto de búsqueda
  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Reader>
      <div>
        <header>
          <h1>PRODUCTOS DESTACADOS</h1>
        </header>
        <main>
          {loading ? (
            <p>Cargando productos...</p>
          ) : (
            <section id="search-results" className={styles.searchResults}>
              {filteredProducts.map((product) => (
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
                    <input
                      type="button"
                      value="See Details"
                      className={styles.detailsButton}
                    />
                  </Link>

                  <input
                    type="button"
                    value="Add to Wishlist"
                    onClick={() =>
                      console.log("Added to wishlist:", product.id)
                    }
                  />
                </article>
              ))}
            </section>
          )}
        </main>
      </div>
    </Reader>
  );
}
