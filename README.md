# OSMAYA

A 15-section parallax homepage for OSMAYA, a fictional fragrance house built around sun-picked osmanthus — *Wear the hour before nightfall.*

**Live:** https://web-inference.github.io/osmaya/ · branded-bottle version: https://web-inference.github.io/osmaya/v2/

Built with Next.js 15 (App Router, static export), TypeScript, Tailwind CSS v4, GSAP (ScrollTrigger, SplitText, ScrambleText, Flip) and Lenis.

- First-visit preloader: the mark fills with amber as the hero loads
- Hero with seven parallax layers and mouse depth
- Pinned spotlight, horizontal collection, sticky craft steps, scroll-scrubbed reveals
- Scent Finder quiz, shop filters with Flip, cart, reviews slider, FAQ accordion, newsletter form
- Respects `prefers-reduced-motion`

```bash
npm install
npm run dev   # http://localhost:3110
```

Pushing to `main` deploys to GitHub Pages (`.github/workflows/pages.yml`).

Brand, products and people are invented; images are AI-generated for this project.
