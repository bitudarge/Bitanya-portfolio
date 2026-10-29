import { motion, useReducedMotion } from "framer-motion";
import styles from "./Footer.module.css";

const LINKS = [
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/bitanya-darge-8260b02b2/",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M7.5 10v6.5M7.5 7.6v.01M11.5 16.5V10M11.5 12.8c0-1.5 1-2.8 2.5-2.8s2.5 1 2.5 2.8v3.7"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "https://github.com/bitudarge",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 2.5c-5.25 0-9.5 4.25-9.5 9.5 0 4.2 2.73 7.76 6.5 9.02.48.09.65-.21.65-.46 0-.23-.01-1-.01-1.82-2.64.57-3.2-1.14-3.2-1.14-.43-1.1-1.06-1.39-1.06-1.39-.87-.59.07-.58.07-.58.96.07 1.47.99 1.47.99.86 1.47 2.25 1.05 2.8.8.09-.62.33-1.05.6-1.29-2.1-.24-4.3-1.05-4.3-4.67 0-1.03.37-1.87.98-2.53-.1-.24-.42-1.22.1-2.55 0 0 .8-.26 2.63.98a9.1 9.1 0 0 1 4.8 0c1.83-1.24 2.63-.98 2.63-.98.52 1.33.2 2.31.1 2.55.61.66.98 1.5.98 2.53 0 3.63-2.21 4.43-4.32 4.66.34.3.64.87.64 1.76 0 1.27-.01 2.29-.01 2.6 0 .25.17.56.65.46 3.76-1.27 6.49-4.82 6.49-9.02 0-5.25-4.25-9.5-9.5-9.5Z"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:bitanyagetahunn@gmail.com",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M4 7l7.25 5.5a1.2 1.2 0 0 0 1.5 0L20 7"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export function Footer() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.footer
      id="contact"
      className={styles.footer}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <h2 className={styles.heading}>
        Let&rsquo;s <span className="text-accent">connect</span>
      </h2>
      <p className={styles.lede}>
        Open to internships, data roles, and interesting projects. My inbox is always open.
      </p>
      <a className={styles.cta} href="mailto:bitanyagetahunn@gmail.com">
        Say hello
      </a>
      <div className={styles.iconsRow}>
        {LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.href.startsWith("mailto:") ? undefined : "_blank"}
            rel={link.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
            className={styles.icon}
            aria-label={link.label}
          >
            {link.icon}
          </a>
        ))}
      </div>
      <p className={styles.copyright}>&copy; {new Date().getFullYear()} Bitanya</p>
    </motion.footer>
  );
}
