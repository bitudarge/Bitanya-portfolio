import React from "react";
import { Parallax } from "react-parallax";
import styles from "./Contact.module.css";
import { getImageUrl } from "../../utils";

export const Contact = () => {
  return (
    <Parallax
      bgImage={getImageUrl("contact/background.jpg")}
      bgImageAlt="Contact Background"
      strength={200}
    >
      <footer id="contact" className={styles.container}>
        <div className={styles.text}>
          <h2>Contact</h2>
          <p>Feel free to reach out!</p>
        </div>
        <ul className={styles.links}>
          <li className={styles.link}>
            <img src={getImageUrl("contact/emailIcon.png")} alt="Email icon" />
            <a href="mailto:bitanyagetahunn@gmail.com">bitanyagetahunn@gmail.com</a>
          </li>
          <li className={styles.link}>
            <img
              src={getImageUrl("contact/linkedinIcon.png")}
              alt="LinkedIn icon"
            />
            <a href="https://www.linkedin.com/in/bitanya-darge-8260b02b2/">linkedin.com/bitanyadarge</a>
          </li>
          <li className={styles.link}>
            <img src={getImageUrl("contact/githubIcon.png")} alt="Github icon" />
            <a href="https://www.github.com/bitudarge">github.com/bitudarge</a>
          </li>
        </ul>
      </footer>
    </Parallax>
  );
};
