"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./page.module.css"; // Puedes definir estilos específicos para el detalle

export default function AuctionDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Primero, intenta buscar la subasta en localStorage (subastas creadas por el usuario)
    const storedSubastas = JSON.parse(localStorage.getItem("subastas")) || [];
    const localAuction = storedSubastas.find((a) => a.id === id);
    if (localAuction) {
      setAuction(localAuction);
      setLoading(false);
    } else {
      // Si no es una subasta creada localmente, intenta obtener el producto de la API
      fetch(`https://fakestoreapi.com/products/${id}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Producto no encontrado");
          }
          return res.json();
        })
        .then((apiProduct) => {
          setAuction(apiProduct);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching product details:", error);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) return <div>Cargando detalles...</div>;

  if (!auction)
    return (
      <div>
        <p>No se encontró el producto</p>
        <button onClick={() => router.back()}>Volver</button>
      </div>
    );

  return (
    <div className={styles.detailContainer}>
      <h1>{auction.titulo || auction.title}</h1>
      <img
        src={auction.imagen || auction.image}
        alt={auction.titulo || auction.title}
        className={styles.productImage}
      />
      <p>{auction.descripcion || auction.description}</p>
      <p>
        <strong>
          Precio de {auction.titulo ? "salida" : "venta"}:
        </strong>{" "}
        {auction.precioSalida || auction.price}€
      </p>
      {/* Si el producto es una subasta creada localmente, podrías agregar un botón para editarla */}
      {auction.titulo && (
        <button
          onClick={() => router.push(`/subastas/${id}/editar`)}
          className={styles.editButton}
        >
          Editar Subasta
        </button>
      )}
      <button onClick={() => router.back()} className={styles.backButton}>
        Volver
      </button>
    </div>
  );
}
