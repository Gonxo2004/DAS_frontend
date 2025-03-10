"use client";
import React, { useEffect, useState } from "react";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No hay token, inicia sesión primero.");
      return;
    }

    fetch("https://das-p2-backend.onrender.com/api/users/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Ojo: Confirma si el backend requiere 'Bearer ' o solo el token
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("No se pudo obtener el perfil");
        }
        return res.json();
      })
      .then((data) => setProfile(data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!profile) return <p>Cargando perfil...</p>;

  return (
    <div>
      <h1>Mi Perfil</h1>
      <p>Usuario: {profile.username}</p>
      <p>Nombre: {profile.first_name} {profile.last_name}</p>
      <p>Email: {profile.email}</p>
      <p>Localidad: {profile.locality}</p>
      <p>Municipio: {profile.municipality}</p>
      {/* Muestra más campos según retorne el backend */}
    </div>
  );
}
