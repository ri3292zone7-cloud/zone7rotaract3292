import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import SiteShell from '../components/layout/SiteShell';

import assemblyCss from './tutorial-assembly.css?inline';
import bloodCss from './tutorial-blood.css?inline';
import boardCss from './tutorial-board.css?inline';
import drrCss from './tutorial-drr.css?inline';
import meetingsCss from './tutorial-meetings.css?inline';
import zrrCss from './tutorial-zrr.css?inline';

const I = {
  bell: (
    <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 4.5a5.5 5.5 0 00-5.5 5.5v3.2L5 16.5h14l-1.5-3.3V10A5.5 5.5 0 0012 4.5z" />
      <path d="M10 19.5a2 2 0 004 0" />
    </svg>
  ),
  agenda: (
    <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6.5 3h11A1.5 1.5 0 0119 4.5v16l-3.5-2.5L12 20.5l-3.5-2.5L5 20.5v-16A1.5 1.5 0 016.5 3z" />
      <path d="M8.5 8h7M8.5 12h7M8.5 16h4" />
    </svg>
  ),
  clip: (
    <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 13.5L20.5 3a1.9 1.9 0 012.7 2.7L12.7 16a4 4 0 01-5.7 0l-.2-.2a4 4 0 010-5.7l9.3-9.3A7.4 7.4 0 0012.8.5L4.6 8.6a7.4 7.4 0 000 10.5l.3.3a7.4 7.4 0 0010.5 0L21.7 13" transform="scale(0.8) translate(3 3)" />
      <path d="M8 6h10M12.7 2.7L15.6 5.6" opacity="0" />
    </svg>
  ),
  people: (
    <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6M9 3.5a3.4 3.4 0 110 6.8 3.4 3.4 0 010-6.8zM16 5.5a3.4 3.4 0 010 6.4M17.5 14.2c2.3.6 4 2.7 4 5.8" />
    </svg>
  ),
  pen: (
    <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  ),
  vote: (
    <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 3h6l4 4v14H5V7l4-4zM8 8h8M12 12l-2 2.5 2 2.5M12 12l2 2.5-2 2.5" />
    </svg>
  ),
  law: (
    <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3v18M8 21h8M7 7h10M5.5 4.5L7 7l-1.5 2.5M18.5 4.5L17 7l1.5 2.5" />
      <path d="M3 7h4M17 7h4" />
      <path d="M6 12h12" />
    </svg>
  ),
  coin: (
    <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v10M9.5 9.2c0-.9 1.1-1.6 2.5-1.6s2.5.7 2.5 1.6c0 1.2-2 1.4-2 3.1 0 1.1 1 1.6 2.2 1.6 1.1 0 2.1-.5 2.4-1.4M9.6 13.8c.4 1.2 1.5 1.8 2.7 1.9" />
    </svg>
  ),
};

