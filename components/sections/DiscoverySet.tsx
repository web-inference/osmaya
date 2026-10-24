"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "@/lib/gsap";
import { DISCOVERY, IMG } from "@/lib/content";
import { Photo } from "@/components/ui/Photo";
import { PetalMark } from "@/components/ui/PetalMark";
import { PrimaryButton } from "@/components/ui/buttons";
import { useCart } from "@/components/ui/CartContext";

export function DiscoverySet() {
  const root = useRef<HTMLElement>(null);
  const { add } = useCart();

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const st = { trigger: q("[data-clip]"), start: "top 80%", end: "center center", scrub: true };
        gsap.fromTo(q("[data-clip]"), { clipPath: "circle(12% at 50% 50%)" }, { clipPath: "circle(75% at 50% 50%)", ease: "none", scrollTrigger: st });
        gsap.fromTo(q("[data-clip] [data-photo-inner]"), { scale: 1.2 }, { scale: 1, ease: "none", scrollTrigger: st });
        gsap.from(q("[data-text] > *"), { y: 30, autoAlpha: 0, stagger: 0.08, duration: 0.9, ease: "expo.out", scrollTrigger: { trigger: q("[data-text]"), start: "top 75%", once: true } });
      });
    },
    { scope: root },
  );

  return (
    <section id="discovery" ref={root} aria-labelledby="discovery-title" className="on-dark section-y bg-deep">
      <div className="container-x grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
        <div data-clip className="overflow-hidden rounded-[20px] lg:col-span-6">
          <Photo src={IMG.discovery} alt={DISCOVERY.alt} sizes="(min-width:1024px) 46vw, 100vw" className="aspect-[4/5] w-full" />
        </div>
        <div data-text className="lg:col-span-5 lg:col-start-8">
          <p className="label text-amber-glow">Discovery Set</p>
          <h2 id="discovery-title" className="h2 mt-5">
            Five evenings, <em>in your pocket.</em>
          </h2>
          <p className="mt-6 max-w-[44ch] text-ivory/80">{DISCOVERY.body}</p>
          <ul className="mt-8 flex flex-col gap-3">
            {DISCOVERY.list.map((l) => (
              <li key={l} className="flex items-center gap-3">
                <PetalMark size={18} ring={false} className="flex-none text-amber" />
                {l}
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <PrimaryButton onClick={() => add("Discovery Set")}>{DISCOVERY.cta}</PrimaryButton>
          </div>
          <p className="mt-4 text-[14px] text-muted-d">{DISCOVERY.note}</p>
        </div>
      </div>
    </section>
  );
}
