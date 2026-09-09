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

function StepDots({ count, activeIndex }) {
  return (
    <div className={styles.dots} aria-hidden="true">
      {Array.from({ length: count }).map((_, j) => (
        <span key={j} className={`${styles.dot} ${j === activeIndex ? styles.dotActive : ""}`} />
      ))}
    </div>
  );
}

function StepContent({ item, index, stepCount }) {
  return (
    <>
      <span className={styles.range}>{formatRange(item.start, item.end)}</span>
      <h3 className={styles.role}>{item.role}</h3>
      <span className={styles.org}>{item.org}</span>
      <p className={styles.summary}>{item.summary}</p>
      {Array.isArray(item.bullets) && item.bullets.length > 0 && (
        <ul className={styles.bullets}>
          {item.bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      )}
      <StepDots count={stepCount} activeIndex={index} />
    </>
  );
}

function StackedCards({ items, animate }) {
  return (
    <div className={styles.stackedList}>
      {items.map((item, i) =>
        animate ? (
          <motion.div
            key={item.id}
            className={styles.stackedCard}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: i * 0.04 }}
          >
            <StepContent item={item} index={i} stepCount={items.length} />
          </motion.div>
        ) : (
          <div key={item.id} className={styles.stackedCard}>
            <StepContent item={item} index={i} stepCount={items.length} />
          </div>
        )
      )}
    </div>
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

      <StackedCards items={history} animate={!prefersReducedMotion} />
    </section>
  );
};
