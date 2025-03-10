"use client";
import React from "react";
import styles from "./page.module.css";

export default function AboutPage() {
  return (
    <main className={styles.aboutContainer}>
      <h1>Sobre nosotros</h1>
      <p>
        Bienvenido a nuestra plataforma de subastas. Nuestro objetivo es conectar
        compradores y vendedores de manera segura y transparente.
      </p>
      <p>
        Contamos con un equipo de expertos que trabaja constantemente para
        ofrecer la mejor experiencia de compra y venta.
      </p>
    </main>
  );
}
