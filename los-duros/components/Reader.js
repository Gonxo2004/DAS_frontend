import React from "react";
import Navbar from "./mainnav";
import Footer from "./footer";
import styles from "./Reader.module.css";

function Reader({ children }) {
  return (
    <div className={styles.reader}>
      <header className={styles.header}>
        <Navbar />
        <h1>SUBASTA LOS DUROS</h1>
      </header>
      <div className={styles.content}>
        {children}
      </div>
      <Footer />
    </div>
  );
}

export default Reader;
