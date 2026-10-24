"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, MQ, useGSAP } from "@/lib/gsap";
import { CRAFT } from "@/lib/content";
import { Photo } from "@/components/ui/Photo";

const R = 22;
const C = 2 * Math.PI * R;

export function Craft() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.desktop, () => {
        const frames = q("[data-frame]");
        const steps = q("[data-step]");
        gsap.set(frames.slice(1), { clipPath: "inset(0% 0% 100% 0%)" });
        gsap.set(steps.slice(1), { opacity: 0.3 });
        steps.forEach((step, i) => {
          const activate = (on: boolean) => {
            gsap.to(steps, { opacity: (j) => (j === (on ? i : i - 1) ? 1 : 0.3), duration: 0.4, overwrite: true });
            gsap.to(q("[data-dial]"), { strokeDashoffset: C * (1 - (on ? i + 1 : i) / CRAFT.length), duration: 0.6, ease: "power3.out" });
            q("[data-dial-n]")[0].textContent = String(on ? i + 1 : Math.max(1, i)).padStart(2, "0");
            if (i === 0) return;
            gsap.to(frames[i], { clipPath: on ? "inset(0% 0% 0% 0%)" : "inset(0% 0% 100% 0%)", duration: 0.9, ease: "power3.inOut", overwrite: true });
            if (on) gsap.fromTo(frames[i].querySelector("[data-photo-inner]"), { scale: 1.08 }, { scale: 1, duration: 1.2, ease: "power3.out" });
          };
          ScrollTrigger.create({ trigger: step, start: "top center", end: "bottom center", onEnter: () => activate(true), onLeaveBack: () => activate(false) });
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="craft" ref={root} aria-labelledby="craft-title" className="on-dark section-y bg-deep">
      <div className="container-x">
        <h2 id="craft-title" className="h2 max-w-[16ch]">
          Eight weeks <em>from flower to flacon.</em>
        </h2>

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-16">
          {/* sticky stack (desktop) */}
          <div className="hidden lg:col-span-5 lg:block">
            <div className="sticky top-[12vh]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[20px]">
                {CRAFT.map((c, i) => (
                  <div key={c.n} data-frame className="absolute inset-0" style={{ zIndex: i }}>
                    <Photo src={c.image} alt={c.alt} sizes="40vw" className="h-full w-full" />
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center gap-4" aria-hidden="true">
                <svg width="52" height="52" viewBox="0 0 52 52" className="-rotate-90">
                  <circle cx="26" cy="26" r={R} fill="none" stroke="var(--line-d)" strokeWidth="1.5" />
                  <circle data-dial cx="26" cy="26" r={R} fill="none" stroke="var(--color-amber)" strokeWidth="1.5" strokeDasharray={C} strokeDashoffset={C * 0.75} strokeLinecap="round" />
                </svg>
                <span className="mono text-muted-d">
                  <span data-dial-n>01</span> / 04
                </span>
              </div>
            </div>
          </div>

          <ol className="flex flex-col gap-16 lg:col-span-7 lg:gap-0">
            {CRAFT.map((c) => (
              <li key={c.n} data-step className="flex flex-col justify-center lg:min-h-[80vh]">
                <Photo src={c.image} alt={c.alt} sizes="100vw" className="mb-8 aspect-[4/5] w-full rounded-[20px] lg:hidden" />
                <span className="mono text-[clamp(48px,6vw,96px)] leading-none text-amber">{c.n}</span>
                <h3 className="mt-4 font-display text-[clamp(40px,4.4vw,72px)] leading-none">{c.title}</h3>
                <p className="mt-5 max-w-[36ch] text-[clamp(17px,1.5vw,21px)] leading-relaxed text-ivory/80">{c.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
