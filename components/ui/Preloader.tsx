"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const PETALS = [
  "M20 20C15.6 15.6 15.6 9 20 5.5 24.4 9 24.4 15.6 20 20Z",
  "M20 20C24.4 15.6 31 15.6 34.5 20 31 24.4 24.4 24.4 20 20Z",
  "M20 20C24.4 24.4 24.4 31 20 34.5 15.6 31 15.6 24.4 20 20Z",
  "M20 20C15.6 24.4 9 24.4 5.5 20 9 15.6 15.6 15.6 20 20Z",
];
const MIN_MS = 1400;
const MAX_MS = 5000;

/**
 * First-visit intro: the OSMAYA mark fills with amber "liquid" as the hero images load,
 * then the screen parts along a dusk horizon to reveal the hero.
 * Only shown when <html> carries `is-loading` (set by the inline script in layout.tsx).
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const html = document.documentElement;
      if (!html.classList.contains("is-loading")) return;
      const q = gsap.utils.selector(root);
      const start = performance.now();

      // ---- what "loaded" means: hero images + fonts ----
      const imgs = Array.from(document.querySelectorAll<HTMLImageElement>("#top img"));
      let done = 0;
      const total = imgs.length + 1;
      const bump = () => { done = Math.min(total, done + 1); };
      imgs.forEach((img) => {
        if (img.complete) bump();
        else { img.addEventListener("load", bump, { once: true }); img.addEventListener("error", bump, { once: true }); }
      });
      if (document.fonts) document.fonts.ready.then(bump);
      else bump();

      // ---- intro ----
      gsap.set(q("[data-stroke]"), { strokeDasharray: 60, strokeDashoffset: 60 });
      const intro = gsap.timeline({ defaults: { ease: "expo.out" } });
      intro
        .from(q("[data-ring]"), { scale: 0.6, autoAlpha: 0, duration: 0.8, transformOrigin: "50% 50%" }, 0)
        .to(q("[data-stroke]"), { strokeDashoffset: 0, duration: 0.9, stagger: 0.08, ease: "power2.inOut" }, 0.05)
        .from(q("[data-char]"), { yPercent: 110, duration: 0.8, stagger: 0.04 }, 0.2)
        .from(q("[data-fade]"), { autoAlpha: 0, y: 10, duration: 0.6, stagger: 0.08 }, 0.45);

      // ---- progress loop ----
      const fill = q("[data-fill]")[0];
      const count = q("[data-count]")[0];
      const line = q("[data-line]")[0];
      const state = { p: 0 };
      let exiting = false;

      const tick = () => {
        const t = performance.now() - start;
        const real = t > MAX_MS ? 1 : done / total;
        const target = Math.min(real, t / MIN_MS); // never faster than the minimum, never ahead of reality
        state.p += (target - state.p) * 0.14;
        if (target >= 1 && 1 - state.p < 0.012) state.p = 1;
        const pct = Math.round(state.p * 100);
        count.textContent = String(pct).padStart(3, "0");
        // petals span y 5.5–34.5 in the 40-unit box, so map progress onto that band
        gsap.set(fill, { attr: { y: 34.5 - 29 * state.p } });
        gsap.set(line, { scaleX: state.p });
        if (state.p === 1 && !exiting) { exiting = true; exit(); }
      };
      gsap.ticker.add(tick);

      // ---- exit: content lifts away, the screen parts at the horizon ----
      const exit = () => {
        gsap.ticker.remove(tick);
        const tl = gsap.timeline({
          onComplete: () => {
            html.classList.remove("is-loading");
            try { localStorage.setItem("osmaya-visited", "1"); } catch { /* storage blocked: intro shows again next time */ }
          },
        });
        tl.to(q("[data-mark]"), { scale: 1.12, duration: 0.4, ease: "power2.out", transformOrigin: "50% 50%" }, 0)
          .to(q("[data-glow]"), { autoAlpha: 1, scale: 1.4, duration: 0.45, ease: "power2.out" }, 0)
          .to(q("[data-content]"), { autoAlpha: 0, y: -30, duration: 0.4, ease: "power2.in" }, 0.2)
          .to(q("[data-corner]"), { autoAlpha: 0, duration: 0.3 }, 0.2)
          .to(line, { scaleY: 3, backgroundColor: "#F7C978", duration: 0.2, ease: "power2.out" }, 0.4)
          .add(() => { window.dispatchEvent(new Event("osmaya:loaded")); }, 0.6)
          .to(q("[data-half='top']"), { yPercent: -100, duration: 0.95, ease: "power4.inOut" }, 0.5)
          .to(q("[data-half='bottom']"), { yPercent: 100, duration: 0.95, ease: "power4.inOut" }, 0.5)
          .to(line, { autoAlpha: 0, duration: 0.3 }, 0.7);
      };

      return () => gsap.ticker.remove(tick);
    },
    { scope: root },
  );

  return (
    <div ref={root} className="preloader fixed inset-0 z-[200]" aria-hidden="true">
      {/* the two halves that part along the horizon */}
      <div data-half="top" className="absolute inset-x-0 top-0 h-1/2 bg-night">
        <div className="absolute inset-x-0 bottom-0 h-[60%] bg-[radial-gradient(60%_100%_at_50%_100%,rgba(232,161,58,.16),transparent_70%)]" />
      </div>
      <div data-half="bottom" className="absolute inset-x-0 bottom-0 h-1/2 bg-night">
        <div className="absolute inset-x-0 top-0 h-[60%] bg-[radial-gradient(60%_100%_at_50%_0%,rgba(232,161,58,.10),transparent_70%)]" />
      </div>

      {/* horizon line that fills with progress */}
      <div data-line className="absolute top-1/2 left-[8%] h-px w-[84%] origin-left scale-x-0 bg-amber" />

      <div data-content className="absolute inset-x-0 bottom-1/2 flex flex-col items-center pb-10 text-ivory">
        <div className="relative">
          <div data-glow className="pointer-events-none absolute inset-[-60%] rounded-full bg-[radial-gradient(circle,rgba(247,201,120,.35),transparent_65%)] opacity-0" />
          <svg data-mark viewBox="0 0 40 40" width="112" height="112" className="relative overflow-visible">
            <defs>
              <clipPath id="preloader-petals">
                {PETALS.map((d) => <path key={d} d={d} />)}
              </clipPath>
              <linearGradient id="preloader-liquid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#F7C978" />
                <stop offset="1" stopColor="#E8A13A" />
              </linearGradient>
            </defs>
            <circle data-ring cx="20" cy="20" r="18.5" fill="none" stroke="rgba(247,240,230,.35)" strokeWidth="0.5" />
            <rect data-fill x="0" y="40" width="40" height="40" fill="url(#preloader-liquid)" clipPath="url(#preloader-petals)" />
            <g fill="none" stroke="#F7C978" strokeWidth="0.7" strokeLinejoin="round">
              {PETALS.map((d) => <path key={d} data-stroke d={d} pathLength={60} />)}
            </g>
          </svg>
        </div>
        <p className="mt-9 flex overflow-hidden font-display text-[clamp(34px,4.6vw,56px)] leading-none font-medium tracking-[0.24em]">
          {"OSMAYA".split("").map((c, i) => <span key={i} data-char className="inline-block">{c}</span>)}
        </p>
        <p data-fade className="mt-4 font-display text-[clamp(17px,1.6vw,22px)] text-ivory/70 italic">Wear the hour before nightfall.</p>
      </div>

      <div data-corner className="absolute bottom-[max(28px,env(safe-area-inset-bottom))] left-[var(--gutter)] flex items-center gap-3">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber" />
        <span className="label text-muted-d">Bottling dusk</span>
      </div>
      <p data-corner className="mono absolute right-[var(--gutter)] bottom-[max(24px,env(safe-area-inset-bottom))] text-[clamp(40px,5vw,72px)] leading-none text-ivory">
        <span data-count>000</span>
        <span className="text-amber">%</span>
      </p>
    </div>
  );
}
