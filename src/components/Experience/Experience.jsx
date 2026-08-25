import { motion, useReducedMotion } from "framer-motion";
import styles from "./Experience.module.css";
import history from "../../data/history.json";

function formatRange(start, end) {
  const fmt = (s) => {
    if (!s) return "";
    const [y, m] = s.split("-");
    const date = new Date(Number(y), Number(m ?? 1) - 1, 1);
    return date.toLocaleString(undefined, { month: "short", year: "numeric" });
  };
  return `${fmt(start)} – ${end && end.toLowerCase() !== "present" ? fmt(end) : "Present"}`;
}

function ExperienceCard({ item, index }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.article
      className={styles.card}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: prefersReducedMotion ? 0 : index * 0.08 }}
      whileHover={prefersReducedMotion ? undefined : { y: -6 }}
    >
      <div className={styles.roleOrgLine}>
        <h3 className={styles.role}>{item.role}</h3>
        <span className={styles.org}>{item.org}</span>
      </div>
      <span className={styles.range}>{formatRange(item.start, item.end)}</span>
      <p className={styles.summary}>{item.summary}</p>
      {Array.isArray(item.bullets) && item.bullets.length > 0 && (
        <ul className={styles.bullets}>
          {item.bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      )}
    </motion.article>
  );
}

export const Experience = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className={styles.container} id="experience">
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
      >
        <h2 className={styles.title}>Experience</h2>
      </motion.div>

      <div className={styles.grid}>
        {history.map((item, i) => (
          <ExperienceCard key={item.id} item={item} index={i} />
        ))}
      </div>
    </section>
  );
};