const RI = {
  crown: (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 9l4 3 4-6 4 6 4-3-1.5 9h-13L4 9zM6.5 20h11" />
    </svg>
  ),
  spark: (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2l2 6.5L21 10l-7 2.5L12 19l-2-6.5L3 10l7-1.5L12 2zM19 17l.8 2.2L22 20l-2.2.8L19 23l-.8-2.2L16 20l2.2-.8L19 17z" />
    </svg>
  ),
  hand: (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9.5 11.5V4a1.7 1.7 0 013.4 0v6.5M12.9 10V2.8a1.7 1.7 0 013.4 0V11M16.3 12V4.6a1.7 1.7 0 013.4 0V14c0 3.6-2 5.5-5 6.3L12 21.5l-2.7-.8c-2.8-.7-4.6-2.4-5.6-5l-.9-2.5a1.8 1.8 0 013.3-1.2l.9 1.9V7.4a1.7 1.7 0 013.4 0v4.1" />
    </svg>
  ),
  pen: (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  ),
  coin: (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v10M9.5 9.2c0-.9 1.1-1.6 2.5-1.6s2.5.7 2.5 1.6c0 1.2-2 1.4-2 3.1 0 1.1 1 1.6 2.2 1.6 1.1 0 2.1-.5 2.4-1.4M9.6 13.8c.4 1.2 1.5 1.8 2.7 1.9" />
    </svg>
  ),
  grid: (
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </svg>
  ),
};
const ASSEMBLY = {
  slug: 'assembly',
  title: 'Assembly',
  crumb: 'Tutorial 01',
  eyebrow: 'Tutorial 01 \u00b7 The Big Meeting',
  tagline: 'Planning a club assembly? Good. This one walks you through a successful meeting from preparation to the final announcement.',
  img: { src: '/media/images/tutorial-assembly.png', alt: 'Flat illustration of a club assembly with raised hands and a speaker at the front' },
  badges: [
    { cls: 'hc1', d: 'M5 12.5l4.5 4.5L19 7.5', stroke: '#0E7490', width: '2.6', label: 'Plan' },
    { cls: 'hc2', d: 'M5 12.5l4.5 4.5L19 7.5', stroke: '#C2410C', width: '2.6', label: 'Run' },
    { cls: 'hc3', d: 'M5 12.5l4.5 4.5L19 7.5', stroke: '#166534', width: '2.6', label: 'Follow up' },
    { cls: 'hc4', d: 'M8 14L12 18L20 8', stroke: '#C2410C', width: '2.4', label: 'Minutes' },
  ],
  ticker: [
    'Assembly \u00b7 Club \u00b7 45\u201390 min',
    'General Body \u00b7 All Members \u00b7 In person',
    'Roles: Chair \u00b7 Secretary \u00b7 Treasurer',
    'Agenda \u00b7 Minutes \u00b7 Motions',
  ],
  sections: [
    {
      icon: I.bell,
      title: 'Prepare: know why you meet',
      intro: 'An assembly has one job: get the whole club in one room, share updates, and leave everyone clear on what comes next. That starts before anyone arrives.',
      steps: [
        { t: 'Set the date and announce it', d: 'Pick a date at least one week ahead. Announce it in the group chat, in the newsletter, and remind people 24 hours before. A good turn-out starts with good reminders.' },
        { t: 'Define the purpose', d: 'One sentence: "This assembly is about electing our directors." Knowing the purpose decides the agenda, the invite, and how long the meeting runs.' },
        { t: 'Prepare the room', d: 'Projector, laptop, agenda on the board, water, chairs. Small details make the meeting feel professional and show members you respect their time.' },
        { t: 'Delegate roles', d: 'Assign a timekeeper and a note-taker so the Chair can focus on leading the room.' },
      ],
      links: [],
      stat: null,
    },
    {
      icon: I.agenda,
      title: 'Build the agenda (and stick to it)',
      intro: 'The agenda is your road map. A meeting without one drifts. A meeting with a bloated one drowns.',
      steps: [
        { t: 'Keep it short', d: 'Six to eight items, max. If something can be handled in the group chat, it stays out of the assembly.' },
        { t: 'Order it wisely', d: 'Open with quick updates, place the decisions in the middle, and close with the action items and next steps. Save the heavy discussions for the middle where the energy is highest.' },
        { t: 'Share it in advance', d: 'Send the agenda with the reminder. Members who know what is coming prepare better questions and faster votes.' },
      ],
      links: [],
      stat: null,
    },
    {
      icon: I.clip,
      title: 'Run the meeting',
      intro: 'The Chair runs the room. The club follows the agenda. Everyone speaks, nobody rambles.',
      steps: [
        { t: 'Open on time', d: 'Start at the announced time. Latecomers adjust; the majority who arrived on time should never wait on a few.' },
        { t: 'State the objective', d: 'In your first sentence, restate why everyone is here. It frames the whole meeting.' },
        { t: 'One topic at a time', d: 'Keep discussions on the current agenda item. Park off-topic ideas in a "parking lot" list the Secretary notes down.' },
        { t: 'Keep the pace', d: 'The timekeeper flags when an item is running long. Move the conversation forward and schedule deep dives for a committee meeting.' },
        { t: 'End with clarity', d: 'Close by reading the decisions and action items out loud, with owners and deadlines. A meeting is only as good as its follow-up.' },
      ],
      links: [],
      stat: null,
    },
    {
      icon: I.people,
      title: 'Involve the general body',
      intro: 'An assembly is the one time the whole club can speak. Make it count.',
      steps: [
        { t: 'Open the floor', d: 'Give every member a chance to ask questions or raise concerns. The Chair invites questions, not volunteers to talk.' },
        { t: 'Encourage, don\u2019t force', d: 'New members may stay quiet. Ask them directly for their view on the lighter items so they build confidence.' },
        { t: 'Summarize the discussion', d: 'After each decision, the Chair repeats what was agreed so the Secretary records the right outcome.' },
      ],
      links: [],
      stat: null,
    },
    {
      icon: I.pen,
      title: 'Motion, debate, vote',
      intro: 'When the club needs to decide, use the motion cycle. It keeps decisions transparent and documented.',
      steps: [
        { t: 'One member proposes', d: 'A member stands and states the motion: "I move that we budget 10,000 \u20b9 for the September project."' },
        { t: 'A second supports it', d: 'A second member says "I second the motion." Without a second, the motion is not discussed.' },
        { t: 'Debate, briefly', d: 'The Chair opens the floor for and against. Each speaker keeps it to two minutes. The Chair may close the debate at any time.' },
        { t: 'Vote and record', d: 'The Chair calls the vote, the Secretary records the result, and the motion passes or fails. That is it, clean and documented.' },
      ],
      links: [],
      stat: null,
    },
    {
      icon: I.vote,
      title: 'Follow up after the meeting',
      intro: 'The real work starts after the last agenda item. Follow-up is what separates meetings that matter from meetings that were just nice.',
      steps: [
        { t: 'Send the minutes within 48 hours', d: 'Minutes are the club\u2019s memory. Send them while the meeting is still fresh. Include decisions, owners, and deadlines.' },
        { t: 'Assign owners and deadlines', d: 'Every action item gets a name and a date. The next meeting opens by checking the previous list.' },
        { t: 'Announce the outcome', d: 'Tell the wider circle what the club decided. Transparency builds trust and makes members want to show up again.' },
      ],
      links: [],
      stat: null,
    },
  ],
  related: [
    { tag: 'Tutorial 02', title: 'Blood Donation Camp', to: '/tutorial/blood', img: '/media/images/tutorial-blood.png', go: 'Open tutorial' },
    { tag: 'Tutorial 03', title: 'Board Meetings', to: '/tutorial/board', img: '/media/images/tutorial-board.png', go: 'Open tutorial' },
    { tag: 'Tutorial 04', title: 'DRR Visits', to: '/tutorial/drr', img: '/media/images/tutorial-drr.png', go: 'Open tutorial' },
    { tag: 'Tutorial 05', title: 'Meetings that Matter', to: '/tutorial/meetings', img: '/media/images/tutorial-meeting.png', go: 'Open tutorial' },
    { tag: 'Tutorial 06', title: 'ZRR Visits', to: '/tutorial/zrr', img: '/media/images/tutorial-zrr.png', go: 'Open tutorial' },
    { tag: 'Hub', title: 'All Six Tutorials', to: '/tutorials', img: '/media/images/tutorial-mascot.png', go: 'Open hub' },
  ],
  cta: {
    title: 'Next up: the camp that brings the whole community together.',
    text: 'From planning committee to thank-you notes, the Blood Donation Camp tutorial walks through every station and every rule.',
    btn: 'Next: Blood Donation Camp \u2192',
    to: '/tutorial/blood',
    img: '/media/images/tutorial-blood.png',
    alt: 'Illustration of a blood donation camp with donors and volunteers at stations',
  },
  note: (
    <p className="guide-note" style={{ backgroundColor: 'rgba(14,116,144,0.06)', borderLeft: '4px solid var(--tc)', padding: '10px 14px', borderRadius: '0 10px 10px 0', fontSize: '15px' }}>
      <strong style={{ color: 'var(--tc)' }}>Practical tip:</strong> the District Operations Manual and the Guide to Effective Meetings are part of the 6-month New Club Training. Read them together with this tutorial, and share the handbook page with your club\u2019s next secretary.
    </p>
  ),
  css: assemblyCss,
};

