"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "../../crear/page.module.css";

export default function EditarSubasta() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    closing_date: "",
    thumbnail: "",
    price: "",
    stock: "",
    rating: "",
    category: "",
    brand: "",
  });

  const [categorias, setCategorias] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Cargar subasta actual y categorías
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Cargar subasta
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auctions/${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setFormData({
          title: data.title,
          description: data.description,
          closing_date: data.closing_date.split("T")[0], // solo fecha
          thumbnail: data.thumbnail,
          price: data.price,
          stock: data.stock,
          rating: data.rating,
          category: data.category,
          brand: data.brand,
        });
      });

    // Cargar categorías
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auctions/categories`)
      .then((res) => res.json())
      .then((data) => {
        const cats = Array.isArray(data.results) ? data.results : [];
        setCategorias(cats);
      });
  }, [id, router]);

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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auctions/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          closing_date: new Date(formData.closing_date).toISOString(),
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          rating: parseInt(formData.rating),
          category: formData.category,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        const errores = Object.entries(result)
          .map(([campo, msg]) => `${campo}: ${msg.join(", ")}`)
          .join(" | ");
        setErrorMsg(errores || "Error al actualizar.");
        return;
      }

      setSuccessMsg("Subasta actualizada correctamente.");
      setTimeout(() => router.push("/subastas/misSubastas"), 2000);
    } catch (error) {
      console.error("Error:", error);
      setErrorMsg("Error de conexión con el servidor.");
    }
  };

  return (
    <div className={styles.mainCrearSubasta}>
      <h2>Editar Subasta</h2>
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      {successMsg && <p style={{ color: "green" }}>{successMsg}</p>}

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>Título:</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Descripción:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Fecha de cierre:</label>
          <input
            type="date"
            name="closing_date"
            value={formData.closing_date}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Thumbnail (URL):</label>
          <input
            type="url"
            name="thumbnail"
            value={formData.thumbnail}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Precio:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Stock:</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Valoración (1-5):</label>
          <input
            type="number"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Categoría:</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">-- Selecciona una categoría --</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.formGroup}>
          <label>Marca:</label>
          <input
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className={styles.submitButton}>
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}
