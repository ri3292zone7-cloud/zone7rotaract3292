/*
 * Real Kathmandu Height data — pulled from the Zone 7 live database
 * (projects) and the club.html site record on 18 Sep 2026.
 * The Supabase club_profiles row has no board line-up on record yet, so
 * BOARD is empty: club officers can add itself via the Club Admin panel
 * and this page will pick it up (or drop a photo path here). All four
 * projects below are live records from the Zone 7 database.
 */

export const CLUB = {
  name: 'Rotaract Club of Kathmandu Height',
  short: 'Kathmandu Height',
  identity: 'The Rising Club',
  vision: 'Developing competent leaders for a brighter tomorrow.',
  ig: 'rackathmanduheight',
  igUrl: 'https://instagram.com/rackathmanduheight',
  emails: ['Kathmanduheight@rotaract3292.org'],
  venue: 'New Summit College, Basuki Marg, Baneshwar',
  fullLoc: 'New Summit College, Basuki Marg, Baneshwar, Kathmandu-31, Bagmati Province · Zone VII',
  meeting: 'Saturday · 10:00 AM',
  meetingLine: 'Every Saturday morning at 10:00 AM',
  founded: '6 January 2026',
  foundedDisplay: '6 Jan 2026',
  sponsor: 'Rotary Club of Kathmandu Height',
  twin: 'N/A',
  interact: 'N/A',
  active: '23',
  inactive: '0',
  events: '1',
  reports: '24',
  logo: '/media/logos/kathmanduheight.jpg',
  about:
    'The newest club in Zone 7, the Rotaract Club of Kathmandu Height was chartered on 6th January 2026 and is sponsored by the Rotary Club of Kathmandu Height. Based at New Summit College in Baneshwar, the club launched strong with 23 active members and no inactive members yet, a sign of an engaged founding cohort. In its first months it has already filed 24 reports. The club meets Saturday mornings at 10:00 AM and is guided by its vision of \u201cdeveloping competent leaders for a brighter tomorrow,\u201d with five founding goals spanning fellowship, leadership, community service, youth engagement and personal development.'
};

export const BOARD = [];

export const PROJECTS = [
  {
    title: 'Food Donation Program — Maghe Sankranti 2026',
    category: 'Special Area Projects',
    date: '16 Jan 2026',
    place: 'Nisaya Sewa Sadan, Shantinagar, Kathmandu',
    tag: 'The club\u2019s inaugural service project — traditional Maghe Sankranti food distributed to 55 elderly residents, just ten days after charter.',
    img: 'https://picsum.photos/seed/food-donation-maghe-sankranti-2026/900/560',
    body: 'Nine Rotaractors distributed Bhuja ko Laddu, Til ko Laddu and Chaku, while spending time in companionship and emotional support with the residents — fostering intergenerational bonding, cultural preservation and a strong foundation in Service Above Self. 1 other visitor took part over 4.5 hours, contributing 50 volunteering hours, with a total expense of NRs. 4,004.98.'
  },
  {
    title: 'Rotary Haat Bazaar',
    category: 'Collaboration · Partnership',
    date: '24 Jan 2026',
    place: 'Rotary Hall, Thapathali',
    tag: 'Participation in Nepal\u2019s first-ever Rotary Haat Bazaar promoting local entrepreneurship and small businesses.',
    img: 'https://picsum.photos/seed/rotary-haat-bazaar-2026/900/560',
    body: 'Members explored stalls, interacted with vendors, and learned about sustainable entrepreneurship and economic empowerment. A highlight was Rtr. Abhipsa Sharma, who presented her handmade jewelry and donated the proceeds to the club fund to support future community service initiatives. 4 other visitors took part over 2 days, contributing 100 volunteering hours.'
  },
  {
    title: 'Gift of Warmth — Warm Clothes Distribution 2026',
    category: 'Special Area Projects',
    date: '6 Feb 2026',
    place: 'Janjagriti Basic School & Mathura Pati HS, Kavre',
    tag: 'Two-day program distributing warm clothes, stationery, and sports materials to students across Kavre.',
    img: 'https://picsum.photos/seed/gift-of-warmth-clothes-distribution-2026/900/560',
    body: 'Part of the Nepal School Support Initiative \u201cGift of Warmth,\u201d organized by the Rotary Club of Kathmandu Height with support from the Rotary Club of Timmins\u2013Porcupine and Sanskriti Farms and Research Center. Rtr. Abhipsa Sharma led distribution activities and was honored by the schools for her dedication. 4 Rotarians and 4 other visitors took part over 2 days, contributing 32 volunteering hours.'
  },
  {
    title: 'Words Matter: Mastering Communication Etiquette',
    category: 'Public Speaking',
    date: '14 Mar 2026',
    place: 'Apex College, Mid-Baneshwor',
    tag: 'World Rotaract Week co-hosted session on professional communication, held with Tripureswor, Baneshwor and Sukedhara.',
    img: 'https://picsum.photos/seed/words-matter-communication-etiquette-2026/900/560',
    body: 'Facilitated by Mr. Ankush Adhikari, the session covered professional etiquette, communication in leadership and speaking with impact. As a newly chartered club, Kathmandu Height used the opportunity to build inter-club fellowship and gain experience in collaborative event organization. 20 Rotaractors and 1 other visitor took part over 3 hours, contributing 15 volunteering hours.'
  }
];

export const STATS = [
  { value: '23', label: 'Active members' },
  { value: '4', label: 'Projects logged' },
  { value: '24', label: 'Reports on file' },
  { value: '2026', label: 'Chartered · Jan 6' }
];

export const GOALS = [
  { t: 'Foster Fellowship and Lasting Connections', s: 'In progress' },
  { t: 'Develop Competent Leaders', s: 'In progress' },
  { t: 'Promote Meaningful Community Service', s: 'In progress' },
  { t: 'Empower Youth Through Learning and Engagement', s: 'In progress' },
  { t: 'Advance Professional and Personal Development', s: 'In progress' }
];

export const FACTS = [
  { k: 'Chartered', v: '6 January 2026' },
  { k: 'Sponsor', v: 'Rotary Club of Kathmandu Height' },
  { k: 'Members', v: '23 active · 0 inactive' },
  { k: 'Meeting', v: 'Every Saturday · 10:00 AM' },
  { k: 'Where', v: 'New Summit College, Baneshwar, Kathmandu-31' },
  { k: 'Instagram', v: '@rackathmanduheight' },
  { k: 'Email', v: 'Kathmanduheight@rotaract3292.org' },
  { k: 'Zone', v: 'Zone VII · District 3292' }
];