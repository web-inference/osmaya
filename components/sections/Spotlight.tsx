"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { asset } from "@/lib/asset";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { IMG, SPOTLIGHT } from "@/lib/content";
import { Photo } from "@/components/ui/Photo";
import { PrimaryButton } from "@/components/ui/buttons";
import { useCart } from "@/components/ui/CartContext";

const SIDES = ["left", "right", "left"] as const;
const TOPS = ["top-[22%]", "top-[40%]", "top-[58%]"];

export function Spotlight() {
  const root = useRef<HTMLElement>(null);
  const [size, setSize] = useState(0);
  const { add } = useCart();

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(MQ.desktop, () => {
        const tl = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: root.current, start: "top top", end: "+=250%", pin: true, scrub: 1 } });
        tl.fromTo(q("[data-bottle]"), { scale: 0.82, rotate: -4 }, { scale: 1.04, rotate: 3, duration: 10 }, 0)
          .fromTo(q("[data-bg] [data-photo-inner]"), { scale: 1.1 }, { scale: 1, duration: 10 }, 0)
          .fromTo(q("[data-rail-fill]"), { scaleY: 0 }, { scaleY: 1, duration: 10 }, 0);
        q("[data-callout]").forEach((el, i) => {
          const left = SIDES[i] === "left";
          tl.fromTo(el, { x: left ? -40 : 40, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 1.2, ease: "power2.out" }, 1 + i * 3)
            .fromTo(q(`[data-connector='${i}']`), { scaleX: 0 }, { scaleX: 1, duration: 1, ease: "power2.out" }, 1.4 + i * 3);
        });
        q("[data-sp-petal]").forEach((el, i) => tl.fromTo(el, { yPercent: 0 }, { yPercent: -120 - i * 40, rotate: 40 * (i % 2 ? 1 : -1), duration: 10 }, 0));
      });

      mm.add(MQ.mobile, () => {
        q("[data-callout]").forEach((el) =>
          gsap.from(el, { y: 40, autoAlpha: 0, duration: 0.9, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%", once: true } }),
        );
      });
    },
    { scope: root },
  );

  const current = SPOTLIGHT.sizes[size];

  return (
    <section ref={root} aria-labelledby="spot-title" className="relative overflow-hidden bg-night lg:h-svh">
      <div data-bg className="absolute inset-0">
        <Photo src={IMG.spotlight} alt="" sizes="100vw" className="h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(10,30,35,.35)] via-transparent to-night" />
      </div>

      {/* progress rail */}
      <div aria-hidden="true" className="absolute top-1/2 left-[var(--gutter)] z-10 hidden h-[52%] -translate-y-1/2 lg:block">
        <div className="relative h-full w-px bg-[var(--line-d)]">
          <div data-rail-fill className="absolute inset-0 origin-top bg-amber" />
          {SPOTLIGHT.rail.map((t, i) => (
            <div key={t} className="absolute left-0 flex -translate-y-1/2 items-center gap-3" style={{ top: `${(i / (SPOTLIGHT.rail.length - 1)) * 100}%` }}>
              <span className="h-px w-3 bg-ivory/70" />
              <span className="mono whitespace-nowrap text-[12px] text-muted-d uppercase">{t}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-[5] flex flex-col items-center px-[var(--gutter)] pt-24 pb-16 lg:h-full lg:pt-0 lg:pb-0">
        {/* bottle */}
        <div data-bottle className="relative h-[52vh] max-h-[560px] lg:absolute lg:top-[8%] lg:left-1/2 lg:h-[64vh] lg:max-h-none lg:[translate:-50%_0]">
          <Photo src={IMG.bottle} alt="Liquid Dusk Eau de Parfum bottle" sizes="(min-width:1024px) 34vw, 70vw" intrinsic={{ width: 1122, height: 1402 }} className="h-full w-auto drop-shadow-[0_40px_60px_rgba(0,0,0,.55)]" imgClassName="" />
        </div>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} data-sp-petal aria-hidden="true" className="pointer-events-none absolute z-[6] hidden lg:block" style={{ left: `${[30, 64, 38, 70][i]}%`, top: `${[30, 20, 72, 64][i]}%`, width: [110, 84, 130, 92][i] }}>
            <Image src={asset(IMG.petals[i % 3])} alt="" width={130} height={130} sizes="260px" className="h-auto w-full" style={{ rotate: `${[20, -40, 120, 60][i]}deg` }} />
          </div>
        ))}

        {/* note callouts */}
        <ol className="mt-10 grid w-full max-w-[560px] gap-4 lg:mt-0 lg:contents">
          {SPOTLIGHT.notes.map((n, i) => {
            const left = SIDES[i] === "left";
            return (
              <li key={n.name} data-callout className={`glass relative z-[7] rounded-[20px] bg-[rgba(10,30,35,.4)] p-6 lg:absolute lg:w-[300px] xl:w-[320px] ${TOPS[i]} ${left ? "lg:right-[calc(50%+13vw)]" : "lg:left-[calc(50%+13vw)]"}`}>
                <span data-connector={i} aria-hidden="true" className={`absolute top-1/2 hidden h-px w-[6vw] bg-ivory/40 lg:block ${left ? "left-full origin-left" : "right-full origin-right"}`} />
                <p className="label text-amber-glow">{n.tier}</p>
                <h3 className="h3 mt-2 text-[28px] text-ivory">{n.name}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ivory/80">{n.text}</p>
              </li>
            );
          })}
        </ol>

        {/* purchase */}
        <div className="mt-10 flex flex-col items-center gap-4 text-center lg:absolute lg:bottom-[6%] lg:mt-0">
          <h2 id="spot-title" className="h3 text-ivory">{SPOTLIGHT.title}</h2>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="mono rounded-full border border-[var(--line-d)] px-4 py-2 text-ivory">{current.ml} ml — ${current.price}</span>
            <div role="radiogroup" aria-label="Size" className="glass flex rounded-full p-1">
              {SPOTLIGHT.sizes.map((s, i) => (
                <button
                  key={s.ml}
                  type="button"
                  role="radio"
                  aria-checked={size === i}
                  tabIndex={size === i ? 0 : -1}
                  onClick={() => setSize(i)}
                  onKeyDown={(e) => {
                    if (["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(e.key)) {
                      e.preventDefault();
                      setSize((v) => (v + 1) % 2);
                      (e.currentTarget.parentElement?.children[(i + 1) % 2] as HTMLElement | undefined)?.focus();
                    }
                  }}
                  className={`h-10 rounded-full px-5 text-[13px] font-semibold tracking-[0.08em] transition-colors ${size === i ? "bg-ivory text-ink" : "text-ivory"}`}
                >
                  {s.ml} ml
                </button>
              ))}
            </div>
            <PrimaryButton onClick={() => add(`Liquid Dusk ${current.ml} ml`)}>Add to bag</PrimaryButton>
          </div>
        </div>
      </div>
    </section>
  );
}
