/*
 * Real people + photos scraped from the club's live site
 * (https://racsukedhara.vercel.app/) on 18 Sep 2026.
 * Images live in /media/sukedhara/.
 */
const P = '/media/sukedhara/';

export const BOARD = [
  { name: 'Mohit Bajracharya', role: 'President', img: `${P}more-heat.jpg` },
  { name: 'Krish Maharjan', role: 'Vice President', img: `${P}krish.jpg` },
  { name: 'Prasanna Shakya', role: 'Secretary', img: `${P}prasanna.png` }
];

export const PRESIDENTS = [
  { name: 'Rtr. Resh Raj Pokharel', term: 'RY 2019-20', img: `${P}resh.jpg` },
  { name: 'Rtr. Chandra Bhakta Adhikari', term: 'RY 2020-21', img: `${P}chandra.jpg` },
  { name: 'Rtr. Rajesh Parajuli', term: 'RY 2021-22', img: `${P}rajesh.jpg` },
  { name: 'Rtr. Shreya Wagle', term: 'RY 2022-23', img: `${P}shreya.jpg` },
  { name: 'Rtr. Ramesh Baral', term: 'RY 2023-24', img: `${P}ramesh.jpg` },
  { name: 'Rtr. Rajay Bajracharya', term: 'RY 2024-25', img: `${P}rajay.png` },
  { name: 'Rtr. Sushovan Shakya', term: 'RY 2025-26', img: `${P}sushovan.jpg` },
  { name: 'Rtr. Mohit Bajracharya', term: 'RY 2026-27', img: `${P}more-heat.jpg`, current: true }
];

export const LOGOS = {
  white: `${P}logo-white.png`,
  alt: `${P}logo-alt.png`,
  wheel: `${P}rotaract-logo.png`
};

/* Official board lineup (club_profiles, live DB). */
export const BOARD_FULL = [
  { name: 'Rtr. Mohit Muni Bajracharya', role: 'President', img: `${P}bod-sukedhara-1-533f4f04.jpg` },
  { name: 'Rtr. Prasanna Shakya', role: 'Secretary', img: `${P}bod-sukedhara-2-a54a65f7.jpg` },
  { name: 'Rtr. Sobika Shrestha', role: 'Treasurer', img: `${P}bod-sukedhara-3-41c0cdd7.jpg` },
  { name: 'Rtr. Krish Maharjan', role: 'Vice President', img: `${P}bod-sukedhara-4-2c72a06a.jpg` },
  { name: 'Rtr. Swikrit Nepal', role: 'Joint Secretary', img: `${P}bod-sukedhara-5-5288c87b.jpg` },
  { name: 'Rtr. Sushovan Shakya', role: 'IPP / Foundation Chair', img: `${P}bod-sukedhara-6-93da9d96.jpg` },
  { name: 'Rtr. Manila Magar', role: 'Club Administration Director', img: `${P}bod-sukedhara-7-7434a6b5.jpg` },
  { name: 'Rtr. Jenisha Joshi', role: 'Public Image Director', img: `${P}bod-sukedhara-8-33932d8b.jpg` },
  { name: 'Rtr. Alisha Ghimire', role: 'Membership Development Director', img: `${P}bod-sukedhara-9-3ba47ef0.jpg` },
  { name: 'Rtr. Sejeena Pradhan', role: 'Service Project Director', img: `${P}bod-sukedhara-10-1dbf5610.jpg` },
  { name: 'Rtr. Muna Gautam', role: 'International Service Director', img: `${P}bod-sukedhara-11-e9c4f981.jpg` },
  { name: 'Rtr. Sujan Pradhan', role: 'Sergeant-at-Arms', img: `${P}bod-sukedhara-12-ed128170.jpg` },
  { name: 'Rtr. Chandra Bhakta Adhikari', role: 'Club Advisor', img: `${P}bod-sukedhara-13-bb9ba885.jpg` }
];

/* Projects run by the club (live DB, newest first). */
export const PROJECTS = [
  { title: 'ESRAG Grant: Waste Segregation & WASH Awareness Program', category: 'Environment', date: '2025-06-29', location: 'Shree Balkumari Secondary School, Sunakothi, Lalitpur', img: null },
  { title: 'Free Eye Camp at Shree Balkumari School', category: 'Health', date: '2025-05-30', location: 'Shree Balkumari School, Lalitpur', img: null },
  { title: 'Project TEACH: Feel it, Deal it, Heal it', category: 'Education', date: '2025-05-19', location: 'Trikon Public Secondary School, Kathmandu', img: null },
  { title: 'Club COTS', category: 'Leadership', date: '2025-05-06', location: 'Google Meet (Virtual)', img: null },
  { title: 'Library Set-up at The Orphans Home', category: 'Education', date: '2025-03-02', location: 'The Orphans Home, Nakkhu, Lalitpur', img: `${P}cover-library.jpg` },
  { title: 'Digital Privacy & Security Awareness Session', category: 'Professional Development', date: '2025-02-23', location: 'Google Meet (Virtual)', img: null },
  { title: 'Changing the Narrative on Suicide', category: 'Health', date: '2024-09-10', location: 'Google Meet (Virtual)', img: null },
  { title: 'Gift of Hope 2.0: Stationery Donation to Shree Hira Devi School', category: 'Education', date: '2024-08-23', location: 'Shree Hira Devi School, Melamchi', img: null },
  { title: 'Making & Distribution of Reusable Menstrual Pads', category: 'Health', date: '2024-08-23', location: 'Shree Hira Devi Basic School, Melamchi / Shree Sitaldevi Secondary School, Sindhupalchok', img: null }
];

export const QUICK_FACTS = [
  ['Sponsoring Rotary Club', 'Rotary Club of Nagarjun'],
  ['Meeting Schedule', 'Saturday · 10:00 AM (Morning)'],
  ['Interact Club', 'N/A'],
  ['International Twin', 'N/A'],
  ['Inactive Members on Record', '68'],
  ['Contact Email', 'sukedhara@rotaract3292.org'],
  ['Alternate Email', 's.sukedhara@rotaract3292.org'],
  ['Zone', 'Zone VII, District 3292'],
  ['Charter Date', '1 Jul 2019']
];