const BLOOD = {
  slug: 'blood',
  title: 'Blood Donation Camp',
  crumb: 'Tutorial 02',
  eyebrow: 'Tutorial 02 \u00b7 The Big Project',
  tagline: 'The District\u2019s flagship service event. From committee to thank-you notes, this tutorial covers the complete blueprint of a successful camp.',
  img: { src: '/media/images/tutorial-blood.png', alt: 'Flat illustration of a blood donation camp with a donor seated at a station and volunteers around' },
  badges: [
    { cls: 'hc1', d: 'M5 12.5l4.5 4.5L19 7.5', stroke: '#DC2626', width: '2.6', label: 'Plan' },
    { cls: 'hc2', d: 'M5 12.5l4.5 4.5L19 7.5', stroke: '#C2410C', width: '2.6', label: 'Partner' },
    { cls: 'hc3', d: 'M5 12.5l4.5 4.5L19 7.5', stroke: '#166534', width: '2.6', label: 'Run' },
    { cls: 'hc4', d: 'M8 14L12 18L20 8', stroke: '#C2410C', width: '2.4', label: 'Follow up' },
  ],
  ticker: [
    'Camp \u00b7 Club \u00b7 Full day',
    'Blood Bank \u00b7 Community \u00b7 Open to all',
    'Roles: Committee \u00b7 Volunteers \u00b7 First Aid',
    'Eligibility \u00b7 Donation \u00b7 Aftercare',
  ],
  sections: [
    {
      icon: I.law,
      title: 'Know the rules first',
      intro: 'Blood donation is health work, and health work runs on rules. Read them before you plan anything else.',
      steps: [
        { t: 'Blood is only drawn by certified staff', d: 'Only the blood bank\u2019s trained medical team may draw blood. Volunteers never touch a needle. This is non-negotiable.' },
        { t: 'The camp needs a licensed blood bank partner', d: 'A licensed blood bank (or hospital blood centre) issues the permission and provides the medical team, the bags, and the testing.' },
        { t: 'Every donor is screened first', d: 'Age, weight, and medical history are checked before donation. The camp cannot bypass these criteria for a "fuller" collection.' },
      ],
      links: [
        { label: 'NBTC guidelines on blood donation camps', href: 'https://www.nbtc.naco.gov.in/' },
        { label: 'National Blood Transfusion Council \u00b7 Official Portal', href: 'https://nbtc.naco.gov.in/' },
      ],
      stat: null,
    },
    {
      icon: I.people,
      title: 'Build the committee',
      intro: 'A camp is a team effort. Divide the work before the camp, not during it.',
      steps: [
        { t: 'Core committee', d: 'A chair, a co-chair, and a treasurer. They own the camp from start to finish.' },
        { t: 'Registration team', d: 'Two to three members who manage the donor list, the consent forms, and the queue.' },
        { t: 'Refreshments team', d: 'Donors need food and drinks after donating. Someone owns that.' },
        { t: 'First aid team', d: 'Two trained volunteers who keep an eye on donors and handle reactions.' },
        { t: 'Publicity team', d: 'The team that fills the camp: posters, social media, and school and college tie-ups.' },
      ],
      links: [],
      stat: { num: '6', unit: 'roles', caption: 'in a full camp committee, each with a clear owner' },
    },
    {
      icon: I.vote,
      title: 'Partner with a blood bank',
      intro: 'Your blood bank is your most important partner. Choose them early.',
      steps: [
        { t: 'Approach a licensed blood bank early', d: 'Book the date at least three weeks ahead. The medical team, the beds, and the collection target all depend on them.' },
        { t: 'Share the plan and get their checklist', d: 'The blood bank will hand you their requirements: hall size, water, power, tables, and privacy for the screening area.' },
        { t: 'Confirm the collection target', d: 'Agree on a realistic target for the day. A well-run camp that collects 60 units is better than a chaotic one that misses its target.' },
      ],
      links: [],
      stat: null,
    },
    {
      icon: I.clip,
      title: 'Publicity: fill the room before the day',
      intro: 'The best-run camp in the district is useless if nobody walks in. Publicity starts weeks before.',
      steps: [
        { t: 'Design one clear poster', d: 'Date, time, venue, and eligibility in big letters. One strong poster beats ten messy ones.' },
        { t: 'Use every channel', d: 'Club social media, WhatsApp groups, local newspapers, and notice boards in colleges and offices.' },
        { t: 'Ask for appointments', d: 'Let donors book a time slot. A filled schedule calms the crowd and helps the medical team plan.' },
        { t: 'Brief the team on eligibility', d: 'Every volunteer should be able to answer, "Can I donate?" with the official criteria.' },
      ],
      links: [],
      stat: null,
    },
    {
      icon: I.bell,
      title: 'The day itself',
      intro: 'A smooth camp runs on one principle: every donor knows what happens next.',
      steps: [
        { t: 'Open with the briefing', d: 'The medical team leads a short briefing before the first donor arrives. Volunteers learn their stations and the day\u2019s flow.' },
        { t: 'Registration first', d: 'Donors register, fill the consent form, and receive a token. The queue moves through registration to screening.' },
        { t: 'Screening before donation', d: 'The medical staff check each donor against the criteria. Rejected donors are counselled politely and offered juice anyway.' },
        { t: 'Station for donation', d: 'Beds with privacy. Donors rest for at least 15 minutes after donating and are monitored by the first aid team.' },
        { t: 'Refreshments and certificates', d: 'Every donor gets food, a drink, and a certificate. A donor who felt valued comes back next year.' },
      ],
      links: [],
      stat: null,
    },
    {
      icon: I.pen,
      title: 'After the camp',
      intro: 'The camp is measured after it ends.',
      steps: [
        { t: 'Clean-up and handover', d: 'Return the venue as you found it. Hand the collected units and records to the blood bank and get their sign-off.' },
        { t: 'Send thank-you notes', d: 'Thank the blood bank, the venue, and every donor within a week. It costs a little and buys a lot.' },
        { t: 'Publish the report', d: 'Share the numbers: units collected, donors screened, partners involved. It motivates the next camp and the next members.' },
      ],
      links: [],
      stat: null,
    },
  ],
  related: [
    { tag: 'Tutorial 01', title: 'Assembly', to: '/tutorial/assembly', img: '/media/images/tutorial-assembly.png', go: 'Open tutorial' },
    { tag: 'Tutorial 03', title: 'Board Meetings', to: '/tutorial/board', img: '/media/images/tutorial-board.png', go: 'Open tutorial' },
    { tag: 'Tutorial 04', title: 'DRR Visits', to: '/tutorial/drr', img: '/media/images/tutorial-drr.png', go: 'Open tutorial' },
    { tag: 'Tutorial 05', title: 'Meetings that Matter', to: '/tutorial/meetings', img: '/media/images/tutorial-meeting.png', go: 'Open tutorial' },
    { tag: 'Tutorial 06', title: 'ZRR Visits', to: '/tutorial/zrr', img: '/media/images/tutorial-zrr.png', go: 'Open tutorial' },
    { tag: 'Hub', title: 'All Six Tutorials', to: '/tutorials', img: '/media/images/tutorial-mascot.png', go: 'Open hub' },
  ],
  cta: {
    title: 'Next up: the meeting room where the club is actually run.',
    text: 'Quorum, roles, and the rhythm of a board that decides things. The Board Meetings tutorial makes the boardroom simple.',
    btn: 'Next: Board Meetings \u2192',
    to: '/tutorial/board',
    img: '/media/images/tutorial-board.png',
    alt: 'Illustration of a board meeting with a president and directors around a table',
  },
  note: (
    <p className="guide-note" style={{ backgroundColor: 'rgba(220,38,38,0.06)', borderLeft: '4px solid var(--tc)', padding: '10px 14px', borderRadius: '0 10px 10px 0', fontSize: '15px' }}>
      <strong style={{ color: 'var(--tc)' }}>Practical tip:</strong> start planning the camp at least a month before the date. The smoothest camps in the district are usually the ones that finished their paperwork first. Pair this tutorial with the Operations Handbook for the official service documentation requirements.
    </p>
  ),
  css: bloodCss,
};
const BOARD = {
  slug: 'board',
  title: 'Board Meetings',
  crumb: 'Tutorial 03',
  eyebrow: 'Tutorial 03 \u00b7 The Decision Room',
  tagline: 'The board runs the club. This tutorial covers the seats, the quorum, and the rhythm of a board meeting that actually decides things.',
  img: { src: '/media/images/tutorial-board.png', alt: 'Flat illustration of a board meeting with a president and four directors around a table' },
  badges: [
    { cls: 'hc1', d: 'M5 12.5l4.5 4.5L19 7.5', stroke: '#7C3AED', width: '2.6', label: 'Seats' },
    { cls: 'hc2', d: 'M5 12.5l4.5 4.5L19 7.5', stroke: '#C2410C', width: '2.6', label: 'Rhythm' },
    { cls: 'hc3', d: 'M5 12.5l4.5 4.5L19 7.5', stroke: '#166534', width: '2.6', label: 'Quorum' },
    { cls: 'hc4', d: 'M8 14L12 18L20 8', stroke: '#C2410C', width: '2.4', label: 'Agenda' },
  ],
  ticker: [
    'Board \u00b7 Club \u00b7 Monthly',
    'Executive Committee \u00b7 5 seats \u00b7 One vote each',
    'Roles: President \u00b7 Secretary \u00b7 Treasurer',
    'Quorum \u00b7 Agenda \u00b7 Minutes',
  ],
  sections: [
    {
      icon: I.people,
      title: 'Who sits on the board',
      intro: 'The board is the executive committee. Small, accountable, and full of owners.',
      roles: [
        { ico: RI.crown, name: 'President', focus: 'leads the board, sets the vision, owns the meeting' },
        { ico: RI.pen, name: 'Secretary', focus: 'records decisions, keeps the minutes and the calendar' },
        { ico: RI.coin, name: 'Treasurer', focus: 'manages the accounts and reports the money health' },
        { ico: RI.hand, name: 'Club Service Director', focus: 'plans internal activities and member wellbeing' },
        { ico: RI.spark, name: 'Community Service Director', focus: 'leads the service projects and their teams' },
        { ico: RI.grid, name: 'Members', focus: 'attend, speak, and vote at assemblies' },
      ],
      links: [],
      stat: { num: '5', unit: 'seats', caption: 'on a typical club board, plus the general body in assemblies' },
    },
    {
      icon: I.bell,
      title: 'The rhythm: monthly, in person',
      intro: 'The board meets at least once a month, in person when it can. This is the operating rhythm of a healthy club.',
      steps: [
        { t: 'Fixed monthly slot', d: 'Same date, same time, same place. When the board has a default slot, nobody chases anyone for a meeting.' },
        { t: 'Hybrid when needed', d: 'If a director is travelling, a video call joins them in. The meeting still happens.' },
        { t: 'Annual calendar', d: 'Lock the major events into the calendar at the start of the year: assemblies, camps, district events, board dates.' },
      ],
      links: [],
      stat: null,
    },
    {
      icon: I.vote,
      title: 'Quorum and voting',
      intro: 'A board meeting only means something when the right people are in the room.',
      steps: [
        { t: 'Check quorum', d: 'Most clubs require a majority of the board to be present. Check your club\u2019s constitution for the exact number.' },
        { t: 'One vote each', d: 'Each board seat carries one vote. The President does not get an extra vote, only the chair\u2019s casting vote in a tie.' },
        { t: 'Record the count', d: 'Decisions record how many voted for and against. The minutes should reflect the count.' },
      ],
      links: [],
      stat: null,
    },
    {
      icon: I.agenda,
      title: 'The decision agenda',
      intro: 'Board time is decision time. Keep it focused.',
      steps: [
        { t: 'Standard items', d: 'Minutes of the last meeting, committee reports, financial update, service project status, new business.' },
        { t: 'Reports in advance', d: 'Committee reports circulate before the meeting. The meeting decides; it does not read aloud.' },
        { t: 'Close with owners', d: 'Every decision ends with an owner and a deadline. The next meeting opens by checking them.' },
      ],
      links: [],
      stat: null,
    },
    {
      icon: I.coin,
      title: 'Money: the treasurer\u2019s part',
      intro: 'Every board meeting hears the numbers. Every project has a budget.',
      steps: [
        { t: 'Financial report', d: 'The treasurer reports income, spending, and the current balance in two minutes flat.' },
        { t: 'Approve budgets', d: 'Projects get a budget approved by the board before spending starts, no exceptions.' },
        { t: 'Receipts and records', d: 'Every expense has a receipt and a record. Audit season thanks you.' },
      ],
      links: [],
      stat: null,
    },
    {
      icon: I.pen,
      title: 'Minutes that mean something',
      intro: 'Minutes are the board\u2019s memory and its proof of work.',
      steps: [
        { t: 'Structure', d: 'Date, members present, decisions, vote counts, action items with owners and deadlines.' },
        { t: 'Approve them', d: 'The next meeting opens by approving the previous minutes. Corrections are noted in the current minutes.' },
        { t: 'File them', d: 'Minutes live in a shared drive. The next board inherits them.' },
      ],
      links: [],
      stat: null,
    },
  ],
  related: [
    { tag: 'Tutorial 01', title: 'Assembly', to: '/tutorial/assembly', img: '/media/images/tutorial-assembly.png', go: 'Open tutorial' },
    { tag: 'Tutorial 02', title: 'Blood Donation Camp', to: '/tutorial/blood', img: '/media/images/tutorial-blood.png', go: 'Open tutorial' },
    { tag: 'Tutorial 04', title: 'DRR Visits', to: '/tutorial/drr', img: '/media/images/tutorial-drr.png', go: 'Open tutorial' },
    { tag: 'Tutorial 05', title: 'Meetings that Matter', to: '/tutorial/meetings', img: '/media/images/tutorial-meeting.png', go: 'Open tutorial' },
    { tag: 'Tutorial 06', title: 'ZRR Visits', to: '/tutorial/zrr', img: '/media/images/tutorial-zrr.png', go: 'Open tutorial' },
    { tag: 'Hub', title: 'All Six Tutorials', to: '/tutorials', img: '/media/images/tutorial-mascot.png', go: 'Open hub' },
  ],
  cta: {
    title: 'Next up: when the District\u2019s Rotaract Representative visits your club.',
    text: 'What DRR visits are for, how to host them, and why a great visit starts weeks before. The DRR Visits tutorial covers it.',
    btn: 'Next: DRR Visits \u2192',
    to: '/tutorial/drr',
    img: '/media/images/tutorial-drr.png',
    alt: 'Illustration of a club hosting a district visitor at a meeting',
  },
  note: (
    <p className="guide-note" style={{ backgroundColor: 'rgba(124,58,237,0.06)', borderLeft: '4px solid var(--tc)', padding: '10px 14px', borderRadius: '0 10px 10px 0', fontSize: '15px' }}>
      <strong style={{ color: 'var(--tc)' }}>Practical tip:</strong> the Operations Handbook in the members\u2019 library contains the full constitution template for club boards. Pair this tutorial with it when your club revises its rules.
    </p>
  ),
  css: boardCss,
};

