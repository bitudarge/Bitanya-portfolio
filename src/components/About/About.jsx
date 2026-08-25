import React from "react";
import { motion } from "framer-motion";
import styles from "./About.module.css";

const technologies = [
  "Python",
  "SQL",
  "scikit-learn",
  "pandas",
  "Power BI",
  "Tableau",
  "Databricks",
  "React",
  "Git/GitHub",
  "Jupyter",
];

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export const About = () => {
  return (
    <section className={styles.container} id="about">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className={styles.title}>About Me</h2>

        <p className={styles.lede}>
          I&rsquo;m a Data Science and Neuroscience student at{" "}
          <span className="text-accent">Augustana College</span>, and I love
          building things that turn messy data into clear decisions.
        </p>

        <p className={styles.lede}>
          Right now I&rsquo;m a part-time student <span className="text-accent">Data Analyst</span>{" "}
          at <span className="text-accent">John Deere</span>, where I centralize product
          data and build dashboards that speed up real business calls. I also work as a{" "}
          <span className="text-accent">Data Science Intern</span>, where I built predictive
          models and data pipelines to improve student success and retention outcomes.
        </p>

        <p className={styles.lede}>
          Outside of work I founded and lead the{" "}
          <span className="text-accent">Data Analytics Club</span> (
          <span className="text-accent">100+</span> members), and mentored{" "}
          <span className="text-accent">90+</span> residents as an RA. I&rsquo;m drawn to
          the space where data, product, and people meet, and I like projects where I get
          to build something real and watch it get used.
        </p>
      </motion.div>

      <motion.div
        className={styles.techBlock}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h3 className={styles.techHeading}>
          Technologies I&rsquo;m <span className="text-accent">currently using</span>
        </h3>

        <motion.ul
          className={styles.techGrid}
          variants={listVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {technologies.map((tech) => (
            <motion.li key={tech} className={styles.techItem} variants={itemVariants}>
              <span className={styles.techMarker} aria-hidden="true" />
              {tech}
            </motion.li>
          ))}
        </motion.ul>
      </motion.div>
    </section>
  );
};
