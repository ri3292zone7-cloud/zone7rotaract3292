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
    name: 'PAWS \u2014 Play & Stay',
    shortName: 'Paws Nepal',
    tagline: 'A home away from home for your four-legged family.',
    desc: 'Pet boarding and day care in the heart of Kathmandu \u2014 day care, sleepovers and short or long stays wrapped in clean, quiet, comfortable care.',
    location: 'Kathmandu',
    category: 'Pet boarding \u00b7 Day care',
    emoji: '\ud83d\udc3e',
    site: 'https://pawsnepal.com',
    instagram: 'https://www.instagram.com/pawsnepal',
    page: '/React%20JS/dist-vendor-pawsnepal/vendor-pawsnepal.html'
  }
];

/* Ghost card slots shown for vendors that join later. */
export const VENDOR_SLOTS = 2;

export function vendorPagePath(id) {
  const v = VENDORS.find((x) => x.id === id);
  return v ? v.page : null;
}
