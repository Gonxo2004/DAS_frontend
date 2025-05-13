"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Reader from "../../components/Reader";
import styles from "./page.module.css";

const ciudadesPorComunidad = {
  "Andalucía": ["Sevilla", "Málaga", "Córdoba", "Granada", "Cádiz"],
  "Aragón": ["Zaragoza", "Huesca", "Teruel"],
  "Asturias": ["Oviedo", "Gijón", "Avilés"],
  "Canarias": ["Santa Cruz de Tenerife", "Las Palmas de Gran Canaria"],
  "Cantabria": ["Santander", "Torrelavega"],
  "Castilla-La Mancha": ["Albacete", "Ciudad Real", "Toledo"],
  "Castilla y León": ["Valladolid", "Burgos", "Salamanca", "León"],
  "Cataluña": ["Barcelona", "Tarragona", "Girona", "Lleida"],
  "Comunidad de Madrid": ["Madrid", "Alcalá de Henares", "Getafe", "Móstoles"],
  "Comunidad Valenciana": ["Valencia", "Alicante", "Castellón"],
  "Extremadura": ["Badajoz", "Cáceres", "Mérida"],
  "Galicia": ["Santiago de Compostela", "A Coruña", "Vigo"],
  "La Rioja": ["Logroño", "Calahorra"],
  "Murcia": ["Murcia", "Cartagena", "Lorca"],
  "Navarra": ["Pamplona", "Tudela"],
  "País Vasco": ["Bilbao", "San Sebastián", "Vitoria"],
};

export default function EditarPerfil() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({});
  const [ciudades, setCiudades] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch("https://das-backend-1-4y45.onrender.com/api/users/profile/", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUserData(data);
        setUserId(data.id);
        setFormData({
          username: data.username || "",
          email: data.email || "",
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          birth_date: data.birth_date || "",
          locality: data.locality || "",
          municipality: data.municipality || "",
        });

        const ciudadesIniciales = ciudadesPorComunidad[data.locality] || [];
        setCiudades(ciudadesIniciales);
      })
      .catch((err) => {
        console.error("Error cargando perfil:", err);
        router.push("/login");
      });
  }, [router]);

  useEffect(() => {
    const nuevasCiudades = ciudadesPorComunidad[formData.locality] || [];
    setCiudades(nuevasCiudades);
    // Si la ciudad seleccionada ya no está en la lista, se limpia
    if (!nuevasCiudades.includes(formData.municipality)) {
      setFormData((prev) => ({ ...prev, municipality: "" }));
    }
  }, [formData.locality]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`https://das-backend-1-4y45.onrender.com/api/users/${userId}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText);
      }

      
      router.push("/perfil");
    } catch (err) {
      console.error("Error al actualizar:", err);
      alert("Ocurrió un error al actualizar el perfil.");
    }
  };

  if (!userData) return <h2>Cargando datos del perfil...</h2>;

  return (
    <Reader>
      <main className={styles.contenedor}>
        <form onSubmit={handleSubmit} className={styles.formulario}>
          <label>
            Nombre:
            <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />
          </label>
          <label>
            Apellidos:
            <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required />
          </label>
          <label>
            Usuario:
            <input type="text" name="username" value={formData.username} onChange={handleChange} required />
          </label>
          <label>
            Email:
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </label>
          <label>
            Fecha de nacimiento:
            <input type="date" name="birth_date" value={formData.birth_date} readOnly />
          </label>
          <label>
            Comunidad Autónoma:
            <select name="locality" value={formData.locality} onChange={handleChange} required>
              <option value="">-- Selecciona tu comunidad --</option>
              {Object.keys(ciudadesPorComunidad).map((com) => (
                <option key={com} value={com}>{com}</option>
              ))}
            </select>
          </label>
          <label>
            Ciudad:
            <select name="municipality" value={formData.municipality} onChange={handleChange} required disabled={!ciudades.length}>
              <option value="">-- Selecciona tu ciudad --</option>
              {ciudades.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </label>
          <div className={styles.botones}>
            <button type="submit">Guardar</button>
            <button type="button" onClick={() => router.push("/perfil")}>Cancelar</button>
          </div>
        </form>
      </main>
    </Reader>
  );
}
