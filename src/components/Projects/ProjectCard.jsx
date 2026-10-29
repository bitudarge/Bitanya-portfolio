import { motion, useReducedMotion } from "framer-motion";
import styles from "./ProjectCard.module.css";
import { getImageUrl } from "../../utils";

export const ProjectCard = ({
  project: { title, imageSrc, imageFit, description, skills, demo, source, poster },
  index = 0,
}) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={styles.container}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 36 }}
      // Entrance delay lives on the entrance only - before, it also delayed
      // every hover lift, which is what made the grid feel laggy/choppy.
      whileInView={{
        opacity: 1,
        y: 0,
        transition: {
          duration: prefersReducedMotion ? 0 : 0.8,
          delay: prefersReducedMotion ? 0 : index * 0.1,
          ease: [0.22, 1, 0.36, 1],
        },
      }}
      viewport={{ once: true, amount: 0.15 }}
      whileHover={prefersReducedMotion ? undefined : { y: -6, transition: { duration: 0.25, ease: "easeOut" } }}
    >
      {imageSrc ? (
        <div className={styles.imageWrap}>
          <img
            src={getImageUrl(imageSrc)}
            alt={`${title} logo`}
            className={imageFit === "contain" ? styles.imageContain : styles.image}
          />
        </div>
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
        {source && (
          <a href={source} target="_blank" rel="noreferrer" className={styles.link}>
            Source
          </a>
        )}
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
