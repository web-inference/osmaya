"use client";

import { useEffect, useRef, useState } from "react";
import { Heart, Home, Menu, ShoppingBag, X } from "lucide-react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { NAV_LINKS } from "@/lib/content";
import { PetalMark } from "@/components/ui/PetalMark";
import { IconCircle } from "@/components/ui/buttons";
import { useCart } from "@/components/ui/CartContext";

const openMenu = () => window.dispatchEvent(new Event("osmaya:menu"));

function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <a href="#top" className="flex items-center gap-3 text-ivory" aria-label="OSMAYA home" data-cursor="link">
      <PetalMark size={compact ? 30 : 40} className="text-amber" />
      <span className={`font-display font-medium tracking-[0.22em] ${compact ? "text-[22px]" : "text-[26px] lg:text-[28px]"}`}>OSMAYA</span>
    </a>
  );
}

function CartCount() {
  const { count, pulse } = useCart();
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!pulse || !ref.current) return;
    gsap.fromTo(ref.current, { scale: 1 }, { scale: 1.25, duration: 0.2, ease: "back.out(1.6)", yoyo: true, repeat: 1 });
  }, [pulse]);
  return (
    <span ref={ref} className="label inline-block origin-center text-ivory" aria-live="off">
      Cart ({count})
    </span>
  );
}

function Actions() {
  return (
    <div className="flex items-center gap-3">
      <IconCircle label="Wishlist" className="hidden lg:grid">
        <Heart size={20} strokeWidth={1.5} aria-hidden="true" />
      </IconCircle>
      <a href="#shop" className="icon-circle glass" aria-label="Bag" data-cursor="link">
        <ShoppingBag size={20} strokeWidth={1.5} aria-hidden="true" />
      </a>
      <span className="hidden sm:inline">
        <CartCount />
      </span>
      <IconCircle label="Open menu" className="xl:hidden" onClick={openMenu}>
        <Menu size={20} strokeWidth={1.5} aria-hidden="true" />
      </IconCircle>
    </div>
  );
}

/** Nav row that lives inside the hero card. */
export function HeroNav() {
  return (
    <nav aria-label="Main" data-hero-nav className="absolute inset-x-0 top-0 z-30 flex h-[84px] items-center justify-between border-b border-[var(--line-d)] px-[4%] lg:h-[96px] lg:px-[3%]">
      <span data-nav-item><Wordmark /></span>
      <div data-nav-item className="glass absolute left-1/2 hidden -translate-x-1/2 items-center gap-1.5 rounded-[16px] p-1.5 xl:flex">
        <a href="#top" className="grid h-[44px] w-[48px] place-items-center rounded-[11px] bg-[rgba(247,240,230,.14)] text-ivory" aria-label="Home" data-cursor="link">
          <Home size={19} strokeWidth={1.5} aria-hidden="true" />
        </a>
        {NAV_LINKS.map((l) => (
          <a key={l.href} href={l.href} className="pill h-[44px] rounded-[11px] bg-[rgba(247,240,230,.07)] px-4 text-ivory hover:bg-[rgba(247,240,230,.18)] xl:px-5" data-cursor="link">
            {l.label}
          </a>
        ))}
      </div>
      <span data-nav-item><Actions /></span>
    </nav>
  );
}

/** Compact glass pill that takes over after the hero; hides on scroll down, returns on scroll up. */
export function FloatingNav() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = ref.current!;
    gsap.set(el, { yPercent: -160, autoAlpha: 0 });
    const show = () => gsap.to(el, { yPercent: 0, autoAlpha: 1, duration: 0.35, ease: "power3.out", overwrite: true });
    const hide = () => gsap.to(el, { yPercent: -160, autoAlpha: 0, duration: 0.35, ease: "power3.out", overwrite: true });
    ScrollTrigger.create({
      trigger: "#top",
      start: "bottom top",
      end: "max",
      onEnter: show,
      onLeaveBack: hide,
      onUpdate: (self) => (self.direction === 1 && Math.abs(self.getVelocity()) > 30 ? hide() : self.direction === -1 && show()),
    });
  });

  return (
    <div ref={ref} className="pointer-events-none fixed inset-x-0 top-[calc(12px+env(safe-area-inset-top,0px))] z-50 flex justify-center px-3 sm:top-4">
      <nav aria-label="Main (compact)" className="glass pointer-events-auto flex w-full max-w-[1100px] items-center justify-between gap-4 rounded-full bg-[rgba(10,30,35,.55)] py-1.5 pr-1.5 pl-5 xl:pr-6">
        <Wordmark compact />
        <div className="hidden items-center gap-1 xl:flex">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="pill h-10 px-4 text-ivory hover:bg-[rgba(247,240,230,.14)]" data-cursor="link">
              {l.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2 [&_.icon-circle]:h-11 [&_.icon-circle]:w-11">
          <Actions />
        </div>
      </nav>
    </div>
  );
}

/** Full-screen menu for <1024px. */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("osmaya:menu", onOpen);
    return () => window.removeEventListener("osmaya:menu", onOpen);
  }, []);

  useEffect(() => {
    if (!open || !ref.current) return;
    const root = ref.current;
    closeRef.current?.focus();
    const links = root.querySelectorAll("[data-menu-link]");
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.fromTo(links, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.06, duration: 0.7, ease: "expo.out" });
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab") {
        const f = root.querySelectorAll<HTMLElement>("a, button");
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;
  return (
    <div ref={ref} role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-[70] flex flex-col bg-deep px-6 pt-[calc(20px+env(safe-area-inset-top,0px))] pb-10">
      <div className="flex items-center justify-between">
        <Wordmark compact />
        <button ref={closeRef} type="button" aria-label="Close menu" className="icon-circle glass" onClick={() => setOpen(false)}>
          <X size={20} strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>
      <ul className="mt-14 flex flex-col gap-3">
        {[{ label: "Home", href: "#top" }, ...NAV_LINKS].map((l) => (
          <li key={l.href}>
            <a data-menu-link href={l.href} onClick={() => setOpen(false)} className="font-display text-[48px] leading-[1.1] text-ivory">
              {l.label}
            </a>
          </li>
        ))}
      </ul>
      <p className="label mt-auto text-muted-d">Wear the hour before nightfall.</p>
    </div>
  );
}
