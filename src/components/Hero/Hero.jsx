import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Hero.module.css";

gsap.registerPlugin(ScrollTrigger);

const VIDEO_SRC = "/assets/hero/bloom-final.mp4";

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
  const fadeRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      // Hold on a fully-bloomed frame once the video is seekable.
      const holdFrame = () => {
        video.currentTime = (video.duration || 4.5) * 0.95;
      };
      if (video.readyState >= 1) holdFrame();
      else video.addEventListener("loadedmetadata", holdFrame, { once: true });
      return () => video.removeEventListener("loadedmetadata", holdFrame);
    }

    // Created synchronously on mount - in the same tick as every other
    // section's ScrollTrigger, not gated behind the video's async
    // metadata load. A pin created later than everything else throws off
    // every OTHER ScrollTrigger below it on the page: each one measured
    // its own position against a layout that didn't yet include this
    // pin's spacer, so it fired hundreds of pixels too early (confirmed
    // via ScrollTrigger.getAll() - Involvement's pin start was off by
    // ~990px, exactly this pin's reserved scroll distance). A later
    // ScrollTrigger.refresh() doesn't fix it either; GSAP's position math
    // here depends on creation order, not just final DOM state. The
    // actual video seek below stays guarded on readiness, since you can't
    // seek a video before its metadata has loaded - scrubbing just no-ops
    // for the rare case someone scrolls in during the first instant
    // before that arrives.
    const FALLBACK_DURATION = 4.5;
    const ctx = gsap.context(() => {
      const scrub = { t: 0 };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          // Scrolling 900px (Hero's own height) just to get past it is
          // unavoidable, pin or no pin - that part isn't the "blank page."
          // It's this extra hold time added on top of that, purely for
          // the scrub+dissolve, that was the real dead stretch. Trimmed
          // down from 1.1x viewport height to 0.6x.
          end: () => "+=" + Math.round(window.innerHeight * 0.6),
          scrub: 0.6,
          pin: true,
          pinType: "fixed",
          pinSpacing: true,
        },
      });

      tl.to(introRef.current, { opacity: 0, y: -30, scale: 0.96, duration: 0.28, ease: "power1.out" }, 0.1);

      // Scrub the clip itself across most of the pin.
      tl.to(
        scrub,
        {
          t: FALLBACK_DURATION,
          duration: 0.72,
          ease: "none",
          onUpdate: () => {
            if (video.readyState >= 1) {
              video.currentTime = Math.min(scrub.t, video.duration || FALLBACK_DURATION);
            }
          },
        },
        0
      );

      // Hold the final bloomed frame and dissolve into About.
      tl.to(fadeRef.current, { opacity: 1, duration: 0.3, ease: "power1.in" }, 0.72);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

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
    </section>
  );
};
