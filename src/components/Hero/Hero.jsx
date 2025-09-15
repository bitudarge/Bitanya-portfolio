import React, { useEffect, useRef, useState } from "react";
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

  // Subtle parallax for portrait only
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

  return (
    <section ref={sectionRef} className={styles.container}>
      {/* Background: gradient + sparkles only */}
      <div className={styles.bgLayer}>
        <Sparkles />
      </div>

      {/* Foreground content */}
      <div className={styles.content}>
        <h1 className={styles.title}>Hi, I’m Bitanya</h1>
        <p className={styles.description}>
          I’m all about digging into data, creating cool projects, and bringing ideas to life. Come explore my portfolio — it’s a little mix of what I’ve been learning, building, and loving.”
        </p>
        <div className={styles.ctaRow}>
          <Link to="/projects" className={`${styles.btn} ${styles.btnPrimary}`}>
            View Projects
          </Link>
          <Link to="/about" className={`${styles.btn} ${styles.btnPrimary}`}>
            About Me
          </Link>
          <a
            href="/Bitanya_Darge_Resume.pdf"
            className={`${styles.btn} ${styles.btnPrimary}`}
            target="_blank"
            rel="noreferrer"
          >
            Download Resume
          </a>
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
