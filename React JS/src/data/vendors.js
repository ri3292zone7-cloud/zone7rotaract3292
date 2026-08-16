/*
 * ZONE 7 LOCAL VENDORS — directory of partner vendors featured in the store.
 * Add a new vendor by appending an object here, creating a vendor island build
 * (React JS/vendor-<id>.html + vite.vendor.config.js input), and linking it
 * via `page`. Every card in the store's "Our Local Vendors" section renders
 * automatically from this data.
 */

export const VENDORS = [
  {
    id: 'paws-nepal',
    name: 'Paws Nepal',
    shortName: 'Paws Nepal',
    tagline: 'A home away from home for your four-legged family.',
    desc: 'Pet boarding and day care in the heart of Kathmandu \u2014 day care, sleepovers and short or long stays wrapped in clean, quiet, comfortable care.',
    location: 'Kathmandu',
    club: 'Rotaract Club of New Road City Kathmandu',
    category: 'Pet boarding \u00b7 Day care',
    emoji: '\ud83d\udc3e',
    site: 'https://pawsnepal.com',
    instagram: 'https://www.instagram.com/pawsnepal',
    page: '/vendor/paws-nepal'
  },
  {
    id: 'mannka-creation',
    name: 'Mannka Creations',
    shortName: 'Mannka Creations',
    tagline: 'Fresh flowers, hand-wrapped bouquets and blooms for every occasion.',
    desc: 'A Kathmandu flower studio crafting bouquets, gift wraps and event florals \u2014 fresh stems, careful hands and a little bit of magic for every occasion.',
    location: 'Kathmandu',
    club: 'Rotaract Club of New Road City Kathmandu',
    category: 'Flowers \u00b7 Gifts',
    emoji: '\ud83c\udf38',
    site: 'https://www.instagram.com/mannka_creation',
    instagram: 'https://www.instagram.com/mannka_creation',
    page: '/vendor/mannka-creation'
  },
  {
    id: 'studio-lumos',
    name: 'StudioLumos.np',
    shortName: 'StudioLumos.np',
    tagline: 'Custom stickers, anime posters, notebooks and frames \u2014 your ideas, printed beautifully.',
    desc: 'A creative sticker, frame and printing studio founded by Rtr. Saurav Singh in 2021. Custom stickers, anime posters, notebooks, frames and bulk printing \u2014 turn your ideas into high-quality, customized products.',
    location: 'Kathmandu',
    club: 'Rotaract Club of Tripureswor Kathmandu',
    category: 'Stickers \u00b7 Printing',
    emoji: '\ud83c\udf89',
    site: 'https://www.instagram.com/studiolumos.np/',
    instagram: 'https://www.instagram.com/studiolumos.np/',
    page: '/vendor/studio-lumos'
  },
  {
    id: 'shankharapur-pustak-pasal',
    name: 'Shree Shankharapur Pustak Pasal',
    shortName: 'Shree Shankharapur Pustak Pasal',
    tagline: 'Books, stationery and everything a student needs — in the heart of Sankhu.',
    desc: 'The neighbourhood book and stationery shop of Shankharapur-6 — textbooks, storybooks, pens, notebooks, school supplies and quick copies, served with 10% off for every Rotaractor.',
    location: 'Shankharapur-6, Sankhu',
    club: 'Rotaract Club of Sankhu',
    category: 'Books \u00b7 Stationery',
    emoji: '\ud83d\udcda',
    site: 'https://www.facebook.com/shankharapurbook',
    facebook: 'https://www.facebook.com/shankharapurbook',
    instagram: '',
    page: '/vendor/shankharapur-pustak-pasal'
  }
];

/* Ghost card slots shown for vendors that join later. */
export const VENDOR_SLOTS = 1;

export function vendorPagePath(id) {
  const v = VENDORS.find((x) => x.id === id);
  return v ? v.page : null;
}
