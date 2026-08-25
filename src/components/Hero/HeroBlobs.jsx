import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import styles from "./Hero.module.css";

const BLOBS = [
  { drift: "blobDriftA", shape: "blobShapeA", factor: 26 },
  { drift: "blobDriftB", shape: "blobShapeB", factor: -18 },
  { drift: "blobDriftC", shape: "blobShapeC", factor: 16 },
];

function Blob({ drift, shape, factor, mouseX, mouseY, isStatic }) {
  const springX = useSpring(mouseX, { stiffness: 40, damping: 22, mass: 0.8 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 22, mass: 0.8 });
  const x = useTransform(springX, (v) => v * factor);
  const y = useTransform(springY, (v) => v * factor);

  return (
    <div className={`${styles.blobDrift} ${styles[drift]}`}>
      <motion.div
        className={`${styles.blobShape} ${styles[shape]}`}
        style={isStatic ? undefined : { x, y }}
      />
    </div>
  );
}

/** Small glow that directly tracks the raw cursor position, layered over the ambient blobs.
 *  Only mounted after the first real mousemove, so its spring starts at the actual
 *  cursor position instead of animating in from an off-screen placeholder. */
function CursorBlob({ cursorX, cursorY }) {
  const springX = useSpring(cursorX, { stiffness: 90, damping: 20, mass: 0.4 });
  const springY = useSpring(cursorY, { stiffness: 90, damping: 20, mass: 0.4 });

  return (
    <motion.div
      className={styles.cursorBlob}
      style={{ left: 0, top: 0, x: springX, y: springY }}
    />
  );
}

/** Fixed, full-page ambient blob background. Tracks the cursor across the whole viewport. */
export function HeroBlobs() {
  const prefersReducedMotion = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const [hasMoved, setHasMoved] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const onMove = (e) => {
      mouseX.set(e.clientX / window.innerWidth - 0.5);
      mouseY.set(e.clientY / window.innerHeight - 0.5);
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setHasMoved(true);
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY, cursorX, cursorY, prefersReducedMotion]);

  return (
    <div className={styles.blobField} aria-hidden="true">
      {BLOBS.map((b) => (
        <Blob key={b.shape} {...b} mouseX={mouseX} mouseY={mouseY} isStatic={prefersReducedMotion} />
      ))}
      {!prefersReducedMotion && hasMoved && <CursorBlob cursorX={cursorX} cursorY={cursorY} />}
    </div>
  );
}
