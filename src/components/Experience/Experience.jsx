import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Experience.module.css";
import history from "../../data/history.json";

gsap.registerPlugin(ScrollTrigger);

const STICKY_TOP = 96;
// How much scroll (in px) the dim/shrink hand-off takes, right before the
// next card reaches its stacked position. Each card's own spacer is a
// full viewport tall, so keying the dim off "next card enters from the
// bottom of the screen" (the old approach) fired it almost the instant a
// card became current - this fixed window keeps it a short hand-off at
// the very end of the card's dwell instead.
const COVER_TRANSITION = 120;

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
   card, so each new one naturally slides over and covers the last). Each
   card sits inside a tall .stepWrap spacer so it actually holds still on
   screen - fully visible, its own moment - before the next card's own
   sticky window begins and slides over it. GSAP only adds the scale/dim
   polish on top, scoped to that hand-off window via its ScrollTrigger. */
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
        // Dim card i only in the short window right before card i+1
        // actually reaches its stacked position - a fixed scroll
        // distance, not tied to viewport height, so it stays a quick
        // hand-off at the end of the dwell on every screen size.
        const scrollTrigger = {
          trigger: nextCard,
          start: `top top+=${STICKY_TOP + COVER_TRANSITION}`,
          end: `top top+=${STICKY_TOP}`,
          scrub: true,
        };

        gsap.to(card, {
          scale: 0.94,
          y: -24,
          opacity: 0.55,
          ease: "none",
          scrollTrigger,
        });

        // The incoming card itself arrives soft and faded, then comes
        // into full focus right as it settles into place - so at any
        // moment the current (sticky) card reads bold and sharp while
        // whatever's arriving underneath it is still a little blurry.
        gsap.fromTo(
          nextCard,
          { filter: "blur(6px)", opacity: 0.7 },
          { filter: "blur(0px)", opacity: 1, ease: "none", scrollTrigger }
        );
      });
    });

    return () => ctx.revert();
  }, [animate, items.length]);

  return (
    <div className={styles.stackedList}>
      {items.map((item, i) => (
        <div key={item.id} className={styles.stepWrap}>
          <div
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
