import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Hero.module.css";

gsap.registerPlugin(ScrollTrigger);

// PLACEHOLDER asset - has a visible "DZ" stock-preview watermark baked in.
// Swap for a licensed/clean single-flower clip before the real launch;
// everything else here (the corner layout, the scroll-scrub) carries over
// to a replacement file with just a src change.
const FLOWER_SRC = "/assets/hero/flower-bud.mp4";

// Same clip, repeated and varied (size/rotation/mirroring) to read as a
// loose cluster rather than identical copies. Slight per-instance delay
// offsets keep the bloom from looking perfectly mechanical.
const BOTTOM_LEFT = [
  { size: 190, left: "-3%", bottom: "-5%", rotate: -12, flip: false, z: 3, delay: 0 },
  { size: 235, left: "7%", bottom: "7%", rotate: 9, flip: true, z: 2, delay: 0.08 },
  { size: 150, left: "19%", bottom: "-3%", rotate: -22, flip: false, z: 1, delay: 0.16 },
];

const TOP_RIGHT = [
  { size: 175, right: "1%", top: "-5%", rotate: 11, flip: true, z: 4, delay: 0.04 },
  { size: 215, right: "11%", top: "5%", rotate: -15, flip: false, z: 3, delay: 0.1 },
  { size: 140, right: "-2%", top: "16%", rotate: 20, flip: true, z: 2, delay: 0.18 },
  { size: 190, right: "17%", top: "-3%", rotate: -7, flip: false, z: 1, delay: 0.24 },
];

function FlowerCluster({ instances, className, registerRef }) {
  return (
    <div className={className} aria-hidden="true">
      {instances.map((f, i) => (
        <div
          key={i}
          className={styles.flowerSlot}
          style={{
            width: f.size,
            height: f.size,
            left: f.left,
            right: f.right,
            top: f.top,
            bottom: f.bottom,
            zIndex: f.z,
            transform: `rotate(${f.rotate}deg) ${f.flip ? "scaleX(-1)" : ""}`,
          }}
        >
          <video
            ref={(el) => registerRef(el, f.delay)}
            className={styles.flowerVideo}
            src={FLOWER_SRC}
            muted
            playsInline
            preload="auto"
          />
        </div>
      ))}
    </div>
  );
}

export const Hero = () => {
  /* -------- Typewriter roles (with backspace + blinking cursor) -------- */
  const roles = useMemo(
    () => ["Student", "Research Assistant", "Data Analyst"],
    []
  );

  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    const current = roles[roleIndex];
    const typingSpeed = 80;
    const deletingSpeed = 45;
    const pauseAtFull = 1000;
    const pauseAtEmpty = 400;

    let timeout;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      timeout = setTimeout(() => {
        setDisplayText(current);
        setIsDeleting(false);
        setCharIndex(current.length);
        setRoleIndex((i) => (i + 1) % roles.length);
      }, 2000);
      return () => clearTimeout(timeout);
    }

    if (!isDeleting && charIndex < current.length) {
      timeout = setTimeout(() => {
        setDisplayText(current.slice(0, charIndex + 1));
        setCharIndex((c) => c + 1);
      }, typingSpeed);
    } else if (!isDeleting && charIndex === current.length) {
      timeout = setTimeout(() => setIsDeleting(true), pauseAtFull);
    } else if (isDeleting && charIndex > 0) {
      timeout = setTimeout(() => {
        setDisplayText(current.slice(0, charIndex - 1));
        setCharIndex((c) => c - 1);
      }, deletingSpeed);
    } else if (isDeleting && charIndex === 0) {
      timeout = setTimeout(() => {
        setIsDeleting(false);
        setRoleIndex((i) => (i + 1) % roles.length);
      }, pauseAtEmpty);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, roleIndex, roles]);

  /* -------- Scroll-scrubbed corner bloom --------------------------------
     Seven copies of the same flower clip (three bottom-left, four
     top-right) all scrub together off one scroll-driven clock, each with
     a small time offset so the cluster blooms as a loose group rather
     than in lockstep. The last part of the pin dissolves the whole scene
     into the real About section below. -------------------------------- */
  const sectionRef = useRef(null);
  const introRef = useRef(null);
  const cueRef = useRef(null);
  const fadeRef = useRef(null);
  const videoEntries = useRef([]);
  const [videoReady, setVideoReady] = useState(false);

  const registerRef = (el, delay) => {
    if (!el) return;
    if (!videoEntries.current.some((entry) => entry.el === el)) {
      videoEntries.current.push({ el, delay });
    }
  };

  useEffect(() => {
    const first = videoEntries.current[0]?.el;
    if (!first) return;
    const onReady = () => setVideoReady(true);
    if (first.readyState >= 1) {
      onReady();
    } else {
      first.addEventListener("loadedmetadata", onReady);
      return () => first.removeEventListener("loadedmetadata", onReady);
    }
  }, []);

  useEffect(() => {
    if (!videoReady) return;
    const duration = videoEntries.current[0]?.el?.duration || 4.1;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const setAll = (t) => {
      videoEntries.current.forEach(({ el, delay }) => {
        el.currentTime = Math.min(Math.max(t + delay, 0), duration);
      });
    };

    if (reducedMotion) {
      setAll(duration * 0.95);
      return;
    }

    const ctx = gsap.context(() => {
      const scrub = { t: 0 };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => "+=" + Math.round(window.innerHeight * 1.1),
          scrub: 0.6,
          pin: true,
          pinType: "fixed",
          pinSpacing: true,
        },
      });

      tl.to(cueRef.current, { opacity: 0, y: -8, duration: 0.08 }, 0);
      tl.to(introRef.current, { opacity: 0, y: -30, scale: 0.96, duration: 0.28, ease: "power1.out" }, 0.1);

      tl.to(
        scrub,
        {
          t: duration,
          duration: 0.72,
          ease: "none",
          onUpdate: () => setAll(scrub.t),
        },
        0
      );

      tl.to(fadeRef.current, { opacity: 1, duration: 0.3, ease: "power1.in" }, 0.72);
    }, sectionRef);

    return () => ctx.revert();
  }, [videoReady]);

  return (
    <section id="home" ref={sectionRef} className={styles.container}>
      <FlowerCluster instances={BOTTOM_LEFT} className={styles.clusterBottomLeft} registerRef={registerRef} />
      <FlowerCluster instances={TOP_RIGHT} className={styles.clusterTopRight} registerRef={registerRef} />
      <div ref={fadeRef} className={styles.heroFade} aria-hidden="true" />

      <div className={styles.stage}>
        <div ref={introRef} className={styles.intro}>
          <div className={styles.textScrim}>
            <h1 className={styles.name}>Hi, I&rsquo;m Bitanya</h1>

            <p className={styles.subtitle} aria-live="polite">
              I&rsquo;m a{" "}
              <span className={styles.type}>
                {displayText}
                <span className={styles.cursor} aria-hidden="true">|</span>
              </span>
            </p>
          </div>
        </div>
      </div>

      <div ref={cueRef} className={styles.scrollCue} aria-hidden="true">
        <span>Scroll to bloom</span>
        <svg width="14" height="20" viewBox="0 0 14 20" fill="none">
          <rect x="1" y="1" width="12" height="18" rx="6" stroke="currentColor" strokeWidth="1.4" />
          <circle className={styles.scrollDot} cx="7" cy="6" r="2" fill="currentColor" />
        </svg>
      </div>
    </section>
  );
};
