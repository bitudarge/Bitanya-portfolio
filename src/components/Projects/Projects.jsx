import React from "react";
import { motion } from "framer-motion";
import styles from "./Projects.module.css";

import projects from "../../data/projects.json";
import { ProjectCard } from "./ProjectCard";

export const Projects = () => {
  return (
    <motion.section
      className={styles.container}
      id="projects"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className={styles.title}>Projects</h2>
      <motion.div
        className={styles.projects}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.2,
            },
          },
        }}
      >
        {projects.map((project, id) => (
          <motion.div
            key={id}
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <ProjectCard project={project} />
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};
