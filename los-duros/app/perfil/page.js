"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function Usuario() {
  const router = useRouter();

  // Estados para controlar si hay token y los datos del usuario
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // No hay token => no estás logueado
      setIsLoggedIn(false);
      setLoadingUser(false);
      return;
    }

    // Si sí hay token, marcamos que está logueado e intentamos cargar el perfil
    setIsLoggedIn(true);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/profile/`, {
      headers: {
        Authorization: `Bearer ${token}`,
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
        // Podrías desloguear al usuario si el token es inválido:
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        setIsLoggedIn(false);
      })
      .finally(() => {
        setLoadingUser(false);
      });
  }, [router]);

  // Función para hacer logout
  const handleLogout = async () => {
    try {
      const accessToken = localStorage.getItem("token");
      const refreshToken = localStorage.getItem("refreshToken");
      if (!accessToken || !refreshToken) {
        throw new Error("No se encontraron tokens.");
      }

      const response = await fetch("http://127.0.0.1:8000/api/users/log-out/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error al hacer log out:", errorText);
      }
    } catch (error) {
      console.error("Error al hacer log out:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      router.push("/login");
    }
  };

  // Mientras determinas si hay token o no, puedes mostrar un mensaje o spinner
  if (loadingUser) {
    return (
      <div className={styles.usuario}>
        <h2>Cargando...</h2>
      </div>
    );
  }

  // Si no hay token, muestra mensaje de “No estás logueado”
  if (!isLoggedIn) {
    return (
      <main className={styles.usuario}>
        <h1>No estás logueado</h1>
        <p>Pulsa aquí para iniciar sesión.</p>
        <button onClick={() => router.push("/login")}>Ir a login</button>
      </main>
    );
  }

  // Si hay token pero no se pudo obtener userData, indica que hubo algún error en la petición
  if (!userData) {
    return (
      <main className={styles.usuario}>
        <h1>No se pudo cargar tu perfil.</h1>
        <button onClick={handleLogout}>Cerrar sesión</button>
      </main>
    );
  }

  // Finalmente, si hay token y userData cargado, muestras los detalles
  return (
    <main className={styles.usuario}>
      <h1>Detalles de Usuario</h1>
      <p>
        <strong>Nombre:</strong> {userData.first_name}
      </p>
      <p>
        <strong>Apellidos:</strong> {userData.last_name}
      </p>
      <p>
        <strong>Username:</strong> {userData.username}
      </p>
      <p>
        <strong>Email:</strong> {userData.email}
      </p>
      <p>
        <strong>Fecha de nacimiento:</strong> {userData.birth_date}
      </p>
      <p>
        <strong>Comunidad Autónoma:</strong> {userData.locality}
      </p>
      <p>
        <strong>Ciudad:</strong> {userData.municipality}
      </p>

      <div className={styles.buttonsContainer}>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Cerrar sesión
        </button>
        <button
          onClick={() => router.push("/cambiarPassword")}
          className={styles.changePasswordButton}
        >
          Cambiar contraseña
        </button>
        <button
          onClick={() => router.push("/editarPerfil")}
          className={styles.editProfileButton}
        >
          Editar perfil
        </button>
      </div>
    </main>
  );
}
