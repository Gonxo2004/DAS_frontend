"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

export default function SearchResults() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Valores iniciales desde la URL
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "";
  const initialPriceMin = searchParams.get("priceMin") || "0";
  const initialPriceMax = searchParams.get("priceMax") || "1500";

  // Estados para filtros
  const [filterSearch, setFilterSearch] = useState(initialSearch);
  const [filterCategory, setFilterCategory] = useState(initialCategory);
  const [filterPriceMin, setFilterPriceMin] = useState(initialPriceMin);
  const [filterPriceMax, setFilterPriceMax] = useState(initialPriceMax);

  // Estados para categorías, productos y loading
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // FETCH CATEGORÍAS
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auctions/categories/`);
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data = await res.json();
        // Si se usa paginación, data.results. Si no, data es el array
        const fetchedCategories = data.results !== undefined ? data.results : data;
        setCategories(Array.isArray(fetchedCategories) ? fetchedCategories : []);
      } catch (error) {
        console.error("Error al cargar categorías:", error);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  // Carga de subastas (productos) con filtros del backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (filterSearch.length >= 3) params.append("search", filterSearch);
        if (filterCategory) params.append("category_id", filterCategory);
        if (filterPriceMin) params.append("min_price", filterPriceMin);
        if (filterPriceMax) params.append("max_price", filterPriceMax);

        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/auctions/?${params.toString()}`;
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}`);
        }
        const data = await res.json();
        // Si la API tiene paginación, extraemos data.results
        const fetchedProducts = data.results !== undefined ? data.results : data;
        setProducts(Array.isArray(fetchedProducts) ? fetchedProducts : []);
      } catch (err) {
        console.error("Error al cargar subastas:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filterSearch, filterCategory, filterPriceMin, filterPriceMax]);

  // Resetear filtros
  const handleResetFilters = () => {
    setFilterSearch("");
    setFilterCategory("");
    setFilterPriceMin("0");
    setFilterPriceMax("1500");
  };

  // Agregar un producto a la wishlist (localStorage)
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
    <div className={styles.container}>
      <div className={styles.filtersHeader}>
        <h1 style={{ textAlign: "center", width: "100%" }}>
          PRODUCTOS DESTACADOS
        </h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={styles.hamburgerButton}
          aria-label="Toggle Filters"
        >
          <span className={styles.hamburger}></span>
          <span className={styles.hamburger}></span>
          <span className={styles.hamburger}></span>
        </button>
      </div>

      {showFilters && (
        <div className={styles.filtersDropdown}>
          <form className={styles.filterForm}>
            <input
              type="text"
              placeholder="Buscar productos..."
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
              className={styles.filterInput}
            />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">Todas las categorías</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <div className={styles.sliderContainer}>
              <label>
                Precio mínimo: <strong>{filterPriceMin}€</strong>
              </label>
              <input
                type="range"
                min="0"
                max="10000"
                step="10"
                value={filterPriceMin}
                onChange={(e) => setFilterPriceMin(e.target.value)}
                className={styles.filterSlider}
              />
            </div>
            <div className={styles.sliderContainer}>
              <label>
                Precio máximo: <strong>{filterPriceMax}€</strong>
              </label>
              <input
                type="range"
                min="0"
                max="10000"
                step="10"
                value={filterPriceMax}
                onChange={(e) => setFilterPriceMax(e.target.value)}
                className={styles.filterSlider}
              />
            </div>
            <div className={styles.buttonsContainer}>
              <button
                type="button"
                onClick={handleResetFilters}
                className={styles.resetButton}
              >
                Resetear Filtros
              </button>
            </div>
          </form>
        </div>
      )}

      <main className={styles.mainResults}>
        {loading ? (
          <p>Cargando productos...</p>
        ) : (
          <section className={styles.searchResults}>
            {products.map((product) => (
              <article key={product.id} className={styles.product}>
                <h4>{product.title}</h4>
                <Link href={`/subastas/${product.id}`}>
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className={styles.clickableImg}
                  />
                </Link>
                <p>Descripción: {product.description}</p>
                <p>
                  <strong>Precio inicial:</strong> {product.price}€
                </p>
                <div className={styles.productButtons}>
                  <Link href={`/subastas/${product.id}`}>
                    <button className={styles.detailsButton}>Ver más</button>
                  </Link>
                  <button
                    type="button"
                    className={styles.wishlistButton}
                    onClick={() => handleAddToWishlist(product)}
                  >
                    Añadir a favoritos
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
