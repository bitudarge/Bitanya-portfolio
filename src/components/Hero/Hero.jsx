import React from "react";

import styles from "./Hero.module.css";
import { getImageUrl } from "../../utils";

export const Hero = () => {
  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Hi, I'm Bitanya</h1>
        <p className={styles.description}>
        As a Data Science and Neuroscience major at Augustana College, I’m passionate about leveraging machine learning and technology to transform data into impactful, innovative solutions that drive meaningful change.
        </p>
        <a href="bitanyagetahunn@gmail.com" className={styles.contactBtn}>
          Contact Me
        </a>
      </div>
      <img
        src={getImageUrl("hero/heroImage.png")}
        alt="Hero image of me"
        className={styles.heroImg}
      />
      <div className={styles.topBlur} />
      <div className={styles.bottomBlur} />
    </section>
  );
};