import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Mono, Manrope } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500"], style: ["normal", "italic"], variable: "--font-cormorant", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-manrope", display: "swap" });
const dmMono = DM_Mono({ subsets: ["latin"], weight: ["400"], variable: "--font-dmmono", display: "swap" });

const description = "Osmanthus, saffron and sandalwood, composed in Grasse. Wear the hour before nightfall.";

export const metadata: Metadata = {
  metadataBase: new URL("https://osmaya.co"),
  title: "OSMAYA — Liquid Dusk Eau de Parfum",
  description,
  openGraph: {
    title: "OSMAYA — Liquid Dusk Eau de Parfum",
    description,
    type: "website",
    images: [{ url: "/brand/og-image.jpg", width: 1024, height: 541, alt: "Liquid Dusk by OSMAYA on a mossy rock at dusk" }],
  },
  twitter: { card: "summary_large_image", title: "OSMAYA — Liquid Dusk Eau de Parfum", description, images: ["/brand/og-image.jpg"] },
};

export const viewport: Viewport = { themeColor: "#0A1E23" };

// Runs before first paint: show the preloader only on a visitor's first visit (and never with reduced motion).
// `?intro` forces it, handy for previewing.
const FIRST_VISIT = `try{var f=/[?&]intro\\b/.test(location.search);if(f||(!localStorage.getItem("osmaya-visited")&&!matchMedia("(prefers-reduced-motion: reduce)").matches)){document.documentElement.classList.add("is-loading")}}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${manrope.variable} ${dmMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: FIRST_VISIT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
