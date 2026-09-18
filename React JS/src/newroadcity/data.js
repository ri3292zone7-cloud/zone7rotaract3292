/*
 * Real New Road City data — pulled from the Zone 7 live database
 * (club_profiles + projects) and the club.html site record on 18 Sep 2026.
 * Board photos live in /media/team-board/.
 */
const B = '/media/team-board/';

export const CLUB = {
  name: 'Rotaract Club of New Road City Kathmandu',
  short: 'New Road City',
  identity: 'The Heritage Club',
  ig: 'racnewroadcity1',
  igUrl: 'https://instagram.com/racnewroadcity1',
  emails: ['NewRoadCityKathmandu@rotaract3292.org', 'racnewroadcitykathmandu@gmail.com'],
  venue: 'New Road, Makkhan Tol, Yetkha, Kathmandu',
  fullLoc: 'New Road, Makkhan Tol, Yetkha, Kathmandu, Bagmati Province · Zone VII',
  meeting: 'Saturday · 10:30 AM',
  meetingLine: 'Every Saturday morning at 10:30 AM',
  founded: '1 September 2004',
  foundedDisplay: '1 Sep 2004',
  sponsor: 'Rotary Club of New Road City',
  interact: 'Interact Club of New Road City',
  active: '14',
  inactive: '180',
  events: '33',
  reports: '186',
  logo: '/media/logos/newroadcity.jpg',
  about:
    'One of the most established clubs in Zone 7, the Rotaract Club of New Road City Kathmandu was chartered on 1st September 2004 and is sponsored by the Rotary Club of New Road City. Based in the historic New Road / Makkhan Tol area of Kathmandu, the club has built a long track record with 33 events and 186 reports over two decades, and works alongside its own Interact Club of New Road City. Members meet Saturday mornings at 10:30 AM.'
};

export const BOARD = [
  { name: 'Smarika Amatya', role: 'President', img: `${B}bod-newroadcity-1-a3f568a4.jpg` },
  { name: 'Shreesti Bajracharya', role: 'Secretary', img: `${B}bod-newroadcity-2-ef4f70e1.jpg` },
  { name: 'Kritagya Maharjan', role: 'Treasurer', img: `${B}bod-newroadcity-3-7fca1a2b.jpg` },
  { name: 'Sujan Shakya', role: 'IPP · Club Service Chair', img: `${B}bod-newroadcity-4-3ecbf7e6.jpg` },
  { name: 'Ujjwal Manandhar', role: 'International Service Chair', img: `${B}bod-newroadcity-5-7d29ca8a.jpg` },
  { name: 'Sujal Khadka', role: 'Public Image Chair', img: `${B}bod-newroadcity-6-0735db3a.jpg` },
  { name: 'Prachi Sulpya', role: 'Committee Service Chair', img: `${B}bod-newroadcity-7-f8af1307.jpg` },
  { name: 'Sathyam Shakya', role: 'Professional Development Chair', img: `${B}bod-newroadcity-8-706c719d.jpg` }
];

export const PROJECTS = [
  {
    num: '01',
    title: 'Goodwill Visit & Letterhead Exchange',
    category: 'Fellowship',
    date: '6 Jun 2026',
    place: 'Lincoln College',
    tag: 'Goodwill visit and letterhead exchange with the Rotaract Club of Bagmati during a general meeting.'
  },
  {
    num: '02',
    title: 'Mental Health Awareness Program',
    category: 'Counseling',
    date: '25 Apr 2026',
    place: 'Liberty College',
    tag: 'Joint session on understanding mental health and wellbeing, with the Rotaract Clubs of Liberty College and Bagmati.'
  },
  {
    num: '03',
    title: 'Christmas Carnival',
    category: 'Fund Raising',
    date: '13 Dec 2025',
    place: 'Swad Garden',
    tag: 'Christmas-themed fellowship program run in collaboration with several Rotaract and Leo clubs.'
  },
  {
    num: '04',
    title: 'Tree Plantation',
    category: 'Environment',
    date: '29 Jul 2025',
    place: 'Tarkeshwor',
    tag: '200 trees planted in collaboration with the Rotary Club of New Road City at Tarkeshwor Nagarpalika.'
  }
];

export const STATS = [
  { value: '14', label: 'Active members' },
  { value: '33', label: 'Events logged' },
  { value: '186', label: 'Reports on file' },
  { value: '2004', label: 'Chartered · Sep 1' }
];

export const FACTS = [
  { k: 'Chartered', v: '1 September 2004' },
  { k: 'Sponsor', v: 'Rotary Club of New Road City' },
  { k: 'Interact', v: 'Interact Club of New Road City' },
  { k: 'Meeting', v: 'Every Saturday · 10:30 AM' },
  { k: 'Where', v: 'New Road, Makkhan Tol, Yetkha' },
  { k: 'Instagram', v: '@racnewroadcity1' }
];