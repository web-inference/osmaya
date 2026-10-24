// Section screenshots at 4 widths. Usage: npm run dev (port 3110), then `npm run shots [-- 390,1440] [--reduce]`.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";

const BASE = process.env.BASE_URL ?? "http://localhost:3110";
const widthsArg = process.argv.slice(2).find((a) => /^\d/.test(a));
const WIDTHS = widthsArg ? widthsArg.split(",").map(Number) : [390, 768, 1024, 1440];
const REDUCE = process.argv.includes("--reduce");
const HEIGHT = { 390: 844, 768: 1024, 1024: 768, 1440: 900 };

// [name, selector, extra scroll as fraction of viewport (for pinned sections)]
const SECTIONS = [
  ["01-hero", "#top", 0],
  ["02-marquee", "[aria-label='Ingredients and promises']", -0.3],
  ["03-story", "#story", 0],
  ["04-spotlight-a", "[aria-labelledby='spot-title']", 0.6],
  ["04-spotlight-b", "[aria-labelledby='spot-title']", 2.2],
  ["05-notes", "#notes", 0.1],
  ["06-collection-a", "#collection", 0],
  ["06-collection-b", "#collection", 1.2],
  ["07-origins", "#origins", 0.1],
  ["08-craft-a", "#craft", 0.2],
  ["08-craft-b", "#craft", 2.0],
  ["09-finder", "#finder", 0],
  ["10-quote", "[aria-label=\"Founder's words\"]", 0],
  ["11-shop", "#shop", 0],
  ["12-discovery", "#discovery", 0.2],
  ["13-journal", "#journal", 0],
  ["14-faq", "#faq", 0],
  ["15-letter", "#contact", 0],
  ["16-footer", "footer", -0.4],
];

const out = fileURLToPath(new URL("./screenshots/", import.meta.url));
mkdirSync(out, { recursive: true });
const browser = await chromium.launch();

for (const w of WIDTHS) {
  const h = HEIGHT[w] ?? 900;
  const page = await browser.newPage({ viewport: { width: w, height: h }, reducedMotion: REDUCE ? "reduce" : "no-preference" });
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (overflow > 0) console.warn(`! ${w}px: horizontal overflow ${overflow}px`);
  for (const [name, sel, extra] of SECTIONS) {
    const top = await page.evaluate(([s, e]) => {
      const el = document.querySelector(s);
      if (!el) return null;
      const host = el.parentElement?.classList.contains("pin-spacer") ? el.parentElement : el;
      return host.getBoundingClientRect().top + window.scrollY + e * window.innerHeight;
    }, [sel, extra]);
    if (top === null) { console.warn(`missing ${sel}`); continue; }
    // walk there in steps so scrubbed/once triggers fire like a real scroll
    await page.evaluate(async (y) => {
      const from = window.scrollY, steps = 12;
      for (let i = 1; i <= steps; i++) { window.scrollTo(0, from + ((y - from) * i) / steps); await new Promise((r) => setTimeout(r, 40)); }
    }, Math.max(0, top));
    await page.waitForTimeout(1600);
    await page.screenshot({ path: `${out}${w}-${name}${REDUCE ? "-reduce" : ""}.png` });
  }
  await page.close();
  console.log(`done ${w}`);
}
await browser.close();
