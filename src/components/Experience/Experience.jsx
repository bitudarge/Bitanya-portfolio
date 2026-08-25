import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import styles from "./Experience.module.css";
import history from "../../data/history.json";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { useParallax } from "../../hooks/useParallax";

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
      <div className={styles.stepHeader}>
        <span className={styles.stepNum}>{String(index + 1).padStart(2, "0")}</span>
        <span className={styles.stepRule} />
      </div>
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
      <StepDots count={stepCount} activeIndex={index} />
    </>
  );
}

function StepPanel({ item, index, stepCount, scrollYProgress }) {
  const start = index / stepCount;
  const end = (index + 1) / stepCount;

  const opacity = useTransform(
    scrollYProgress,
    [start - 0.05, start + 0.1, end - 0.1, end + 0.05],
    [0, 1, 1, 0]
  );
  const translateY = useTransform(
    scrollYProgress,
    [start - 0.05, start + 0.1, end - 0.1, end + 0.05],
    [40, 0, 0, -40]
  );

  return (
    <motion.div className={styles.stepPanel} style={{ opacity, y: translateY }}>
      <StepContent item={item} index={index} stepCount={stepCount} />
    </motion.div>
  );
}

function DesktopStickyScroll({ items }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const stepCount = items.length;

  return (
    <div
      ref={containerRef}
      className={styles.stickyOuter}
      style={{ height: `${stepCount * 100 + 50}vh` }}
    >
      <div className={styles.stickyInner}>
        <div className={styles.panelWrap}>
          {items.map((item, i) => (
            <StepPanel
              key={item.id}
              item={item}
              index={i}
              stepCount={stepCount}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </div>
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
  const isDesktop = useMediaQuery("(min-width: 900px)");
  const eyebrowRef = useParallax(-24);

  return (
    <section className={styles.container} id="experience">
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
      >
        <span ref={eyebrowRef} className={styles.eyebrow}>03 — Experience</span>
        <h2 className={styles.title}>Experience</h2>
      </motion.div>

      {prefersReducedMotion ? (
        <StackedCards items={history} animate={false} />
      ) : isDesktop ? (
        <DesktopStickyScroll items={history} />
      ) : (
        <StackedCards items={history} animate={true} />
      )}
    </section>
  );
};
