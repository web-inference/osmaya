"use client";

import { useRef } from "react";
import { gsap, SplitText, MQ, useGSAP } from "@/lib/gsap";
import { ORIGINS } from "@/lib/content";
import { Photo } from "@/components/ui/Photo";

export function Origins() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add({ desktop: "(min-width: 1024px)", motion: MQ.motion }, (ctx) => {
        const { desktop, motion } = ctx.conditions as { desktop: boolean; motion: boolean };
        if (!motion) return;
        const k = desktop ? 1 : 0.5;
        q("[data-row]").forEach((row) => {
          gsap.fromTo(row.querySelector("[data-photo-inner]"), { yPercent: -12 * k }, { yPercent: 12 * k, ease: "none", scrollTrigger: { trigger: row, start: "top bottom", end: "bottom top", scrub: true } });
          const place = row.querySelector("[data-place]")!;
          const split = SplitText.create(place, { type: "lines", mask: "lines" });
          const coords = row.querySelector<HTMLElement>("[data-coords]")!;
          const final = coords.textContent ?? "";
          const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: "top 75%", once: true } });
          tl.from(split.lines, { yPercent: 100, duration: 1, ease: "expo.out" })
            .to(coords, { duration: 1.2, scrambleText: { text: final, chars: "0123456789.°", speed: 0.6 } }, 0.1)
            .from(row.querySelectorAll("[data-fade]"), { y: 20, autoAlpha: 0, stagger: 0.08, duration: 0.8, ease: "expo.out" }, 0.2);
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="origins" ref={root} aria-labelledby="origins-title" className="on-light section-y bg-sand text-ink">
      <div className="container-x">
        <div className="max-w-[820px]">
          <h2 id="origins-title" className="h2">
            Three harvests, <em>one horizon.</em>
          </h2>
          <p className="mt-6 max-w-[48ch] text-muted-l">{ORIGINS.sub}</p>
        </div>

        <ol className="mt-16 flex flex-col gap-16 lg:mt-24 lg:gap-28">
          {ORIGINS.rows.map((r, i) => (
            <li key={r.place} data-row className="grid items-center gap-8 lg:grid-cols-12 lg:gap-16">
              <Photo src={r.image} alt={r.alt} sizes="(min-width:1024px) 56vw, 100vw" className={`aspect-[3/2] w-full rounded-[20px] lg:col-span-7 ${i % 2 ? "lg:order-2" : ""}`} innerClassName="inset-x-0 -inset-y-[14%]" />
              <div className="lg:col-span-5">
                <p data-coords className="mono text-muted-l">{r.coords}</p>
                <h3 data-place className="mt-3 font-display text-[clamp(36px,4vw,60px)] leading-none">{r.place}</h3>
                <p data-fade className="mt-5 max-w-[42ch] text-[17px] text-ink/80">{r.text}</p>
                <span data-fade className="mono mt-6 inline-block rounded-full border border-[var(--line-l)] px-4 py-2 uppercase">{r.chip}</span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
