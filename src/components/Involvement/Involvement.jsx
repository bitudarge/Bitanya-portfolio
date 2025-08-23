import React from "react";
import styles from "./Involvement.module.css";

export const Involvement = () => {
  return (
    <section id="involvement" className={styles.involvementSection}>
      <h2 className={styles.title}>Involvement</h2>
      <div className={styles.content}>
        {/* Add your clubs and on-campus jobs here */}
        <p>Here you can showcase the clubs you are part of and the on-campus jobs you have held.</p>
      </div>
    </section>
  );
};