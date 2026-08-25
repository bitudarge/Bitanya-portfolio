import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import styles from "./Involvement.module.css";
import data from "../../data/involvement.json";
import { getImageUrl } from "../../utils";
import { useParallax } from "../../hooks/useParallax";

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export const Involvement = () => {
  const prefersReducedMotion = useReducedMotion();
  const eyebrowRef = useParallax(-24);

  return (
    <section className={styles.container} id="involvement" aria-labelledby="inv-title">
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
      >
        <span ref={eyebrowRef} className={styles.eyebrow}>05 — Involvement</span>
        <h2 id="inv-title" className={styles.title}>Involvement</h2>
      </motion.div>

      <motion.ul
        className={styles.list}
        role="list"
        variants={listVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
      >
        {data.map((item, idx) => {
          const initials = (item.org || item.title || "")
            .split(" ")
            .filter(Boolean)
            .slice(0, 2)
            .map((s) => s[0]?.toUpperCase() || "")
            .join("");

          return (
            <motion.li key={item.id ?? idx} className={styles.row} variants={itemVariants}>
              <article className={styles.card}>
                <header className={styles.header}>
                  <span className={styles.logoWrap} aria-hidden={item.logo ? "false" : "true"}>
                    {item.logo ? (
                      <img src={getImageUrl(item.logo)} alt="" />
                    ) : (
                      <span className={styles.initials}>{initials || "•"}</span>
                    )}
                  </span>

                  <div className={styles.headText}>
                    <h3 className={styles.cardTitle}>{item.title}</h3>
                    <div className={styles.metaLine}>
                      {item.role && <span className={styles.role}>{item.role}</span>}
                      {item.role && item.org && <span className={styles.sep}>·</span>}
                      {item.org && <span className={styles.org}>{item.org}</span>}
                    </div>
                  </div>

                  {item.date && <time className={styles.when}>{item.date}</time>}
                </header>

                {item.description && <p className={styles.blurb}>{item.description}</p>}
              </article>
            </motion.li>
          );
        })}
      </motion.ul>
    </section>
  );
};