const DRR = {
  slug: 'drr',
  title: 'DRR Visits',
  crumb: 'Tutorial 04',
  eyebrow: 'Tutorial 04 \u00b7 The District Connects',
  tagline: 'A DRR visit is not an inspection. It is the District checking in, cheering on, and connecting your club to the bigger circle.',
  img: { src: '/media/images/tutorial-drr.png', alt: 'Flat illustration of a district representative being welcomed by a club at a meeting' },
  badges: [
    { cls: 'hc1', d: 'M5 12.5l4.5 4.5L19 7.5', stroke: '#0E7490', width: '2.6', label: 'Why' },
    { cls: 'hc2', d: 'M5 12.5l4.5 4.5L19 7.5', stroke: '#C2410C', width: '2.6', label: 'Prepare' },
    { cls: 'hc3', d: 'M5 12.5l4.5 4.5L19 7.5', stroke: '#166534', width: '2.6', label: 'Host' },
    { cls: 'hc4', d: 'M8 14L12 18L20 8', stroke: '#C2410C', width: '2.4', label: 'Follow up' },
  ],
  ticker: [
    'DRR \u00b7 District \u00b7 Twice a year',
    'District Rotaract Representative \u00b7 Club Visit',
    'Roles: Host Club \u00b7 DRR \u00b7 Chair',
    'Report \u00b7 Calendar \u00b7 Photos',
  ],
  sections: [
    {
      icon: I.people,
      title: 'Who is the DRR, really?',
      intro: 'The District Rotaract Representative (DRR) leads Rotaract across the district. The DRR is your club\u2019s bridge to everything bigger.',
      steps: [
        { t: 'A peer, not a boss', d: 'The DRR is a Rotaractor, elected to lead the district\u2019s Rotaract family for the year.' },
        { t: 'Twice a year', d: 'The DRR (or the DRR\u2019s team) visits each club at least once every six months.' },
        { t: 'A friendly ear', d: 'Visits are about listening: how the club is doing, what it needs, and what the district can unlock for it.' },
      ],
      links: [],
      stat: null,
    },
    {
      icon: I.bell,
      title: 'Why visits matter',
      intro: 'A visit is a two-way street. The club gains support, the district gains a live picture of its clubs.',
      steps: [
        { t: 'For the club', d: 'The club gets a live link to district news, guidance, training, and support for its next big step.' },
        { t: 'For the district', d: 'The district learns what clubs actually face, so its programs fit reality instead of theory.' },
        { t: 'For members', d: 'Members meet the person who represents them at the district level, face to face.' },
      ],
      links: [],
      stat: null,
    },
    {
      icon: I.agenda,
      title: 'Prepare weeks before',
      intro: 'A great visit is built before the visitor arrives.',
      steps: [
        { t: 'Set the date together', d: 'Coordinate with the DRR\u2019s calendar at least three weeks ahead.' },
        { t: 'Share your year in five lines', d: 'Projects, members, wins, challenges, and the one thing the club wants help with.' },
        { t: 'Book the room and the agenda', d: 'A room, a projector, and an agenda that shows the club\u2019s real work. Structure respects everyone\u2019s time.' },
      ],
      links: [],
      stat: null,
    },
    {
      icon: I.clip,
      title: 'Host the visit',
      intro: 'The host club owns the visit\u2019s flow. The DRR brings the connection.',
      steps: [
        { t: 'Open with the club\u2019s story', d: 'The President opens with the year in review: projects, members, and what the club is proud of.' },
        { t: 'Show real work', d: 'Share the service report, the numbers, and the stories. Photographs land better than slides.' },
        { t: 'Leave room for questions', d: 'Members ask the DRR anything: district events, training, or how other clubs run things.' },
        { t: 'Close with the ask', d: 'End with the club\u2019s one big question or request for the district. Every visit should end with a clear next step.' },
      ],
      links: [],
      stat: null,
    },
    {
      icon: I.pen,
      title: 'Useful contacts and tools',
      intro: 'The DRR is not a contact list, but the district is a network.',
      steps: [
        { t: 'Find the DRR\u2019s channel', d: 'The district Rotaract channel and social pages carry DRR updates and visit schedules.' },
        { t: 'Invite the DRR to your events', d: 'Camps, assemblies, and installations are all great moments for the DRR to see the club in action.' },
        { t: 'Ask for training', d: 'The DRR\u2019s team runs training modules for clubs. Ask for one when the club needs it.' },
      ],
      links: [
        { label: 'Rotary India \u00b7 District 3292 \u00b7 Official', href: 'https://rotary3292.org/' },
        { label: 'Rotaract \u00b7 Rotary International', href: 'https://www.rotary.org/en/get-involved/rotaract-clubs' },
      ],
      stat: null,
    },
    {
      icon: I.vote,
      title: 'Follow up after the visit',
      intro: 'The visit ends when the report lands.',
      steps: [
        { t: 'Minutes and report', d: 'The Secretary records the visit: what was discussed and the agreed next steps.' },
        { t: 'Share with members', d: 'Summarize the visit for the whole club, including members who missed the meeting.' },
        { t: 'Thank the DRR', d: 'A short thank-you message with the photos keeps the relationship warm for the next visit.' },
      ],
      links: [],
      stat: null,
    },
  ],
  related: [
    { tag: 'Tutorial 01', title: 'Assembly', to: '/tutorial/assembly', img: '/media/images/tutorial-assembly.png', go: 'Open tutorial' },
    { tag: 'Tutorial 02', title: 'Blood Donation Camp', to: '/tutorial/blood', img: '/media/images/tutorial-blood.png', go: 'Open tutorial' },
    { tag: 'Tutorial 03', title: 'Board Meetings', to: '/tutorial/board', img: '/media/images/tutorial-board.png', go: 'Open tutorial' },
    { tag: 'Tutorial 05', title: 'Meetings that Matter', to: '/tutorial/meetings', img: '/media/images/tutorial-meeting.png', go: 'Open tutorial' },
    { tag: 'Tutorial 06', title: 'ZRR Visits', to: '/tutorial/zrr', img: '/media/images/tutorial-zrr.png', go: 'Open tutorial' },
    { tag: 'Hub', title: 'All Six Tutorials', to: '/tutorials', img: '/media/images/tutorial-mascot.png', go: 'Open hub' },
  ],
  cta: {
    title: 'Next up: the hardest meeting in Rotary, made simple.',
    text: 'Parliamentary procedure without the mystery. The Meetings that Matter tutorial turns meeting craft into a practical skill.',
    btn: 'Next: Meetings that Matter \u2192',
    to: '/tutorial/meetings',
    img: '/media/images/tutorial-meeting.png',
    alt: 'Illustration of a meeting with a speaker at a lectern and members seated',
  },
  note: (
    <p className="guide-note" style={{ backgroundColor: 'rgba(14,116,144,0.06)', borderLeft: '4px solid var(--tc)', padding: '10px 14px', borderRadius: '0 10px 10px 0', fontSize: '15px' }}>
      <strong style={{ color: 'var(--tc)' }}>Practical tip:</strong> schedule the DRR visit early in the Rotary year, when the club\u2019s plans are fresh. A visit that shapes the year beats a visit that reviews it.
    </p>
  ),
  css: drrCss,
};
const MEETINGS = {
  slug: 'meetings',
  title: 'Meetings that Matter',
  crumb: 'Tutorial 05',
  eyebrow: 'Tutorial 05 \u00b7 The Craft',
  tagline: 'The hardest meeting in Rotary is the one run with no craft. This tutorial turns meeting mechanics into a practical skill.',
  img: { src: '/media/images/tutorial-meeting.png', alt: 'Flat illustration of a meeting with a speaker at a lectern and members seated in rows' },
  badges: [
    { cls: 'hc1', d: 'M5 12.5l4.5 4.5L19 7.5', stroke: '#0E7490', width: '2.6', label: 'Types' },
    { cls: 'hc2', d: 'M5 12.5l4.5 4.5L19 7.5', stroke: '#C2410C', width: '2.6', label: 'Agenda' },
    { cls: 'hc3', d: 'M5 12.5l4.5 4.5L19 7.5', stroke: '#166534', width: '2.6', label: 'Motions' },
    { cls: 'hc4', d: 'M8 14L12 18L20 8', stroke: '#C2410C', width: '2.4', label: 'Minutes' },
  ],
  ticker: [
    'Meetings \u00b7 Every club \u00b7 Every time',
    'Types: General \u00b7 Board \u00b7 Committee',
    'Agenda \u00b7 Motions \u00b7 Minutes',
    'Parliamentary \u00b7 Procedure \u00b7 Simplified',
  ],
  sections: [
    {
      icon: I.people,
      title: 'Types of meetings',
      intro: 'Every meeting type has a job. Match the meeting to the job and the room does the work.',
      table: [
        { t: 'General Body Assembly', rows: [['Who', 'All members'], ['When', 'Monthly (at least quarterly)'], ['Job', 'Share club-wide updates, elect, decide']] },
        { t: 'Board Meeting', rows: [['Who', 'Executive committee'], ['When', 'Monthly'], ['Job', 'Run the club: approve, plan, report']] },
        { t: 'Committee Meeting', rows: [['Who', 'Project or committee team'], ['When', 'As needed'], ['Job', 'Build and execute the work']] },
      ],
      links: [],
      stat: null,
    },
    {
      icon: I.agenda,
      title: 'Agenda craft',
      intro: 'A strong agenda is a plan, not a list.',
      steps: [
        { t: 'The 4-part skeleton', d: 'Open (roll call, previous minutes), Reports (brief), Decisions (the core), Close (actions and next steps).' },
        { t: 'Time-box every item', d: 'Write a number next to each item. When the timer wins, the meeting ends on time.' },
        { t: 'Send it early', d: 'The agenda goes out before the meeting, not printed at the door.' },
      ],
      links: [],
      stat: null,
    },
    {
      icon: I.vote,
      title: 'Motions, plainly',
      intro: 'Motions are how a group decides without a fight.',
      steps: [
        { t: 'Propose', d: '"I move that we allocate 5,000 \u20b9 for the project."' },
        { t: 'Second', d: 'A second member agrees. No second, no debate.' },
        { t: 'Debate', d: 'Speakers for and against, two minutes each, Chair moderates.' },
        { t: 'Vote and record', d: 'The Chair calls the vote, the Secretary records it, and the motion stands or falls.' },
      ],
      links: [],
      stat: null,
    },
    {
      icon: I.clip,
      title: 'Reading a motion aloud',
      intro: 'Some motions are written to be read. Know what you are voting on.',
      steps: [
        { t: 'Main motions', d: 'The core proposals. They are discussed and voted in order.' },
        { t: 'Amendments', d: 'Changes to a proposal, voted on before the main motion.' },
        { t: 'Point of order', d: 'A member\u2019s right to challenge the meeting\u2019s process. The Chair rules on it.' },
      ],
      links: [],
      stat: null,
    },
    {
      icon: I.pen,
      title: 'Minutes: the memory of the club',
      intro: 'Minutes are the club\u2019s official memory. Simple, structured, useful.',
      steps: [
        { t: 'The minimum', d: 'Date, attendees, decisions, vote counts, action items with owners and deadlines.' },
        { t: 'Within 48 hours', d: 'Draft them while the meeting is fresh and share them with the group.' },
        { t: 'Approved at the next meeting', d: 'Minutes are formally approved by the next meeting\u2019s attendees, then filed.' },
      ],
      links: [],
      stat: null,
    },
    {
      icon: I.bell,
      title: 'Run it, end it, follow it up',
      intro: 'A meeting is a cycle, not an event.',
      steps: [
        { t: 'Open on time', d: 'Start at the announced time. The culture of punctuality begins with the Chair.' },
        { t: 'Close with actions', d: 'Read the action items aloud: what, who, when. Then thank the room and end.' },
        { t: 'Follow up', d: 'The minutes go out, owners are reminded, and the next agenda opens with the previous actions.' },
      ],
      links: [],
      stat: null,
    },
  ],
  related: [
    { tag: 'Tutorial 01', title: 'Assembly', to: '/tutorial/assembly', img: '/media/images/tutorial-assembly.png', go: 'Open tutorial' },
    { tag: 'Tutorial 02', title: 'Blood Donation Camp', to: '/tutorial/blood', img: '/media/images/tutorial-blood.png', go: 'Open tutorial' },
    { tag: 'Tutorial 03', title: 'Board Meetings', to: '/tutorial/board', img: '/media/images/tutorial-board.png', go: 'Open tutorial' },
    { tag: 'Tutorial 04', title: 'DRR Visits', to: '/tutorial/drr', img: '/media/images/tutorial-drr.png', go: 'Open tutorial' },
    { tag: 'Tutorial 06', title: 'ZRR Visits', to: '/tutorial/zrr', img: '/media/images/tutorial-zrr.png', go: 'Open tutorial' },
    { tag: 'Hub', title: 'All Six Tutorials', to: '/tutorials', img: '/media/images/tutorial-mascot.png', go: 'Open hub' },
  ],
  cta: {
    title: 'The last tutorial: the visit that puts you on the Rotary map.',
    text: 'ZRR visits are the link between your club and Rotary\u2019s leadership in the zone. Here is how to host one well.',
    btn: 'Next: ZRR Visits \u2192',
    to: '/tutorial/zrr',
    img: '/media/images/tutorial-zrr.png',
    alt: 'Illustration of a zone official visiting a club with members gathered',
  },
  note: (
    <p className="guide-note" style={{ backgroundColor: 'rgba(14,116,144,0.06)', borderLeft: '4px solid var(--tc)', padding: '10px 14px', borderRadius: '0 10px 10px 0', fontSize: '15px' }}>
      <strong style={{ color: 'var(--tc)' }}>Practical tip:</strong> pair this tutorial with the District Operations Manual\u2019s meeting section. The handbook has the templates; this tutorial has the craft.
    </p>
  ),
  css: meetingsCss,
};

