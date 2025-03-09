"use client";
import React from "react";
import styles from "./page.module.css";

export default function TermsPage() {
  return (
    <main className={styles.termsContainer}>
      <h1>Términos y Condiciones</h1>
      <p>
        Al utilizar nuestra plataforma de subastas, aceptas cumplir con
        nuestras normas y regulaciones. Te recomendamos leer detenidamente
        todas las disposiciones para garantizar una experiencia óptima.
      </p>
      <p>
        Estos términos y condiciones explican los derechos y deberes tanto de
        la plataforma como de los usuarios, asegurando así un entorno seguro y
        confiable para todos.
      </p>
    </main>
  );
}
