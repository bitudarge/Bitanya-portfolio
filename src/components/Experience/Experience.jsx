import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Experience.module.css";
import history from "../../data/history.json";

gsap.registerPlugin(ScrollTrigger);

const STICKY_TOP = 96;

function formatRange(start, end) {
  const fmt = (s) => {
    if (!s) return "";
    const [y, m] = s.split("-");
    const date = new Date(Number(y), Number(m ?? 1) - 1, 1);
    return date.toLocaleString(undefined, { month: "short", year: "numeric" });
  };
  return `${fmt(start)} – ${end && end.toLowerCase() !== "present" ? fmt(end) : "Present"}`;
}

function StepContent({ item }) {
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
    </>
  );
}

/* Cards stack via plain CSS position: sticky (same top offset for every
   card, so each new one naturally slides over and covers the last). The
   scroll distance this needs is just each card's own rendered height -
   nothing artificial added - so a short history never reads as a long
   blank scroll. GSAP only adds the scale/dim polish on top, scoped to
   each card's own height via its ScrollTrigger. */
function StackedCards({ items, animate }) {
  const cardRefs = useRef([]);
  cardRefs.current = [];

  useEffect(() => {
    if (!animate) return;

    const ctx = gsap.context(() => {
      cardRefs.current.forEach((card, i) => {
        if (!card || i === items.length - 1) return;
        const nextCard = cardRefs.current[i + 1];
        if (!nextCard) return;
        // Dim card i only as card i+1 physically slides over it (next
        // card's own entrance), not across its own whole sticky window -
        // otherwise it starts fading the instant it becomes current,
        // before anyone's actually covering it.
        gsap.to(card, {
          scale: 0.94,
          opacity: 0.55,
          ease: "none",
          scrollTrigger: {
            trigger: nextCard,
            start: "top bottom",
            end: `top top+=${STICKY_TOP}`,
            scrub: true,
          },
        });
      });
    });

    return () => ctx.revert();
  }, [animate, items.length]);

  return (
    <div className={styles.stackedList}>
      {items.map((item, i) => (
        <div
          key={item.id}
          className={styles.stickyWrap}
          style={{ top: `${STICKY_TOP + i * 6}px`, zIndex: i + 1 }}
        >
          <div
            ref={(el) => (cardRefs.current[i] = el)}
            className={styles.stackedCard}
          >
            <StepContent item={item} />
          </div>
        </div>
      ))}
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
