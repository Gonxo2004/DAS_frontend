"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function CrearSubasta() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    closing_date: "",
    thumbnail: "",
    price: "",
    stock: "",
    rating: "",
    category: "", // se enviará el ID
    brand: "",
  });

  const [categorias, setCategorias] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
  
    fetch("https://das-backend-final.onrender.com/api/auctions/categories/")
      .then((res) => res.json())
      .then((data) => {
        console.log("Categorías recibidas:", data);
        const categorias = Array.isArray(data.results) ? data.results : [];
        setCategorias(categorias);
      })
      .catch((err) => {
        console.error("Error cargando categorías:", err);
        setErrorMsg("No se pudieron cargar las categorías.");
      });
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("https://das-backend-final.onrender.com/api/auctions/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          closing_date: new Date(formData.closing_date).toISOString(),
          thumbnail: formData.thumbnail,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          brand: formData.brand,
          category: formData.category,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (err) {
        throw new Error("Respuesta no válida del servidor.");
      }

      if (!response.ok) {
        const errores = Object.entries(data)
          .map(([campo, mensajes]) => `${campo}: ${mensajes.join(", ")}`)
          .join(" | ");
        setErrorMsg(errores || "Error al crear subasta.");
        return;
      }

      setSuccessMsg("Subasta creada correctamente.");
      setTimeout(() => router.push("/subastas"), 2000);
    } catch (err) {
      console.error("Error al enviar subasta:", err);
      setErrorMsg("Error al conectar con el servidor.");
    }
  };

  return (
    <div className={styles.mainCrearSubasta}>
      <h2>Crear Nueva Subasta</h2>

      {errorMsg && <p style={{ color: "red", fontWeight: "bold" }}>{errorMsg}</p>}
      {successMsg && <p style={{ color: "green", fontWeight: "bold" }}>{successMsg}</p>}

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.labelText}>Título:</label>
          <input
            type="text"
            name="title"
            className={styles.inputField}
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.labelText}>Descripción:</label>
          <textarea
            name="description"
            className={styles.inputField}
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.labelText}>Fecha de cierre:</label>
          <input
            type="date"
            name="closing_date"
            className={styles.inputField}
            value={formData.closing_date}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.labelText}>Thumbnail (URL):</label>
          <input
            type="url"
            name="thumbnail"
            className={styles.inputField}
            value={formData.thumbnail}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.labelText}>Precio:</label>
          <input
            type="number"
            name="price"
            className={styles.inputField}
            value={formData.price}
            onChange={handleChange}
            min="1"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.labelText}>Stock:</label>
          <input
            type="number"
            name="stock"
            className={styles.inputField}
            value={formData.stock}
            onChange={handleChange}
            min="1"
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.labelText}>Categoría:</label>
          <select
            name="category"
            className={styles.inputField}
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">-- Selecciona una categoría --</option>
            {Array.isArray(categorias) &&
              categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
          </select>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.labelText}>Marca:</label>
          <input
            type="text"
            name="brand"
            className={styles.inputField}
            value={formData.brand}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          Crear Subasta
        </button>
      </form>
    </div>
  );
}
