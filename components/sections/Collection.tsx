"use client";

import { useRef } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { SCENTS } from "@/lib/content";
import { Photo } from "@/components/ui/Photo";

export function Collection() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.desktop, () => {
        const el = track.current!;
        const distance = () => Math.max(0, el.scrollWidth - window.innerWidth + parseFloat(getComputedStyle(el).paddingLeft));
        const scroll = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: () => "+=" + distance(), pin: true, scrub: 1, invalidateOnRefresh: true },
        });
        gsap.fromTo(q("[data-progress]"), { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: () => "+=" + distance(), scrub: true, invalidateOnRefresh: true } });
        q("[data-card] [data-photo-inner]").forEach((img) =>
          gsap.fromTo(img, { xPercent: -8 }, { xPercent: 8, ease: "none", scrollTrigger: { trigger: img.closest("[data-card]"), containerAnimation: scroll, start: "left right", end: "right left", scrub: true } }),
        );
      });
    },
    { scope: root },
  );

  const nudge = (dir: 1 | -1) => track.current?.scrollBy({ left: dir * track.current.clientWidth * 0.8, behavior: "smooth" });

  return (
    <section id="collection" ref={root} aria-labelledby="collection-title" className="on-dark relative flex flex-col justify-center overflow-hidden bg-night py-[clamp(80px,10vw,140px)] lg:h-svh lg:py-0">
      <div className="container-x flex flex-wrap items-end justify-between gap-6">
        <h2 id="collection-title" className="h2 max-w-[14ch]">
          Five scents for <em>five hours</em> of evening.
        </h2>
        <div className="flex w-full max-w-[340px] flex-col gap-4">
          <span className="label text-muted-d">(05) Scents</span>
          <div className="relative h-px w-full bg-[var(--line-d)]">
            <div data-progress className="absolute inset-0 origin-left bg-amber max-lg:scale-x-[0.2]" />
          </div>
          <div className="flex gap-2 lg:hidden">
            <button type="button" className="arrow-pill glass" aria-label="Previous scents" onClick={() => nudge(-1)}><ArrowLeft size={18} aria-hidden="true" /></button>
            <button type="button" className="arrow-pill glass" aria-label="Next scents" onClick={() => nudge(1)}><ArrowRight size={18} aria-hidden="true" /></button>
          </div>
        </div>
      </div>

      <ul
        ref={track}
        tabIndex={0}
        aria-label="The Dusk Collection"
        data-cursor="drag"
        className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-8 overflow-x-auto px-[var(--gutter)] max-lg:scroll-px-[var(--gutter)] lg:mt-14 motion-safe:lg:w-max motion-safe:lg:snap-none motion-safe:lg:overflow-visible"
      >
        {SCENTS.map((s, i) => (
          <li key={s.id} data-card className="group relative w-[78vw] flex-none snap-start overflow-hidden rounded-[24px] sm:w-[clamp(300px,30vw,460px)] lg:w-[min(30vw,460px,calc((100svh-340px)*0.75))]">
            <Photo src={s.image} alt={s.imageAlt} sizes="(min-width:1024px) 30vw, 78vw" className="aspect-[3/4] w-full" innerClassName="inset-y-0 -inset-x-[10%]" imgClassName="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.06]" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(10,30,35,.92)] via-[rgba(10,30,35,.2)] to-transparent" />
            <span className="mono absolute top-5 left-5 text-ivory">{String(i + 1).padStart(2, "0")}/{String(SCENTS.length).padStart(2, "0")}</span>
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
              <div className="min-w-0">
                <p className="label text-amber-glow">{s.family}</p>
                <h3 className="h3 mt-1 text-ivory">{s.name}</h3>
                <p className="mt-1 text-[14px] text-ivory/80">{s.notes.join(" · ")}</p>
                <p className="mono mt-3 text-ivory">from ${s.from}</p>
              </div>
              <a href="#shop" aria-label={`Discover ${s.name}`} className="arrow-pill glass card-arrow flex-none text-ivory group-hover:[&_svg]:rotate-45" data-cursor="link">
                <ArrowUpRight size={18} aria-hidden="true" />
              </a>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
