"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function MisPujas() {
  const router = useRouter();

  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Verificamos si hay token en localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoggedIn(false);
      setLoading(false);
      return;
    } else {
      setIsLoggedIn(true);
    }

    // Función para cargar las pujas del usuario
    const fetchMyBids = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/auctions/mybids/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error("Error al obtener tus pujas: " + text);
        }

        const data = await res.json();
        // data puede tener { results: [...] } si hay paginación, o un array si no
        const bidsArray = data.results || data;

        // Añadimos campos timeLeft e isOpen a cada puja
        const now = new Date();
        const bidsWithTime = bidsArray.map((bid) => {
          const closing = new Date(bid.auction.closing_date);
          const diff = closing - now;
          let isOpen = false;
          let timeLeft = "Finalizada";
          if (diff > 0) {
            isOpen = true;
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            timeLeft = `${hours}h ${minutes}m ${seconds}s`;
          }
          return {
            ...bid,
            isOpen,
            timeLeft,
          };
        });
        // Filtrar la puja más alta por cada subasta
        const highestBidsPerAuction = Object.values(
          bidsWithTime.reduce((acc, bid) => {
            const auctionId = bid.auction.id;
            if (!acc[auctionId] || bid.price > acc[auctionId].price) {
              acc[auctionId] = bid;
            }
            return acc;
          }, {})
        );

        setBids(highestBidsPerAuction);
        } catch (err) {
          console.error(err);
          setErrorMsg(err.message);
        } finally {
          setLoading(false);
        }
      };

    fetchMyBids();
  }, []);

  // Actualizamos cada segundo el tiempo restante
  useEffect(() => {
    if (!bids.length) return;

    const interval = setInterval(() => {
      setBids((prevBids) => {
        const now = new Date();
        return prevBids.map((bid) => {
          const closing = new Date(bid.auction.closing_date);
          const diff = closing - now;
          if (diff <= 0) {
            return {
              ...bid,
              isOpen: false,
              timeLeft: "Finalizada",
            };
          } else {
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            return {
              ...bid,
              isOpen: true,
              timeLeft: `${hours}h ${minutes}m ${seconds}s`,
            };
          }
        });
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [bids]);

  // Botón “Dejar de pujar”
  const handleDeleteBid = async (bidId, auctionId) => {
    setErrorMsg("");
    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMsg("No hay token, inicia sesión de nuevo.");
      return;
    }
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/auctions/${auctionId}/bid/${bidId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error("No se pudo eliminar la puja: " + text);
      }
      // Borramos la puja del estado
      setBids((prev) => prev.filter((bid) => bid.id !== bidId));
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message);
    }
  };

  // Render
  if (loading) {
    return <div className={styles.container}>Cargando tus pujas...</div>;
  }

  if (!isLoggedIn) {
    return (
      <div className={styles.container}>
        <h1>No has iniciado sesión</h1>
        <button onClick={() => router.push("/login")}>Ir a Login</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>Mis Pujas</h1>
      {errorMsg && <p className={styles.errorMsg}>{errorMsg}</p>}

      {bids.length === 0 ? (
        <p>No tienes pujas realizadas.</p>
      ) : (
        <ul className={styles.bidList}>
          {bids.map((bid) => {
            const { auction } = bid;  
            return (
              <li key={bid.id} className={styles.bidItem}>
                <h2>{auction.title}</h2>

                {/* Mostrar la imagen */}
                <div className={styles.imageFrame}>
                  <img
                    src={auction.thumbnail}
                    alt={auction.title}
                    className={styles.thumbnailImg}
                  />
                </div>

                <p>
                  <strong>Mi puja:</strong> {bid.price}€
                </p>
                <p>
                  <strong>Tiempo restante:</strong> {bid.timeLeft}
                </p>
                
                {bid.isOpen ? (
                  <button
                    className={styles.btnStop}
                    onClick={() => handleDeleteBid(bid.id, auction.id)}
                  >
                    Dejar de pujar
                  </button>
                ) : (
                  <p>
                    <em>Subasta finalizada</em>
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
