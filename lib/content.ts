// Every string and data array on the OSMAYA homepage.

export const IMG = {
  sky: "/images/hero/hero-sky.jpg",
  ridge: "/images/hero/hero-ridge.png",
  bottle: "/images/hero/hero-bottle.png",
  branch: "/images/hero/hero-branch.png",
  foreground: "/images/hero/hero-foreground.png",
  petals: ["/images/decor/petal-1.png", "/images/decor/petal-2.png", "/images/decor/petal-3.png"],
  manifesto: "/images/sections/manifesto-hands.jpg",
  spotlight: "/images/sections/spotlight-bg.jpg",
  finder: "/images/sections/finder-bg.jpg",
  quote: "/images/sections/quote-parallax.jpg",
  discovery: "/images/sections/discovery-set.jpg",
  faq: "/images/sections/faq-still-life.jpg",
  footer: "/images/sections/footer-horizon.jpg",
} as const;

export const NAV_LINKS = [
  { label: "Our Story", href: "#story" },
  { label: "Collection", href: "#collection" },
  { label: "Scent Finder", href: "#finder" },
  { label: "Journal", href: "#journal" },
  { label: "Contact", href: "#contact" },
] as const;

export type ScentId = "liquid-dusk" | "tidal-saffron" | "velvet-fig" | "white-ember" | "night-orchard";

export type Scent = {
  id: ScentId;
  name: string;
  family: string;
  notes: [string, string, string];
  from: number;
  image: string;
  imageAlt: string;
  line: string;
};

export const SCENTS: Scent[] = [
  {
    id: "liquid-dusk", name: "Liquid Dusk", family: "Floral amber", notes: ["Bergamot", "Osmanthus", "Sandalwood"], from: 148,
    image: "/images/cards/collection-liquid-dusk.jpg",
    imageAlt: "Liquid Dusk bottle with amber liquid on a mossy rock beside osmanthus blossoms at dusk",
    line: "Apricot-scented osmanthus over warm sandalwood — the golden minute, bottled.",
  },
  {
    id: "tidal-saffron", name: "Tidal Saffron", family: "Marine spice", notes: ["Sea Salt", "Saffron", "Ambergris"], from: 148,
    image: "/images/cards/collection-tidal-saffron.jpg",
    imageAlt: "Tidal Saffron bottle with pale gold liquid on wet sea stones with saffron threads",
    line: "Salt air, a thread of saffron, and skin still warm from the sea.",
  },
  {
    id: "velvet-fig", name: "Velvet Fig", family: "Green woody", notes: ["Fig Leaf", "Cassis", "Cedar"], from: 176,
    image: "/images/cards/collection-velvet-fig.jpg",
    imageAlt: "Velvet Fig bottle with garnet liquid resting on fig leaves beside a split fig",
    line: "Crushed fig leaf and dark berries in a cedar-lined room.",
  },
  {
    id: "white-ember", name: "White Ember", family: "Soft incense", notes: ["Orange Blossom", "Frankincense", "Vanilla"], from: 148,
    image: "/images/cards/collection-white-ember.jpg",
    imageAlt: "White Ember bottle with champagne liquid on travertine with orange blossoms",
    line: "Orange blossom and the last curl of incense smoke in a quiet room.",
  },
  {
    id: "night-orchard", name: "Night Orchard", family: "Fruity chypre", notes: ["Pear", "Tuberose", "Patchouli"], from: 148,
    image: "/images/cards/collection-night-orchard.jpg",
    imageAlt: "Night Orchard bottle with cognac liquid beside pears and tuberose in moonlight",
    line: "Ripe pear and tuberose walking home through a dark orchard.",
  },
];

export const scentById = (id: ScentId) => SCENTS.find((s) => s.id === id)!;

