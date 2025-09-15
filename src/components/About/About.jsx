import React, { useEffect, useRef } from "react";
import styles from "./About.module.css";
import { getImageUrl } from "../../utils";


const hobbies = [
  { img: getImageUrl("about/painting.png"), title: "Painting", blurb: "Colors, creativity, and a calm mind at work." },
  { img: getImageUrl("about/figma.png"),   title: "Design",  blurb: "Figma mockups, color palettes, typography." },
  { img: getImageUrl("about/coffee.png"),  title: "Cafés",   blurb: "Matcha, playlists, and study ambience." },
  { img: getImageUrl("about/nature.png"), title: "Nature",blurb: "Fresh air, long walks, and quiet thinking spots."},
];

export const About = () => {
  const sectionRef = useRef(null);

  // Stagger-in reveal when section enters viewport
  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return;
    const items = root.querySelectorAll(`.${styles.reveal}`);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add(styles.in);
        });
      },
      { threshold: 0.15 }
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Subtle hover tilt for hobby cards
  const onCardMove = (e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / r.width;  // -0.5..0.5
    const dy = (e.clientY - (r.top + r.height / 2)) / r.height; // -0.5..0.5
    el.style.setProperty("--tiltX", `${dy * -6}deg`);
    el.style.setProperty("--tiltY", `${dx * 6}deg`);
  };
  const onCardLeave = (e) => {
    const el = e.currentTarget;
    el.style.setProperty("--tiltX", `0deg`);
    el.style.setProperty("--tiltY", `0deg`);
  };

  return (
    <section ref={sectionRef} className={styles.container} id="about">
      {/* Decorative rotating blob in the back */}
      <div className={`${styles.blob} ${styles.reveal}`} aria-hidden="true" />

      <div className={styles.columns}>
        {/* Left: text column */}
        <div className={`${styles.left} ${styles.reveal}`}>
          <h2 className={styles.title}>About Me</h2>
          <p className={styles.lede}>
           I love building things that make life easier and more meaningful. Whether it’s designing a smoother user experience, turning data into clear insights, or creating spaces for people to connect, I’m at my best when I’m blending creativity with problem-solving.
          </p>

          <ul className={styles.highlights}>
            <li><span>Data analyst</span> uncovering patterns, building dashboards, and driving insight.</li>
            <li><span>Research-minded collaborator</span> turning findings into practical, user-centered solutions.</li>
            <li><span>Connector</span> fostering teamwork, growth, and meaningful impact.</li>
          </ul>
        </div>

        {/* Right: animated “hobby” grid */}
        <div className={`${styles.right} ${styles.reveal}`}>
          <div className={styles.hobbyGrid}>
            {hobbies.map((h, i) => (
              <article
                key={i}
                className={`${styles.card} ${styles[`card${(i % 4) + 1}`]}`}
                onMouseMove={onCardMove}
                onMouseLeave={onCardLeave}
              >
                <div className={styles.cardImgWrap}>
                  <img src={h.img} alt={h.title} className={styles.cardImg} />
                </div>
                <h3 className={styles.cardTitle}>{h.title}</h3>
                <p className={styles.cardBlurb}>{h.blurb}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
