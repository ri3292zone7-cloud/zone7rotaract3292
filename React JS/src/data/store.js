export const SITE = {
  name: "Zone 7 Rotaract",
  shortName: "Zone 7",
  district: "Rotaract District 3292 Nepal-Bhutan",
  region: "Kathmandu Valley",
  tagline: "The Vision is Clear. The Mission is Ours. The Future is Together.",
  resourcesUrl: "https://zone7rotaract3292.vercel.app/guides.html"
};

export const MAGAZINE = {
  id: "magazine",
  kind: "magazine",
  name: "Zonal Magazine 2024-25",
  badge: "Featured drop",
  price: 0,
  priceLabel: "FREE",
  priceNote: "for every Rotaractor in the zone",
  tagline: "The collected voice of Zone 7.",
  desc: "40 pages of service stories, club spotlights, fellowship highlights and the moments that made the year — the magazine the whole zone writes together.",
  bullets: [
    "40 pages of stories from all 9 clubs in the valley",
    "Flip through it online like a real book",
    "PDF download for printing and sharing"
  ],
  icon: "📖",
  accent: "#E11A6E",
  accent2: "#F2A900",
  edition: "2024-25 Edition",
  file: "/media/magazine/zonal-magazine.pdf",
  pdfName: "Zonal Magazine 2024-25.pdf",
  flip: true
};

export const PRODUCTS = [MAGAZINE];

export const COMING_SOON = [
  { icon: "🧢", name: "Zone 7 Merch", desc: "Tees, caps and accessories — designed by the zone, printed locally." },
  { icon: "📦", name: "Products", desc: "Lookbooks and brochures for projects, sponsors and partners." },
  { icon: "📣", name: "Announcements", desc: "Official releases and notices from Zone 7 leadership." },
  { icon: "🚀", name: "Asset Launches", desc: "Brand kits, logos and creative assets ready to use." }
];

export const HOW_IT_WORKS = [
  { num: "01", icon: "🛍️", title: "Pick your drop", desc: "Browse the store for live merch and products. Each drop shows its price in NPR and exactly what you're getting." },
  { num: "02", icon: "💬", title: "Order & confirm", desc: "Add items to your cart and check out — your order lands straight in our WhatsApp. We confirm size, stock and pickup." },
  { num: "03", icon: "💸", title: "Pay & collect", desc: "Settle with eSewa, Khalti or cash at the next Zone 7 event or meetup. Receipt, sticker, done — that's it." }
];

export const PAY_CHIPS = ["eSewa", "Khalti", "Cash · events", "Cards · soon"];

export const HERO_STATS = [
  { id: "drops", num: "1", lab: "Live drops on the shelf" },
  { id: "pages", num: "40", lab: "Pages in the Zonal Magazine" },
  { id: "clubs", num: "9", lab: "Clubs across the Kathmandu Valley" },
  { id: "pay", small: true, num: "eSewa · Khalti · Cash", lab: "Pay your way at any Zone 7 event" }
];

export const MARQUEE_ITEMS = [
  "Zonal Magazine 2024-25",
  "Service",
  "Fellowship",
  "Leadership",
  "9 Clubs",
  "One Voice",
  "Read it like a real book"
];

/*
 * PUBLISH A NEW DROP:
 *   1. Drop the PDF into public/ (e.g. public/magazine/)
 *   2. Add one entry to PRODUCTS in this file — a shop card + (optionally)
 *      a flip book tab appear automatically. Price > 0 enables the cart +
 *      WhatsApp order.
 *   3. Replace WHATSAPP_NUMBER with the zone's order line.
 */
export const WHATSAPP_NUMBER = "97798XXXXXXXX";

export function money(n) {
  return "NPR " + Number(n).toLocaleString("en-IN");
}

export function formatBytes(b) {
  const mb = b / 1048576;
  return mb > 1 ? mb.toFixed(1) + " MB" : Math.round(b / 1024) + " KB";
}
