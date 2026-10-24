"use client";

import { useRef } from "react";
import { gsap, SplitText, MQ, useGSAP } from "@/lib/gsap";
import { IMG, QUOTE } from "@/lib/content";
import { Photo } from "@/components/ui/Photo";

export function QuoteParallax() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add({ desktop: "(min-width: 1024px)", motion: MQ.motion }, (ctx) => {
        const { desktop, motion } = ctx.conditions as { desktop: boolean; motion: boolean };
        if (!motion) return;
        const k = desktop ? 1 : 0.5;
        gsap.fromTo(q("[data-photo-inner]"), { yPercent: -12 * k }, { yPercent: 12 * k, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
        const split = SplitText.create(q("blockquote p"), { type: "lines", mask: "lines" });
        gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 65%", once: true } })
          .from(split.lines, { yPercent: 100, stagger: 0.12, duration: 1.1, ease: "expo.out" })
          .from(q("figcaption"), { autoAlpha: 0, y: 12, duration: 0.8, ease: "expo.out" }, "-=0.5");
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label="Founder's words" className="relative flex h-[90vh] min-h-[560px] items-center justify-center overflow-hidden bg-night">
      <Photo src={IMG.quote} alt={QUOTE.alt} sizes="100vw" className="absolute inset-0" innerClassName="inset-x-0 -inset-y-[12.5%]" />
      <div className="absolute inset-0 bg-gradient-to-b from-night via-[rgba(10,30,35,.35)] to-night" />
      <figure className="relative px-[var(--gutter)] text-center">
        <blockquote>
          <p className="mx-auto max-w-[18ch] font-display text-[clamp(36px,5vw,80px)] leading-[1.1] italic text-ivory">{QUOTE.text}</p>
        </blockquote>
        <figcaption className="label mt-8 text-amber-glow">{QUOTE.by}</figcaption>
      </figure>
    </section>
  );
}
