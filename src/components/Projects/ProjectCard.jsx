import { motion, useReducedMotion } from "framer-motion";
import styles from "./ProjectCard.module.css";
import { getImageUrl } from "../../utils";

const cardVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const riseVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export const ProjectCard = ({
  project: { title, imageSrc, imageFit, description, skills, demo, source, poster },
  index = 0,
}) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={styles.container}
      variants={cardVariants}
      initial={prefersReducedMotion ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: prefersReducedMotion ? 0 : index * 0.05 }}
      whileHover={prefersReducedMotion ? undefined : { y: -6 }}
    >
      <motion.div variants={riseVariants} className={styles.imageWrap}>
        {imageSrc ? (
          <img
            src={getImageUrl(imageSrc)}
            alt={`${title} logo`}
            className={imageFit === "contain" ? styles.imageContain : styles.image}
          />
        ) : (
          <div className={styles.imagePlaceholder} aria-hidden="true">
            <span>{title}</span>
          </div>
        )}
      </motion.div>

      <motion.h3 variants={riseVariants} className={styles.title}>{title}</motion.h3>
      <motion.p variants={riseVariants} className={styles.description}>{description}</motion.p>

      <motion.ul variants={riseVariants} className={styles.skills}>
        {skills.map((skill, id) => (
          <li key={id} className={styles.skill}>
            {skill}
          </li>
        ))}
      </motion.ul>

      <motion.div variants={riseVariants} className={styles.links}>
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
      </motion.div>
    </motion.div>
  );
};
