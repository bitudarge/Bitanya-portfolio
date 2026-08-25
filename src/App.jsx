import React from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { MotionConfig } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./App.module.css";
import { Navbar } from "./components/Navbar/Navbar";
import { Hero } from "./components/Hero/Hero";
import { About } from "./components/About/About";
import { Experience } from "./components/Experience/Experience";
import { Projects } from "./components/Projects/Projects";
import { Involvement } from "./components/Involvement/Involvement";
import { Footer } from "./components/Footer/Footer";

gsap.registerPlugin(ScrollTrigger);
gsap.ticker.lagSmoothing(0);

function LenisScrollTriggerBridge() {
  useLenis(() => ScrollTrigger.update());
  return null;
}

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ReactLenis root options={{ autoRaf: true, lerp: 0.1, duration: 1.1, anchors: true }}>
        <LenisScrollTriggerBridge />
        <div className={styles.App}>
          <Navbar />
          <Hero />
          <About />
          <Experience />
          <Projects />
          <Involvement />
          <Footer />
        </div>
      </ReactLenis>
    </MotionConfig>
  );
}

export default App;
