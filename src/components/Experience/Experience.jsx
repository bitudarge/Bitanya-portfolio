import styles from "./Experience.module.css";
import history from "../../data/history.json"; // ← reads your data

/**
 * Expected history.json shape (array):
 * [
 *   {
 *     "id": "meta-2024",
 *     "role": "Product Design Intern",
 *     "org": "Meta",
 *     "location": "Menlo Park, CA",
 *     "start": "2024-05",
 *     "end": "2024-08",
 *     "summary": "Worked on XYZ...",
 *     "bullets": ["Did A", "Shipped B", "Improved C"],
 *     "link": "https://example.com" // optional
 *   },
 *   ...
 * ]
 */

function formatRange(start, end) {
  const fmt = (s) => {
    if (!s) return "";
    const [y, m] = s.split("-");
    const date = new Date(Number(y), Number(m ?? 1) - 1, 1);
    return date.toLocaleString(undefined, { month: "short", year: "numeric" });
  };
  return `${fmt(start)} – ${end && end.toLowerCase() !== "present" ? fmt(end) : "Present"}`;
}

export const Experience = () => {

  return (
    <section className={styles.container} id="experience">
      <h2 className={styles.title}>Experience</h2>

      <div className={styles.timeline}>
        {/* vertical rail */}
        <div className={styles.rail} aria-hidden="true" />

        <ul className={styles.list}>
          {history.map((item, idx) => (
            <li key={item.id ?? idx} className={styles.item}>
              <div className={styles.dotWrap}>
                <span className={styles.dot} />
              </div>

              <article className={styles.card}>
                <header className={styles.header}>
                  <div className={styles.roleOrgLine}>
                    <h3 className={styles.role}>{item.role}</h3>
                    <span className={styles.org}>{item.org}</span>
                  </div>
                  <div className={styles.meta}>
                    <span className={styles.range}>{formatRange(item.start, item.end)}</span>
                    {item.location && <span className={styles.location}>{item.location}</span>}
                  </div>
                </header>

                {item.summary && <p className={styles.summary}>{item.summary}</p>}

                {Array.isArray(item.bullets) && item.bullets.length > 0 && (
                  <ul className={styles.bullets}>
                    {item.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                )}

                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.link}
                    aria-label={`Open details for ${item.role} at ${item.org}`}
                  >
                    Learn more →
                  </a>
                )}
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
