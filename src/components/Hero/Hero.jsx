import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./Hero.module.css";
import { Link } from "react-router-dom";
import { getImageUrl } from "../../utils";

/* -------- Sparkles (twinkle stars) -------- */
function Sparkles({ count = 140 }) {
  const [stars, setStars] = useState([]);
  useEffect(() => {
    setStars(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 4,
        duration: Math.random() * 3 + 2,
      }))
    );
  }, [count]);

  return (
    <div className={styles.sparklesFixed} aria-hidden="true">
      {stars.map((s) => (
        <span
          key={s.id}
          className={styles.star}
          style={{
            top: `${s.top}vh`,
            left: `${s.left}vw`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

export const Hero = () => {
  const sectionRef = useRef(null);
  const imgRef = useRef(null);

  // Subtle parallax for portrait (kept)
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      if (imgRef.current) {
        const px = (x - 50) * 0.2;
        const py = (y - 50) * 0.2;
        imgRef.current.style.transform = `translate3d(${px}px, ${py}px, 0)`;
      }
    };
    const onLeave = () => {
      if (imgRef.current) imgRef.current.style.transform = `translate3d(0,0,0)`;
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  /* -------- Typewriter roles (with backspace + blinking cursor) -------- */
  const roles = useMemo(
    () => [
      "Student",
      "Research Assistant",
      "Product Manager",
      "UI/UX Designer",
    ],
    []
  );

  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    const current = roles[roleIndex];
    const typingSpeed = 80;      // ms per character when typing
    const deletingSpeed = 45;    // ms per character when deleting
    const pauseAtFull = 1000;    // pause when full word shown
    const pauseAtEmpty = 400;    // pause before typing next word

    let timeout;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Respect reduced motion: instantly swap roles every ~2s
      timeout = setTimeout(() => {
        setDisplayText(current);
        setIsDeleting(false);
        setCharIndex(current.length);
        setRoleIndex((i) => (i + 1) % roles.length);
      }, 2000);
      return () => clearTimeout(timeout);
    }

    if (!isDeleting && charIndex < current.length) {
      // typing forward
      timeout = setTimeout(() => {
        setDisplayText(current.slice(0, charIndex + 1));
        setCharIndex((c) => c + 1);
      }, typingSpeed);
    } else if (!isDeleting && charIndex === current.length) {
      // reached end, pause then start deleting
      timeout = setTimeout(() => setIsDeleting(true), pauseAtFull);
    } else if (isDeleting && charIndex > 0) {
      // deleting backward
      timeout = setTimeout(() => {
        setDisplayText(current.slice(0, charIndex - 1));
        setCharIndex((c) => c - 1);
      }, deletingSpeed);
    } else if (isDeleting && charIndex === 0) {
      // finished deleting, go to next word
      timeout = setTimeout(() => {
        setIsDeleting(false);
        setRoleIndex((i) => (i + 1) % roles.length);
      }, pauseAtEmpty);
    }

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, roleIndex, roles]);

  return (
    <section ref={sectionRef} className={styles.container}>
      {/* Background: gradient + sparkles only */}
      <div className={styles.bgLayer}>
        <Sparkles />
      </div>

      {/* Foreground content */}
      <div className={styles.content}>
        <h1 className={styles.title}>Hi, I’m Bitanya</h1>

        {/* Typewriter line */}
        <p className={styles.subtitle} aria-live="polite">
          I’m a{" "}
          <span className={styles.type}>
            {displayText}
            <span className={styles.cursor} aria-hidden="true">|</span>
          </span>
        </p>

        <div className={styles.ctaRow}>
          <Link to="/about" className={`${styles.btn} ${styles.btnPrimary}`}>
            About Me
          </Link>
          <Link to="/projects" className={`${styles.btn} ${styles.btnPrimary}`}>
            View Projects
          </Link>
          <Link to="/Experience" className={`${styles.btn} ${styles.btnPrimary}`}>
            View Experience
          </Link>
        </div>
      </div>

      <img
        ref={imgRef}
        src={getImageUrl("hero/heroImage.png")}
        alt="Portrait"
        className={styles.heroImg}
      />
    </section>
  );
};
