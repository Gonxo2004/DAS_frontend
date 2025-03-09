"use client";

import React from "react";
import Reader from "../../components/Reader";
import styles from "./page.module.css";

function Usuario() {
    return (
      <Reader>
        <main className={styles.usuario}>
          <h1> DETALLES DE USUARIO</h1>
        </main>
      </Reader>
    );
  }
  
  export default Usuario;