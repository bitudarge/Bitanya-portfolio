import { motion, useReducedMotion } from "framer-motion";
import styles from "./Projects.module.css";
import { getImageUrl } from "../../utils";
import { useParallax } from "../../hooks/useParallax";

const textVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const riseVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export const FeaturedProject = ({ project, reversed }) => {
  const { title, imageSrc, imageFit, description, skills, demo, source, poster } = project;
  const prefersReducedMotion = useReducedMotion();
  const parallaxRef = useParallax(44);

  return (
    <article className={`${styles.featured} ${reversed ? styles.featuredReverse : ""}`}>
      <motion.div
        className={styles.featuredMedia}
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div ref={parallaxRef} className={styles.featuredImageWrap}>
          <img
            src={getImageUrl(imageSrc)}
            alt={`${title} logo`}
            className={imageFit === "contain" ? styles.featuredImageContain : styles.featuredImage}
          />
        </div>
      </motion.div>

      <motion.div
        className={styles.featuredText}
        variants={textVariants}
        initial={prefersReducedMotion ? false : "hidden"}
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
      >
        <motion.span variants={riseVariants} className={styles.featuredKicker}>Featured project</motion.span>
        <motion.h3 variants={riseVariants} className={styles.featuredTitle}>{title}</motion.h3>
        <motion.p variants={riseVariants} className={styles.featuredDescription}>{description}</motion.p>
        <motion.ul variants={riseVariants} className={styles.featuredSkills}>
          {skills.map((skill, id) => (
            <li key={id} className={styles.featuredSkill}>{skill}</li>
          ))}
        </motion.ul>
        <motion.div variants={riseVariants} className={styles.featuredLinks}>
          {source && (
            <a href={source} target="_blank" rel="noreferrer" className={styles.featuredLink}>
              Source
            </a>
          )}
          {demo && (
            <a href={demo} target="_blank" rel="noreferrer" className={styles.featuredLink}>
              Live
            </a>
          )}
          {poster && (
            <a href={getImageUrl(poster)} target="_blank" rel="noreferrer" className={styles.featuredLink}>
              Poster
            </a>
          )}
        </motion.div>
      </motion.div>
    </article>
  );
};
