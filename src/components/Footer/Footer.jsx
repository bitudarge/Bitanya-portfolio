import React from "react";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.iconsRow}>
        <a href="mailto:bitanyagetahunn@gmail.com" target="_blank" rel="noopener noreferrer">
          <img src="https://img.icons8.com/ios-filled/32/ffffff/email.png" alt="Email" className={styles.icon} />
        </a>
        <a href="https://linkedin.com/in/bitanya-darge-8260b02b2/" target="_blank" rel="noopener noreferrer">
          <img src="https://img.icons8.com/ios-filled/32/ffffff/linkedin.png" alt="LinkedIn" className={styles.icon} />
        </a>
        <a href="https://github.com/bitudarge" target="_blank" rel="noopener noreferrer">
          <img src="https://img.icons8.com/ios-filled/32/ffffff/github.png" alt="GitHub" className={styles.icon} />
        </a>
      </div>
    </footer>
  );
}