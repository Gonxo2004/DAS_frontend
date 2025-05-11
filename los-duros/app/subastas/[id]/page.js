"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function AuctionDetails() {
  const { id } = useParams();
  const router = useRouter();

  // Subasta y pujas
  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [newBidAmount, setNewBidAmount] = useState("");

  // Ratings
  const [userRating, setUserRating] = useState(null);

  // Comentarios
  const [comments, setComments] = useState([]);
  const [newCommentTitle, setNewCommentTitle] = useState("");
  const [newCommentBody, setNewCommentBody] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editCommentTitle, setEditCommentTitle] = useState("");
  const [editCommentBody, setEditCommentBody] = useState("");

  // Estados varios
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  // Cliente: token + username
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const username =
    typeof window !== "undefined" ? localStorage.getItem("username") : null;
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  // Fetch subasta, pujas, rating, comentarios
  const fetchAll = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      // Subasta + pujas
      const [aRes, bRes] = await Promise.all([
        fetch(`http://127.0.0.1:8000/api/auctions/${id}/`),
        fetch(`http://127.0.0.1:8000/api/auctions/${id}/bid/`),
      ]);
      if (!aRes.ok) throw new Error("Error cargando subasta.");
      if (!bRes.ok) throw new Error("Error cargando pujas.");
      const aData = await aRes.json();
      const bData = await bRes.json();
      setAuction(aData);
      setBids((bData.results || []).sort((x, y) => y.price - x.price));

      // Rating actual del usuario
      if (token && username) {
        const rRes = await fetch(
          `http://127.0.0.1:8000/api/auctions/${id}/ratings/`,
          { headers }
        );
        if (rRes.ok) {
          const rData = await rRes.json();
          const my = rData.results.find((r) => r.user === username);
          setUserRating(my ? { id: my.id, value: my.value } : null);
        } else {
          setUserRating(null);
        }
      }

      // Comentarios
      const cRes = await fetch(
        `http://127.0.0.1:8000/api/auctions/${id}/comments/`
      );
      if (!cRes.ok) throw new Error("Error cargando comentarios.");
      const cData = await cRes.json();
      setComments(cData.results || cData);
    } catch (e) {
      setErrorMsg(e.message);
    } finally {
      setLoading(false);
    }
  }, [id, token, username]);

  useEffect(() => {
    setIsLoggedIn(!!token);
    fetchAll();
  }, [fetchAll, token]);

  // Cuenta atrás
  useEffect(() => {
    if (!auction) return;
    const iv = setInterval(() => {
      const diff = new Date(auction.closing_date) - new Date();
      if (diff <= 0) {
        setTimeLeft("Subasta cerrada");
        clearInterval(iv);
      } else {
        const h = Math.floor(diff / 3.6e6);
        const m = Math.floor((diff % 3.6e6) / 6e4);
        const s = Math.floor((diff % 6e4) / 1e3);
        setTimeLeft(`${h}h ${m}m ${s}s`);
      }
    }, 1000);
    return () => clearInterval(iv);
  }, [auction]);

  // Enviar puja
  const handleBidSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (!token) return setErrorMsg("Inicia sesión para pujar.");
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/auctions/${id}/bid/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", ...headers },
          body: JSON.stringify({ price: +newBidAmount }),
        }
      );
      if (!res.ok) throw new Error(await res.text());
      setNewBidAmount("");
      fetchAll();
    } catch (e) {
      setErrorMsg(e.message);
    }
  };

  // Rating
  const sendRating = async (v) => {
    if (!token) return router.push("/login");
    const editing = Boolean(userRating);
    const url = editing
      ? `http://127.0.0.1:8000/api/auctions/${id}/ratings/${userRating.id}/`
      : `http://127.0.0.1:8000/api/auctions/${id}/ratings/`;
    const body = editing ? { value: v } : { value: v, auction: id };
    try {
      const res = await fetch(url, {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(await res.text());
      fetchAll();
    } catch (e) {
      setErrorMsg(e.message);
    }
  };
  const handleRemoveRating = async () => {
    if (!userRating) return;
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/auctions/${id}/ratings/${userRating.id}/`,
        { method: "DELETE", headers }
      );
      if (!res.ok) throw new Error(await res.text());
      fetchAll();
    } catch (e) {
      setErrorMsg(e.message);
    }
  };

  // Crear comentario
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (!token) return setErrorMsg("Inicia sesión para comentar.");
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/auctions/${id}/comments/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", ...headers },
          body: JSON.stringify({
            title: newCommentTitle,
            body: newCommentBody,
            auction: id,
          }),
        }
      );
      if (!res.ok) throw new Error(await res.text());
      setNewCommentTitle("");
      setNewCommentBody("");
      fetchAll();
    } catch (e) {
      setErrorMsg(e.message);
    }
  };

  // Iniciar edición
  const startEdit = (c) => {
    setEditingComment(c.id);
    setEditCommentTitle(c.title);
    setEditCommentBody(c.body);
  };

  // Guardar edición
  const handleEditSave = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/auctions/${id}/comments/${editingComment}/`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json", ...headers },
          body: JSON.stringify({
            title: editCommentTitle,
            body: editCommentBody,
          }),
        }
      );
      if (!res.ok) throw new Error(await res.text());
      setEditingComment(null);
      fetchAll();
    } catch (e) {
      setErrorMsg(e.message);
    }
  };

  // Eliminar comentario
  const handleDelete = async (commentId) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/auctions/${id}/comments/${commentId}/`,
        { method: "DELETE", headers }
      );
      if (!res.ok) throw new Error(await res.text());
      fetchAll();
    } catch (e) {
      setErrorMsg(e.message);
    }
  };

  // Render
  if (loading) return <div className={styles.detailContainer}>Cargando...</div>;
  if (errorMsg)
    return (
      <div className={styles.detailContainer}>
        <p className={styles.errorMsg}>{errorMsg}</p>
        <button onClick={() => router.back()}>Volver</button>
      </div>
    );
  if (!auction)
    return (
      <div className={styles.detailContainer}>
        <p>No se encontró la subasta.</p>
        <button onClick={() => router.back()}>Volver</button>
      </div>
    );

  const closing = new Date(auction.closing_date).toLocaleString();

  return (
    <div className={styles.detailContainer}>
      <button onClick={() => router.back()} className={styles.backButton}>
        Volver
      </button>

      <div className={styles.auctionDetailWrapper}>
        {/* Col 1: Imagen */}
        <div className={styles.imageFrame}>
          <img
            src={auction.thumbnail}
            alt={auction.title}
            className={styles.auctionImage}
          />
        </div>

        {/* Col 2: Detalles */}
        <div className={styles.detailsInfo}>
          <h1>{auction.title}</h1>
          <p>
            <strong>Descripción:</strong> {auction.description}
          </p>
          <p>
            <strong>Precio inicial:</strong> {auction.price}€
          </p>
          <p>
            <strong>Tiempo restante:</strong> {timeLeft}
          </p>
          <p>
            <strong>Stock:</strong> {auction.stock}
          </p>
          <p>
            <strong>Marca:</strong> {auction.brand}
          </p>
          <p>
            <strong>Vendedor:</strong> {auction.auctioneer}
          </p>
          <p>
            <strong>Valoración promedio:</strong>{" "}
            {auction.average_rating != null
              ? auction.average_rating.toFixed(2)
              : "Sin valoraciones"}
          </p>
        </div>

        {/* Col 3: Pujas + Valoración */}
        <div className={styles.sideColumn}>
          {/* Pujas */}
          <div className={styles.bidSection}>
            <h2>Pujas</h2>
            {bids.length ? (
              <ul className={styles.bidList}>
                {bids.map((b, i) => (
                  <li
                    key={b.id}
                    className={styles.bidItem}
                    style={{ fontWeight: i === 0 ? "bold" : "normal" }}
                  >
                    <strong>{b.bidder}</strong>: {b.price}€
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay pujas.</p>
            )}
            {isLoggedIn && (
              <form onSubmit={handleBidSubmit} className={styles.bidForm}>
                <label>
                  <strong>Tu puja:</strong>
                </label>
                <input
                  type="number"
                  value={newBidAmount}
                  onChange={(e) => setNewBidAmount(e.target.value)}
                  required
                  min={bids[0] ? bids[0].price + 1 : auction.price}
                />
                <button type="submit">Pujar</button>
                {successMsg && <p className={styles.successMsg}>{successMsg}</p>}
              </form>
            )}
          </div>

          {/* Valoración */}
          {isLoggedIn && (
            <div className={styles.ratingSection}>
              <h2>Tu valoración</h2>
              {[1, 2, 3, 4, 5].map((v) => (
                <button
                  key={v}
                  onClick={() => sendRating(v)}
                  className={userRating?.value === v ? styles.selected : ""}
                >
                  {v}
                </button>
              ))}
              {userRating && (
                <button onClick={handleRemoveRating}>Eliminar valoración</button>
              )}
            </div>
          )}
        </div>

                {/* Col 4: Comentarios */}
        <div className={styles.commentSection}>
          <h2>Comentarios</h2>

          {isLoggedIn && (
            <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
              <input
                type="text"
                placeholder="Título"
                value={newCommentTitle}
                onChange={(e) => setNewCommentTitle(e.target.value)}
                required
              />
              <textarea
                placeholder="Escribe tu comentario..."
                value={newCommentBody}
                onChange={(e) => setNewCommentBody(e.target.value)}
                required
              />
              <button type="submit">Añadir comentario</button>
            </form>
          )}

          {comments.length ? (
            comments.map((c) => {
              // c.user es ya un string con el username
              const isOwner = isLoggedIn && c.user === username;
              const created = new Date(c.creation_date).toLocaleString();
              const modified = new Date(c.last_modification_date).toLocaleString();

              return editingComment === c.id ? (
                <form
                  key={c.id}
                  onSubmit={handleEditSave}
                  className={styles.commentForm}
                >
                  <input
                    type="text"
                    value={editCommentTitle}
                    onChange={(e) => setEditCommentTitle(e.target.value)}
                    required
                  />
                  <textarea
                    value={editCommentBody}
                    onChange={(e) => setEditCommentBody(e.target.value)}
                    required
                  />
                  <button type="submit">Guardar</button>
                  <button
                    type="button"
                    onClick={() => setEditingComment(null)}
                  >
                    Cancelar
                  </button>
                </form>
              ) : (
                <div key={c.id} className={styles.commentItem}>
                  {/* Only the creator sees these */}
                  {isOwner && (
                    <div className={styles.commentOptions}>
                      <button
                        className={styles.editBtn}
                        onClick={() => startEdit(c)}
                        aria-label="Editar comentario"
                      >
                        ✎
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(c.id)}
                        aria-label="Borrar comentario"
                      >
                        🗑
                      </button>
                    </div>
                  )}

                  <h2><strong>{c.title}</strong></h2>
                  <p>{c.body}</p>
                  <small>
                    Por {username} el {created}
                    {modified !== created && (
                      <>
                        <br />
                        <em>Modificado: {modified}</em>
                      </>
                    )}
                  </small>
                </div>
              );
            })
          ) : (
            <p>No hay comentarios aún.</p>
          )}
        </div>
      </div>
    </div>
  );
}
