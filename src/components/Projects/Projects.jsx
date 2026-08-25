import React from "react";
import styles from "./Projects.module.css";
import { ProjectCard } from "./ProjectCard";
import projects from "../../data/projects.json";
import { useParallax } from "../../hooks/useParallax";

export const Projects = () => {
  const eyebrowRef = useParallax(-24);

  return (
    <section className={styles.container} id="projects">
      <span ref={eyebrowRef} className={styles.eyebrow}>04 — Projects</span>
      <h2 className={styles.title}>Projects</h2>

      <div className={styles.grid}>
        {projects.map((proj, idx) => (
          <div className={styles.item} key={idx}>
            <ProjectCard project={proj} index={idx % 3} />
          </div>
        ))}
      </div>
    </section>
  );
};
