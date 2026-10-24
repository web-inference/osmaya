import { CartProvider } from "@/components/ui/CartContext";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { Cursor } from "@/components/ui/Cursor";
import { Preloader } from "@/components/ui/Preloader";
import { FloatingNav, MobileMenu } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { NotesMarquee } from "@/components/sections/NotesMarquee";
import { Manifesto } from "@/components/sections/Manifesto";
import { Spotlight } from "@/components/sections/Spotlight";
import { ScentPyramid } from "@/components/sections/ScentPyramid";
import { Collection } from "@/components/sections/Collection";
import { Origins } from "@/components/sections/Origins";
import { Craft } from "@/components/sections/Craft";
import { ScentFinder } from "@/components/sections/ScentFinder";
import { QuoteParallax } from "@/components/sections/QuoteParallax";
import { Bestsellers } from "@/components/sections/Bestsellers";
import { DiscoverySet } from "@/components/sections/DiscoverySet";
import { Testimonials } from "@/components/sections/Testimonials";
import { Faq } from "@/components/sections/Faq";
import { DuskLetterFooter } from "@/components/sections/DuskLetterFooter";

/** The whole homepage; /v2 renders the same thing with branded bottle images. */
export function Site() {
  return (
    <CartProvider>
      <a href="#main" className="sr-only-focusable fixed top-3 left-3 z-[100] rounded-full bg-ivory px-5 py-3 font-semibold text-ink">
        Skip to content
      </a>
      <Preloader />
      <SmoothScroll />
      <Cursor />
      <FloatingNav />
      <MobileMenu />
      <Hero />
      <main id="main">
        <NotesMarquee />
        <Manifesto />
        <Spotlight />
        <ScentPyramid />
        <Collection />
        <Origins />
        <Craft />
        <ScentFinder />
        <QuoteParallax />
        <Bestsellers />
        <DiscoverySet />
        <Testimonials />
        <Faq />
      </main>
      <DuskLetterFooter />
    </CartProvider>
  );
}
