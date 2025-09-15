import React from "react";
import styles from "./Involvement.module.css";
import data from "../../data/involvement.json";

/**
 * involvement.json item shape used here:
 * {
 *   "id": "jd",
 *   "title": "Technical Product Support",
 *   "role": "Technical Product Support",
 *   "org": "John Deere · Part-time",
 *   "date": "Mar 2025 – Present · 7 mos",
 *   "logo": "involvement/logos/john_deere.png",   // optional; if missing we render initials
 *   "description": "Short one-line description."   // optional; used as a brief blurb
 * }
 */

export const Involvement = () => {
  // If you want newest first by inferred dates, sort here.
  const items = [...data];

  return (
    <section className={styles.container} id="involvement" aria-labelledby="inv-title">
      <h2 id="inv-title" className={styles.title}>Involvement</h2>

      <ul className={styles.list} role="list">
        {items.map((item, idx) => {
          const initials = (item.org || item.title || "")
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map(s => s[0]?.toUpperCase() || "")
            .join("");

          return (
            <li key={item.id ?? idx} className={styles.row}>
              {/* Accent rail per card with slight color variation */}
              <div className={`${styles.rail} ${styles[`v${(idx % 5) + 1}`]}`} aria-hidden="true" />

              <article className={styles.card}>
                <header className={styles.header}>
                  <span className={styles.logoWrap} aria-hidden={item.logo ? "false" : "true"}>
                    {item.logo ? (
                      <img src={item.logo} alt="" />
                    ) : (
                      <span className={styles.initials}>{initials || "•"}</span>
                    )}
                  </span>

                  <div className={styles.headText}>
                    <h3 className={styles.cardTitle}>{item.title}</h3>
                    <div className={styles.metaLine}>
                      {item.role && <span className={styles.role}>{item.role}</span>}
                      {item.role && item.org && <span className={styles.sep}>•</span>}
                      {item.org && <span className={styles.org}>{item.org}</span>}
                    </div>
                  </div>

                  {item.date && <time className={styles.when}>{item.date}</time>}
                </header>

                {item.description && (
                  <p className={styles.blurb}>{item.description}</p>
                )}
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
