"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function CrearSubasta() {
  const router = useRouter();
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

  // Verifica que el usuario esté autenticado
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  // Manejo de cambios en los inputs
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      // Convertir el archivo a data URL usando FileReader
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

  // Genera un identificador único (ejemplo; en producción lo haría el backend)
  const generateUniqueId = () => {
    return Date.now().toString() + Math.floor(Math.random() * 1000).toString();
  };

  // Manejo del envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    const nuevaSubasta = {
      ...formData,
      id: generateUniqueId(),
      estado: "abierta",
    };

    // Guarda la nueva subasta en localStorage
    const storedSubastas = JSON.parse(localStorage.getItem("subastas")) || [];
    storedSubastas.push(nuevaSubasta);
    localStorage.setItem("subastas", JSON.stringify(storedSubastas));

    // Redirige a la página principal de subastas
    router.push("/subastas");
  };

  return (
    <div className={styles.mainCrearSubasta}>
      <h2>Crear Nueva Subasta</h2>
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
            required
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
          Crear Subasta
        </button>
      </form>
    </div>
  );
}