const ZRR = {
  slug: 'zrr',
  title: 'ZRR Visits',
  crumb: 'Tutorial 06',
  eyebrow: 'Tutorial 06 \u00b7 The Zone Connects',
  tagline: 'ZRR stands for Zone Rotaract Representative. A ZRR visit is the District\u2019s way of linking your club to Rotary\u2019s wider leadership.',
  img: { src: '/media/images/tutorial-zrr.png', alt: 'Flat illustration of a zone representative visiting a club and being welcomed by members' },
  badges: [
    { cls: 'hc1', d: 'M5 12.5l4.5 4.5L19 7.5', stroke: '#B45309', width: '2.6', label: 'Who' },
    { cls: 'hc2', d: 'M5 12.5l4.5 4.5L19 7.5', stroke: '#C2410C', width: '2.6', label: 'Why' },
    { cls: 'hc3', d: 'M5 12.5l4.5 4.5L19 7.5', stroke: '#166534', width: '2.6', label: 'Prepare' },
    { cls: 'hc4', d: 'M8 14L12 18L20 8', stroke: '#C2410C', width: '2.4', label: 'Host' },
  ],
  ticker: [
    'ZRR \u00b7 Zone \u00b7 Annually',
    'Zone Rotaract Representative \u00b7 Club Visit',
    'Roles: Host Club \u00b7 ZRR \u00b7 District',
    'Calendar \u00b7 Report \u00b7 Photos',
  ],
  sections: [
    {
      icon: I.people,
      title: 'Who the ZRR is',
      intro: 'The ZRR represents Rotaract at the zone level, one step above the district.',
      steps: [
        { t: 'A zone-level leader', d: 'The ZRR coordinates Rotaract across the zone, which groups several districts together.' },
        { t: 'A link to Rotary leadership', d: 'The ZRR connects clubs and districts with Rotary\u2019s regional and international leadership.' },
        { t: 'A visit with meaning', d: 'A ZRR visit is less frequent than a DRR visit and has more ceremony around it. Treat it with care.' },
      ],
      links: [],
      stat: null,
    },
    {
      icon: I.bell,
      title: 'Why the visit happens',
      intro: 'ZRR visits strengthen the connection between the club, the district, and the wider Rotary world.',
      steps: [
        { t: 'For recognition', d: 'The visit acknowledges the club\u2019s work and brings it to the zone\u2019s attention.' },
        { t: 'For perspective', d: 'Members hear how the zone works, what other districts are doing, and where the club stands.' },
        { t: 'For the network', d: 'The visit opens doors: inter-district projects, training exchanges, and the zone\u2019s calendar of events.' },
      ],
      links: [],
      stat: null,
    },
    {
      icon: I.agenda,
      title: 'Prepare the visit',
      intro: 'A ZRR visit deserves the club\u2019s best preparation.',
      steps: [
        { t: 'Coordinate early', d: 'Dates are set through the district, well in advance. Check the district\u2019s visit calendar.' },
        { t: 'Draft the story', d: 'Prepare the club\u2019s year: projects, numbers, member growth, and the challenges the club wants to raise.' },
        { t: 'Plan the ceremony', d: 'Welcome, meeting, and a short presentation or tour. Arrive early, dress well, and think about photos.' },
      ],
      links: [],
      stat: null,
    },
    {
      icon: I.clip,
      title: 'Host the visit',
      intro: 'The club owns the flow; the ZRR brings the zone.',
      steps: [
        { t: 'A proper welcome', d: 'Greet the ZRR at the entrance, introduce the board, and open with the club\u2019s year in review.' },
        { t: 'Show the work', d: 'Present the projects and the numbers. A short video or a wall of photographs works better than slides.' },
        { t: 'The exchange', d: 'The ZRR speaks about the zone, answers questions, and shares what is coming up.' },
        { t: 'Close with thanks', d: 'Thank the ZRR and the district for the visit. Close with the club\u2019s commitments for the coming months.' },
      ],
      links: [],
      stat: null,
    },
    {
      icon: I.pen,
      title: 'After the visit',
      intro: 'The visit lands when the follow-up lands.',
      steps: [
        { t: 'Minutes and report', d: 'The Secretary records the visit and shares it with members and the district.' },
        { t: 'Action items', d: 'Note anything the club committed to during the visit, with owners and deadlines.' },
        { t: 'Thank-you notes', d: 'Send thanks and the photos to the ZRR and the district team within a week.' },
      ],
      links: [],
      stat: null,
    },
  ],
  related: [
    { tag: 'Tutorial 01', title: 'Assembly', to: '/tutorial/assembly', img: '/media/images/tutorial-assembly.png', go: 'Open tutorial' },
    { tag: 'Tutorial 02', title: 'Blood Donation Camp', to: '/tutorial/blood', img: '/media/images/tutorial-blood.png', go: 'Open tutorial' },
    { tag: 'Tutorial 03', title: 'Board Meetings', to: '/tutorial/board', img: '/media/images/tutorial-board.png', go: 'Open tutorial' },
    { tag: 'Tutorial 04', title: 'DRR Visits', to: '/tutorial/drr', img: '/media/images/tutorial-drr.png', go: 'Open tutorial' },
    { tag: 'Tutorial 05', title: 'Meetings that Matter', to: '/tutorial/meetings', img: '/media/images/tutorial-meeting.png', go: 'Open tutorial' },
    { tag: 'Hub', title: 'All Six Tutorials', to: '/tutorials', img: '/media/images/tutorial-mascot.png', go: 'Open hub' },
  ],
  cta: {
    title: 'That is the full tutorial series.',
    text: 'Six playbooks, one zone. Start from the beginning if you need a refresh, or jump into the hub to find any tutorial again.',
    btn: 'Back to All Tutorials \u2190',
    to: '/tutorials',
    img: '/media/images/tutorial-mascot.png',
    alt: 'Illustration of the zone mascot waving hello',
  },
  note: (
    <p className="guide-note" style={{ backgroundColor: 'rgba(180,83,9,0.06)', borderLeft: '4px solid var(--tc)', padding: '10px 14px', borderRadius: '0 10px 10px 0', fontSize: '15px' }}>
      <strong style={{ color: 'var(--tc)' }}>Practical tip:</strong> keep the ZRR visit in the club\u2019s annual calendar and coordinate with the district\u2019s visit schedule. A well-timed visit can open inter-district projects for your club.
    </p>
  ),
  css: zrrCss,
};
const PAGES = [ASSEMBLY, BLOOD, BOARD, DRR, MEETINGS, ZRR];

