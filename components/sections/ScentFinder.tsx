"use client";

import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { FINDER, IMG, scentById, scoreFinder } from "@/lib/content";
import { Photo } from "@/components/ui/Photo";
import { PrimaryButton } from "@/components/ui/buttons";
import { useCart } from "@/components/ui/CartContext";
import { scrollToTarget } from "@/components/ui/SmoothScroll";

export function ScentFinder() {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0); // 0..2 questions, 3 = result
  const [picks, setPicks] = useState<number[]>([]);
  const { add } = useCart();
  const { contextSafe } = useGSAP({ scope: root });

  const go = contextSafe((next: number, dir: 1 | -1) => {
    const el = stage.current;
    if (!el || prefersReducedMotion()) { setStep(next); return; }
    gsap.to(el, {
      xPercent: -12 * dir, autoAlpha: 0, duration: 0.25, ease: "power3.in",
      onComplete: () => {
        setStep(next);
        requestAnimationFrame(() => {
          gsap.fromTo(el, { xPercent: 12 * dir, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, duration: 0.5, ease: "power3.out" });
          if (next === 3) {
            gsap.fromTo(el.querySelector("[data-result-img]"), { clipPath: "circle(0% at 50% 50%)" }, { clipPath: "circle(75% at 50% 50%)", duration: 0.9, ease: "power3.inOut" });
            gsap.from(el.querySelectorAll("[data-result-text]"), { y: 16, autoAlpha: 0, stagger: 0.07, duration: 0.6, delay: 0.25, ease: "expo.out" });
          }
          el.querySelector<HTMLElement>("[data-focus]")?.focus({ preventScroll: true });
        });
      },
    });
  });

  const choose = (q: number, a: number) => setPicks((p) => { const n = [...p]; n[q] = a; return n; });
  const result = step === 3 ? scentById(scoreFinder(picks)) : null;

  return (
    <section id="finder" ref={root} aria-labelledby="finder-title" className="on-dark relative overflow-hidden py-[clamp(96px,12vw,180px)]">
      <div className="absolute inset-0">
        <Photo src={IMG.finder} alt="" sizes="100vw" className="h-full w-full" />
        <div className="absolute inset-0 bg-[rgba(10,30,35,.45)]" />
        {/* melt into Craft above and the quote below, so no image edge shows as a seam */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--color-deep)_0%,transparent_22%,transparent_78%,var(--color-night)_100%)]" />
      </div>

      <div className="relative px-[var(--gutter)]">
        <div className="glass mx-auto max-w-[720px] overflow-hidden rounded-[28px] bg-[rgba(10,30,35,.5)] p-7 sm:p-12">
          <div className="flex items-center justify-between gap-4">
            <p className="label text-amber-glow">Scent Finder · 3 questions</p>
            <ol className="flex gap-2" aria-label={`Step ${Math.min(step + 1, 3)} of 3`}>
              {[0, 1, 2].map((i) => (
                <li key={i} className={`h-2 w-2 rounded-full transition-colors ${i <= Math.min(step, 2) ? "bg-amber" : "bg-ivory/25"}`} />
              ))}
            </ol>
          </div>
          <h2 id="finder-title" className="h2 mt-4">
            Find <em>your hour.</em>
          </h2>

          <div ref={stage} className="mt-10 min-h-[260px]" aria-live="polite">
            {step < 3 && (
              <fieldset>
                <legend data-focus tabIndex={-1} className="font-display text-[clamp(26px,2.6vw,36px)] leading-tight text-ivory outline-none">
                  {FINDER[step].q}
                </legend>
                <div role="radiogroup" aria-label={FINDER[step].q} className="mt-7 flex flex-wrap gap-3">
                  {FINDER[step].answers.map((a, i) => {
                    const id = `finder-${step}-${i}`;
                    return (
                      <label key={id} htmlFor={id} className="cursor-pointer">
                        <input id={id} type="radio" name={`finder-${step}`} className="peer sr-only" checked={picks[step] === i} onChange={() => choose(step, i)} />
                        <span className="pill glass h-12 px-6 text-[13px] text-ivory peer-checked:border-ivory peer-checked:bg-ivory peer-checked:text-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-amber-glow">
                          {a.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
                <div className="mt-10 flex items-center justify-between gap-4">
                  <button type="button" onClick={() => go(step - 1, -1)} disabled={step === 0} className="inline-flex items-center gap-2 text-[14px] font-semibold text-ivory disabled:opacity-30">
                    <ArrowLeft size={16} aria-hidden="true" /> Back
                  </button>
                  <button type="button" onClick={() => go(step + 1, 1)} disabled={picks[step] === undefined} className="inline-flex h-12 items-center gap-2 rounded-full bg-ivory px-6 text-[13px] font-semibold tracking-[0.08em] text-ink uppercase transition-opacity disabled:opacity-35">
                    {step === 2 ? "See my match" : "Next"} <ArrowRight size={16} aria-hidden="true" />
                  </button>
                </div>
              </fieldset>
            )}

            {result && (
              <div className="flex flex-col gap-7 sm:flex-row sm:items-center">
                <div data-result-img className="w-[200px] flex-none overflow-hidden rounded-[20px]">
                  <Photo src={result.image} alt={result.imageAlt} sizes="200px" className="aspect-[3/4] w-full" />
                </div>
                <div className="min-w-0">
                  <p data-result-text className="label text-amber-glow">Your hour · {result.family}</p>
                  <h3 data-result-text data-focus tabIndex={-1} className="h3 mt-2 text-[40px] outline-none">{result.name}</h3>
                  <p data-result-text className="mt-3 text-ivory/80">{result.line}</p>
                  <div data-result-text className="mt-6 flex flex-wrap items-center gap-3">
                    <PrimaryButton onClick={() => add(result.name)}>Add to bag</PrimaryButton>
                    <button type="button" onClick={() => scrollToTarget("#discovery")} className="pill glass h-14 px-6 text-ivory">
                      Try it in the Discovery Set
                    </button>
                  </div>
                  <button data-result-text type="button" onClick={() => { setPicks([]); go(0, -1); }} className="mt-5 inline-flex items-center gap-2 text-[14px] font-semibold text-ivory/80 hover:text-ivory">
                    <RotateCcw size={15} aria-hidden="true" /> Start again
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
