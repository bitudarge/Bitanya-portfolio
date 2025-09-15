import React, { useEffect } from "react";
import styles from "./App.module.css";
import { Navbar } from "./components/Navbar/Navbar";
import { Hero } from "./components/Hero/Hero";
import { About } from "./components/About/About";
import { Experience } from "./components/Experience/Experience";
import { Projects } from "./components/Projects/Projects";
import { Contact } from "./components/Contact/Contact";
import { Involvement } from "./components/Involvement/Involvement";
import { Footer } from "./components/Footer/Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  // global spotlight effect tied to cursor
  useEffect(() => {
    const root = document.documentElement;
    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      root.style.setProperty("--mx", `${x}%`);
      root.style.setProperty("--my", `${y}%`);
    };
    const onLeave = () => {
      root.style.setProperty("--mx", `50%`);
      root.style.setProperty("--my", `50%`);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div className={`${styles.App} ${styles.rootBg}`}>
      <Router>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <Footer />
              </>
            }
          />
          <Route
            path="/about"
            element={
              <>
                <About />
                <Footer />
              </>
            }
          />
          <Route
            path="/experience"
            element={
              <>
                <Experience />
                <Footer />
              </>
            }
          />
          <Route
            path="/involvement"
            element={
              <>
                <Involvement />
                <Footer />
              </>
            }
          />
          <Route
            path="/projects"
            element={
              <>
                <Projects />
                <Footer />
              </>
            }
          />
          <Route
            path="/contact"
            element={
              <>
                <Contact />
                <Footer />
              </>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
