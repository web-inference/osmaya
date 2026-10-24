"use client";

import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { gsap, SplitText, MQ, useGSAP } from "@/lib/gsap";
import { IMG, MANIFESTO } from "@/lib/content";
import { Photo } from "@/components/ui/Photo";

export function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const split = SplitText.create(q("[data-para]"), { type: "words" });
        gsap.fromTo(split.words, { opacity: 0.14 }, { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: q("[data-para]"), start: "top 75%", end: "bottom 55%", scrub: true } });

        gsap.fromTo(q("[data-reveal]"), { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "power3.inOut", scrollTrigger: { trigger: q("[data-reveal]"), start: "top 80%", once: true } });
        gsap.fromTo(q("[data-reveal] [data-photo-inner]"), { yPercent: -10 }, { yPercent: 10, ease: "none", scrollTrigger: { trigger: q("[data-reveal]"), start: "top bottom", end: "bottom top", scrub: true } });

        q("[data-count]").forEach((el) => {
          const end = Number((el as HTMLElement).dataset.count);
          const obj = { v: 0 };
          gsap.to(obj, { v: end, duration: 1.6, ease: "power2.out", snap: { v: 1 }, scrollTrigger: { trigger: el, start: "top 85%", once: true }, onUpdate: () => { el.textContent = String(obj.v); } });
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="story" ref={root} aria-labelledby="story-title" className="on-light section-y bg-sand text-ink">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <h2 id="story-title" className="label text-muted-l">{MANIFESTO.label}</h2>
          <p data-para className="mt-8 font-display text-[clamp(30px,3.6vw,56px)] leading-[1.15] text-ink">{MANIFESTO.text}</p>

          <dl className="mt-14 grid border-t border-[var(--line-l)] sm:grid-cols-3">
            {MANIFESTO.stats.map((s, i) => (
              <div key={s.text} className={`py-7 sm:px-6 ${i ? "border-t border-[var(--line-l)] sm:border-t-0 sm:border-l" : "sm:pl-0"}`}>
                <dt className="font-display text-[72px] leading-none font-medium">
                  <span data-count={s.value}>{s.value}</span>
                  <span className="text-[0.55em]">{s.suffix}</span>
                </dt>
                <dd className="mt-3 max-w-[22ch] text-[15px] text-muted-l">{s.text}</dd>
              </div>
            ))}
          </dl>

          <a href="#origins" className="group mt-8 inline-flex items-center gap-3 border-b border-ink pb-1 text-[15px] font-semibold" data-cursor="link">
            {MANIFESTO.link}
            <ArrowRight size={18} strokeWidth={1.6} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </a>
        </div>

        <div className="max-lg:-order-1 lg:col-span-5">
          <div data-reveal className="overflow-hidden rounded-[20px]">
            <Photo src={IMG.manifesto} alt={MANIFESTO.imageAlt} sizes="(min-width:1024px) 38vw, 100vw" className="aspect-[4/5] w-full" innerClassName="inset-x-0 -inset-y-[12%]" />
          </div>
        </div>
      </div>
    </section>
  );
}
