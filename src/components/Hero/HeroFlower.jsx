import { forwardRef } from "react";
import styles from "./Hero.module.css";

// Six lily petals, evenly spread. Each petal is its own <g>, exposed via
// petalRefs, so Hero.jsx's scroll timeline can stagger them individually
// when they open - a real unfurl rather than one shape rotating as a block.
const PETAL_ANGLES = [0, 60, 120, 180, 240, 300];
const STAMEN_ANGLES = [15, 85, 155, 225, 295];

/** Stylized vector lily - NOT a photoreal or 3D asset. A real botanical
 *  time-lapse (as requested) needs either a rigged 3D model (glTF) or a
 *  produced photo/video frame sequence; neither exists for this project,
 *  so per the brief's own fallback instruction this is a clearly-labeled
 *  illustrated prototype built from SVG paths + GSAP, not a crossfade
 *  between static photos and not an unrelated stock flower image. */
export const HeroFlower = forwardRef(function HeroFlower({ petalRefs }, groupRef) {
  return (
    <div className={styles.flower} aria-hidden="true">
      <svg viewBox="0 0 320 320" className={styles.flowerSvg}>
        <defs>
          <radialGradient id="petalGradient" cx="50%" cy="15%" r="95%">
            <stop offset="0%" stopColor="#fff0f5" />
            <stop offset="45%" stopColor="var(--color-accent-soft)" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.75" />
          </radialGradient>
          <linearGradient id="stamenGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c2185b" />
            <stop offset="100%" stopColor="#f48fb1" />
          </linearGradient>
        </defs>

        <g ref={groupRef} className={styles.flowerSway} style={{ transformBox: "view-box", transformOrigin: "160px 160px" }}>
          {PETAL_ANGLES.map((angle, i) => (
            <g
              key={angle}
              ref={(el) => petalRefs && (petalRefs.current[i] = el)}
              transform={`rotate(${angle} 160 160)`}
            >
              <path
                d="M160,160 C146,124 142,78 160,34 C178,78 174,124 160,160 Z"
                fill="url(#petalGradient)"
                stroke="#fff"
                strokeOpacity="0.5"
                strokeWidth="1"
              />
              <path
                d="M160,150 C154,124 153,92 160,60"
                fill="none"
                stroke="#c2185b"
                strokeOpacity="0.35"
                strokeWidth="1.2"
              />
            </g>
          ))}

          <g className={styles.stamens}>
            {STAMEN_ANGLES.map((angle) => (
              <g key={angle} transform={`rotate(${angle} 160 160)`}>
                <line x1="160" y1="160" x2="160" y2="110" stroke="url(#stamenGradient)" strokeWidth="2" strokeLinecap="round" />
                <ellipse cx="160" cy="108" rx="5" ry="8" fill="#ad1457" transform="rotate(20 160 108)" />
              </g>
            ))}
          </g>

          <circle cx="160" cy="160" r="10" fill="#fff6f9" opacity="0.9" />
        </g>
      </svg>
    </div>
  );
});
