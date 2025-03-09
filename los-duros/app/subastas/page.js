"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

export default function SearchResults() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const categoryQuery = searchParams.get("category") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carga los productos de la FakeStoreAPI al montar el componente
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

  // Función para manejar categorías desde la URL (igual que antes)
  const mapCategory = (cat) => {
    const lowerCat = cat.toLowerCase();
    switch (lowerCat) {
      case "moda":
        return ["men's clothing", "women's clothing"];
      case "hogar":
        return ["jewelery"];
      case "electronics":
        return ["electronics"];
      case "jewelery":
        return ["jewelery"];
      case "men's clothing":
        return ["men's clothing"];
      case "women's clothing":
        return ["women's clothing"];
      default:
        return null;
    }
  };

  // Función para filtrar productos
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const mappedCategories = mapCategory(categoryQuery);

    if (!mappedCategories || mappedCategories.length === 0) {
      return matchesSearch;
    }

    const matchesCategory = mappedCategories.includes(product.category);
    return matchesSearch && matchesCategory;
  });

  // FUNCIÓN: Agregar producto a la wishlist en localStorage
  const handleAddToWishlist = (product) => {
    // Lee la wishlist actual
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    // Comprueba si ya está en la wishlist para no duplicar
    const exists = wishlist.some((item) => item.id === product.id);
    if (!exists) {
      wishlist.push(product);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      console.log("Producto agregado a wishlist:", product.title);
    } else {
      console.log("El producto ya está en la wishlist");
    }
  };

  return (
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

                {/* Botón para añadir a la wishlist */}
                <input
                  type="button"
                  value="Add to Wishlist"
                  onClick={() => handleAddToWishlist(product)}
                />
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