export const HERO = {
  words: ["Liquid", "Dusk"] as const,
  features: [
    { lines: ["Sun-picked", "Osmanthus"], side: "left" as const },
    { lines: ["14-hour", "Sillage"], side: "right" as const },
  ],
  pillRows: [["Osmanthus", "Saffron", "Bergamot"], ["Suede", "Amber"]],
  cta: "Shop the Eau",
  scroll: "Scroll to unveil",
  proof: { count: "12K+", caption: ["Collectors who wear", "the hour before nightfall."] },
  avatars: [
    { src: "/images/people/avatar-01.jpg", alt: "Mei Lin Tan" },
    { src: "/images/people/avatar-02.jpg", alt: "Daniel Okafor" },
    { src: "/images/people/avatar-03.jpg", alt: "Priya Raman" },
  ],
};

export const MARQUEE = {
  notes: ["Osmanthus", "Saffron", "Calabrian Bergamot", "Mysore Sandalwood", "Suede", "Ambergris Accord"],
  claims: ["Vegan", "Cruelty-free", "22% perfume oil", "Composed in Grasse", "Refillable glass", "Carbon-neutral shipping"],
};

export const MANIFESTO = {
  label: "(01) Our Story",
  text: "We bottle the minute between sunset and night — when gardens exhale, the air turns gold, and every scent lands softer. OSMAYA began with one osmanthus tree in Guilin and a borrowed copper still in Grasse.",
  stats: [
    { value: 14, suffix: " h", text: "Average wear on skin, tested on 120 people" },
    { value: 22, suffix: "%", text: "Perfume oil in every Eau de Parfum" },
    { value: 38, suffix: "", text: "Hand-sourced raw materials, no fillers" },
  ],
  link: "Read the founder's letter",
  imageAlt: "Cupped hands holding freshly picked apricot osmanthus flowers in warm evening light",
};

export const SPOTLIGHT = {
  rail: ["0 min", "30 min", "5 h", "14 h"],
  notes: [
    { tier: "Top · 0–30 min", name: "Calabrian Bergamot", text: "A bright, bitter-sweet first breath, with pink pepper and mandarin." },
    { tier: "Heart · 30 min–5 h", name: "Sun-picked Osmanthus", text: "Apricot skin, black tea and soft suede. The reason this bottle exists." },
    { tier: "Base · 5–14 h", name: "Sandalwood & Ambergris", text: "Warm skin, a little salt, and a trail that stays into the night." },
  ],
  title: "Liquid Dusk · Eau de Parfum",
  sizes: [
    { ml: 50, price: 148 },
    { ml: 100, price: 210 },
  ],
};

export const PYRAMID = {
  sub: "Nine materials, each chosen for when it arrives and how long it stays.",
  tiers: [
    { label: "Top notes", notes: ["Calabrian Bergamot", "Pink Pepper", "Mandarin"], time: "0–30 min", image: "/images/cards/note-bergamot.jpg", alt: "Halved bergamot with a curl of zest", width: "lg:w-[60%]" },
    { label: "Heart notes", notes: ["Osmanthus Absolute", "Black Tea", "Apricot Skin"], time: "30 min–5 h", image: "/images/cards/note-osmanthus.jpg", alt: "Twig of apricot osmanthus flowers", width: "lg:w-[80%]" },
    { label: "Base notes", notes: ["Mysore Sandalwood", "Suede", "Ambergris Accord"], time: "5–14 h", image: "/images/cards/note-sandalwood.jpg", alt: "Sandalwood shavings with a thread of smoke", width: "lg:w-full" },
  ],
};

export const ORIGINS = {
  sub: "We buy direct from three growers and visit each harvest.",
  rows: [
    { place: "Guilin, China", coords: "25.27° N · 110.29° E", text: "Osmanthus, shaken from the branch by hand for two weeks each September, then pressed into absolute within the day.", chip: "400 kg blossoms → 1 L absolute", image: "/images/sections/origin-guilin.jpg", alt: "Osmanthus grove at dawn below misty karst peaks" },
    { place: "Calabria, Italy", coords: "38.10° N · 15.65° E", text: "Bergamot from terraced orchards above the Ionian sea, cold-pressed within six hours of picking.", chip: "Harvest: Nov–Feb", image: "/images/sections/origin-calabria.jpg", alt: "Terraced bergamot orchard sloping to the sea at golden hour" },
    { place: "Mysore, India", coords: "12.30° N · 76.64° E", text: "Sandalwood from replanted, certified estates, aged fifteen years before distillation.", chip: "FSC-certified estates", image: "/images/sections/origin-mysore.jpg", alt: "Sandalwood forest with a red earth path and shafts of morning light" },
  ],
};

