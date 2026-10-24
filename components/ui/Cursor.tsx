"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/** Amber dot cursor; grows into a ring over links and a "Drag" disc over draggable areas. Fine pointers only. */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    const x = gsap.quickTo(el, "x", { duration: 0.25, ease: "power3.out" });
    const y = gsap.quickTo(el, "y", { duration: 0.25, ease: "power3.out" });
    gsap.set(el, { autoAlpha: 0 });
    const move = (e: PointerEvent) => {
      gsap.set(el, { autoAlpha: 1 });
      x(e.clientX);
      y(e.clientY);
      const t = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor], a, button, label, input");
      el.dataset.state = t?.dataset.cursor === "drag" ? "drag" : t ? "link" : "";
    };
    const leave = () => gsap.set(el, { autoAlpha: 0 });
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  });

  return (
    <div ref={ref} className="cursor" aria-hidden="true">
      <span>Drag</span>
    </div>
  );
}
