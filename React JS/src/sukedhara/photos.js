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
