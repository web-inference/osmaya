"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

let lenisRef: Lenis | null = null;
/** Scroll helper that uses Lenis when it is running, native scroll otherwise. */
export function scrollToTarget(target: string | number) {
  if (lenisRef) {
    lenisRef.scrollTo(target, { offset: 0, duration: 1.4 });
    return;
  }
  if (typeof target === "number") window.scrollTo({ top: target });
  else document.querySelector(target)?.scrollIntoView();
}

export function SmoothScroll() {
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh);

    if (prefersReducedMotion()) return () => window.removeEventListener("load", refresh);

    const lenis = new Lenis({ lerp: 0.1, anchors: true });
    lenisRef = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    // hold scrolling while the first-visit preloader is on screen
    const html = document.documentElement;
    if (html.classList.contains("is-loading")) {
      lenis.stop();
      window.addEventListener("osmaya:loaded", () => lenis.start(), { once: true });
    }
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      window.removeEventListener("load", refresh);
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef = null;
    };
  }, []);

  return null;
}
