import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Hero.module.css";

gsap.registerPlugin(ScrollTrigger);

const VIDEO_SRC = "/assets/hero/bloom-corners.mp4";

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

  /* -------- Ambient corner-flower video + scroll hand-off --------------
     The flowers just loop on their own (autoPlay/loop) - they're no
     longer scroll-scrubbed. A short pin only covers the hand-off: the
     intro text fades out, then a soft wash dissolves the scene into the
     real About section below, so it still reads as one continuous scene
     rather than a hard cut. -------------------------------- */
  const sectionRef = useRef(null);
  const introRef = useRef(null);
  const cueRef = useRef(null);
  const fadeRef = useRef(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => "+=" + Math.round(window.innerHeight * 0.6),
          scrub: 0.6,
          pin: true,
          pinType: "fixed",
          pinSpacing: true,
        },
      });

      tl.to(cueRef.current, { opacity: 0, y: -8, duration: 0.15 }, 0);
      tl.to(introRef.current, { opacity: 0, y: -30, scale: 0.96, duration: 0.5, ease: "power1.out" }, 0.05);
      tl.to(fadeRef.current, { opacity: 1, duration: 0.5, ease: "power1.in" }, 0.5);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="home" ref={sectionRef} className={styles.container}>
      <video
        className={styles.heroVideo}
        src={VIDEO_SRC}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />
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
        <span>Scroll</span>
        <svg width="14" height="20" viewBox="0 0 14 20" fill="none">
          <rect x="1" y="1" width="12" height="18" rx="6" stroke="currentColor" strokeWidth="1.4" />
          <circle className={styles.scrollDot} cx="7" cy="6" r="2" fill="currentColor" />
        </svg>
      </div>
    </section>
  );
};
