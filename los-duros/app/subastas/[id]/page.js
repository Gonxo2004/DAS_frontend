"use client"; // Necesario porque usamos useState y useEffect

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // Para recoger el id
import Link from "next/link"; // Para la navegación
import Reader from "../../../components/Reader"; // Ajusta la ruta según corresponda
import styles from "./page.module.css";

export default function ProductDetailPage() {
  const { id } = useParams(); // Obtenemos el id desde la URL
  const [product, setProduct] = useState(null);
  const [bidValue, setBidValue] = useState("");
  const [bidMessage, setBidMessage] = useState("");

  // Función para convertir una fecha a formato YYYY-MM-DD
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date)) return "";
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (!id) return; // Evita llamadas si `id` aún no está
    console.log("Cargando producto con id:", id);
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then((res) => {
        if (!res.ok) {
          console.error("Error en la respuesta del API:", res.status);
          throw new Error("Error al obtener el producto");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Datos recibidos:", data);
        // Aseguramos que las fechas tengan el formato correcto
        data.fechaCreacion = formatDate(data.fechaCreacion);
        data.fechaLimite = formatDate(data.fechaLimite);
        setProduct(data);
      })
      .catch((err) => console.error("Error fetching product:", err));
  }, [id]);

  // Función de puja
  function handleBid(minimumBid) {
    const currentBid = parseFloat(bidValue) || 0;
    if (currentBid < minimumBid) {
      setBidMessage(`La puja debe ser mayor a ${minimumBid}€`);
    } else {
      setBidMessage("¡Puja realizada con éxito!");
    }
  }

  // Función para añadir a la wishlist
  function handleAddToWishlist(product) {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const exists = wishlist.some((item) => item.id === product.id);
    if (!exists) {
      wishlist.push(product);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }
  }

  if (!product) {
    return <p className={styles.loading}>Cargando producto...</p>;
  }

  return (
    <Reader>
      <div className={styles.detailContainer}>
        <main className={styles.mainContent}>
          {/* Sección de imágenes */}
          <div className={styles.imagesSection}>
            <img
              src={product.image}
              alt={product.title}
              className={styles.mainImage}
            />
          </div>

          {/* Sección de información */}
          <div className={styles.infoSection}>
            <h2>{product.title}</h2>
            <p className={styles.description}>{product.description}</p>
            <p className={styles.price}>
              <strong>Precio mínimo para la puja:</strong> {product.price}€
            </p>

            <input
              type="number"
              placeholder="Introduce tu puja"
              min={product.price}
              step="0.01"
              value={bidValue}
              onChange={(e) => setBidValue(e.target.value)}
              className={styles.inputBid}
            />
            <p className={styles.bidMessage}>{bidMessage}</p>

            <button
              className={styles.bidButton}
              onClick={() => handleBid(product.price)}
            >
              ¡Pujar ahora!
            </button>

            {/* Botón para añadir a la wishlist */}
            <button
              className={styles.wishlistButton}
              onClick={() => handleAddToWishlist(product)}
            >
              Añadir a Wishlist
            </button>

            <Link href="/subastas">
              <button className={styles.backButton}>
                ← Volver a subastas
              </button>
            </Link>
          </div>
        </main>
      </div>
    </Reader>
  );
}
