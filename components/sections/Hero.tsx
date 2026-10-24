"use client";

import { useRef } from "react";
import Image from "next/image";
import { asset } from "@/lib/asset";
import { gsap, SplitText, MQ, useGSAP } from "@/lib/gsap";
import { HERO, IMG } from "@/lib/content";
import { Photo } from "@/components/ui/Photo";
import { ArrowPill, PrimaryButton } from "@/components/ui/buttons";
import { useCart } from "@/components/ui/CartContext";
import { useVersionedSrc } from "@/components/ui/ImageVersion";
import { HeroNav } from "./Navbar";

// x/y in % of the card, size in px, petal index, rotation, mobile visibility
const PETALS = [
  { x: 9, y: 17, s: 52, i: 0, r: -20, m: true },
  { x: 27, y: 58, s: 40, i: 2, r: 30, m: false },
  { x: 61, y: 13, s: 44, i: 1, r: 12, m: false },
  { x: 78, y: 20, s: 64, i: 0, r: 70, m: true },
  { x: 92, y: 42, s: 44, i: 2, r: -40, m: false },
];

/** Point on the orbit circle (viewBox 0 0 100 100, r = 49.5), angle in degrees, y down. */
const P = (deg: number) => {
  const a = (deg * Math.PI) / 180;
  return `${(50 + 49.5 * Math.cos(a)).toFixed(2)} ${(50 + 49.5 * Math.sin(a)).toFixed(2)}`;
};

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const { add } = useCart();
  // v2 bottles carry a real label, so the bottle sits in front of "DUSK" instead of behind it
  const branded = useVersionedSrc(IMG.bottle) !== IMG.bottle;

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add({ desktop: "(min-width: 1024px)", motion: MQ.motion }, (ctx) => {
        const { desktop, motion } = ctx.conditions as { desktop: boolean; motion: boolean };
        if (!motion) return;
        const k = desktop ? 1 : 0.5;

        // ---- load timeline ----
        const splits = q("[data-word]").map((el) => SplitText.create(el, { type: "chars", mask: "chars" }));
        // first visit: the preloader owns the screen, so hold the intro until it hands over
        const waiting = document.documentElement.classList.contains("is-loading");
        const tl = gsap.timeline({ defaults: { ease: "expo.out" }, paused: waiting });
        if (waiting) window.addEventListener("osmaya:loaded", () => tl.play(), { once: true });
        tl.fromTo(q("[data-card]"), { clipPath: "inset(6% 6% 6% 6% round 28px)" }, { clipPath: "inset(0% 0% 0% 0% round 28px)", duration: 1.2 }, 0)
          .from(q("[data-sky-inner]"), { scale: 1.12, duration: 1.4 }, 0)
          .from(q("[data-frame-letters]"), { yPercent: 30, duration: 1.2 }, 0)
          .from(splits.flatMap((s) => s.chars), { yPercent: 110, stagger: 0.035, duration: 1.1 }, 0.3)
          .from(q("[data-bottle-in]"), { y: 80, autoAlpha: 0, duration: 1.1 }, 0.45)
          .from(q("[data-branch-in]"), { rotate: -8, autoAlpha: 0, transformOrigin: "0% 100%", duration: 1.2 }, 0.6)
          .from(q("[data-ridge-in]"), { y: 40, autoAlpha: 0, duration: 1 }, 0.35)
          .from(q("[data-arc]"), { strokeDashoffset: 101, duration: 1.2, ease: "power2.inOut" }, 0.8)
          .from(q("[data-dot]"), { scale: 0, duration: 0.6, ease: "back.out(2)" }, 1.2)
          .from(q("[data-feature-text]"), { autoAlpha: 0, x: (i) => (i === 0 ? 12 : -12), duration: 0.8 }, 1.25)
          .from(q("[data-nav-item]"), { y: -20, autoAlpha: 0, stagger: 0.05, duration: 0.8 }, 0.5)
          .from(q("[data-ui]"), { y: 24, autoAlpha: 0, stagger: 0.06, duration: 0.9 }, 0.9)
          .from(q("[data-petal-in]"), { autoAlpha: 0, scale: 0.6, stagger: 0.05, duration: 1 }, 0.9)
          .set(q("[data-layer]"), { willChange: "auto" });

        // ---- scroll parallax ----
        const st = gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
        st.to(q("[data-l='sky']"), { yPercent: 14 * k }, 0)
          .to(q("[data-l='w1']"), { xPercent: -10 * k }, 0)
          .to(q("[data-l='ridge']"), { scale: 1 + 0.08 * k, transformOrigin: "50% 100%" }, 0)
          .to(q("[data-l='bottle']"), { yPercent: -6 * k, scale: 1 + 0.04 * k, transformOrigin: "50% 100%" }, 0)
          .to(q("[data-l='branch']"), { yPercent: -28 * k, rotate: 4 * k }, 0)
          .to(q("[data-l='w2']"), { xPercent: 10 * k }, 0)
          .to(q("[data-l='fg']"), { scale: 1 + 0.16 * k, transformOrigin: "50% 100%" }, 0)
          .to(q("[data-l='petal']"), { yPercent: () => gsap.utils.random(-180, -80) * k }, 0)
          .to(q("[data-l='ui']"), { autoAlpha: 0, duration: 0.4 }, 0);

        // ---- ambient petals ----
        q("[data-petal-float]").forEach((el) =>
          gsap.to(el, { y: "random(-14, 14)", rotation: "random(-12, 12)", duration: "random(4, 7)", ease: "sine.inOut", yoyo: true, repeat: -1, delay: "random(0, 2)" }),
        );

        // ---- the bottle (and its branch) hover gently, like the petals ----
        gsap.to(q("[data-hero-float]"), { y: -12 * k, duration: 3.2, ease: "sine.inOut", yoyo: true, repeat: -1 });

        // ---- mouse parallax (fine pointers, desktop) ----
        if (!desktop || !window.matchMedia("(pointer: fine)").matches) return;
        const layers = q("[data-depth]").map((el) => ({
          x: gsap.quickTo(el, "x", { duration: 0.9, ease: "power3.out" }),
          y: gsap.quickTo(el, "y", { duration: 0.9, ease: "power3.out" }),
          d: Number((el as HTMLElement).dataset.depth),
        }));
        // the bottle also leans a little toward the pointer
        const tiltEl = q("[data-tilt]")[0];
        gsap.set(tiltEl, { transformOrigin: "50% 90%" });
        const tilt = gsap.quickTo(tiltEl, "rotation", { duration: 1.1, ease: "power3.out" });
        const onMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          layers.forEach((l) => { l.x(-nx * 2 * l.d); l.y(-ny * 2 * l.d); });
          tilt(nx * 5);
        };
        root.current!.addEventListener("pointermove", onMove);
        return () => root.current?.removeEventListener("pointermove", onMove);
      });
    },
    { scope: root },
  );

  const [w1, w2] = HERO.words;

  return (
    <header id="top" ref={root} className="relative overflow-hidden bg-frame p-2 pt-2 sm:p-4 sm:pt-3 lg:p-6 lg:pt-3">
      {/* giant cropped wordmark behind the card */}
      <div aria-hidden="true" data-frame-letters className="pointer-events-none absolute inset-x-0 top-[-14.6vw] flex justify-center font-display text-[30vw] leading-[0.8] tracking-[0.02em] text-frame-letters select-none">
        OSMAYA
      </div>

      <div data-card className="relative isolate z-10 h-[max(680px,calc(100svh-16px))] overflow-hidden rounded-[28px] bg-night sm:h-[max(720px,calc(100svh-28px))] lg:h-[max(720px,calc(100svh-36px))]">
        {/* 1 · sky */}
        <div data-layer data-l="sky" className="absolute inset-x-0 -top-[8%] h-[120%] will-change-transform">
          <div data-depth="6" className="absolute -inset-3">
            <div data-sky-inner className="absolute inset-0">
              <Photo src={IMG.sky} alt="Blue-hour sky over misty mountain ridges with an amber horizon" sizes="100vw" priority className="h-full w-full" imgClassName="object-cover object-[50%_60%]" />
            </div>
          </div>
          <div className="absolute inset-x-0 top-0 h-[32%] bg-gradient-to-b from-[rgba(10,30,35,.65)] to-transparent" />
        </div>

        {/* guide lines */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-[20%] z-[1] w-px bg-[var(--line-d)] max-lg:hidden" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-[80%] z-[1] w-px bg-[var(--line-d)] max-lg:hidden" />

        {/* headline: two words living on different depth layers */}
        <h1 aria-label="Liquid Dusk" className="contents">
          <span data-layer data-l="w1" className="absolute top-[17%] left-[6%] z-[2] will-change-transform lg:top-[18%] lg:left-[calc(20%-2vw-0.6em)]">
            <span data-depth="8" className="block"><span data-word aria-hidden="true" className="h1 block text-[19vw] text-ivory lg:text-[clamp(72px,12vw,220px)]">{w1}</span></span>
          </span>
          <span data-layer data-l="w2" className="absolute bottom-[31%] right-[6%] z-[6] will-change-transform lg:top-[46%] lg:right-[20%] lg:bottom-auto lg:translate-x-[0.35em]">
            <span data-depth="16" className="block"><span data-word aria-hidden="true" className="h1 block text-[19vw] text-ivory/95 lg:text-[clamp(72px,12vw,220px)]">{w2}</span></span>
          </span>
        </h1>

        {/* 3 · ridge */}
        <div data-layer data-l="ridge" className="absolute -bottom-[5%] left-1/2 z-[3] w-[150%] [translate:-50%_0] will-change-transform sm:w-[95%] lg:w-[62%]">
          <div data-ridge-in>
            <Image src={asset(IMG.ridge)} alt="" width={1024} height={434} sizes="(min-width:1024px) 62vw, 100vw" priority className="h-auto w-full" draggable={false} />
          </div>
        </div>

        {/* 4 · bottle */}
        <div data-layer data-l="bottle" className={`absolute bottom-[22%] left-1/2 ${branded ? "z-[7]" : "z-[5]"} h-[44%] [translate:-50%_0] will-change-transform sm:h-[50%] lg:bottom-[24%] lg:h-[56%]`}>
          <div data-depth="20" data-tilt className="h-full">
            <div data-bottle-in className="h-full">
              <div data-hero-float className="h-full">
              <Photo src={IMG.bottle} alt="Liquid Dusk Eau de Parfum bottle with amber liquid and a brass cap" sizes="(min-width:1024px) 30vw, 50vw" priority intrinsic={{ width: 1122, height: 1402 }} className="h-full w-auto drop-shadow-[0_30px_40px_rgba(0,0,0,.45)]" imgClassName="" />
              </div>
            </div>
          </div>
        </div>

        {/* 5 · branch */}
        <div data-layer data-l="branch" className="absolute bottom-[26%] left-[46%] z-[4] h-[50%] will-change-transform sm:left-[47%] lg:bottom-[29%] lg:left-[48%] lg:h-[55%]">
          {/* same depth and float as the bottle, so the stem stays tucked behind it */}
          <div data-depth="20" className="h-full">
            <div data-branch-in className="h-full">
              <div data-hero-float className="h-full">
                <Image src={asset(IMG.branch)} alt="" width={1024} height={1536} sizes="(min-width:1024px) 30vw, 40vw" priority className="h-full w-auto" draggable={false} />
              </div>
            </div>
          </div>
        </div>

        {/* 7 · foreground blossoms */}
        <div data-layer data-l="fg" className="pointer-events-none absolute -bottom-[2%] left-1/2 z-[7] w-[160%] [translate:-50%_0] will-change-transform sm:w-[110%]">
          <div data-depth="22">
            <Image src={asset(IMG.foreground)} alt="" width={1024} height={434} sizes="110vw" priority className="h-auto w-full" draggable={false} />
          </div>
        </div>

        {/* 8 · petals */}
        {PETALS.map((p, n) => (
          <div key={n} data-layer data-l="petal" className={`pointer-events-none absolute z-[8] ${p.m ? "" : "max-lg:hidden"}`} style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s }}>
            <div data-depth="28" className="h-full w-full">
              <div data-petal-in className="h-full w-full">
                <div data-petal-float className="h-full w-full">
                  <Image src={asset(IMG.petals[p.i])} alt="" width={p.s} height={p.s} sizes={`${p.s * 2}px`} className="h-full w-full" style={{ rotate: `${p.r}deg` }} draggable={false} />
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* bottom fade for UI legibility */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-[8] h-[34%] bg-gradient-to-t from-[rgba(10,30,35,.78)] to-transparent" />

        {/* 9 · UI */}
        <HeroNav />

        <div data-layer data-l="ui" className="absolute inset-0 z-20">
          {/* orbit + feature labels */}
          <div aria-hidden="true" className="absolute top-[13%] left-1/2 hidden aspect-square h-[66%] [translate:-50%_0] lg:block">
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible" fill="none">
              <path data-arc pathLength={100} strokeDasharray="101" d={`M ${P(175)} A 49.5 49.5 0 0 0 ${P(112)}`} stroke="rgba(247,240,230,.38)" strokeWidth="0.18" />
              <path data-arc pathLength={100} strokeDasharray="101" d={`M 112 37.4 A 64 64 0 0 1 ${P(68)}`} stroke="rgba(247,240,230,.38)" strokeWidth="0.18" />
            </svg>
            {HERO.features.map((f, i) => (
              <div key={i} className={`absolute flex -translate-y-1/2 items-center gap-4 ${i === 0 ? "top-[54.3%] right-[99.3%] translate-x-[5px] flex-row" : "top-[37.4%] left-[112%] -translate-x-[5px] flex-row-reverse"}`}>
                <p data-feature-text className={`label whitespace-nowrap text-[13px] text-ivory ${i === 0 ? "text-right" : "text-left"}`}>
                  {f.lines[0]}<br />{f.lines[1]}
                </p>
                <span data-dot className="block h-[10px] w-[10px] flex-none rounded-full bg-ivory shadow-[0_0_0_6px_rgba(247,240,230,.18)]" />
              </div>
            ))}
          </div>

          {/* bottom row */}
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-6 px-[4%] pb-6 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-end lg:px-[3%] lg:pb-[2.4%]">
            <div data-ui className="no-scrollbar flex w-full gap-2.5 max-lg:order-2 max-lg:-mx-[4%] max-lg:w-[108%] max-lg:overflow-x-auto max-lg:px-[4%] lg:w-auto lg:flex-col">
              {HERO.pillRows.map((row, r) => (
                <div key={r} className="flex gap-2.5 max-lg:contents">
                  <ul className="flex gap-2.5 max-lg:contents" aria-label={r === 0 ? "Key notes" : undefined}>
                    {row.map((n) => (
                      <li key={n} className="pill glass flex-none text-ivory">{n}</li>
                    ))}
                  </ul>
                  <ArrowPill label="See all notes" href="#notes" className="text-ivory max-lg:hidden" />
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center gap-5 max-lg:order-1">
              <div data-ui>
                <PrimaryButton onClick={() => add("Liquid Dusk")} aria-label="Shop the Eau — add Liquid Dusk 50 ml to your bag">{HERO.cta}</PrimaryButton>
              </div>
              <a data-ui href="#story" className="flex flex-col items-center gap-2 text-ivory max-lg:hidden" data-cursor="link">
                <span aria-hidden="true" className="relative block h-[30px] w-[20px] rounded-full border border-ivory/80">
                  <span className="wheel-dot absolute top-[6px] left-1/2 h-[6px] w-[2px] -translate-x-1/2 rounded-full bg-ivory" />
                </span>
                <span className="label text-[12px]">{HERO.scroll}</span>
              </a>
            </div>

            <div data-ui className="flex flex-col items-center gap-3 max-lg:hidden lg:items-end">
              <div className="flex items-center gap-4">
                <div className="flex">
                  {HERO.avatars.map((a, i) => (
                    <Image key={a.src} src={asset(a.src)} alt={a.alt} width={48} height={48} sizes="96px" className={`h-12 w-12 rounded-full object-cover ring-2 ring-ivory ${i ? "-ml-3.5" : ""}`} />
                  ))}
                </div>
                <span className="text-[28px] leading-none font-semibold text-ivory">{HERO.proof.count}</span>
              </div>
              <p className="label text-right text-[12.5px] text-ivory">{HERO.proof.caption[0]}<br />{HERO.proof.caption[1]}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
