// Version 2 = the same site with branded bottle labels. Only these images change; everything else is shared with v1.
export const V2_FILES = [
  "/images/hero/hero-bottle.png",
  "/images/cards/collection-liquid-dusk.jpg",
  "/images/cards/collection-tidal-saffron.jpg",
  "/images/cards/collection-velvet-fig.jpg",
  "/images/cards/collection-white-ember.jpg",
  "/images/cards/collection-night-orchard.jpg",
  "/images/cards/shop-liquid-dusk.jpg",
  "/images/cards/shop-tidal-saffron.jpg",
  "/images/cards/shop-velvet-fig.jpg",
  "/images/cards/shop-white-ember.jpg",
  "/images/sections/faq-still-life.jpg",
  "/images/sections/discovery-set.jpg",
  "/images/sections/finder-bg.jpg",
];

export const toV2 = (src: string) => src.replace("/images/", "/images-v2/");
