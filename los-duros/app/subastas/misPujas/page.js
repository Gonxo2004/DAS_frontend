"use client";
import React, { useState, useEffect } from "react";
import styles from "./page.module.css";

export default function BidsSection({ auctionId, auctionFechaLimite }) {
  const [bids, setBids] = useState([]);
  const [newBid, setNewBid] = useState("");
  const [message, setMessage] = useState("");
  const [editingBidId, setEditingBidId] = useState(null);
  const [editingBidPrice, setEditingBidPrice] = useState("");

  // Se asume que el token y el username se almacenan en localStorage
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username") || "Usuario";

  // Función para obtener las pujas desde el backend
  const fetchBids = async () => {
    try {
      const res = await fetch(`https://mi-backend.com/api/subastas/${auctionId}/bids/`);
      if (!res.ok) {
        if (res.status === 404) {
          setMessage("No se encontraron pujas para esta subasta.");
          setBids([]);
          return;
        }
        throw new Error("Error al obtener las pujas.");
      }
      const data = await res.json();
      // Ordenar pujas de mayor a menor precio
      data.sort((a, b) => b.precio - a.precio);
      setBids(data);
    } catch (error) {
      console.error(error);
      setMessage("Error al cargar las pujas.");
    }
  };

  useEffect(() => {
    if (auctionId) fetchBids();
  }, [auctionId]);

  // Obtenemos la puja más alta (si hay)
  const highestBid = bids.length > 0 ? bids[0].precio : 0;
  // Determinamos si la subasta está abierta (la fecha límite es posterior a la fecha actual)
  const isAuctionOpen = new Date(auctionFechaLimite) > new Date();

  // Manejo del envío de una nueva puja
  const handleBidSubmit = async (e) => {
    e.preventDefault();
    const bidPrice = parseFloat(newBid);
    if (isNaN(bidPrice) || bidPrice <= 0) {
      setMessage("El precio de la puja debe ser un número positivo.");
      return;
    }
    if (bidPrice <= highestBid) {
      setMessage(`La puja debe ser mayor que la actual de ${highestBid}€.`);
      return;
    }
    if (!isAuctionOpen) {
      setMessage("La subasta ha finalizado. No se pueden realizar pujas.");
      return;
    }
    // Construimos el objeto de puja
    const newBidObj = {
      precio: bidPrice,
      fechaCreacion: new Date().toISOString(),
      pujador: username,
      subasta: auctionId,
    };

    try {
      const res = await fetch(`https://mi-backend.com/api/subastas/${auctionId}/bids/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(newBidObj),
      });
      if (!res.ok) {
        if (res.status === 400) {
          const errorData = await res.json();
          setMessage(`Error: ${errorData.message || "Datos inválidos."}`);
          return;
        }
        throw new Error("Error al crear la puja.");
      }
      const createdBid = await res.json();
      setMessage("Puja realizada con éxito.");
      setNewBid("");
      fetchBids();
    } catch (error) {
      console.error(error);
      setMessage("Error al realizar la puja.");
    }
  };

  // Manejo de edición de una puja
  const handleEditBid = async (bidId) => {
    if (!editingBidPrice) {
      setMessage("Debes introducir un nuevo precio.");
      return;
    }
    const bidPrice = parseFloat(editingBidPrice);
    if (isNaN(bidPrice) || bidPrice <= 0) {
      setMessage("El precio de la puja debe ser un número positivo.");
      return;
    }
    if (bidPrice <= highestBid) {
      setMessage(`La nueva puja debe ser mayor que la puja actual de ${highestBid}€.`);
      return;
    }
    try {
      const res = await fetch(`https://mi-backend.com/api/bids/${bidId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ precio: bidPrice }),
      });
      if (!res.ok) {
        if (res.status === 400) {
          const errorData = await res.json();
          setMessage(`Error: ${errorData.message || "Datos inválidos."}`);
          return;
        }
        throw new Error("Error al actualizar la puja.");
      }
      setMessage("Puja actualizada con éxito.");
      setEditingBidId(null);
      setEditingBidPrice("");
      fetchBids();
    } catch (error) {
      console.error(error);
      setMessage("Error al actualizar la puja.");
    }
  };

  // Manejo de borrado de una puja
  const handleDeleteBid = async (bidId) => {
    try {
      const res = await fetch(`https://mi-backend.com/api/bids/${bidId}/`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error("Error al borrar la puja.");
      }
      setMessage("Puja borrada exitosamente.");
      fetchBids();
    } catch (error) {
      console.error(error);
      setMessage("Error al borrar la puja.");
    }
  };

  return (
    <div className={styles.bidsSection}>
      <h3>Pujas</h3>
      {message && <p className={styles.message}>{message}</p>}
      {bids.length === 0 ? (
        <p>No hay pujas aún.</p>
      ) : (
        <ul className={styles.bidList}>
          {bids.map((bid) => (
            <li key={bid.id} className={styles.bidItem}>
              <p>
                <strong>{bid.pujador}</strong> pujó <strong>{bid.precio}€</strong> el{" "}
                {new Date(bid.fechaCreacion).toLocaleString()}
              </p>
              {token && isAuctionOpen && (
                <div className={styles.bidActions}>
                  {editingBidId === bid.id ? (
                    <>
                      <input
                        type="number"
                        value={editingBidPrice}
                        onChange={(e) => setEditingBidPrice(e.target.value)}
                        className={styles.inputField}
                      />
                      <button onClick={() => handleEditBid(bid.id)} className={styles.btn}>
                        Guardar
                      </button>
                      <button onClick={() => setEditingBidId(null)} className={styles.btn}>
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditingBidId(bid.id);
                          setEditingBidPrice(bid.precio);
                        }}
                        className={styles.btn}
                      >
                        Editar
                      </button>
                      <button onClick={() => handleDeleteBid(bid.id)} className={styles.btn}>
                        Borrar
                      </button>
                    </>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      {token && isAuctionOpen && (
        <form onSubmit={handleBidSubmit} className={styles.newBidForm}>
          <input
            type="number"
            placeholder="Tu puja"
            value={newBid}
            onChange={(e) => setNewBid(e.target.value)}
            className={styles.inputField}
            step="0.01"
          />
          <button type="submit" className={styles.btn}>
            Pujar
          </button>
        </form>
      )}
      {!token && <p><em>Debes iniciar sesión para pujar.</em></p>}
      {!isAuctionOpen && <p><em>La subasta ha finalizado. No se pueden realizar pujas.</em></p>}
    </div>
  );
}
