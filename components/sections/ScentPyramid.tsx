"use client";

import { Fragment, useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { PYRAMID } from "@/lib/content";
import { Photo } from "@/components/ui/Photo";
import { PetalMark } from "@/components/ui/PetalMark";

export function ScentPyramid() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add({ desktop: "(min-width: 1024px)", motion: MQ.motion }, (ctx) => {
        const { desktop, motion } = ctx.conditions as { desktop: boolean; motion: boolean };
        if (!motion) return;
        const k = desktop ? 1 : 0.5;
        q("[data-tier]").forEach((el, i) => {
          gsap.from(el, { x: (i % 2 ? 80 : -80) * k, autoAlpha: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 80%", once: true } });
          gsap.fromTo(el.querySelector("[data-drift]"), { yPercent: -(6 + i * 3) * k }, { yPercent: (6 + i * 3) * k, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="notes" ref={root} aria-labelledby="notes-title" className="on-dark section-y overflow-hidden bg-deep">
      <div className="container-x">
        <div className="mx-auto max-w-[900px] text-center">
          <h2 id="notes-title" className="h2">
            Built like a sunset, <em>in three layers.</em>
          </h2>
          <p className="mx-auto mt-6 max-w-[48ch] text-muted-d">{PYRAMID.sub}</p>
        </div>

        <ol className="mt-16 flex flex-col items-center gap-5">
          {PYRAMID.tiers.map((t) => (
            <li key={t.label} data-tier className={`relative flex w-full flex-col gap-5 overflow-hidden rounded-[24px] border border-[var(--line-d)] bg-surface p-6 sm:flex-row sm:items-center sm:gap-8 sm:p-7 ${t.width}`}>
              <div data-drift className="relative z-[1] flex-none">
                <Photo src={t.image} alt={t.alt} sizes="160px" className="h-24 w-24 rounded-full ring-1 ring-[var(--line-d)] lg:h-40 lg:w-40" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="label text-amber-glow">{t.label}</p>
                <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                  {t.notes.map((n, i) => (
                    <Fragment key={n}>
                      {i > 0 && <PetalMark size={16} ring={false} className="text-amber" />}
                      <span className="h3">{n}</span>
                    </Fragment>
                  ))}
                </p>
              </div>
              <span className="mono flex-none text-muted-d uppercase sm:text-right">{t.time}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
