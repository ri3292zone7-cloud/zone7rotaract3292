/*
 * Real Liberty College data — pulled from the Zone 7 live database
 * (projects) and the club.html site record on 18 Sep 2026.
 * Liberty has no board roster on record in the DB, so `BOARD` starts empty:
 * fill { name, role } entries here and the roster dock renders them.
 */
export const CLUB = {
  name: 'Rotaract Club of Liberty College',
  short: 'Liberty College',
  identity: 'The Empowerment Club',
  visionShort: 'Empower to Impact',
  ig: 'rotaractcluboflibertycollege',
  igUrl: 'https://instagram.com/rotaractcluboflibertycollege',
  emails: ['libertycollege@rotaract3292.org', 'raclibertycollege123@gmail.com'],
  venue: 'Liberty College, Buddha Nagar, Kathmandu-10',
  fullLoc: 'Liberty College, Shanti Binayak Marg, Pushpa Nagar, Buddha Nagar, Kathmandu-10, Bagmati Province · Zone VII',
  meeting: 'Tuesday · 12:00 PM',
  meetingLine: 'Every Tuesday at 12:00 PM',
  founded: '1 May 2012',
  foundedDisplay: '01 MAY 2012',
  sponsor: 'Rotary Club of Nagarjun',
  twin: 'Rotaract Club of Central Lumbini',
  interact: 'N/A',
  active: '21',
  inactive: '140',
  events: '45',
  reports: '304',
  logo: '/media/logos/liberty.jpg',
  vision:
    'To realize the spirit of \u201cEmpower to Impact\u201d by building an inclusive, innovative, and sustainable Rotaract Club where every member is empowered to lead with integrity, serve with purpose, and create lasting value for the community and future generations.',
  about:
    'A college-based club housed at Liberty College in Buddha Nagar, Kathmandu, the Rotaract Club of Liberty College is one of the longest-standing clubs in Zone 7, chartered on 1st May 2012 and sponsored by the Rotary Club of Nagarjun. Over more than a decade the club has run 45 events and filed 304 reports, and is twinned with the Rotaract Club of Central Lumbini. Members meet on Tuesdays around midday, and the club\u2019s guiding theme, \u201cEmpower to Impact,\u201d runs through its seven active goals.'
};

/* Officer roster on record — the live database has no names or photos yet.
   Add { name, role, photo } entries here (e.g. { name: 'Rtr. Anon', role: 'President',
   photo: '/media/liberty/anon.jpg' }) and the people grid renders real faces. */
export const BOARD = [];

export const PEOPLE = [
  { name: '', role: 'President', photo: '' },
  { name: '', role: 'Vice President', photo: '' },
  { name: '', role: 'Secretary', photo: '' },
  { name: '', role: 'Treasurer', photo: '' },
  { name: '', role: 'Service Chair', photo: '' },
  { name: '', role: 'Public Image', photo: '' },
  { name: '', role: 'Fellowship', photo: '' },
  { name: '', role: 'International Chair', photo: '' }
];

export const PROJECTS = [
  {
    title: 'Understanding Leftism & Feminism in Gen Z',
    category: 'Women Empowerment',
    date: '16 MAY 2026',
    place: 'Liberty College',
    img: 'https://picsum.photos/seed/leftism-feminism-gen-z-2026/900/560'
  },
  {
    title: 'High-Level Dialogue: Nepal–Japan Strategic Partnership',
    category: 'Fellowship',
    date: '25 APR 2026',
    place: 'Hotel Radisson, Kathmandu',
    img: 'https://picsum.photos/seed/nepal-japan-strategic-partnership-2026/900/560'
  },
  {
    title: 'Bonds Beyond Service',
    category: 'Felicitation',
    date: '04 APR 2026',
    place: 'Greenhouse Restaurant',
    img: 'https://picsum.photos/seed/bonds-beyond-service-2026/900/560'
  },
  {
    title: '\u201CKnow Your Teeth\u201D Dental Health Session',
    category: 'Dental Camp',
    date: '15 MAR 2026',
    place: 'Google Meet',
    img: 'https://picsum.photos/seed/know-your-teeth-dental-health-2026/900/560'
  },
  {
    title: 'Digital Empowerment for Young Minds',
    category: 'RNLM · Teach',
    date: '11 MAR 2026',
    place: 'Shree Manohora School, Duwakot, Bhaktapur',
    img: 'https://picsum.photos/seed/digital-empowerment-young-minds-2026/900/560'
  },
  {
    title: 'Equipment Handover: Kathmandu Valley Traffic Office',
    category: 'Partnership',
    date: '30 JAN 2026',
    place: 'Everest Hotel, Kathmandu',
    img: 'https://picsum.photos/seed/equipment-handover-traffic-office-2026/900/560'
  },
  {
    title: 'Rotary Regional Road Safety Symposium',
    category: 'Road Safety',
    date: '08 NOV 2025',
    place: 'Nepal House, Hattisar, Kathmandu',
    img: 'https://picsum.photos/seed/rotary-road-safety-symposium-2025/900/560'
  },
  {
    title: 'Community Clean-Up Drive',
    category: 'Cleaning Camp',
    date: '25 SEP 2025',
    place: 'Global Park, Kaushaltar & Ghordaura',
    img: 'https://picsum.photos/seed/local-cleanliness-initiative-2025/900/560'
  }
];

export const STATS = [
  { value: '45', label: 'Events logged' },
  { value: '304', label: 'Reports filed' },
  { value: '21', label: 'Active members' },
  { value: '2012', label: 'Chartered' }
];

export const GOALS = [
  { t: 'Build a stronger, more engaged, sustainable club.' },
  { t: 'Empower members with leadership, career, entrepreneurial skills.' },
  { t: 'Deliver sustainable projects for genuine community needs.' },
  { t: 'Expand global understanding through collaboration & exchange.' },
  { t: 'Create a thriving membership experience, recruitment to leadership.' },
  { t: 'Strengthen the Rotary–Rotaract partnership.' },
  { t: 'Build a professional, recognizable club brand.' }
];

export const FACTS = [
  { k: 'Chartered', v: '1 May 2012' },
  { k: 'Sponsor', v: 'Rotary Club of Nagarjun' },
  { k: 'Twin club', v: 'Rotaract Club of Central Lumbini' },
  { k: 'Meeting', v: 'Every Tuesday · 12:00 PM' },
  { k: 'Where', v: 'Liberty College, Buddha Nagar, Kathmandu-10' },
  { k: 'Instagram', v: '@rotaractcluboflibertycollege' }
];