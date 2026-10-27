import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Hero.module.css";

gsap.registerPlugin(ScrollTrigger);

const VIDEO_SRC = "/assets/hero/bloom.mp4";

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

  /* -------- Scroll-scrubbed bloom video -------------------------------
     The bloom itself is a real video (not CSS/SVG) - its currentTime is
     driven directly by scroll position, so scrolling back up genuinely
     reverses the footage rather than faking a reverse animation. Roughly
     the first ~72% of the pin scrubs through the clip; the last ~28%
     holds the final frame while a soft wash dissolves the scene into the
     real About section below, so the hand-off reads as one continuous
     scene rather than a hard cut. -------------------------------- */
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const introRef = useRef(null);
  const cueRef = useRef(null);
  const fadeRef = useRef(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onReady = () => setVideoReady(true);
    if (video.readyState >= 1) {
      onReady();
    } else {
      video.addEventListener("loadedmetadata", onReady);
    }
    return () => video.removeEventListener("loadedmetadata", onReady);
  }, []);

  useEffect(() => {
    if (!videoReady) return;
    const video = videoRef.current;
    const duration = video.duration || 4;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      // No scroll-driven playback - just hold on a fully-bloomed frame.
      video.currentTime = duration * 0.92;
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
          anticipatePin: 1,
        },
      });

      tl.to(cueRef.current, { opacity: 0, y: -8, duration: 0.08 }, 0);
      tl.to(introRef.current, { opacity: 0, y: -30, scale: 0.96, duration: 0.28, ease: "power1.out" }, 0.1);

      // Scrub the clip itself across most of the pin.
      tl.to(
        scrub,
        {
          t: duration,
          duration: 0.72,
          ease: "none",
          onUpdate: () => {
            video.currentTime = scrub.t;
          },
        },
        0
      );

      // Hold the final bloomed frame and dissolve into About.
      tl.to(fadeRef.current, { opacity: 1, duration: 0.3, ease: "power1.in" }, 0.72);
    }, sectionRef);

    return () => ctx.revert();
  }, [videoReady]);

  return (
    <section id="home" ref={sectionRef} className={styles.container}>
      <video
        ref={videoRef}
        className={styles.heroVideo}
        src={VIDEO_SRC}
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      <div className={styles.heroScrim} aria-hidden="true" />
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
