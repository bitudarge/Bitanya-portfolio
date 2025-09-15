import React, { useState } from "react";
import styles from "./Contact.module.css";

export function Contact() {
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = form.get("name");
    const email = form.get("email");
    const message = form.get("message");

    // Formspree support (optional): set VITE_FORMSPREE_ID in your .env
    const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID || "";
    if (FORMSPREE_ID) {
      try {
        const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: "POST",
          headers: { "Accept": "application/json" },
          body: form
        });
        if (res.ok) {
          setStatus("Thanks, your message has been sent.");
          e.currentTarget.reset();
        } else {
          setStatus("There was a problem sending your message.");
        }
      } catch {
        setStatus("Network error. Please try again.");
      }
    } else {
      // Mailto fallback
      const subject = encodeURIComponent(`Portfolio message from ${name}`);
      const body = encodeURIComponent(`${message}\n\nFrom: ${name} <${email}>`);
      window.location.href = `mailto:bitanyagetahunn@gmail.com?subject=${subject}&body=${body}`;
    }
  };

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>Contact</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label>
          <span>Name</span>
          <input name="name" type="text" required placeholder="Your name" />
        </label>
        <label>
          <span>Email</span>
          <input name="email" type="email" required placeholder="you@example.com" />
        </label>
        <label className={styles.full}>
          <span>Message</span>
          <textarea name="message" rows="6" required placeholder="Write your message..." />
        </label>
        <div className={styles.actions}>
          <button type="submit" className={styles.submit}>Send</button>
        </div>
        {status && <p className={styles.status}>{status}</p>}
      </form>
    </section>
  );
}
