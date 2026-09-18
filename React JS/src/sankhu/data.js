/*
 * Real Sankhu data — pulled from the Zone 7 live database
 * (club_profiles board + projects) and the club.html site record on 18 Sep 2026.
 * The club board carries no photos on record, so each officer has an empty
 * `photo` slot: drop a file into /media/sankhu/ and set the path here to
 * swap the initials avatar for a real portrait (no other change needed).
 */
const B = '';

export const CLUB = {
  name: 'Rotaract Club of Sankhu',
  short: 'Sankhu',
  identity: 'The Literacy Club',
  vision: 'Literate Sankhu',
  ig: 'racsankhu',
  igUrl: 'https://instagram.com/racsankhu',
  emails: ['sankhu@rotaract3292.org', 'Rotaractclubofsankhu@gmail.com'],
  venue: 'Sankhu, Shankharapur-07, Shankharapur, Kathmandu',
  fullLoc: 'Sankhu, Shankharapur-07, Shankharapur, Kathmandu, Bagmati Province · Zone VII',
  meeting: 'Wednesday · 5:00 PM',
  meetingLine: 'Every Wednesday evening at 5:00 PM',
  founded: '25 June 2020',
  foundedDisplay: '25 Jun 2020',
  sponsor: 'Rotary Club of Sankhu',
  twin: 'Rotaract Club of Kathmandu Metro',
  interact: 'Interact Club of Evergreen School',
  active: '19',
  inactive: '25',
  events: '17',
  reports: '178',
  logo: '/media/logos/sankhu.jpg',
  about:
    'Chartered on 25th June 2020 and sponsored by the Rotary Club of Sankhu, this club serves the historic town of Sankhu in Shankharapur, Kathmandu. Guided by Rotary International\u2019s ethos to \u201cserve to change lives,\u201d the club focuses on enhancing members\u2019 knowledge and skills so they can tackle societal issues through sustainable projects. Its central vision, \u201cLiterate Sankhu,\u201d reflects a strong focus on education in the local community, supported by its Interact partner, the Interact Club of Evergreen School, and twin club Rotaract Club of Kathmandu Metro. The club meets Wednesday evenings at 5:00 PM and has logged 17 events and 178 reports since chartering.'
};

export const BOARD = [
  { name: 'Binisha Shrestha', role: 'President', photo: `${B}` },
  { name: 'Lipee Shrestha', role: 'Vice President', photo: `${B}` },
  { name: 'Dipesh Shrestha', role: 'Secretary', photo: `${B}` },
  { name: 'Swornima K.C', role: 'Treasurer', photo: `${B}` },
  { name: 'Prasanna Shrestha', role: 'IPP', photo: `${B}` },
  { name: 'Rushma Shrestha', role: 'Joint Secretary', photo: `${B}` },
  { name: 'Roshika Shrestha', role: 'Joint Treasurer', photo: `${B}` },
  { name: 'Nilisha Shrestha', role: 'Sergeant-at-Arms', photo: `${B}` },
  { name: 'Subin Kuickel', role: 'Learning Facilitator', photo: `${B}` },
  { name: 'Bibek Desar', role: 'Service Chair', photo: `${B}` },
  { name: 'Amit K.C', role: 'International Chair', photo: `${B}` },
  { name: 'Prasansha Shrestha', role: 'Membership Chair', photo: `${B}` },
  { name: 'Anika Shrestha', role: 'Public Image', photo: `${B}` },
  { name: 'Bhupen Shrestha', role: 'Professional Development Chair', photo: `${B}` },
  { name: 'Krisha Shrestha', role: 'Club Administrative', photo: `${B}` },
  { name: 'Palistha Shrestha', role: 'Young Leader Contact', photo: `${B}` },
  { name: 'Subina Kuickel', role: 'TRF', photo: `${B}` },
  { name: 'Suraj Shrestha', role: 'Advisor', photo: `${B}` },
  { name: 'Dharma Bhakta Malla', role: 'Advisor', photo: `${B}` }
];

export const PROJECTS = [
  {
    title: 'Aama ko Chaya',
    category: 'Sanitation · Health',
    date: '31 Jul 2026',
    place: 'Bhagyodaya School',
    tag: 'Menstrual and maternal health awareness session for 50 class 10 students.',
    img: 'https://picsum.photos/seed/aama-ko-chaya-2026/900/560'
  },
  {
    title: 'Sitting Bench Distribution',
    category: 'Donation',
    date: '10 Apr 2026',
    place: 'Mahadevsthan',
    tag: 'Public bench installation project sponsored by the Rotary Club of Sankhu, in partnership with International Rotary.',
    img: 'https://picsum.photos/seed/sitting-bench-distribution-2026/900/560'
  },
  {
    title: 'AI and Agentic AI Workshop',
    category: 'Training · Workshops',
    date: '11 Nov 2025',
    place: 'Sakwo Campus',
    tag: 'Hands-on workshop on building autonomous AI agents, sponsored by the Rotary Club of Sankhu.',
    img: 'https://picsum.photos/seed/ai-agentic-ai-workshop-2025/900/560'
  }
];

export const STATS = [
  { value: '19', label: 'Active members' },
  { value: '17', label: 'Events logged' },
  { value: '178', label: 'Reports on file' },
  { value: '2020', label: 'Chartered · Jun 25' }
];

export const GOALS = [
  { t: 'Support Literacy Mission', s: 'In progress' },
  { t: 'Hello\u2019s Period', s: '75%' },
  { t: 'Membership Growth', s: 'In progress' }
];

export const FACTS = [
  { k: 'Chartered', v: '25 June 2020' },
  { k: 'Sponsor', v: 'Rotary Club of Sankhu' },
  { k: 'Twin club', v: 'Rotaract Club of Kathmandu Metro' },
  { k: 'Interact', v: 'Interact Club of Evergreen School' },
  { k: 'Meeting', v: 'Every Wednesday · 5:00 PM' },
  { k: 'Where', v: 'Sankhu, Shankharapur-07' },
  { k: 'Instagram', v: '@racsankhu' }
];