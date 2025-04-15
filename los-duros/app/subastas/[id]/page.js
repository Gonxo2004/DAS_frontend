"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function AuctionDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [newBidAmount, setNewBidAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setIsLoggedIn(true);

    const fetchData = async () => {
      try {
        // 1) Obtener los dos fetch de forma simultánea
        const [auctionRes, bidsRes] = await Promise.all([
          fetch(`http://127.0.0.1:8000/api/auctions/${id}/`),
          fetch(`http://127.0.0.1:8000/api/auctions/${id}/bid/`),
        ]);

        // 2) Revisar si la respuesta no es "ok" => HTML de error
        if (!auctionRes.ok) {
          // Parsear texto (por si es HTML) para ver más detalles en consola
          const errorText = await auctionRes.text();
          console.error("Error en auctionRes:", errorText);
          throw new Error("No se encontró la subasta o hubo un error en el servidor.");
        }

        if (!bidsRes.ok) {
          const errorText = await bidsRes.text();
          console.error("Error en bidsRes:", errorText);
          throw new Error("No se encontraron pujas o hubo un error en el servidor.");
        }

        // 3) Asegurar que sean JSON válidos
        let auctionData;
        let bidData;
        try {
          auctionData = await auctionRes.json();
        } catch (jsonErr) {
          console.error("No se pudo parsear la subasta como JSON:", jsonErr);
          throw new Error("La respuesta de la subasta no es JSON válido.");
        }

        try {
          bidData = await bidsRes.json();
        } catch (jsonErr) {
          console.error("No se pudo parsear las pujas como JSON:", jsonErr);
          throw new Error("La respuesta de las pujas no es JSON válido.");
        }

        // 4) Guardar subasta
        setAuction(auctionData);

        // 5) Ordenar pujas de mayor a menor precio
        const sorted = (bidData.results || []).sort((a, b) => b.price - a.price);
        setBids(sorted);
      } catch (err) {
        console.error("Error cargando datos:", err);
        setErrorMsg(err.message || "No se pudo cargar la información de la subasta.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (!auction) return;
  
    const updateTimeLeft = () => {
      const now = new Date();
      const end = new Date(auction.closing_date);
      const diff = end - now;
  
      if (diff <= 0) {
        setTimeLeft("Subasta cerrada");
        return;
      }
  
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };
  
    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [auction]);

  const handleBidSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMsg("Debes iniciar sesión para pujar.");
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/auctions/${id}/bid/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ price: parseInt(newBidAmount) }),
      });

      if (!response.ok) {
        // si el servidor responde con error (puede venir JSON con error o HTML)
        const errorText = await response.text();
        console.error("Error en POST bid:", errorText);
        throw new Error(errorText || "Error al realizar la puja.");
      }

      // Si está todo bien, parsear la nueva puja
      let nuevaPuja;
      try {
        nuevaPuja = await response.json();
      } catch (jsonErr) {
        console.error("No se pudo parsear la nueva puja como JSON:", jsonErr);
        throw new Error("La respuesta de la puja no es JSON válido.");
      }

      // Añadir la nueva puja y reordenar
      setBids((prev) => [nuevaPuja, ...prev].sort((a, b) => b.price - a.price));

      setSuccessMsg("¡Puja realizada con éxito!");
      setNewBidAmount("");
    } catch (error) {
      console.error("Error al pujar:", error);
      setErrorMsg(error.message);
    }
  };

  // mientras cargamos, mostramos un texto
  if (loading) {
    return <div className={styles.detailContainer}>Cargando detalles...</div>;
  }

  // si ha habido un error, mostramos un mensaje
  if (errorMsg) {
    return (
      <div className={styles.detailContainer}>
        <p className={styles.errorMsg}>{errorMsg}</p>
        <button onClick={() => router.back()}>Volver</button>
      </div>
    );
  }

  // si no hay subasta
  if (!auction) {
    return (
      <div className={styles.detailContainer}>
        <p>No se encontró la subasta.</p>
        <button onClick={() => router.back()}>Volver</button>
      </div>
    );
  }

  const closingDate = new Date(auction.closing_date).toLocaleString();

  return (
    <div className={styles.detailContainer}>
      <button onClick={() => router.back()} className={styles.backButton}>
        Volver
      </button>

      <div className={styles.auctionDetailWrapper}>
        {/* Imagen */}
        <div className={styles.imageFrame}>
          <img
            src={auction.thumbnail}
            alt={auction.title}
            className={styles.auctionImage}
          />
        </div>

        {/* Descripción */}
        <div className={styles.detailsInfo}>
          <h1>{auction.title}</h1>
          <p><strong>Descripción:</strong> {auction.description}</p>
          <p><strong>Precio inicial:</strong> {auction.price}€</p>
          <p><strong>Rating:</strong> {auction.rating}</p>
          <p><strong>Fecha de cierre:</strong> {closingDate}</p>
          <p><strong>Tiempo restante:</strong> {timeLeft}</p>
          <p><strong>Stock:</strong> {auction.stock}</p>
          <p><strong>Marca:</strong> {auction.brand}</p>
          <p><strong>Vendedor:</strong> {auction.auctioneer}</p>
        </div>

        {/* Pujas */}
        <div className={styles.bidSection}>

          <h2>Historial de pujas</h2>
          {bids.length === 0 ? (
            <p>No hay pujas aún.</p>
          ) : (
            <ul className={styles.bidList}>
              {bids.map((bid, index) => (
                <li
                  key={bid.id}
                  className={styles.bidItem}
                  // Si es la primera en la lista (mayor precio), la resaltamos
                  style={{ fontWeight: index === 0 ? "bold" : "normal" }}
                >
                  <strong>  {bid.bidder}</strong>: {bid.price}€
                </li>
              ))}
            </ul>
          )}

          {/* Formulario de pujas */}
          {isLoggedIn && (
            <>
              <form onSubmit={handleBidSubmit} className={styles.bidForm}>
                <label htmlFor="bidAmount"><strong>Tu puja:</strong></label>
                <input
                  type="number"
                  id="bidAmount"
                  value={newBidAmount}
                  onChange={(e) => setNewBidAmount(e.target.value)}
                  required
                  min={bids[0] ? bids[0].price + 1 : 1}
                />
                <button type="submit">Pujar</button>
              </form>

              {/* Mensajes de éxito / error */}
              {errorMsg && <p className={styles.errorMsg}>{errorMsg}</p>}
              {successMsg && <p className={styles.successMsg}>{successMsg}</p>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