export const CRAFT = [
  { n: "01", title: "Harvest", text: "At first light, before the sun burns the scent off the petals.", image: "/images/sections/craft-harvest.jpg", alt: "Hands shaking osmanthus blossoms onto a cotton sheet" },
  { n: "02", title: "Distill", text: "Slow copper distillation: 400 kg of blossoms for a single litre of absolute.", image: "/images/sections/craft-distill.jpg", alt: "Copper alembic still with amber distillate collecting in a flask" },
  { n: "03", title: "Blend", text: "Forty-one trials in Grasse before the formula was signed off.", image: "/images/sections/craft-blend.jpg", alt: "Perfumer's organ of amber vials with a pipette over a beaker" },
  { n: "04", title: "Age", text: "Rested eight weeks in glass so the notes can settle into each other.", image: "/images/sections/craft-age.jpg", alt: "Glass demijohns of amber liquid resting in a stone cellar" },
];

type Answer = { label: string; points: ScentId[] };
export const FINDER: { q: string; answers: Answer[] }[] = [
  { q: "When do you feel most like yourself?", answers: [
    { label: "Sunrise", points: ["white-ember", "tidal-saffron"] },
    { label: "Golden hour", points: ["liquid-dusk"] },
    { label: "Midnight", points: ["night-orchard", "velvet-fig"] },
  ] },
  { q: "Pick a texture.", answers: [
    { label: "Linen", points: ["white-ember"] },
    { label: "Velvet", points: ["velvet-fig", "liquid-dusk"] },
    { label: "Smoke", points: ["night-orchard"] },
  ] },
  { q: "Choose a place.", answers: [
    { label: "Sea cliffs", points: ["tidal-saffron"] },
    { label: "An orchard", points: ["night-orchard", "velvet-fig"] },
    { label: "An old library", points: ["liquid-dusk", "white-ember"] },
  ] },
];

export function scoreFinder(picks: number[]): ScentId {
  const score = new Map<ScentId, number>();
  picks.forEach((a, q) => FINDER[q]?.answers[a]?.points.forEach((id) => score.set(id, (score.get(id) ?? 0) + 1)));
  let best: ScentId = "liquid-dusk";
  let top = score.get("liquid-dusk") ?? 0;
  score.forEach((v, id) => { if (v > top) { top = v; best = id; } });
  return best;
}

export const QUOTE = { text: "“Perfume is the hour you choose to carry.”", by: "Inès Varela — Founder & Nose", alt: "Stone path through an osmanthus grove at dusk" };

export type Product = { id: string; scent: ScentId; name: string; type: "Eau de Parfum" | "Extrait"; ml: number; price: number; rating: string; reviews: string; image: string; alt: string };
export const PRODUCTS: Product[] = [
  { id: "ld-100", scent: "liquid-dusk", name: "Liquid Dusk", type: "Eau de Parfum", ml: 100, price: 210, rating: "4.9", reviews: "1,284", image: "/images/cards/shop-liquid-dusk.jpg", alt: "Liquid Dusk 100 ml bottle on sand backdrop" },
  { id: "ts-50", scent: "tidal-saffron", name: "Tidal Saffron", type: "Eau de Parfum", ml: 50, price: 148, rating: "4.8", reviews: "912", image: "/images/cards/shop-tidal-saffron.jpg", alt: "Tidal Saffron 50 ml bottle on sand backdrop" },
  { id: "vf-50", scent: "velvet-fig", name: "Velvet Fig", type: "Extrait", ml: 50, price: 176, rating: "4.9", reviews: "640", image: "/images/cards/shop-velvet-fig.jpg", alt: "Velvet Fig Extrait 50 ml bottle on sand backdrop" },
  { id: "we-100", scent: "white-ember", name: "White Ember", type: "Eau de Parfum", ml: 100, price: 210, rating: "4.7", reviews: "538", image: "/images/cards/shop-white-ember.jpg", alt: "White Ember 100 ml bottle on sand backdrop" },
];