function StatText({ stat }) {
  if (!stat) return null;
  return (
    <div className="guide-stat">
      <span className="g-icon">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 17l5-6 4 3 7-8" />
        </svg>
      </span>
      <strong>{stat.num}</strong> {stat.unit} &middot; {stat.caption}
    </div>
  );
}

function WordTitle({ word }) {
  const letters = word.split('');
  return (
    <h1>
      {letters.map((ch, i) => (
        <span key={i} className="rword" style={{ animationDelay: `${i * 0.07}s` }}>
          {ch === ' ' ? '\u00A0' : ch}
        </span>
      ))}
    </h1>
  );
}

function ProgressBar({ progressRef }) {
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const p = max > 0 ? (window.scrollY / max) * 100 : 0;
      progressRef.current.style.width = `${p}%`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [progressRef]);

  return <div id="progress" ref={progressRef} aria-hidden="true"></div>;
}

function Hero({ page, heroRef }) {
  const [canParallax, setCanParallax] = useState(false);
  useEffect(() => {
    setCanParallax(window.matchMedia && window.matchMedia('(min-width: 1024px)').matches);
  }, []);

  const onMove = (e) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--mx', x.toFixed(3));
    el.style.setProperty('--my', y.toFixed(3));
  };
  const onLeave = (e) => {
    e.currentTarget.style.setProperty('--mx', '0');
    e.currentTarget.style.setProperty('--my', '0');
  };

  return (
    <header className="hero" ref={heroRef}>
      <div className="aurora a1"></div>
      <div className="aurora a2"></div>
      <div className="aurora a3"></div>
      <div className="fshape shape-ring"></div>
      <div className="fshape shape-tri"></div>
      <div className="fshape shape-dot"></div>
      <div className="fshape shape-dot2"></div>
      <div className="fshape shape-sq"></div>

      <div className="hero-content">
        <div className="crumb">
          <Link to="/tutorials">&larr; All Tutorials</Link> &middot; {page.crumb}
        </div>

        <p className="eyebrow">
          <span className="dot"></span>
          {page.eyebrow}
        </p>

        <WordTitle word={page.title} />

        <p className="tagline">{page.tagline}</p>

        <div className="hc-badges">
          {page.badges.map((b) => (
            <span className={`hc-badge ${b.cls}`} key={b.label}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d={b.d} stroke={b.stroke} strokeWidth={b.width} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {b.label}
            </span>
          ))}
        </div>

        <div className="ticker" aria-hidden="true">
          <div className="ticker-track">
            {[0, 1].map((k) => (
              <span key={k}>
                {page.ticker.map((t, i) => (
                  <span className="t-item" key={i}>
                    {t} <span className="t-dot">&bull;</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="hero-grid">
        <div className="hero-char" onMouseMove={canParallax ? onMove : undefined} onMouseLeave={canParallax ? onLeave : undefined}>
          <img src={page.img.src} alt={page.img.alt} className="phase-img" />
          <svg className="char-ring" viewBox="0 0 200 200" aria-hidden="true">
            <circle cx="100" cy="100" r="86" fill="none" stroke="var(--tc)" strokeWidth="1.6" strokeDasharray="4 9" />
          </svg>
        </div>
      </div>
    </header>
  );
}

function VideoCard({ v }) {
  return (
    <div className="video-card">
      <div className="v-thumb">
        <img src={v.img} alt={v.title} loading="lazy" />
        <span className="v-play">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
            <path d="M8 5.5v13l11-6.5-11-6.5z" />
          </svg>
        </span>
      </div>
      <div className="v-info">
        <p className="v-ttl">{v.title}</p>
        <p className="v-len">{v.len} &middot; watch on YouTube</p>
      </div>
    </div>
  );
}

function GuideBlock({ s, n, ticked, onTick }) {
  const [open, setOpen] = useState(n === 0);
  const bodyRef = useRef(null);
  const [maxH, setMaxH] = useState('0px');

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    if (open) {
      setMaxH(`${el.scrollHeight + 24}px`);
      const t = setTimeout(() => setMaxH('none'), 400);
      return () => clearTimeout(t);
    }
    setMaxH('0px');
  }, [open]);

  /* Some sections omit steps/links/checklist (e.g. role/stat sections). */
  s = { steps: [], links: [], checklist: [], ...s };

  const first = s.steps.length > 0 ? s.steps[0] : null;

  return (
    <section className="guide-block">
      <button type="button" className="guide-head" aria-expanded={open} onClick={() => setOpen(!open)}>
        <span className="guide-head-left">
          <span className="guide-icon">{s.icon}</span>
          <span className="guide-title-wrap">
            <span className="guide-n">{String(n + 1).padStart(2, '0')}</span>
            <span className="guide-title">{s.title}</span>
            <span className="guide-tag">{first ? first.t : 'Overview'}</span>
          </span>
        </span>
        <span className="guide-chevron" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </button>

      <div className="guide-body" style={{ maxHeight: maxH }}>
        <div className="guide-body-inner" ref={bodyRef}>
          <p className="intro">{s.intro}</p>

          {s.steps.length > 0 && (
            <div className="steps">
              {s.steps.map((st, i) => (
                <div className="step" key={i}>
                  <span className="step-n">{i + 1}</span>
                  <div className="step-c">
                    <p className="step-t">{st.t}</p>
                    <p className="step-d">{st.d}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {s.roles && (
            <div className="roles-grid">
              {s.roles.map((r, i) => (
                <div className="role-card" key={i}>
                  <div className="role-top">
                    <span className="role-ico">{r.ico}</span>
                    <span className="role-focus">{r.focus}</span>
                  </div>
                  <p className="role-name">{r.name}</p>
                </div>
              ))}
            </div>
          )}

          {s.table && (
            <div className="type-table">
              {s.table.map((group, i) => (
                <div className="type-row" key={i}>
                  <p className="type-name">{group.t}</p>
                  {group.rows.map(([k, v], j) => (
                    <p className="type-line" key={j}>
                      <span className="type-k">{k}:</span> {v}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          )}

          {s.links.length > 0 && (
            <div className="guide-links">
              <p className="guide-links-label">Useful links</p>
              {s.links.map((l, i) => (
                <a className="guide-link" href={l.href} target="_blank" rel="noopener noreferrer" key={i}>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M10 14L14 10" />
                    <path d="M7 13L4 10a3.5 3.5 0 015-5l3 3M17 11l3 3a3.5 3.5 0 01-5 5l-3-3" />
                  </svg>
                  {l.label}
                </a>
              ))}
            </div>
          )}

          <StatText stat={s.stat} />

          {s.checklist && s.checklist.length > 0 && (
            <div className="guide-checklist">
              <p className="guide-links-label">Checklist</p>
              {s.checklist.map((c, i) => (
                <label className="checklist-label" key={i}>
                  <input
                    type="checkbox"
                    checked={!!ticked[i]}
                    onChange={() => onTick(i)}
                  />
                  <span className="checkbox-box" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12.5l4.5 4.5L19 7.5" />
                    </svg>
                  </span>
                  <span className="checkbox-txt">{c}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function PageBody({ page }) {
  const location = useLocation();
  const [ticked, setTicked] = useState({});
  const progressRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (location.hash) {
      const t = setTimeout(() => {
        const el = document.getElementById(location.hash.slice(1));
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 250);
      return () => clearTimeout(t);
    }
  }, [location]);

  const onTick = (i) => setTicked((prev) => ({ ...prev, [i]: !prev[i] }));

  return (
    <SiteShell current="tutorials" cta="join" title={`${page.title} | Zone 7 Rotaract`} css={page.css}>
      <ProgressBar progressRef={progressRef} />
      <Hero page={page} heroRef={heroRef} />

      <div className="wrap">
        <h2 className="section-title">The Playbook</h2>
        <p className="section-sub">
          Six parts. One page. Open each part and work through it at your own pace.
        </p>

        <div className="guide-list">
          {page.sections.map((s, i) => (
            <GuideBlock key={i} s={s} n={i} ticked={ticked[i]} onTick={onTick} />
          ))}
        </div>

        {page.videos && page.videos.length > 0 && (
          <div className="video-section">
            <h2 className="section-title">Watch &amp; Learn</h2>
            <p className="section-sub">Short clips to see the playbook in action.</p>
            <div className="video-grid">
              {page.videos.map((v, i) => (
                <VideoCard v={v} key={i} />
              ))}
            </div>
          </div>
        )}

        <div className="related">
          <div className="related-head">
            <h2 className="section-title">Keep Learning</h2>
            <p className="section-sub">The other tutorials in the series.</p>
          </div>
          <div className="related-grid">
            {page.related.map((r, i) => (
              <Link to={r.to} className="rel-card" key={i}>
                <span className="rel-tag">{r.tag}</span>
                <img src={r.img} alt={r.title} loading="lazy" />
                <span className="rel-body">
                  <span className="rel-ttl">{r.title}</span>
                  <span className="go">{r.go} &rarr;</span>
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div className="cta-band">
          <img className="cta-img" src={page.cta.img} alt={page.cta.alt} loading="lazy" />
          <div className="cta-body">
            <p className="cta-ttl">{page.cta.title}</p>
            <p className="cta-txt">{page.cta.text}</p>
            <Link className="btn" to={page.cta.to}>{page.cta.btn}</Link>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}

export default function TutorialDetailPage() {
  const { slug } = useParams();
  const page = PAGES.find((p) => p.slug === slug);

  if (!page) {
    return (
      <SiteShell current="tutorials" cta="join" title="Tutorial not found | Zone 7 Rotaract" css={assemblyCss}>
        <div className="wrap not-found">
          <h1>Tutorial not found</h1>
          <p>The tutorial you are looking for does not exist.</p>
          <Link className="btn" to="/tutorials">Back to All Tutorials</Link>
        </div>
      </SiteShell>
    );
  }

  return <PageBody key={slug} page={page} />;
}
