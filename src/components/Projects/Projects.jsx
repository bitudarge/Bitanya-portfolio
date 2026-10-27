import styles from "./Projects.module.css";
import { ProjectCard } from "./ProjectCard";
import { FeaturedProject } from "./FeaturedProject";
import projects from "../../data/projects.json";

export const Projects = () => {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <section className={styles.container} id="projects">
      <h2 className={styles.title}>Projects</h2>

      <div className={styles.featuredList}>
        {featured.map((proj, idx) => (
          <FeaturedProject key={proj.title} project={proj} reversed={idx % 2 === 1} />
        ))}
      </div>

      <div className={styles.grid}>
        {rest.map((proj, idx) => (
          <div className={styles.item} key={proj.title}>
            <ProjectCard project={proj} index={idx % 3} />
          </div>
        ))}
      </div>
    </section>
  );
};
