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

    // Utilizamos el token para obtener los datos del usuario
    fetch("http://127.0.0.1:8000/api/users/profile/", {
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

  // Función para cerrar sesión: elimina el token y redirige a login
  const handleLogout = async () => {
    try {
      // Recuperamos tanto el token de acceso como el refresh token del localStorage
      const accessToken = localStorage.getItem("token");
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken || !accessToken) {
        throw new Error("No se encontraron tokens.");
      }
  
      // Realizamos la petición POST al endpoint de log out
      const response = await fetch("http://127.0.0.1:8000/api/users/log-out/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`, // Se añade el token de acceso
        },
        body: JSON.stringify({ refresh: refreshToken }), // Se envía el refresh token en el body
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error al hacer log out:", errorText);
        // Puedes mostrar un mensaje de error o seguir con el proceso de logout
      }
    } catch (error) {
      console.error("Error al hacer log out:", error);
    } finally {
      // Se eliminan los tokens y se redirige al usuario a la página de login
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      window.dispatchEvent(new Event("logout"));
      router.push("/login");
    }
  };
  

  // Función para redirigir a la página de cambiar contraseña
  const handleChangePassword = () => {
    router.push("/cambiarPassword");
  };

  // Función para redirigir a la página de editar perfil
  const handleEditProfile = () => {
    router.push("/editarPerfil");
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
          <button onClick={handleChangePassword} className={styles.changePasswordButton}>
            Cambiar contraseña
          </button>
          <button onClick={handleEditProfile} className={styles.editProfileButton}>
            Editar perfil
          </button>
        </div>
      </main>
    </Reader>
  );
}

