import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Experience.module.css";
import history from "../../data/history.json";

gsap.registerPlugin(ScrollTrigger);

// How far each card in the pile sits below the one before it, so the top
// edges of earlier cards stay visible as a neat stacked "pile".
const PEEK = 18;

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

/* A pile of cards centered on screen. Every card is position: sticky
   inside ONE shared container, so each card that arrives stays stuck
   while the next slides up over it, and the whole pile scrolls away
   together at the end. Each card sticks a little lower than the one
   before (PEEK), so the earlier cards' top edges stay visible. GSAP only
   adds a slight shrink to the cards underneath. No blur, no fading. */
function StackedCards({ items, animate }) {
  const cardRefs = useRef([]);
  cardRefs.current = [];

  useEffect(() => {
    if (!animate) return;

    const ctx = gsap.context(() => {
      cardRefs.current.forEach((card, i) => {
        const nextCard = cardRefs.current[i + 1];
        if (!card || !nextCard) return;
        // As the next card rises from the bottom of the screen into its
        // stuck spot, this card shrinks a touch, so the pile reads as depth.
        gsap.to(card, {
          scale: 0.95,
          ease: "none",
          scrollTrigger: {
            trigger: nextCard.parentElement,
            start: "top bottom",
            end: "top center",
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
          style={{ "--i": i, zIndex: i + 1, "--peek": `${PEEK}px` }}
        >
          <div ref={(el) => (cardRefs.current[i] = el)} className={styles.stackedCard}>
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
