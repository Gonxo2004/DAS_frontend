"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "./page.module.css";

export default function EditarSubasta() {
  const router = useRouter();
  // Obtenemos el parámetro "id" de la URL usando useParams()
  const { id } = useParams();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    // Verificar que el usuario esté autenticado
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    // Cargar la subasta a editar desde localStorage
    const storedSubastas = JSON.parse(localStorage.getItem("subastas")) || [];
    const auction = storedSubastas.find((a) => a.id === id);
    if (auction) {
      setFormData({ ...auction });
    } else {
      // Si no se encuentra la subasta, redirige a la lista de mis subastas
      router.push("/subastas/misSubastas");
    }
  }, [id, router]);

  // Mientras se carga la información, mostramos un mensaje
  if (formData === null) {
    return <div>Cargando...</div>;
  }

  // Manejo de cambios en los inputs del formulario
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, [name]: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Guarda los cambios y actualiza localStorage; luego redirige a misSubastas
  const handleSubmit = (e) => {
    e.preventDefault();
    const storedSubastas = JSON.parse(localStorage.getItem("subastas")) || [];
    const updatedSubastas = storedSubastas.map((a) =>
      a.id === id ? { ...formData } : a
    );
    localStorage.setItem("subastas", JSON.stringify(updatedSubastas));
    router.push("/subastas/misSubastas");
  };

  // Descarta los cambios y redirige a misSubastas sin modificar nada
  const handleDiscard = () => {
    router.push("/subastas/misSubastas");
  };

  return (
    <div className={styles.mainCrearSubasta}>
      <h2>Editar Subasta</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.labelText}>Título:</label>
          <input
            type="text"
            name="titulo"
            className={styles.inputField}
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
          <label className={styles.labelText}>Imagen:</label>
          <input
            type="file"
            name="imagen"
            className={styles.inputField}
            onChange={handleChange}
            accept="image/*"
          />
          {formData.imagen && (
            <img
              src={formData.imagen}
              alt="Imagen de la subasta"
              style={{ maxWidth: "200px", marginTop: "10px" }}
            />
          )}
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
        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.submitButton}>
            Guardar Cambios
          </button>
          <button
            type="button"
            onClick={handleDiscard}
            className={styles.submitButton}
          >
            Descartar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}
