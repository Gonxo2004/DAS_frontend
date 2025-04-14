"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.css";

export default function MisSubastasPage() {
  const [subastas, setSubastas] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setIsLoggedIn(true);

    fetch("http://127.0.0.1:8000/api/users/profile/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((user) => {
        setCurrentUser(user);

        fetch("http://127.0.0.1:8000/api/auctions/", {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((data) => {
            const todas = Array.isArray(data.results) ? data.results : [];
            const propias = todas.filter(
              (auction) => auction.auctioneer === user.username
            );
            setSubastas(propias);
          })
          .catch((err) => {
            console.error("Error al cargar subastas:", err);
            setErrorMsg("No se pudieron cargar las subastas.");
          });
      })
      .catch((err) => {
        console.error("Error al obtener el perfil:", err);
        setErrorMsg("No se pudo cargar el usuario.");
      });
  }, []);

  // ✅ Función para eliminar subasta del backend
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    const confirm = window.confirm("¿Estás seguro de que quieres eliminar esta subasta?");
    if (!confirm) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/auctions/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errMsg = await response.text();
        throw new Error(errMsg || "Error al eliminar la subasta.");
      }

      // Eliminar del estado local
      setSubastas((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      console.error("Error al eliminar subasta:", error);
      alert("No se pudo eliminar la subasta.");
    }
  };

  if (!isLoggedIn) {
    return (
      <div>
        <header>
          <h1>Mis Subastas Públicas</h1>
        </header>
        <main>
          <p>Debes estar logueado para ver tus subastas.</p>
          <Link href="/login">
            <button className={styles.btn}>Inicia sesión</button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div>
      <header>
        <h1>Mis Subastas Públicas</h1>
        <div className={styles.buttonGroup}>
          <Link href="/subastas">
            <button className={styles.btn}>Volver al catálogo</button>
          </Link>
          <Link href="/subastas/crear">
            <button className={styles.btn}>Añadir Subasta</button>
          </Link>
        </div>
      </header>
      <main>
        {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
        {subastas.length === 0 ? (
          <p>No has creado ninguna subasta aún.</p>
        ) : (
          <section className={styles.searchResults}>
            {subastas.map((auction) => (
              <article key={auction.id} className={styles.product}>
                <h4>{auction.title}</h4>
                <img
                  src={auction.thumbnail}
                  alt={auction.title}
                  className={styles.clickableImg}
                />
                <p>
                  <strong>Precio de salida:</strong> {auction.price}€
                </p>
                <div className={styles.buttonGroup}>
                  <Link href={`/subastas/${auction.id}/editar`}>
                    <button className={styles.btn}>Editar Subasta</button>
                  </Link>
                  <button
                    onClick={() => handleDelete(auction.id)}
                    className={styles.btn}
                  >
                    Eliminar Subasta
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


