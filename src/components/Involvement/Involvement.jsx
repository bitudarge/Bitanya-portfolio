import { useEffect, useMemo, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Involvement.module.css";
import data from "../../data/involvement.json";
import extras from "../../data/extras.json";
import { getImageUrl } from "../../utils";
import { useMediaQuery } from "../../hooks/useMediaQuery";

gsap.registerPlugin(ScrollTrigger);

export const Involvement = () => {
  const prefersReducedMotion = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 900px)");

  const moments = useMemo(() => {
    const fromRoles = data.flatMap((item) =>
      (item.photos || []).map((p) => ({ ...p, title: item.title }))
    );
    const fromExtras = extras.map((ex) => ({
      src: ex.photo,
      title: ex.title,
      caption: ex.date,
    }));
    return [...fromRoles, ...fromExtras].filter((m) => m.src);
  }, []);

  const otherRoles = useMemo(
    () => data.filter((item) => !item.photos?.length),
    []
  );

  const sectionRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion || !isDesktop) return;
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return;

    const ctx = gsap.context(() => {
      const distance = track.scrollWidth - viewport.clientWidth;
      if (distance <= 0) return;

      gsap.to(track, {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => "+=" + distance,
          scrub: true,
          pin: true,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion, isDesktop, moments.length]);

  return (
    <section ref={sectionRef} className={styles.container} id="involvement" aria-labelledby="inv-title">
      <motion.div
        className={styles.heading}
        initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
      >
        <h2 id="inv-title" className={styles.title}>Involvement</h2>
      </motion.div>

      <div ref={viewportRef} className={styles.galleryViewport}>
        <ul ref={trackRef} className={styles.track} role="list">
          {moments.map((m, i) => (
            <li key={i} className={styles.momentCard}>
              <img src={getImageUrl(m.src)} alt={m.caption || m.title} />
              <div className={styles.momentText}>
                <span className={styles.momentTitle}>{m.title}</span>
                {m.caption && <span className={styles.momentCaption}>{m.caption}</span>}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {otherRoles.length > 0 && (
        <ul className={styles.otherRoles} role="list">
          {otherRoles.map((item, i) => (
            <li key={i} className={styles.otherRole}>
              <span className={styles.otherRoleTitle}>{item.title}</span>
              <span className={styles.otherRoleMeta}>
                {item.role ? `${item.role} · ${item.org}` : item.org}
              </span>
              {item.date && <time className={styles.otherRoleDate}>{item.date}</time>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
