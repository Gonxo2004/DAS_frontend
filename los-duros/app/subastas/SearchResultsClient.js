"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

/**
 * Página de listado de subastas / productos destacados con filtros:
 *   • Texto, categoría, rango de precios (min-max)
 *   • Valoración mínima ★ (obtenida del backend)
 *   • Estado (abiertas / cerradas)
 *
 * Para disponer de la valoración media (average_rating) aunque el endpoint
 * /api/auctions/ no la devuelva, hacemos una petición adicional por cada
 * subasta a /api/auctions/{id}/ y la añadimos al objeto antes de filtrar.
 */
export default function SubastasPage() {
  const searchParams = useSearchParams();

  /* ───── valores iniciales (por query-string) ───── */
  const initialSearch    = searchParams.get("search")    || "";
  const initialCategory  = searchParams.get("category")  || "";
  const initialPriceMin  = searchParams.get("priceMin")  || "0";
  const initialPriceMax  = searchParams.get("priceMax")  || "50000";
  const initialRatingMin = searchParams.get("minRating") || "";   // ★
  const initialStatus    = searchParams.get("status")    || "";   // abierta / cerrada / ""

  /* ───── estados de filtros ───── */
  const [filterSearch,    setFilterSearch]    = useState(initialSearch);
  const [filterCategory,  setFilterCategory]  = useState(initialCategory);
  const [filterPriceMin,  setFilterPriceMin]  = useState(initialPriceMin);
  const [filterPriceMax,  setFilterPriceMax]  = useState(initialPriceMax);
  const [filterRatingMin, setFilterRatingMin] = useState(initialRatingMin);
  const [filterStatus,    setFilterStatus]    = useState(initialStatus);

  /* ───── datos y control de UI ───── */
  const [categories, setCategories] = useState([]);
  const [products,   setProducts]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [showFilters,setShowFilters]= useState(false);

  /* ───── cargar categorías (una vez) ───── */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/auctions/categories/");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setCategories(data.results ?? data ?? []);
      } catch (err) {
        console.error("Error al cargar categorías:", err);
        setCategories([]);
      }
    })();
  }, []);

  /* ───── cargar subastas cada vez que cambie un filtro ───── */
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        /* filtros que soporta la API */
        const p = new URLSearchParams();
        if (filterSearch.length >= 3) p.append("search",      filterSearch);
        if (filterCategory)           p.append("category_id", filterCategory);
        if (filterPriceMin)           p.append("min_price",   filterPriceMin);
        if (filterPriceMax)           p.append("max_price",   filterPriceMax);

        const listRes = await fetch(`http://127.0.0.1:8000/api/auctions/?${p.toString()}`);
        if (!listRes.ok) throw new Error(`HTTP ${listRes.status}`);
        let fetched = (await listRes.json()).results ?? [];

        /* ───── enriquecemos cada subasta con average_rating ───── */
        fetched = await Promise.all(
          fetched.map(async (a) => {
            // Si ya viene average_rating, no hacemos nada
            if (a.average_rating !== undefined && a.average_rating !== null) {
              return a;
            }
            try {
              const detailRes = await fetch(`http://127.0.0.1:8000/api/auctions/${a.id}/`);
              if (detailRes.ok) {
                const detail = await detailRes.json();
                return { ...a, average_rating: detail.average_rating };
              }
            } catch (e) {
              console.warn(`No se pudo obtener rating para subasta ${a.id}`);
            }
            return { ...a, average_rating: null };
          })
        );

        /* ───── filtros aplicados en cliente ───── */
        let filtered = [...fetched];

        if (filterRatingMin) {
          const min = Number(filterRatingMin);
          filtered = filtered.filter(
            (a) => a.average_rating !== null && a.average_rating >= min
          );
        }
        if (filterStatus) {
          const now = new Date();
          filtered = filtered.filter((a) => {
            const open = new Date(a.closing_date) > now;
            return filterStatus === "abiertas" ? open : filterStatus === "cerradas" ? !open : true;
          });
        }

        setProducts(filtered);
      } catch (err) {
        console.error("Error al cargar subastas:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [
    filterSearch,
    filterCategory,
    filterPriceMin,
    filterPriceMax,
    filterRatingMin,
    filterStatus,
  ]);

  /* ───── reset filtros ───── */
  const handleResetFilters = () => {
    setFilterSearch("");
    setFilterCategory("");
    setFilterPriceMin("0");
    setFilterPriceMax("50000");
    setFilterRatingMin("");
    setFilterStatus("");
  };

  /* ───── wishlist (localStorage) ───── */
  const handleAddToWishlist = (product) => {
    const wl = JSON.parse(localStorage.getItem("wishlist") || "[]");
    if (!wl.some((i) => i.id === product.id)) {
      localStorage.setItem("wishlist", JSON.stringify([...wl, product]));
    }
  };

  /* ───── render ───── */
  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.filtersHeader}>
        <h1 style={{ textAlign: "center", width: "100%" }}>PRODUCTOS DESTACADOS</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={styles.hamburgerButton}
        >
          <span className={styles.hamburger} />
          <span className={styles.hamburger} />
          <span className={styles.hamburger} />
        </button>
      </div>

      {/* Panel de filtros */}
      {showFilters && (
        <div className={styles.filtersDropdown}>
          <form className={styles.filterForm} onSubmit={(e) => e.preventDefault()}>
            {/* búsqueda */}
            <input
              type="text"
              placeholder="Buscar productos…"
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
              className={styles.filterInput}
            />

            {/* categoría */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">Todas las categorías</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            {/* precio */}
            <div className={styles.sliderContainer}>
              <label>Precio mínimo: <strong>{filterPriceMin}€</strong></label>
              <input
                type="range" min="0" max="50000" step="10"
                value={filterPriceMin}
                onChange={(e) => setFilterPriceMin(e.target.value)}
                className={styles.filterSlider}
              />
            </div>
            <div className={styles.sliderContainer}>
              <label>Precio máximo: <strong>{filterPriceMax}€</strong></label>
              <input
                type="range" min="0" max="50000" step="10"
                value={filterPriceMax}
                onChange={(e) => setFilterPriceMax(e.target.value)}
                className={styles.filterSlider}
              />
            </div>

            {/* rating mínimo */}
            <select
              value={filterRatingMin}
              onChange={(e) => setFilterRatingMin(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">Todas las valoraciones</option>
              <option value="1">1★ o más</option>
              <option value="2">2★ o más</option>
              <option value="3">3★ o más</option>
              <option value="4">4★ o más</option>
              <option value="5">5★</option>
            </select>

            {/* estado */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">Abiertas y cerradas</option>
              <option value="abiertas">Solo abiertas</option>
              <option value="cerradas">Solo cerradas</option>
            </select>

            <div className={styles.buttonsContainer}>
              <button type="button" onClick={handleResetFilters} className={styles.resetButton}>
                Resetear filtros
              </button>
            </div>
          </form>
        </div>
      )}

      {/* listado */}
      <main className={styles.mainResults}>
        {loading ? (
          <p>Cargando productos…</p>
        ) : (
          <section className={styles.searchResults}>
            {products.map((p) => (
              <article key={p.id} className={styles.product}>
                <h4>{p.title}</h4>
                <Link href={`/subastas/${p.id}`}>
                  <img
                    src={p.thumbnail}
                    alt={p.title}
                    className={styles.clickableImg}
                  />
                </Link>
                <p><strong>Precio inicial:</strong> {p.price}€</p>
                <p>
                  <strong>Valoración media:</strong>{" "}
                  {p.average_rating !== null && p.average_rating !== undefined
                    ? p.average_rating.toFixed(2)
                    : "Sin valoraciones"}
                </p>
                <div className={styles.productButtons}>
                  <Link href={`/subastas/${p.id}`}>
                    <button className={styles.detailsButton}>Ver más</button>
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleAddToWishlist(p)}
                    className={styles.wishlistButton}
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
