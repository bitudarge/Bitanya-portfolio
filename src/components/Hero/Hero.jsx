import React, { useEffect, useMemo, useState } from "react";
import styles from "./Hero.module.css";
import { useParallax } from "../../hooks/useParallax";

export const Hero = () => {
  const eyebrowRef = useParallax(-28);
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

  return (
    <section id="home" className={styles.container}>
      <span ref={eyebrowRef} className={styles.eyebrow}>01 — Portfolio</span>

      <h1 className={styles.title}>Hi, I&rsquo;m Bitanya</h1>

      <p className={styles.subtitle} aria-live="polite">
        I&rsquo;m a{" "}
        <span className={styles.type}>
          {displayText}
          <span className={styles.cursor} aria-hidden="true">|</span>
        </span>
      </p>

      <div className={styles.ctaRow}>
        <a href="#about" className={`${styles.btn} ${styles.btnPrimary}`}>
          About Me
        </a>
        <a href="#projects" className={styles.btn}>
          View Projects
        </a>
      </div>

      <div className={styles.rule} aria-hidden="true" />
    </section>
  );
};