export const DISCOVERY = {
  body: "Five 2 ml vials of the whole collection — about ten wears each. Your $38 comes back as credit on any full bottle within 60 days.",
  list: ["All five scents, 2 ml each", "$38 credited to your first full bottle", "Free shipping, ships in 24 h"],
  cta: "Get the set — $38",
  note: "Free samples with every order over $120",
  alt: "Open teal gift box with five glass vials of perfume and osmanthus blossoms",
};

export const TESTIMONIALS = [
  { quote: "It smells like the last warm evening of summer. Strangers stop me to ask what I'm wearing.", name: "Mei Lin Tan", city: "Singapore", product: "Liquid Dusk", avatar: "/images/people/avatar-01.jpg" },
  { quote: "Eleven hours on my skin and still there at dinner. It's become my signature.", name: "Daniel Okafor", city: "London", product: "Night Orchard", avatar: "/images/people/avatar-02.jpg" },
  { quote: "The osmanthus is real, not candy. Rare to find at this price.", name: "Priya Raman", city: "Toronto", product: "Liquid Dusk", avatar: "/images/people/avatar-03.jpg" },
  { quote: "I bought the Discovery Set and came back for Tidal Saffron a week later.", name: "Mateo Alvarez", city: "Madrid", product: "Tidal Saffron", avatar: "/images/people/avatar-04.jpg" },
];

export const PRESS = [
  { name: "Maison Review", cls: "font-display italic text-[28px]" },
  { name: "THE SCENT LEDGER", cls: "font-sans font-semibold tracking-[0.14em] text-[15px]" },
  { name: "NOIR Quarterly", cls: "font-display font-medium text-[26px]" },
  { name: "atelier weekly", cls: "font-mono text-[17px]" },
  { name: "Fragrantia", cls: "font-display italic text-[30px]" },
];

export const FAQ = [
  { q: "How long does OSMAYA last?", a: "Our Eaux de Parfum are 22% perfume oil. Most people get 10–14 hours on skin, and longer on fabric." },
  { q: "Is it vegan and cruelty-free?", a: "Yes. We use no animal-derived materials — our ambergris is a lab-made accord — and we never test on animals." },
  { q: "Can I refill my bottle?", a: "Every 100 ml flacon takes our 200 ml refill pouch. Send back empties for 15% off your next order." },
  { q: "Which scent should I start with?", a: "Try the Scent Finder above, or order the Discovery Set; its $38 is credited toward a full bottle." },
  { q: "How fast is shipping?", a: "Free carbon-neutral shipping over $120. 2–4 working days in the US and EU, 5–8 days elsewhere." },
  { q: "What if I don't love it?", a: "Return it within 30 days, even opened, for a full refund." },
];

export const FOOTER = {
  cols: [
    { title: "Shop", links: [["The Collection", "#collection"], ["Bestsellers", "#shop"], ["Discovery Set", "#discovery"], ["Refills", "#faq"], ["Gift cards", "#discovery"]] },
    { title: "House", links: [["Our Story", "#story"], ["Origins", "#origins"], ["Craft", "#craft"], ["Journal", "#journal"]] },
    { title: "Help", links: [["Shipping", "#faq"], ["Returns", "#faq"], ["FAQ", "#faq"], ["Contact", "#contact"]] },
  ] as { title: string; links: [string, string][] }[],
  address: ["Atelier OSMAYA", "14 Rue des Fleurs d'Oranger", "06130 Grasse"],
  email: "hello@osmaya.co",
  social: ["Instagram", "TikTok", "Pinterest"],
};
