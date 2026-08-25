import React, { useEffect } from "react";
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

/** Fixed, full-page ambient blob background. Tracks the cursor across the whole viewport. */
export function HeroBlobs() {
  const prefersReducedMotion = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const onMove = (e) => {
      mouseX.set(e.clientX / window.innerWidth - 0.5);
      mouseY.set(e.clientY / window.innerHeight - 0.5);
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY, prefersReducedMotion]);

  return (
    <div className={styles.blobField} aria-hidden="true">
      {BLOBS.map((b) => (
        <Blob key={b.shape} {...b} mouseX={mouseX} mouseY={mouseY} isStatic={prefersReducedMotion} />
      ))}
    </div>
  );
}
