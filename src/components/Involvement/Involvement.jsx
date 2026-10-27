import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import styles from "./Involvement.module.css";
import data from "../../data/involvement.json";
import extras from "../../data/extras.json";
import { getImageUrl } from "../../utils";
import { useMediaQuery } from "../../hooks/useMediaQuery";

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

function Initials({ item }) {
  const initials = (item.org || item.title || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() || "")
    .join("");
  return <span className={styles.initials}>{initials || "•"}</span>;
}

function InvolvementCard({ item, mobilePhotos }) {
  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <span className={styles.logoWrap} aria-hidden={item.logo ? "false" : "true"}>
          {item.logo ? <img src={getImageUrl(item.logo)} alt="" /> : <Initials item={item} />}
        </span>

        <div className={styles.headText}>
          <h3 className={styles.cardTitle}>{item.title}</h3>
          <div className={styles.metaLine}>
            {item.role && <span className={styles.role}>{item.role}</span>}
            {item.role && item.org && <span className={styles.sep}>·</span>}
            {item.org && <span className={styles.org}>{item.org}</span>}
          </div>
        </div>

        {item.date && <time className={styles.when}>{item.date}</time>}
      </header>

      {item.description && <p className={styles.blurb}>{item.description}</p>}

      {mobilePhotos && Array.isArray(item.photos) && item.photos.length > 0 && (
        <div className={styles.mobilePhotos}>
          {item.photos.map((p, i) => (
            <figure key={i} className={styles.mobilePhoto}>
              <img src={getImageUrl(p.src)} alt={p.caption || ""} />
              {p.caption && <figcaption>{p.caption}</figcaption>}
            </figure>
          ))}
        </div>
      )}
    </article>
  );
}

/** Sticky panel showing the photo(s) of whichever involvement card is
 *  currently in view. Only present at desktop widths - on mobile each
 *  card carries its own photos inline instead (see InvolvementCard). */
function PhotoPanel({ item }) {
  if (!item || !Array.isArray(item.photos) || item.photos.length === 0) return null;

  return (
    <div className={styles.photoPanel}>
      <motion.div
        key={item.title}
        className={styles.photoPanelInner}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <span className={styles.photoPanelLabel}>{item.title}</span>
        <div className={styles.photoStack}>
          {item.photos.map((p, i) => (
            <figure key={i} className={styles.photoCard}>
              <img src={getImageUrl(p.src)} alt={p.caption || ""} />
              {p.caption && <figcaption>{p.caption}</figcaption>}
            </figure>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export const Involvement = () => {
  const prefersReducedMotion = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 900px)");

  const itemsWithPhotos = useMemo(() => data.filter((d) => d.photos?.length), []);
  const [activeItem, setActiveItem] = useState(itemsWithPhotos[0] ?? null);
  const rowRefs = useRef([]);
  rowRefs.current = [];

  useEffect(() => {
    if (!isDesktop) return;
    const elements = rowRefs.current.filter(Boolean);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const idx = Number(entry.target.dataset.index);
          const item = data[idx];
          if (item?.photos?.length) setActiveItem(item);
        });
      },
      { rootMargin: "-35% 0px -50% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [isDesktop]);

  return (
    <section className={styles.container} id="involvement" aria-labelledby="inv-title">
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
      >
        <h2 id="inv-title" className={styles.title}>Involvement</h2>
      </motion.div>

      <div className={styles.layout}>
        <motion.ul
          className={styles.list}
          role="list"
          variants={listVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          {data.map((item, idx) => (
            <motion.li
              key={item.title ?? idx}
              className={styles.row}
              variants={itemVariants}
              data-index={idx}
              ref={(el) => (rowRefs.current[idx] = el)}
            >
              <InvolvementCard item={item} mobilePhotos={!isDesktop} />
            </motion.li>
          ))}
        </motion.ul>

        {isDesktop && <PhotoPanel item={activeItem} />}
      </div>

      {extras.length > 0 && (
        <div className={styles.extras}>
          <h3 className={styles.extrasTitle}>Also around campus</h3>
          <ul className={styles.extrasList} role="list">
            {extras.map((ex, i) => (
              <li key={i} className={styles.extraItem}>
                {ex.photo && (
                  <img
                    className={styles.extraPhoto}
                    src={getImageUrl(ex.photo)}
                    alt=""
                  />
                )}
                <div>
                  <p className={styles.extraName}>{ex.title}</p>
                  {ex.date && <p className={styles.extraDate}>{ex.date}</p>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};
