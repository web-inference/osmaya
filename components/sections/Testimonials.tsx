"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { asset } from "@/lib/asset";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import { gsap, MQ, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { PRESS, TESTIMONIALS } from "@/lib/content";

export function Testimonials() {
  const root = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  const { contextSafe } = useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from(q("[data-tcard]"), { y: 60, autoAlpha: 0, stagger: 0.1, duration: 1, ease: "expo.out", scrollTrigger: { trigger: track.current, start: "top 80%", once: true } });
      });
      paint(0, true);
    },
    { scope: root },
  );

  const offsetFor = (i: number) => {
    const cards = track.current?.children;
    const vp = viewport.current;
    if (!cards || !vp) return 0;
    const card = cards[i] as HTMLElement;
    const max = track.current!.scrollWidth - vp.clientWidth;
    const left = card.offsetLeft - (cards[0] as HTMLElement).offsetLeft;
    return -Math.min(left, Math.max(0, max));
  };

  function paint(i: number, instant = false) {
    const cards = gsap.utils.toArray<HTMLElement>("[data-tcard]", root.current);
    const d = instant || prefersReducedMotion() ? 0 : 0.7;
    gsap.to(track.current, { x: offsetFor(i), duration: d, ease: "power3.out", overwrite: true });
    gsap.to(cards, { opacity: (j) => (j === i ? 1 : 0.55), scale: (j) => (j === i ? 1 : 0.96), duration: d, ease: "power3.out" });
  }

  const goTo = contextSafe((i: number) => {
    const n = gsap.utils.clamp(0, TESTIMONIALS.length - 1, i);
    activeRef.current = n;
    setActive(n);
    paint(n);
  });

  // pointer drag
  const drag = useRef<{ x: number; start: number; moved: boolean } | null>(null);
  const onDown = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, start: Number(gsap.getProperty(track.current, "x")), moved: false };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    if (Math.abs(dx) > 4) drag.current.moved = true;
    gsap.set(track.current, { x: drag.current.start + dx });
  };
  const onUp = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    drag.current = null;
    goTo(activeRef.current + (dx < -60 ? 1 : dx > 60 ? -1 : 0));
  };

  return (
    <section id="journal" ref={root} aria-labelledby="journal-title" className="on-light section-y overflow-hidden bg-sand text-ink">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 id="journal-title" className="h2 max-w-[15ch]">
            12,400 collectors. <em>4.9 average.</em>
          </h2>
          <div className="flex gap-3">
            <button type="button" aria-label="Previous review" disabled={active === 0} onClick={() => goTo(active - 1)} className="icon-circle border border-[var(--line-l)] disabled:opacity-35">
              <ArrowLeft size={20} strokeWidth={1.5} aria-hidden="true" />
            </button>
            <button type="button" aria-label="Next review" disabled={active === TESTIMONIALS.length - 1} onClick={() => goTo(active + 1)} className="icon-circle border border-[var(--line-l)] disabled:opacity-35">
              <ArrowRight size={20} strokeWidth={1.5} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div
          ref={viewport}
          role="region"
          aria-roledescription="carousel"
          aria-label="Customer reviews"
          tabIndex={0}
          data-cursor="drag"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") { e.preventDefault(); goTo(active + 1); }
            if (e.key === "ArrowLeft") { e.preventDefault(); goTo(active - 1); }
          }}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          className="mt-12 cursor-grab touch-pan-y select-none active:cursor-grabbing"
        >
          <ul ref={track} className="flex w-max gap-6">
            {TESTIMONIALS.map((t, i) => (
              <li key={t.name} data-tcard aria-roledescription="slide" aria-label={`${i + 1} of ${TESTIMONIALS.length}`} className="flex w-[min(520px,82vw)] origin-left flex-col rounded-[24px] bg-ivory p-8 sm:p-10">
                <div className="flex gap-1" aria-label="5 out of 5 stars">
                  {[0, 1, 2, 3, 4].map((s) => <Star key={s} size={16} className="fill-amber text-amber" aria-hidden="true" />)}
                </div>
                <blockquote className="mt-6 flex-1 font-display text-[28px] leading-[1.25]">“{t.quote}”</blockquote>
                <div className="mt-8 flex items-center gap-4">
                  <Image src={asset(t.avatar)} alt="" width={56} height={56} sizes="112px" className="h-14 w-14 rounded-full object-cover" draggable={false} />
                  <div>
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-[14px] text-muted-l">{t.city} · <span className="mono">{t.product}</span></p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-20 border-t border-[var(--line-l)] pt-10">
          <p className="label text-muted-l">As seen in</p>
          <div className="mt-6">
            <ul className="flex flex-wrap items-center justify-between gap-x-14 gap-y-6 text-muted-l">
              {PRESS.map((p) => (
                <li key={p.name} className={`${p.cls} transition-colors hover:text-ink`}>{p.name}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
