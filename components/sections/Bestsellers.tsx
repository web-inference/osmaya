"use client";

import { useRef, useState } from "react";
import { Heart, Star } from "lucide-react";
import { gsap, Flip, ScrollTrigger, MQ, useGSAP } from "@/lib/gsap";
import { PRODUCTS, scentById } from "@/lib/content";
import { Photo } from "@/components/ui/Photo";
import { useCart } from "@/components/ui/CartContext";

const FILTERS = ["All", "Eau de Parfum", "Extrait"] as const;
type Filter = (typeof FILTERS)[number];

export function Bestsellers() {
  const root = useRef<HTMLElement>(null);
  const [filter, setFilter] = useState<Filter>("All");
  const [wish, setWish] = useState<Record<string, boolean>>({});
  const { add } = useCart();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        ScrollTrigger.batch(gsap.utils.toArray("[data-product]", root.current), {
          start: "top 88%",
          once: true,
          onEnter: (els) => gsap.from(els, { y: 40, autoAlpha: 0, stagger: 0.1, duration: 0.9, ease: "expo.out" }),
        });
      });
    },
    { scope: root },
  );

  const { contextSafe } = useGSAP({ scope: root });
  const applyFilter = contextSafe((f: Filter) => {
    const items = gsap.utils.toArray<HTMLElement>("[data-product]", root.current);
    const state = Flip.getState(items);
    setFilter(f);
    requestAnimationFrame(() => {
      Flip.from(state, { duration: 0.6, ease: "power3.inOut", absolute: true, onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 0.5 }), onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.94, duration: 0.3 }) });
      ScrollTrigger.refresh();
    });
  });

  return (
    <section id="shop" ref={root} aria-labelledby="shop-title" className="on-light section-y bg-sand text-ink">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 id="shop-title" className="h2 max-w-[14ch]">
            The ones people <em>come back for.</em>
          </h2>
          <div role="radiogroup" aria-label="Filter by type" className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button key={f} type="button" role="radio" aria-checked={filter === f} onClick={() => applyFilter(f)} className="pill pill-light">
                {f}
              </button>
            ))}
          </div>
        </div>

        <ul className="no-scrollbar -mx-[var(--gutter)] mt-12 flex snap-x snap-mandatory scroll-px-[var(--gutter)] gap-5 overflow-x-auto px-[var(--gutter)] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
          {PRODUCTS.map((p) => {
            const hidden = filter !== "All" && p.type !== filter;
            const s = scentById(p.scent);
            return (
              <li key={p.id} data-product data-flip-id={p.id} className={`group w-[80vw] flex-none snap-start sm:w-auto ${hidden ? "hidden" : ""}`}>
                <div className="relative overflow-hidden rounded-[20px] bg-sand-2">
                  <Photo src={p.image} alt={p.alt} sizes="(min-width:1024px) 24vw, (min-width:640px) 48vw, 80vw" className="aspect-[4/5] w-full" />
                  <Photo src={s.image} alt="" sizes="(min-width:1024px) 24vw, 48vw" className="absolute inset-0 opacity-0 transition-opacity duration-[600ms] group-focus-within:opacity-100 group-hover:opacity-100" />
                  <button
                    type="button"
                    aria-label={`Save ${p.name} to wishlist`}
                    aria-pressed={!!wish[p.id]}
                    onClick={() => setWish((w) => ({ ...w, [p.id]: !w[p.id] }))}
                    className="absolute top-4 right-4 grid h-11 w-11 place-items-center rounded-full bg-ivory/90 text-ink"
                  >
                    <Heart size={18} strokeWidth={1.6} className={wish[p.id] ? "fill-amber text-amber" : ""} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => add(p.name)}
                    className="absolute inset-x-4 bottom-4 h-12 rounded-full bg-ivory text-[13px] font-semibold tracking-[0.08em] text-ink uppercase transition-transform duration-500 ease-out [@media(hover:hover)]:translate-y-[calc(100%+20px)] [@media(hover:hover)]:group-focus-within:translate-y-0 [@media(hover:hover)]:group-hover:translate-y-0"
                  >
                    Quick add — ${p.price}
                  </button>
                </div>
                <div className="mt-5 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="h3 text-[28px]">{p.name}</h3>
                    <p className="label mt-1 text-muted-l">{p.type} · {p.ml} ml</p>
                  </div>
                  <p className="mono pt-1.5 text-[15px]">${p.price}</p>
                </div>
                <p className="mt-2 flex items-center gap-1.5 text-[14px] text-muted-l">
                  <Star size={14} className="fill-amber text-amber" aria-hidden="true" />
                  <span><span className="font-semibold text-ink">{p.rating}</span> ({p.reviews} reviews)</span>
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
