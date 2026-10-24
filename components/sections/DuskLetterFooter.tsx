"use client";

import { useRef, useState } from "react";
import { gsap, SplitText, MQ, useGSAP } from "@/lib/gsap";
import { FOOTER, IMG } from "@/lib/content";
import { Photo } from "@/components/ui/Photo";
import { PetalMark } from "@/components/ui/PetalMark";
import { scrollToTarget } from "@/components/ui/SmoothScroll";

export function DuskLetterFooter() {
  const root = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const word = q("[data-giant]")[0];
        const split = SplitText.create(word, { type: "chars" });
        const st = { trigger: q("[data-letter-band]"), start: "top bottom", end: "bottom bottom", scrub: true };
        // rise only: animating letter-spacing made the whole word grow and shrink while scrolling
        gsap.fromTo(word, { yPercent: 40 }, { yPercent: 0, ease: "none", scrollTrigger: st });
        gsap.fromTo(split.chars, { y: (i) => 30 + (i % 3) * 18 }, { y: 0, ease: "none", stagger: 0.04, scrollTrigger: st });
      });
    },
    { scope: root },
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter an email like name@example.com");
      return;
    }
    setError("");
    setDone(true);
  };

  return (
    <div ref={root}>
      <section id="contact" aria-labelledby="letter-title" className="on-dark relative overflow-hidden bg-night">
        <Photo src={IMG.footer} alt="" sizes="100vw" className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(10,30,35,.55)] via-transparent to-night" />

        <div className="relative px-[var(--gutter)] pt-[clamp(110px,14vw,200px)] text-center">
          <p className="label text-amber-glow">The Dusk Letter</p>
          <h2 id="letter-title" className="h2 mt-5">
            New scents, <em>first.</em>
          </h2>
          <p className="mx-auto mt-6 max-w-[46ch] text-ivory/85">Early access to releases, notes from the harvest, and 10% off your first order. One email a month.</p>

          <div className="mx-auto mt-10 max-w-[560px]" aria-live="polite">
            {done ? (
              <p className="glass rounded-full px-6 py-4 font-semibold text-ivory">You&apos;re on the list. Check your inbox for your 10% code.</p>
            ) : (
              <form onSubmit={submit} noValidate className="flex flex-col gap-3 sm:flex-row">
                <label htmlFor="letter-email" className="sr-only">Email address</label>
                <input
                  id="letter-email"
                  type="email"
                  autoComplete="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={!!error}
                  aria-describedby={error ? "letter-error" : undefined}
                  className="glass h-14 w-full min-w-0 rounded-full sm:flex-1 px-6 text-[16px] text-ivory placeholder:text-ivory/60"
                />
                <button type="submit" className="btn-primary justify-between">
                  <span>Subscribe</span>
                  <span className="btn-dot" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M7 17 17 7M7 7h10v10" /></svg>
                  </span>
                </button>
              </form>
            )}
            {error && <p id="letter-error" className="mt-3 text-left text-[14px] text-amber-glow sm:pl-6">{error}</p>}
          </div>
        </div>

        <div data-letter-band className="relative mt-[clamp(60px,8vw,120px)] overflow-hidden">
          <p data-giant aria-hidden="true" className="text-center font-display text-[22vw] leading-[0.78] tracking-[0.02em] whitespace-nowrap text-ivory/90 select-none">OSMAYA</p>
        </div>
      </section>

      <footer className="bg-night text-ivory">
        <div className="container-x grid gap-12 border-t border-[var(--line-d)] py-16 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1.4fr]">
          <div>
            <div className="flex items-center gap-3">
              <PetalMark size={36} className="text-amber" />
              <span className="font-display text-[24px] font-medium tracking-[0.22em]">OSMAYA</span>
            </div>
            <p className="mt-5 max-w-[26ch] text-[15px] text-muted-d">Wear the hour before nightfall.</p>
          </div>
          {FOOTER.cols.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <h3 className="label text-muted-d">{c.title}</h3>
              <ul className="mt-5 flex flex-col gap-2.5">
                {c.links.map(([label, href]) => (
                  <li key={label}><a href={href} className="text-[15px] text-ivory/85 hover:text-ivory">{label}</a></li>
                ))}
              </ul>
            </nav>
          ))}
          <div>
            <h3 className="label text-muted-d">Visit</h3>
            <address className="mt-5 text-[15px] leading-relaxed text-ivory/85 not-italic">
              {FOOTER.address.map((l) => <span key={l} className="block">{l}</span>)}
              <span className="mt-3 block select-all text-amber-glow">{FOOTER.email}</span>
            </address>
          </div>
        </div>
        <div className="container-x flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line-d)] py-7 text-[14px] text-muted-d">
          <p>© 2026 OSMAYA Parfums</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li><a href="#top" className="hover:text-ivory">Privacy</a></li>
            <li><a href="#top" className="hover:text-ivory">Terms</a></li>
            {FOOTER.social.map((s) => <li key={s}><a href="#top" className="hover:text-ivory">{s}</a></li>)}
          </ul>
          <button type="button" onClick={() => scrollToTarget(0)} className="font-semibold text-ivory">Back to top ↑</button>
        </div>
      </footer>
    </div>
  );
}
