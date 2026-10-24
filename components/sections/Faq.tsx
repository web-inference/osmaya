"use client";

import { useRef, useState } from "react";
import { Plus } from "lucide-react";
import { gsap, MQ, ScrollTrigger, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { FAQ, IMG } from "@/lib/content";
import { Photo } from "@/components/ui/Photo";

export function Faq() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(0);

  const { contextSafe } = useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      // closed panels collapse via JS so the answers stay in the HTML without it
      q("[data-panel]").forEach((p, i) => gsap.set(p, { height: i === 0 ? "auto" : 0 }));
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.fromTo(q("[data-faq-img] [data-photo-inner]"), { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
      });
    },
    { scope: root },
  );

  const toggle = contextSafe((i: number) => {
    const next = open === i ? -1 : i;
    const panels = gsap.utils.toArray<HTMLElement>("[data-panel]", root.current);
    const d = prefersReducedMotion() ? 0 : 0.5;
    panels.forEach((p, j) => gsap.to(p, { height: j === next ? "auto" : 0, duration: d, ease: "power3.inOut", overwrite: true, onComplete: j === next ? () => ScrollTrigger.refresh() : undefined }));
    setOpen(next);
  });

  return (
    <section id="faq" ref={root} aria-labelledby="faq-title" className="on-light section-y bg-ivory text-ink">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div data-faq-img className="lg:sticky lg:top-[12vh]">
            <Photo src={IMG.faq} alt="Liquid Dusk bottle resting on ivory silk with an amber ribbon" sizes="(min-width:1024px) 38vw, 100vw" className="aspect-[3/4] w-full rounded-[20px] max-lg:aspect-[4/3]" innerClassName="inset-x-0 -inset-y-[10%]" />
          </div>
        </div>
        <div className="lg:col-span-7">
          <h2 id="faq-title" className="h2">
            Before you <em>choose.</em>
          </h2>
          <ul className="mt-12 border-t border-[var(--line-l)]">
            {FAQ.map((f, i) => {
              const isOpen = open === i;
              return (
                <li key={f.q} className="border-b border-[var(--line-l)]">
                  <h3>
                    <button
                      type="button"
                      id={`faq-btn-${i}`}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${i}`}
                      onClick={() => toggle(i)}
                      className="flex w-full items-center justify-between gap-6 py-7 text-left font-display text-[clamp(22px,2vw,30px)] leading-tight font-medium"
                    >
                      {f.q}
                      <Plus size={22} strokeWidth={1.4} aria-hidden="true" className={`flex-none transition-transform duration-500 ${isOpen ? "rotate-45" : ""}`} />
                    </button>
                  </h3>
                  <div id={`faq-panel-${i}`} role="region" aria-labelledby={`faq-btn-${i}`} data-panel className="faq-panel">
                    <p className="max-w-[56ch] pb-7 text-[17px] text-ink/75">{f.a}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
