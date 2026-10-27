import React from "react";
import styles from "./Hero.module.css";

const PETAL_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

/** Decorative flower behind the hero text. Idle sway is pure CSS (cheap,
 *  always running); the bloom-open (petals rotate outward + scale up) is
 *  driven by Hero.jsx's scroll timeline via the petalsRef it's given. */
export const HeroFlower = React.forwardRef(function HeroFlower(_, petalsRef) {
  return (
    <div className={styles.flower} aria-hidden="true">
      <svg viewBox="0 0 300 300" className={styles.flowerSvg}>
        <g ref={petalsRef} className={styles.flowerPetals} style={{ transformOrigin: "150px 150px" }}>
          <g className={styles.flowerSway} style={{ transformOrigin: "150px 150px" }}>
            {PETAL_ANGLES.map((angle) => (
              <ellipse
                key={angle}
                cx="150"
                cy="86"
                rx="26"
                ry="58"
                fill="url(#petalGradient)"
                transform={`rotate(${angle} 150 150)`}
              />
            ))}
          </g>
        </g>
        <circle cx="150" cy="150" r="22" fill="var(--color-accent)" opacity="0.85" />
        {Array.from({ length: 10 }).map((_, i) => {
          const a = (i / 10) * Math.PI * 2;
          return (
            <circle
              key={i}
              cx={150 + Math.cos(a) * 12}
              cy={150 + Math.sin(a) * 12}
              r="2.2"
              fill="#fff"
              opacity="0.8"
            />
          );
        })}
        <defs>
          <radialGradient id="petalGradient" cx="50%" cy="30%" r="80%">
            <stop offset="0%" stopColor="var(--color-accent-soft)" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.55" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
});
