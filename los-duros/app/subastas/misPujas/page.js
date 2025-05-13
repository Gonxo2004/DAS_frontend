"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function MisPujas() {
  const router = useRouter();

  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoggedIn(false);
      setLoading(false);
      return;
    }
    setIsLoggedIn(true);

    const fetchMyBids = async () => {
      try {
        const res = await fetch("https://das-backend-1-4y45.onrender.com/api/auctions/mybids/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error("Error al obtener tus pujas: " + text);
        }
        const data = await res.json();
        const bidsArray = data.results || data;
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
          return { ...bid, isOpen, timeLeft };
        });
        setBids(bidsWithTime);
      } catch (err) {
        console.error(err);
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBids();
  }, []);

  // Actualiza tiempo cada segundo
  useEffect(() => {
    if (!bids.length) return;
    const interval = setInterval(() => {
      const now = new Date();
      setBids((prev) =>
        prev.map((bid) => {
          const closing = new Date(bid.auction.closing_date);
          const diff = closing - now;
          if (diff <= 0) {
            return { ...bid, isOpen: false, timeLeft: "Finalizada" };
          }
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          return {
            ...bid,
            isOpen: true,
            timeLeft: `${hours}h ${minutes}m ${seconds}s`,
          };
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [bids]);

  // Mantener solo la mayor puja por subasta
  const highestBids = useMemo(() => {
    const map = {};
    bids.forEach((bid) => {
      const aid = bid.auction.id;
      if (!map[aid] || bid.price > map[aid].price) {
        map[aid] = bid;
      }
    });
    return Object.values(map);
  }, [bids]);

  const handleDeleteBid = async (bidId, auctionId) => {
    setErrorMsg("");
    const token = localStorage.getItem("token");
    if (!token) {
      setErrorMsg("No hay token, inicia sesión de nuevo.");
      return;
    }
    try {
      const res = await fetch(
        `https://das-backend-1-4y45.onrender.com/api/auctions/${auctionId}/bid/${bidId}/`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) {
        const text = await res.text();
        throw new Error("No se pudo eliminar la puja: " + text);
      }
      setBids((prev) => prev.filter((b) => b.id !== bidId));
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message);
    }
  };

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

      {highestBids.length === 0 ? (
        <p>No tienes pujas realizadas.</p>
      ) : (
        <ul className={styles.bidList}>
          {highestBids.map((bid) => {
            const { auction } = bid;
            return (
              <li key={bid.id} className={styles.bidItem}>
                <h2>{auction.title}</h2>
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
                    onClick={() =>
                      handleDeleteBid(bid.id, auction.id)
                    }
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
