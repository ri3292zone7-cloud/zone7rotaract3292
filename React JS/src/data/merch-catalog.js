/*
 * ZONE 7 STORE CATALOG — products, variants and prices (NPR).
 * Edit this file to publish new drops; every card re-renders automatically.
 */

export const STORE = {
  name: "Zone 7 Store",
  tagline: "Designed by the zone. Printed locally. Worn proudly.",
  whatsapp: "97798XXXXXXXX", // TODO: replace with the zone's real order line
  payChips: ["eSewa", "Khalti", "Cash · events", "Cards · soon"],
  deliveryNote:
    "Orders are confirmed on WhatsApp, then paid and collected at the next Zone 7 event or meetup — or delivered in the valley when agreed."
};

export const TEE_SIZES = ["S", "M", "L", "XL"];

export const CATALOG = [
  {
    id: "tee-black",
    kind: "tee",
    name: "Zone 7 Classic Tee — Black",
    tagline: "The zone on your chest. Heavy cotton, embroidered-ish Z7 print.",
    price: 800,
    color: "#17141F",
    colorName: "Black",
    ink: "#FFFFFF",
    sizes: TEE_SIZES,
    badge: "Best seller"
  },
  {
    id: "tee-white",
    kind: "tee",
    name: "Zone 7 Classic Tee — White",
    tagline: "Crisp white with the full-colour Zone 7 mark up front.",
    price: 800,
    color: "#FDFBF7",
    colorName: "White",
    ink: "#E11A6E",
    sizes: TEE_SIZES,
    badge: null
  },
  {
    id: "tee-navy",
    kind: "tee",
    name: "Zone 7 Classic Tee — Navy",
    tagline: "Deep navy, gold Z7 foil. Service above self, worn daily.",
    price: 800,
    color: "#232A4E",
    colorName: "Navy",
    ink: "#F2A900",
    sizes: TEE_SIZES,
    badge: null
  },
  {
    id: "badge-enamel",
    kind: "badge",
    name: "Zone 7 Enamel Badge",
    tagline: "Gold-rimmed enamel disc. The Zone 7 mark, pin-ready.",
    price: 250,
    color: "#E11A6E",
    colorName: "Magenta",
    sizes: [],
    badge: "Collector's"
  },
  {
    id: "pin-lapel",
    kind: "pin",
    name: "Zone 7 Lapel Pin",
    tagline: "Small pin, big pride — for blazers, bags and lanyards.",
    price: 150,
    color: "#F2A900",
    colorName: "Gold",
    sizes: [],
    badge: null
  },
  {
    id: "cap-navy",
    kind: "cap",
    name: "Zone 7 Cap — Navy",
    tagline: "Structured five-panel, embroidered Z7 front. Adjustable back.",
    price: 600,
    color: "#232A4E",
    colorName: "Navy",
    sizes: ["Free"],
    badge: "New drop"
  },
  {
    id: "cap-black",
    kind: "cap",
    name: "Zone 7 Cap — Black",
    tagline: "Shadow black with a tone-on-tone Z7 crest.",
    price: 600,
    color: "#17141F",
    colorName: "Black",
    sizes: ["Free"],
    badge: null
  },
  {
    id: "bottle-steel",
    kind: "bottle",
    name: "Zone 7 Coffee Mug",
    tagline: "Ceramic mug with the Z7 crest. Start the day in the zone.",
    price: 400,
    color: "#9AA5B1",
    colorName: "Mug",
    sizes: [],
    badge: "Hydrate in style"
  },
  {
    id: "bottle-magenta",
    kind: "bottle",
    name: "Zone 7 Steel Bottle — Magenta",
    tagline: "Same steel, painted in zone colours. Stay hydrated, stay zoned.",
    price: 400,
    color: "#C7457F",
    colorName: "Magenta",
    sizes: [],
    badge: null
  }
];

export const CATEGORIES = [
  {
    id: "tees",
    label: "Tees",
    title: "Wear the zone.",
    sub: "Heavyweight cotton tees printed and delivered by local Kathmandu studios. 3D mockups for every colourway.",
    tag: "3D mockups"
  },
  {
    id: "badges",
    label: "Badges & Pins",
    title: "Pin the zone.",
    sub: "Enamel badges and lapel pins cast with the Zone 7 mark — for blazers, bags, lanyards and bragging rights.",
    tag: "Enamel"
  },
  {
    id: "caps",
    label: "Caps",
    title: "Cap the look.",
    sub: "Structured five-panel caps with an embroidered Z7 front and an adjustable back that fits everyone.",
    tag: "Embroidered"
  },
  {
    id: "bottles",
    label: "Bottles",
    title: "Hydrate in the zone.",
    sub: "Double-walled steel bottles that keep chiya cold and zindaagi warm — with the Z7 crest on the side.",
    tag: "750 ml"
  }
];

export function money(n) {
  return "NPR " + Number(n).toLocaleString("en-IN");
}