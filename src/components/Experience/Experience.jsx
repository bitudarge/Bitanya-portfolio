import React from "react";
import { motion } from "framer-motion";
import styles from "./Experience.module.css";
import skills from "../../data/skills.json";
import history from "../../data/history.json";
import { getImageUrl } from "../../utils";

export const Experience = () => {
  return (
    <motion.section
      className={styles.container}
      id="experience"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h2 className={styles.title}>Experience</h2>
      <div className={styles.content}>
        {/* Skills Section */}
        <div className={styles.skills}>
          {skills.map((skill, id) => (
            <motion.div
              key={id}
              className={styles.skill}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <div className={styles.skillImageContainer}>
                <img src={getImageUrl(skill.imageSrc)} alt={skill.title} />
              </div>
              <p>{skill.title}</p>
            </motion.div>
          ))}
        </div>

        {/* Job History Section */}
        <motion.ul
          className={styles.history}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.3, // Creates a wave-like effect
              },
            },
          }}
        >
          {history.map((historyItem, id) => (
            <motion.li
              key={id}
              className={styles.historyItem}
              variants={{
                hidden: { opacity: 0, rotate: -10, x: -30 },
                visible: { opacity: 1, rotate: 0, x: 0 },
              }}
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={getImageUrl(historyItem.imageSrc)}
                alt={`${historyItem.organisation} Logo`}
              />
              <div className={styles.historyItemDetails}>
                <h3>{`${historyItem.role}, ${historyItem.organisation}`}</h3>
                <p>{`${historyItem.startDate} - ${historyItem.endDate}`}</p>
                <ul>
                  {historyItem.experiences.map((experience, id) => (
                    <li key={id}>{experience}</li>
                  ))}
                </ul>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </motion.section>
  );
};
