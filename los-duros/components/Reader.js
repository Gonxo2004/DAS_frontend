import React from "react";
import Navbar from "./mainnav";
import Footer from "./footer";
import styles from "./Reader.module.css";

function Reader({ children }) {
  return (
    <div className={styles.reader}>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
}

export default Reader;
