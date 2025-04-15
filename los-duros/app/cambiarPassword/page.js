"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Reader from "../../components/Reader";
import styles from "./page.module.css";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
  
    if (newPassword !== confirmPassword) {
      setErrorMsg("Las contraseñas no coinciden.");
      return;
    }
  
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
  
    try {
     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/change-password/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
        }),
      });
  
      let result;
  
      try {
        result = await response.json();
      } catch (jsonError) {
        const textError = await response.text();
        throw new Error(textError);
      }
  
      if (!response.ok) {
        const errors = Object.values(result).flat().join(" ");
        setErrorMsg(errors || "Error al cambiar la contraseña.");
        return;
      }
  
      setSuccessMsg("Contraseña actualizada correctamente.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
  
      setTimeout(() => router.push("/perfil"), 2000);
    } catch (err) {
      console.error("Error general:", err);
      setErrorMsg("Error de conexión con el servidor.");
    }
  };

  return (
    <Reader>
      <main className={styles.contenedor}>
        <form onSubmit={handleSubmit} className={styles.formulario}>
          {errorMsg && <p className={styles.error}>{errorMsg}</p>}
          {successMsg && <p className={styles.exito}>{successMsg}</p>}

          <label>
            Contraseña actual:  
            <input
              type="password"
              name="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </label>

          <label>
            Nueva contraseña:  
            <input
              type="password"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
            />
          </label>

          <label>
            Confirmar nueva contraseña:
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
            />
          </label>

          <div className={styles.botones}>
            <button type="submit">Actualizar contraseña</button>
            <button type="button" onClick={() => router.push("/perfil")}>
              Cancelar
            </button>
          </div>
        </form>
      </main>
    </Reader>
  );
}
