"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, MQ, useGSAP } from "@/lib/gsap";
import { MARQUEE } from "@/lib/content";
import { PetalMark } from "@/components/ui/PetalMark";

function Row({ items: base, kind, repeat = 1 }: { items: string[]; kind: "notes" | "claims"; repeat?: number }) {
  // each half of the loop must be wider than the widest screen, or a gap shows before it wraps
  const items = Array.from({ length: repeat }, (_, r) => base.map((t) => ({ t, key: `${r}-${t}`, rep: r > 0 }))).flat();
  const run = (dup: boolean) => (
    <div className={`flex flex-none items-center ${dup ? "marquee-dup" : ""}`} aria-hidden={dup || undefined}>
      {items.map(({ t, key, rep }) => (
        <span key={key} className={`flex flex-none items-center ${rep ? "marquee-rep" : ""}`}>
          <span className={kind === "notes" ? "px-6 font-display text-[clamp(40px,5vw,72px)] leading-[1.15] italic text-ivory lg:px-10" : "label px-5 text-muted-d"}>{t}</span>
          {kind === "notes" ? <PetalMark size={24} className="flex-none text-amber" /> : <span className="h-1 w-1 flex-none rounded-full bg-amber" />}
        </span>
      ))}
    </div>
  );
  return (
    <div data-marquee className="marquee-track">
      {run(false)}
      {run(true)}
    </div>
  );
}

export function NotesMarquee() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const [a, b] = gsap.utils.toArray<HTMLElement>("[data-marquee]", root.current);
        const t1 = gsap.to(a, { xPercent: -50, repeat: -1, ease: "none", duration: 28 });
        const t2 = gsap.fromTo(b, { xPercent: -50 }, { xPercent: 0, repeat: -1, ease: "none", duration: 34 });
        let dir = 1;
        let hovered = false;
        const setSpeed = (v: number) => {
          if (hovered) return;
          gsap.to([t1, t2], { timeScale: v * dir, duration: 0.6, ease: "power2.out", overwrite: true });
        };
        const settle = gsap.delayedCall(0.15, () => setSpeed(1)).pause();
        ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            if (hovered) return;
            dir = self.direction;
            const v = gsap.utils.clamp(1, 4, 1 + Math.abs(self.getVelocity()) / 600);
            gsap.to([t1, t2], { timeScale: v * dir, duration: 0.15, overwrite: true });
            settle.restart(true);
          },
        });
        if (window.matchMedia("(pointer: fine)").matches) {
          const el = root.current!;
          const enter = () => { hovered = true; gsap.to([t1, t2], { timeScale: 0, duration: 0.5, overwrite: true }); };
          const leave = () => { hovered = false; setSpeed(1); };
          el.addEventListener("pointerenter", enter);
          el.addEventListener("pointerleave", leave);
          return () => { el.removeEventListener("pointerenter", enter); el.removeEventListener("pointerleave", leave); };
        }
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label="Ingredients and promises" className="overflow-hidden border-y border-[var(--line-d)] bg-night py-14">
      <Row items={MARQUEE.notes} kind="notes" repeat={2} />
      <div className="mt-6">
        <Row items={MARQUEE.claims} kind="claims" repeat={3} />
      </div>
    </section>
  );
}
