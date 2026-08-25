import React from "react";
import { motion } from "framer-motion";
import styles from "./About.module.css";
import { useParallax } from "../../hooks/useParallax";

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export const About = () => {
  const eyebrowRef = useParallax(-24);

  return (
    <section className={styles.container} id="about">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span ref={eyebrowRef} className={styles.eyebrow}>02 — About</span>
        <h2 className={styles.title}>About Me</h2>

        <p className={styles.lede}>
          I turn ambiguity into decisions. Give me a stakeholder question with no
          clean answer and I&rsquo;ll build the dashboard that settles it; give me a
          flow that&rsquo;s losing users and I&rsquo;ll find the friction and design
          it out. I move fluidly between analysis and design — quantifying what&rsquo;s
          actually happening, then shaping what should happen next.
        </p>
      </motion.div>

      <motion.ul
        className={styles.highlights}
        variants={listVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        <motion.li variants={itemVariants}>
          <span>Data analyst</span> — surfaces the pattern in the noise and builds
          the dashboard that ends the debate.
        </motion.li>
        <motion.li variants={itemVariants}>
          <span>Research-minded collaborator</span> — turns a messy dataset into a
          decision a team can act on.
        </motion.li>
        <motion.li variants={itemVariants}>
          <span>Connector</span> — gets the right people in the room, and the room
          actually working.
        </motion.li>
      </motion.ul>
    </section>
  );
};
