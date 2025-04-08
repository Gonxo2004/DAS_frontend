"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

export default function SearchResults() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extraer valores iniciales de la URL
  const initialSearch = searchParams.get("search") || "";
  const initialCategory = searchParams.get("category") || "";
  const initialPriceMin = searchParams.get("priceMin") || "0";
  const initialPriceMax = searchParams.get("priceMax") || "1000";

  // Estados locales para los filtros (interactivos)
  const [filterSearch, setFilterSearch] = useState(initialSearch);
  const [filterCategory, setFilterCategory] = useState(initialCategory);
  const [filterPriceMin, setFilterPriceMin] = useState(initialPriceMin);
  const [filterPriceMax, setFilterPriceMax] = useState(initialPriceMax);

  // Estados para productos y loading
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estado para mostrar/ocultar el dropdown de filtros
  const [showFilters, setShowFilters] = useState(false);

  // Cargar productos desde la API y localStorage
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("https://fakestoreapi.com/products");
        const apiProducts = await res.json();
        const storedSubastas =
          JSON.parse(localStorage.getItem("subastas")) || [];
        const transformedSubastas = storedSubastas.map((auction) => ({
          id: auction.id,
          title: auction.titulo,
          description: auction.descripcion,
          image: auction.imagen, // La imagen ya es un string (data URL)
          price: auction.precioSalida,
          category: auction.categoria,
        }));
        setProducts([...transformedSubastas, ...apiProducts]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Función para mapear la categoría a las categorías reales
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

  // Filtrar productos en tiempo real usando los estados actuales de los filtros
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(filterSearch.toLowerCase());
    const mappedCategories = mapCategory(filterCategory);
    const matchesCategory =
      !mappedCategories || mappedCategories.length === 0
        ? true
        : mappedCategories.includes(product.category);
    const priceMinValue = parseFloat(filterPriceMin);
    const priceMaxValue = parseFloat(filterPriceMax);
    const matchesPrice =
      product.price >= priceMinValue && product.price <= priceMaxValue;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Función para resetear filtros a sus valores por defecto
  const handleResetFilters = () => {
    setFilterSearch("");
    setFilterCategory("");
    setFilterPriceMin("0");
    setFilterPriceMax("1000");
  };

  // Función para añadir producto a wishlist (localStorage)
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
      {/* Encabezado con título y botón de filtros (hamburguesa) */}
      <div className={styles.filtersHeader}>
        <h1>PRODUCTOS DESTACADOS</h1>
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

      {/* Dropdown de filtros debajo del encabezado */}
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
              <option value="moda">Moda</option>
              <option value="hogar">Hogar</option>
              <option value="electronics">Electronics</option>
              <option value="jewelery">Jewelery</option>
              <option value="men's clothing">Men's Clothing</option>
              <option value="women's clothing">Women's Clothing</option>
            </select>
            <div className={styles.sliderContainer}>
              <label>
                Precio mínimo: <strong>{filterPriceMin}€</strong>
              </label>
              <input
                type="range"
                min="0"
                max="1000"
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
                max="1000"
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
                <div className={styles.productButtons}>
                  <Link href={`/subastas/${product.id}`}>
                    <button className={styles.detailsButton}>
                      See Details
                    </button>
                  </Link>
                  <button
                    type="button"
                    className={styles.wishlistButton}
                    onClick={() => handleAddToWishlist(product)}
                  >
                    +
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
