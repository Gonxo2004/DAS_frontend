"use client"; // Necesario porque usamos useState y useEffect

import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // Para recoger el id
import Link from "next/link"; // Para la navegación
import Reader from "../../../components/Reader"; // Ajusta la ruta según corresponda
import styles from "./page.module.css";


export default function ProductDetailPage() {
  const { id } = useParams(); // Obtenemos el id desde la URL
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [bidValue, setBidValue] = useState("");
  const [bidMessage, setBidMessage] = useState("");

  useEffect(() => {
    if (!id) return; // Evita llamadas si `id` aún no está
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setMainImage(data.image);
      })
      .catch((err) => console.error("Error fetching product:", err));
  }, [id]);

  // Función para cambiar la imagen principal
  function changeImage(newSrc) {
    setMainImage(newSrc);
  }

  // Función de puja
  function handleBid(minimumBid) {
    const currentBid = parseFloat(bidValue) || 0;
    if (currentBid < minimumBid) {
      setBidMessage(`La puja debe ser mayor a ${minimumBid}€`);
    } else {
      setBidMessage("¡Puja realizada con éxito!");
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
              src={mainImage}
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
