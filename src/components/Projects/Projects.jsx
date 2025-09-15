import React from "react";
import styles from "./Projects.module.css";
import { ProjectCard } from "./ProjectCard";
import projects from "../../data/projects.json"; // keep your existing data source

export const Projects = () => {
  return (
    <section className={styles.container} id="projects">
      <h2 className={styles.title}>Projects</h2>

      {/* Grid wrapper controls layout only */}
      <div className={styles.grid}>
        {projects.map((proj, idx) => (
          <div className={styles.item} key={idx}>
            <ProjectCard project={proj} />
          </div>
        ))}
      </div>
    </section>
  );
};
