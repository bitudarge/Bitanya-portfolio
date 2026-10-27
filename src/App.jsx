import { useEffect, useRef } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { MotionConfig } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./App.module.css";
import { Navbar } from "./components/Navbar/Navbar";
import { Hero } from "./components/Hero/Hero";
import { HeroBlobs } from "./components/Hero/HeroBlobs";
import { About } from "./components/About/About";
import { Experience } from "./components/Experience/Experience";
import { Projects } from "./components/Projects/Projects";
import { Involvement } from "./components/Involvement/Involvement";
import { Footer } from "./components/Footer/Footer";

gsap.registerPlugin(ScrollTrigger);
gsap.ticker.lagSmoothing(0);
// The Involvement section now pins on phones too; without this, a mobile
// browser's address bar hiding/showing mid-scroll changes the viewport
// height, which would otherwise force a pin recalculation and a visible
// jump right in the middle of the horizontal scroll.
ScrollTrigger.config({ ignoreMobileResize: true });

function LenisScrollTriggerBridge() {
  useLenis(() => ScrollTrigger.update());
  return null;
}

function App() {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Lenis's own autoRaf runs on a separate, independently-timed rAF loop
    // from GSAP's ticker. That's fine with no pins, but once ScrollTrigger
    // is pinning sections (Hero, Involvement) the two loops drift out of
    // sync - GSAP's pin math and Lenis's eased scroll position each think
    // they're authoritative, and the result is scroll position jumping far
    // past what the user actually scrolled. Driving Lenis from GSAP's own
    // ticker (autoRaf: false below) keeps both on one clock.
    function update(time) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }
    gsap.ticker.add(update);
    return () => gsap.ticker.remove(update);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      <ReactLenis
        root
        ref={lenisRef}
        options={{ autoRaf: false, lerp: 0.1, duration: 1.1, anchors: true }}
      >
        <LenisScrollTriggerBridge />
        <HeroBlobs />
        <div className={styles.App}>
          <Navbar />
          <Hero />
          <About />
          <Experience />
          <Projects />
          <div className={styles.sectionGapBeforeInvolvement} aria-hidden="true" />
          <Involvement />
          <div className={styles.sectionGapAfterInvolvement} aria-hidden="true" />
          <Footer />
        </div>
      </ReactLenis>
    </MotionConfig>
  );
}

export default App;
