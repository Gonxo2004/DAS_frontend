"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

export default function SearchResults() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const categoryQuery = searchParams.get("category") || "";
  const priceMinQuery = searchParams.get("priceMin") || "";
  const priceMaxQuery = searchParams.get("priceMax") || "";

  // Convertir parámetros de precio a números (o null si no se indican)
  const priceMin = priceMinQuery ? parseFloat(priceMinQuery) : null;
  const priceMax = priceMaxQuery ? parseFloat(priceMaxQuery) : null;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carga los productos de la API y las subastas creadas en localStorage
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://fakestoreapi.com/products");
        const apiProducts = await res.json();

        // Cargar subastas creadas en localStorage
        const storedSubastas = JSON.parse(localStorage.getItem("subastas")) || [];
        const transformedSubastas = storedSubastas.map((auction) => ({
          id: auction.id,
          title: auction.titulo,
          description: auction.descripcion,
          // Aquí, la imagen ya es un string (data URL)
          image: auction.imagen,
          price: auction.precioSalida,
          category: auction.categoria,
        }));

        // Combinar ambas fuentes
        setProducts([...transformedSubastas, ...apiProducts]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Función para mapear la categoría de la URL a las categorías reales
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

  // Filtrar productos (por búsqueda, categoría y precio)
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const mappedCategories = mapCategory(categoryQuery);
    const matchesCategory =
      !mappedCategories || mappedCategories.length === 0
        ? true
        : mappedCategories.includes(product.category);
    const matchesPrice =
      (priceMin === null || product.price >= priceMin) &&
      (priceMax === null || product.price <= priceMax);
    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Función para agregar producto a la wishlist en localStorage
  const handleAddToWishlist = (product) => {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
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
