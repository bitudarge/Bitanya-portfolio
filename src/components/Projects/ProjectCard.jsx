import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import styles from "./ProjectCard.module.css";
import { getImageUrl } from "../../utils";

export const ProjectCard = ({
  project: { title, imageSrc, description, skills, demo, source, poster },
  index = 0,
}) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={styles.container}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.5, delay: prefersReducedMotion ? 0 : index * 0.08 }}
      whileHover={prefersReducedMotion ? undefined : { y: -6 }}
    >
      {imageSrc ? (
        <img
          src={getImageUrl(imageSrc)}
          alt={`Screenshot of ${title}`}
          className={styles.image}
        />
      ) : (
        <div className={styles.imagePlaceholder} aria-hidden="true">
          <span>{title}</span>
        </div>
      )}
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      <ul className={styles.skills}>
        {skills.map((skill, id) => (
          <li key={id} className={styles.skill}>
            {skill}
          </li>
        ))}
      </ul>
      <div className={styles.links}>
        <a href={source} target="_blank" rel="noreferrer" className={styles.link}>
          Source
        </a>
        {demo && (
          <a href={demo} target="_blank" rel="noreferrer" className={styles.link}>
            Live
          </a>
        )}
        {poster && (
          <a href={getImageUrl(poster)} target="_blank" rel="noreferrer" className={styles.link}>
            Poster
          </a>
        )}
      </div>
    </motion.div>
  );
};
