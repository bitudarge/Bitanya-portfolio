import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Hero.module.css";
import { HeroFlower } from "./HeroFlower";

gsap.registerPlugin(ScrollTrigger);

// Petals have no static SVG rotation of their own - GSAP owns the whole
// angle (a CSS transform on an SVG element replaces its transform
// attribute rather than adding to it, so splitting the rotation between
// JSX and GSAP doesn't compose). PETAL_ANGLES is each petal's fully-bloomed
// spread angle; CLOSED_ANGLE is the small, alternating, near-vertical angle
// each one sits at as a closed bud.
const PETAL_ANGLES = [0, 60, 120, 180, 240, 300];
const CLOSED_ANGLE = [10, -10, 14, -14, 6, -6];

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

  /* -------- Scroll-tied bloom, four phases over one pinned scene:
     0-20%   closed bud, name reads clearly, nothing moving yet
     20-50%  petals unfurl (staggered, not a single block rotation),
             name fades up and out as the bloom takes over
     50-80%  full bloom holds with a slow, gentle drift (scale + rotate)
     80-100% bloom shifts aside and softens as the pin releases straight
             into the real About section below - no invented filler
     Scrubbed to scroll position throughout, so scrolling back up runs
     every phase in reverse automatically. -------- */
  const sectionRef = useRef(null);
  const introRef = useRef(null);
  const cueRef = useRef(null);
  const flowerWrapRef = useRef(null);
  const flowerGroupRef = useRef(null);
  const petalRefs = useRef([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const petals = petalRefs.current.filter(Boolean);
      const stamens = flowerGroupRef.current?.querySelector(`.${styles.stamens}`);

      // svgOrigin (not transformOrigin) is GSAP's purpose-built way to pivot
      // an SVG element around an arbitrary point in the SVG's own user-space
      // coordinates - transformOrigin here gets resolved against each
      // petal's own getBBox() (its narrow sliver, not the flower center),
      // which swings every petal off to the wrong place on any real rotation.
      gsap.set(petals, {
        svgOrigin: "160 160",
        rotate: (i) => CLOSED_ANGLE[i],
        scaleX: 0.32,
        scaleY: 0.82,
      });
      gsap.set(stamens, { opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => "+=" + Math.round(window.innerHeight * 0.85),
          scrub: 0.6,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
        },
      });

      // Phase 0-0.2: scroll cue fades almost immediately, everything else holds
      tl.to(cueRef.current, { opacity: 0, y: -8, duration: 0.1 }, 0);

      // Phase 0.15-0.48: name fades/lifts away
      tl.to(
        introRef.current,
        { opacity: 0, y: -34, scale: 0.95, duration: 0.33, ease: "power1.out" },
        0.15
      );

      // Phase 0.2-0.5: petals unfurl to their fully-spread angle with a soft
      // per-petal stagger; bud scales up
      tl.to(
        petals,
        {
          svgOrigin: "160 160",
          rotate: (i) => PETAL_ANGLES[i],
          scaleX: 1,
          scaleY: 1,
          duration: 0.3,
          stagger: 0.025,
          ease: "power2.out",
        },
        0.2
      );
      tl.to(flowerWrapRef.current, { scale: 1, duration: 0.3, ease: "power2.out" }, 0.2);
      tl.to(stamens, { opacity: 1, duration: 0.18 }, 0.34);

      // Phase 0.5-0.8: full bloom, gentle continuous-feeling drift. This
      // animates flowerWrapRef (the outer HTML wrapper), not the SVG <g>
      // that carries the CSS idle-sway keyframe animation - mixing a CSS
      // animation and a GSAP tween on the same element's transform would
      // fight each other every frame.
      tl.to(flowerWrapRef.current, { scale: 1.05, rotate: 3, duration: 0.3, ease: "sine.inOut" }, 0.5);

      // Phase 0.8-1.0: bloom shifts aside and softens, pin releases into About
      tl.to(
        flowerWrapRef.current,
        { x: 120, y: -10, scale: 0.86, opacity: 0.22, duration: 0.2, ease: "power1.in" },
        0.8
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="home" ref={sectionRef} className={styles.container}>
      <div className={styles.sunsetBg} aria-hidden="true" />

      <div className={styles.stage}>
        <div ref={flowerWrapRef} className={styles.flowerWrap}>
          <HeroFlower ref={flowerGroupRef} petalRefs={petalRefs} />
        </div>

        <div ref={introRef} className={styles.intro}>
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
