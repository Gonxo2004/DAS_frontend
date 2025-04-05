"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function SubastaDetailPage() {
  const { id } = useParams(); // Si existe, estamos en modo edición
  const router = useRouter();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    fechaLimite: "",
    // Fecha actual en formato YYYY-MM-DD
    fechaCreacion: new Date().toISOString().split("T")[0],
    imagen: "",
    precioSalida: "",
    stock: "",
    valoracion: "",
    categoria: "",
    marca: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Si estamos editando, cargar los datos de la subasta desde el backend
  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      fetch(`https://mi-backend.com/api/subastas/${id}/`) // Reemplaza con tu endpoint real
        .then((res) => {
          if (!res.ok) throw new Error("Error al obtener la subasta");
          return res.json();
        })
        .then((data) => {
          setFormData({
            titulo: data.titulo || "",
            descripcion: data.descripcion || "",
            fechaLimite: data.fechaLimite || "",
            fechaCreacion: data.fechaCreacion || new Date().toISOString().split("T")[0],
            imagen: data.imagen || "",
            precioSalida: data.precioSalida || "",
            stock: data.stock || "",
            valoracion: data.valoracion || "",
            categoria: data.categoria || "",
            marca: data.marca || "",
          });
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setMessage("Error al cargar los detalles de la subasta.");
          setLoading(false);
        });
    }
  }, [id, isEditing]);

  // Manejo de cambios en el formulario (incluyendo el input file)
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, [name]: reader.result }));
      };
      reader.onerror = (err) => {
        console.error("Error loading file:", err);
        setMessage("Error al cargar el archivo. Por favor, intenta de nuevo.");
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Manejo del envío del formulario: PUT si es edición, POST si es creación
  const handleSubmit = (e) => {
    e.preventDefault();
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `https://mi-backend.com/api/subastas/${id}/`
      : "https://mi-backend.com/api/subastas/";
    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        // Agrega aquí autenticación si es necesario, por ejemplo:
        // "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error en la operación");
        return res.json();
      })
      .then((data) => {
        setMessage(isEditing ? "Subasta actualizada exitosamente" : "Subasta creada exitosamente");
        router.push(`/subastas/${data.id}`);
      })
      .catch((error) => {
        console.error(error);
        setMessage("Ocurrió un error al enviar los datos.");
      });
  };

  if (loading) {
    return <p className={styles.loading}>Cargando datos...</p>;
  }

  return (
    <div className={styles.detailContainer}>
      <h2>{isEditing ? "Editar Subasta" : "Crear Subasta"}</h2>
      {message && <p className={styles.message}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.labelText}>Título:</label>
          <input
            type="text"
            name="titulo"
            className={styles.inputField}
            placeholder="Ingresa el título"
            value={formData.titulo}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.labelText}>Descripción:</label>
          <textarea
            name="descripcion"
            className={styles.inputField}
            placeholder="Ingresa la descripción"
            value={formData.descripcion}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.labelText}>Fecha límite para cierre:</label>
          <input
            type="date"
            name="fechaLimite"
            className={styles.inputField}
            value={formData.fechaLimite}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.labelText}>Fecha de creación:</label>
          <input
            type="date"
            name="fechaCreacion"
            className={styles.inputField}
            value={formData.fechaCreacion}
            readOnly
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.labelText}>Imagen:</label>
          <input
            type="file"
            name="imagen"
            className={styles.inputField}
            onChange={handleChange}
            accept="image/*"
            required={!isEditing}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.labelText}>Precio de salida:</label>
          <input
            type="number"
            name="precioSalida"
            className={styles.inputField}
            value={formData.precioSalida}
            onChange={handleChange}
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
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.labelText}>Valoración:</label>
          <input
            type="number"
            name="valoracion"
            className={styles.inputField}
            value={formData.valoracion}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.labelText}>Categoría:</label>
          <input
            type="text"
            name="categoria"
            className={styles.inputField}
            value={formData.categoria}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.labelText}>Marca:</label>
          <input
            type="text"
            name="marca"
            className={styles.inputField}
            value={formData.marca}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          {isEditing ? "Actualizar Subasta" : "Crear Subasta"}
        </button>
      </form>
    </div>
  );
}
