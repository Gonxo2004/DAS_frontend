"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Reader from "../../components/Reader";
import styles from "./page.module.css";

export default function Usuario() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No se encontró token, redirigiendo a login.");
      router.push("/login");
      return;
    }

    fetch("https://das-p2-backend.onrender.com/api/users/profile/", {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.text().then((text) => {
            console.error(
              "Error al obtener datos de usuario:",
              res.status,
              res.statusText,
              text
            );
            throw new Error("Error al obtener datos de usuario");
          });
        }
        return res.json();
      })
      .then((data) => {
        console.log("Datos de usuario recibidos:", data);
        setUserData(data);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        router.push("/login");
      });
  }, [router]);

  const handleLogout = () => {
    // Elimina el token y cualquier dato relacionado
    localStorage.removeItem("token");
    // Emite un evento personalizado para notificar el cambio
    window.dispatchEvent(new Event("logout"));
    // Redirige al usuario a la página de login
    router.push("/login");
  };

  if (!userData) {
    return (
      <Reader>
        <main className={styles.usuario}>
          <h1>Cargando datos de usuario...</h1>
        </main>
      </Reader>
    );
  }

  return (
    <Reader>
      <main className={styles.usuario}>
        <h1>Detalles de Usuario</h1>
        <p>
          <strong>Username:</strong> {userData.username}
        </p>
        <p>
          <strong>Email:</strong> {userData.email}
        </p>
        <p>
          <strong>Nombre:</strong> {userData.first_name}
        </p>
        <p>
          <strong>Apellidos:</strong> {userData.last_name}
        </p>
        <p>
          <strong>Fecha de nacimiento:</strong> {userData.birth_date}
        </p>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Cerrar sesión
        </button>
      </main>
    </Reader>
  );
}
