import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Involvement.module.css";
import story from "../../data/involvementStory.json";
import { getImageUrl } from "../../utils";
import { useMediaQuery } from "../../hooks/useMediaQuery";

gsap.registerPlugin(ScrollTrigger);

// Hand-tuned vertical offsets per beat index, desktop only - this is what
// gives the horizontal track its staggered, editorial-scrapbook feel
// instead of everything sitting on one straight row.
const STAGGER = [0, 72, -28, 96, 0, 48];

function PhotoBeat({ beat }) {
  return (
    <>
      <div className={styles.beatImageWrap}>
        <img src={getImageUrl(beat.src)} alt={beat.caption || beat.title} loading="lazy" />
      </div>
      <div className={styles.beatCaptionBlock}>
        {beat.kicker && <span className={styles.beatKicker}>{beat.kicker}</span>}
        <span className={styles.beatTitle}>{beat.title}</span>
        {beat.caption && <span className={styles.beatCaption}>{beat.caption}</span>}
      </div>
    </>
  );
}

function TextBeat({ beat }) {
  return (
    <div className={styles.textBeatInner}>
      <h3 className={`${styles.textHeading} ${beat.accent === "cursive" ? styles.textHeadingCursive : ""}`}>
        {beat.heading}
      </h3>
      <p className={styles.textBody}>{beat.body}</p>
    </div>
  );
}

function beatClassName(beat) {
  const parts = [styles.beatSlot];
  if (beat.type === "text") {
    parts.push(styles.textBeat);
  } else {
    parts.push(styles.photoBeat);
    parts.push(styles[`size-${beat.size}`]);
    parts.push(styles[`orientation-${beat.orientation}`]);
    if (beat.featured) parts.push(styles.featuredBeat);
  }
  return parts.join(" ");
}

export const Involvement = () => {
  const prefersReducedMotion = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 900px)");

  const sectionRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const beatRefs = useRef([]);
  beatRefs.current = [];

  useEffect(() => {
    if (prefersReducedMotion || !isDesktop) return;
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return;

    const ctx = gsap.context(() => {
      const distance = track.scrollWidth - viewport.clientWidth;
      if (distance <= 0) return;

      function updateDepth() {
        const viewportRect = viewport.getBoundingClientRect();
        const center = viewportRect.left + viewportRect.width / 2;
        const half = viewportRect.width / 2;

        beatRefs.current.forEach((el) => {
          if (!el) return;
          const r = el.getBoundingClientRect();
          const elCenter = r.left + r.width / 2;
          const norm = Math.min(Math.abs(elCenter - center) / half, 1);
          gsap.set(el, { scale: 1 - norm * 0.07, opacity: 1 - norm * 0.3 });
        });
      }

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
          onUpdate: updateDepth,
          onRefresh: updateDepth,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion, isDesktop]);

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
        <p className={styles.subtitle}>Leadership, research, and the moments that built them.</p>
      </motion.div>

      {isDesktop ? (
        <div ref={viewportRef} className={styles.galleryViewport}>
          <div ref={trackRef} className={styles.track}>
            {story.map((beat, i) => (
              <div
                key={i}
                ref={(el) => (beatRefs.current[i] = el)}
                className={beatClassName(beat)}
                style={prefersReducedMotion ? undefined : { marginTop: STAGGER[i % STAGGER.length] }}
              >
                {beat.type === "photo" ? <PhotoBeat beat={beat} /> : <TextBeat beat={beat} />}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <ul className={styles.mobileStory} role="list">
          {story.map((beat, i) => (
            <motion.li
              key={i}
              className={beatClassName(beat)}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5 }}
            >
              {beat.type === "photo" ? <PhotoBeat beat={beat} /> : <TextBeat beat={beat} />}
            </motion.li>
          ))}
        </ul>
      )}
    </section>
  );
};
