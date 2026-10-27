import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.iconsRow}>
        <a
          href="https://linkedin.com/in/bitanya-darge-8260b02b2/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.icon}
          aria-label="LinkedIn"
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
      </div>
    </footer>
  );
}
