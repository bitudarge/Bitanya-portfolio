import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Involvement.module.css";
import story from "../../data/involvementStory.json";
import { getImageUrl } from "../../utils";

gsap.registerPlugin(ScrollTrigger);

// Vertical offsets per beat index - gives the horizontal track a gentle
// editorial stagger instead of everything sitting on one straight row.
// A smaller, steadier range than before (was jumping as much as 96px
// between neighbors, which read as erratic rather than intentional).
const STAGGER = [0, 22, -12, 24, 6, 18, -14, 16, 4, -8];

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
  }
  return parts.join(" ");
}

export const Involvement = () => {
  const prefersReducedMotion = useReducedMotion();

  const sectionRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const progressRef = useRef(null);
  const beatRefs = useRef([]);
  beatRefs.current = [];

  useEffect(() => {
    if (prefersReducedMotion) return;
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return;

    const ctx = gsap.context(() => {
      const getDistance = () => Math.max(0, track.scrollWidth - viewport.clientWidth);
      if (getDistance() <= 0) return;

      // A light edge vignette only - cards fade a touch as they near the
      // left/right edge of the viewport, nothing more. The old version
      // also scaled every card down as it crossed center, which meant the
      // same zoom-in-zoom-out pulse repeated for all ten cards in a row -
      // that's what read as a "loop." Opacity-only, and only right at the
      // edges, keeps the depth cue without the repeating motion.
      function updateDepth() {
        const viewportRect = viewport.getBoundingClientRect();
        const left = viewportRect.left;
        const right = viewportRect.right;
        const edgeZone = viewportRect.width * 0.18;

        beatRefs.current.forEach((el) => {
          if (!el) return;
          const r = el.getBoundingClientRect();
          const distFromEdge = Math.min(r.left - left, right - r.right);
          const norm = 1 - Math.max(0, Math.min(distFromEdge, edgeZone)) / edgeZone;
          gsap.set(el, { opacity: 1 - norm * 0.35 });
        });
      }

      // No anticipatePin here: it pre-pins based on raw scroll velocity,
      // which fights Lenis's own eased scroll position and was exactly
      // what made this section's pin appear to grab a beat before
      // Projects had actually finished scrolling past.
      // The whole section (heading + gallery) is pinned as one
      // exactly-viewport-tall frame (see .container in the CSS), so the
      // gallery sits vertically centered and is fully visible the moment
      // the pin grabs - no blank fade-in. It's sized to fit the viewport,
      // which avoids the old "taller than the screen" catch-up jump.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => "+=" + getDistance(),
          scrub: 0.5,
          pin: true,
          pinType: "fixed",
          invalidateOnRefresh: true,
          onUpdate: updateDepth,
          onRefresh: updateDepth,
        },
      });

      tl.to(track, { x: () => -getDistance(), ease: "none", duration: 1 }, 0);
      if (progressRef.current) {
        tl.fromTo(progressRef.current, { scaleX: 0 }, { scaleX: 1, ease: "none", duration: 1 }, 0);
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

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

      {!prefersReducedMotion ? (
        <div ref={viewportRef} className={styles.galleryViewport}>
          <div ref={trackRef} className={styles.track}>
            {story.map((beat, i) => (
              <div
                key={i}
                ref={(el) => (beatRefs.current[i] = el)}
                className={beatClassName(beat)}
                style={{ transform: `translateY(${STAGGER[i % STAGGER.length]}px)` }}
              >
                {beat.type === "photo" ? <PhotoBeat beat={beat} /> : <TextBeat beat={beat} />}
              </div>
            ))}
          </div>
          <div className={styles.progressTrack} aria-hidden="true">
            <div ref={progressRef} className={styles.progressBar} />
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
