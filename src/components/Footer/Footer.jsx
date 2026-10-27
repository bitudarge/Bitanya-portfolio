import styles from "./Footer.module.css";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div>
          <a href="#home" className={styles.brand}>Bitanya Darge</a>
          <p className={styles.tagline}>Data Science &amp; Neuroscience · Augustana College</p>
        </div>

        <a href="#home" className={styles.backToTop}>
          Back to top
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
              d="M7 11V3M3 6.5 7 3l4 3.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>

      <div className={styles.divider} />

      <div className={styles.bottom}>
        <p className={styles.copyright}>&copy; {year} Bitanya Darge. Built with React.</p>

        <div className={styles.iconsRow}>
          <a
            href="mailto:bitanyagetahunn@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.icon}
            aria-label="Email"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M3 5.5A1.5 1.5 0 0 1 4.5 4h15A1.5 1.5 0 0 1 21 5.5v13a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5v-13Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="m4 6 8 6.5L20 6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <a
            href="https://linkedin.com/in/bitanya-darge-8260b02b2/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.icon}
            aria-label="LinkedIn"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M7.5 10v6.5M7.5 7.6v.01M11.5 16.5V10M11.5 12.8c0-1.5 1-2.8 2.5-2.8s2.5 1 2.5 2.8v3.7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <a
            href="https://github.com/bitudarge"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.icon}
            aria-label="GitHub"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.46-1.15-1.11-1.46-1.11-1.46-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
