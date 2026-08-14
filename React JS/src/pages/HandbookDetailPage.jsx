import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import SiteShell from '../components/layout/SiteShell';
import Reveal from '../components/ui/Reveal';
import grantsCss from './handbook-grants.css?inline';
import healthCss from './handbook-health.css?inline';
import newclubCss from './handbook-newclub.css?inline';
import projectsCss from './handbook-projects.css?inline';
import twinshipCss from './handbook-twinship.css?inline';

const CHEVRON = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M6 3.5L10.5 8L6 12.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LINK_ICON = (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
    <path d="M6 4H4a1 1 0 00-1 1v7a1 1 0 001 1h7a1 1 0 001-1v-2M9 3h4v4M13 3L7 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SPARK = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4L12 3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);

const GRANTS = {
  title: 'Handbook: Grants | Rotaract District 3292',
  chapter: '01',
  eyebrow: 'Handbook \u00b7 Chapter 01',
  crumb: 'Chapter 01',
  h1: 'Turn a good idea into funded service.',
  sub: "Rotary funding comes in two speeds. District Grants are small, local and fast; they support short-term projects that answer an urgent community need. Global Grants are large, international and rigorous; they fund sustainable projects aligned with the 7 Areas of Focus. This chapter walks both paths end to end, with the rules that keep the money honest.",
  note: (
    <>
      Rules per the <a href="/media/guides/Rotaract-District-Fund_Grant-Criterion-Document.pdf">District Fund &amp; Grant Criterion Document</a> and the directory's Global Grant guide. Amounts, matching percentages and deadlines that change every year (set by the District Governor) are noted as such. Check the current directory before applying.
    </>
  ),
  img: '/media/images/handbook-grants.svg',
  imgAlt: 'Grants and funding illustration',
  badges: [
    { cls: 'hc1', stroke: '#E11A6E', width: 2.6, d: 'M5 12.5l4.5 4.5L19 7.5', label: <>District <b>&amp;</b> Global</> },
    { cls: 'hc2', stroke: '#F2A900', width: 2.6, d: 'M5 12.5l4.5 4.5L19 7.5', label: <>15% <b>outside</b></> },
    { cls: 'hc3', stroke: '#0E7490', width: 2.6, d: 'M5 12.5l4.5 4.5L19 7.5', label: <>3 <b>quotes</b></> },
    { cls: 'hc4', stroke: '#C2410C', width: 2.4, d: 'M8 14L12 18L20 8', label: <>90 <b>days ahead</b></> },
  ],
  ticker: ['District Grant', 'Global Grant', '15% outside country', '90 days before start', '3 competitive quotes', 'Separate bank account', 'Report in 12 months', 'Records for 5 years'],
  insideSub: 'Five sections: the two grant types, the financial rules, the application, and the reporting that closes the loop.',
  sections: [
    {
      id: 'district-grants', color: '#E11A6E',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#fff" strokeWidth="1.6" /><circle cx="12" cy="12" r="4.5" stroke="#fff" strokeWidth="1.6" /><path d="M12 4.5v3M12 16.5v3M4.5 12h3M16.5 12h3" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" /></svg>,
      title: 'District Grants: the fast track',
      tagline: 'Small-scale, short-term, local, decided by the District Governor',
      img: '/media/images/handbook-grants.svg',
      alt: 'Illustration of grant funding and application documents',
      intro: 'District Grants support small, urgent, community-specific projects. Every year the District Governor fixes the total pool and splits it between Rotary and Rotaract clubs, sets the amount per approved project, and decides the matching share that sponsoring Rotary clubs and partner Rotaract clubs pay. Rotaract clubs apply as implementation partners with their sponsoring Rotary club, and the funds go to the sponsoring Rotary club.',
      steps: [
        { n: 1, title: 'Confirm eligibility', body: "Rotary and Rotaract clubs must be current with renewals; the sponsoring Rotary club's CDO registration must be up to date." },
        { n: 2, title: 'Funding agreement', body: 'The sponsoring Rotary club emails the district to confirm its commitment to contribute its share; the partner Rotaract club commits to its portion too.' },
        { n: 3, title: 'Prepare the application', body: 'Get the official online application link, print the form, draft the answers and gather every supporting document.' },
        { n: 4, title: 'Submit online', body: 'Transfer the draft into the online form. The Club President clicks "Submit", and all parties receive a confirmation.' },
        { n: 5, title: 'Respect the deadline', body: 'Applications close on the date set by the District Governor. One application per club.' },
      ],
      stat: <>District Grants can also fund the <span>community assessment</span> that a future Global Grant needs. It is the first step toward bigger funding.</>,
      checklistLabel: 'Quick-Start Checklist',
      checklistHint: 'tap to tick',
      checklist: [
        "Check the current directory for this year's pool, per-project amount and matching percentages",
        'Confirm your club and the sponsoring Rotary club are current with renewals before drafting anything',
        'Draft on paper first, then submit. Mistakes are harder to fix after the click',
        'Keep the submission confirmation email; it is your proof of application',
      ],
      links: [{ label: 'District Fund & Grant Criterion Document', url: '/media/guides/Rotaract-District-Fund_Grant-Criterion-Document.pdf' }],
    },
    {
      id: 'global-grants', color: '#0E7490',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#fff" strokeWidth="1.6" /><ellipse cx="12" cy="12" rx="9" ry="3.6" stroke="#fff" strokeWidth="1.6" /><line x1="12" y1="3" x2="12" y2="21" stroke="#fff" strokeWidth="1.6" /></svg>,
      title: 'Global Grants: the big leagues',
      tagline: 'Large, international, sustainable, run through the Grant Center',
      img: '/media/images/handbook-grants.svg',
      alt: 'Illustration of a globe representing international grants',
      intro: 'A Global Grant is a commitment to design and deliver a project with lasting, measurable change. It demands planning, partnerships, transparent finances and timely reporting. A good idea alone is not enough. Before you begin, the project must meet every qualification below.',
      steps: [
        { n: 1, title: 'Confirm you qualify', body: "Fits at least one of Rotary's 7 Areas of Focus; minimum total budget of USD 30,000; lasting, sustainable impact; a Host Sponsor in the project country and an International Sponsor from another country; the club must attend a Grant Management Seminar, sign the club MOU, and meet extra district requirements." },
        { n: 2, title: 'Conduct a community assessment', body: 'Engage men, women, youth, elders, leaders and marginalized members; document findings with the Global Grants Community Assessment Results Form. District Grants can fund this assessment; Global Grants cannot.' },
        { n: 3, title: 'Build strong partnerships', body: 'The Host Sponsor manages and implements locally; the International Sponsor brings funding, expertise and oversight. Working with an NGO or government agency? Sign an MOU that defines responsibilities.' },
        { n: 4, title: 'Plan in detail', body: 'Clear measurable goals, assigned roles, a timeline with milestones, a financial management plan, and a detailed budget with at least three competitive quotes for major expenses.' },
        { n: 5, title: 'Secure funding', body: "At least 15% of total funding must come from outside the project country. District Designated Funds are matched 80% by the World Fund; member contributions and non-member donations are no longer matched. Never collect money from beneficiaries to cover grant costs." },
        { n: 6, title: 'Apply with precision', body: 'Apply through the Grant Center on My Rotary with objectives, activities, budget, partners and sustainability and monitoring plans. Get club and district approval, and submit at least 90 days before any planned travel or project start.' },
        { n: 7, title: 'Implement and monitor', body: 'Follow the approved plan exactly; changes require Rotary approval. Track spending and progress, keep partners informed, and fix problems fast.' },
        { n: 8, title: 'Report on time', body: 'First report within 12 months of the first payment; follow-up reports every 12 months until the project ends; final report within 2 months after completion.' },
      ],
      stat: <>A <span>separate, club-controlled bank account</span> for the grant is non-negotiable. It is how Rotary can audit one project without touching club funds.</>,
      checklistLabel: 'Quick-Start Checklist',
      checklistHint: 'tap to tick',
      checklist: [
        'Verify the USD 30,000 minimum and the 7 Areas of Focus fit before planning',
        'Recruit your Host Sponsor and International Sponsor early; they shape the whole application',
        'Get at least three competitive quotes for every major expense',
        'Keep every receipt and financial record; inventory all equipment and name its future owner',
      ],
      links: [{ label: 'My Rotary: Grant Center', url: 'https://my.rotary.org/en/grants', external: true }],
    },
    {
      id: 'money-rules', color: '#F2A900',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 9l9-5.5L21 9" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /><path d="M5 9v8M9.5 9v8M14.5 9v8M19 9v8M4 21h16M3.5 19.5h17" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" /></svg>,
      title: 'The money rules that protect everyone',
      tagline: 'Where funds live, how they move, and what you may never do',
      img: '/media/images/handbook-grants.svg',
      alt: 'Illustration of a bank with coins and funding rules',
      intro: "Grant money is public trust. The directory's rules are short and absolute. Clubs that respect them keep qualifying for more funding, and clubs that don't lose it for everyone.",
      stat: <><span>At least 15% of Global Grant funding</span> must come from outside the project country. It is the rule that makes a project genuinely international.</>,
      checklistLabel: 'Quick-Start Checklist',
      checklistHint: 'tap to tick',
      checklist: [
        'Use a separate, club-controlled bank account for the grant. Never mix it with club funds',
        'Secure at least three competitive quotes for major expenses and keep them on file',
        'Do not collect money from project beneficiaries to cover grant costs',
        'For district grants, confirm the share split in writing before any money moves',
        'Never spend before approval. Changes to the approved plan require Rotary approval',
      ],
      links: [],
    },
    {
      id: 'apply', color: '#C2410C',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 20l1-4L16.5 4.5a2.1 2.1 0 013 3L8 19l-4 1z" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" /><path d="M14.5 6.5l3 3" stroke="#fff" strokeWidth="1.6" /></svg>,
      title: 'The application, done properly',
      tagline: 'Grant Center, club approval, district approval, 90 days of buffer',
      img: '/media/images/handbook-grants.svg',
      alt: 'Illustration of an application form being prepared',
      intro: "Precision beats speed. A rejected application usually fails because the plan or the paperwork was incomplete, not because the idea was bad. Treat the application like the club's best report card.",
      stat: <>Submitting <span>at least 90 days before</span> planned travel or project start is a hard rule. Mark the calendar the day you decide to apply.</>,
      checklistLabel: 'Quick-Start Checklist',
      checklistHint: 'tap to tick',
      checklist: [
        "Apply through the Grant Center on My Rotary for global grants; use the district's official online form for district grants",
        'Include objectives, activities, budget, partners, sustainability plan and monitoring plan',
        "Get both your club board's and the district's approval before submitting",
        'Submit early enough to fix any technical issues before the deadline',
      ],
      links: [],
    },
    {
      id: 'reporting', color: '#1B1836',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M8 21h8a2 2 0 002-2V7l-4-4H8a2 2 0 00-2 2v14a2 2 0 002 2z" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" /><path d="M14 3v4h4M8 12h8M8 16h8" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" /></svg>,
      title: 'Reporting & record-keeping',
      tagline: 'Twelve months, two months, five years. The calendar that never lies',
      img: '/media/images/handbook-grants.svg',
      alt: 'Illustration of a clipboard with reports and records',
      intro: "A grant is not finished when the money arrives or when the project ends. It is finished when every report is in and every record is filed. The directory's deadlines are strict.",
      stat: <>Keep all financial and project documents for <span>at least 5 years</span>. Long after the project ends, that file can still be audited.</>,
      checklistLabel: 'Quick-Start Checklist',
      checklistHint: 'tap to tick',
      checklist: [
        'First report within 12 months of receiving the first payment',
        'Follow-up reports every 12 months until the project ends',
        'Final report within 2 months after completion',
        'Keep all financial and project documents for at least 5 years',
        'Maintain an inventory of purchased equipment and identify who owns it after the project',
      ],
      links: [{ label: 'Club Admin: minutes & treasury', url: '/admin', internal: true }],
    },
  ],
  watchSub: 'Rotary training videos on running District Grants and applying for Global Grants. Press play inside the card.',
  videos: [
    { id: '3d4n0Pj-xTU', title: 'Rotary District Grants: Starting, Editing, and Submitting a Grant', desc: "Rotary's own walkthrough of preparing a District Grant application in the Grant Center." },
    { id: 'LCAsYqWjVJA', title: 'Rotary Global Grants: How to Apply with The Rotary Foundation', desc: 'A clear, practical guide to applying for Global Grants, sponsor roles and the approval flow.' },
  ],
  keepSub: 'Grants fund the projects. The twinships and the Areas of Focus chapters tell you what to build and with whom.',
  related: [
    { to: '/handbook/twinship', img: '/media/images/handbook-twinship.svg', alt: 'Twinship chapter', title: 'Twinship & the MOU', desc: 'Joint projects with a twin club are some of the strongest grant applications.', go: 'Open chapter' },
    { to: '/handbook/projects', img: '/media/images/handbook-projects.svg', alt: 'Areas of focus chapter', title: 'Projects: 7 Areas of Focus', desc: 'Global Grants must fit one of the seven areas. See ready-made designs.', go: 'Open chapter' },
    { to: '/handbook', img: '/media/images/handbook-hub.svg', alt: 'Handbook hub', title: 'The Handbook', desc: 'Back to all five chapters. Rules, checklists and videos in one place.', go: 'Open hub' },
  ],
  cta: {
    title: 'Funded projects need partners.',
    text: 'Twinships and MOUs are how clubs in Zone 7 scale up. The next chapter shows the whole relationship.',
    btn: 'Next: Twinship & MOU',
    to: '/handbook/twinship',
  },
  css: grantsCss,
};

const HEALTH = {
  title: 'Handbook: Club Health | Rotaract District 3292',
  chapter: '05',
  eyebrow: 'Handbook \u00b7 Chapter 05',
  crumb: 'Chapter 05',
  h1: 'Give your club a 75-point checkup.',
  sub: "Every six months, the district's health checkup asks your club 75 honest yes-or-no questions across five sections: Club Experience, Service & Socials, Members, Public Image, and Business & Operations. One point per yes, a score you compute in a single meeting, and a two-or-three-item action plan that makes the next checkup better.",
  note: (
    <>
      Process, section names and item counts come from the <a href="/media/guides/RC. Dis. Dinesh Gaire BW 2082 Final District directory.pdf">District 3292 Directory</a> (Club Health Checkup section). The sample checks below follow the directory's section themes; the official full 75-item table lives in the directory and in <a href="https://on.rotary.org/club-health-check" target="_blank" rel="noopener noreferrer" style={{ fontWeight: 700 }}>Rotary's club health check</a>.
    </>
  ),
  img: '/media/images/handbook-health.svg',
  imgAlt: 'Club health checkup illustration',
  badges: [
    { cls: 'hc1', stroke: '#E11A6E', width: 2.6, d: 'M5 12.5l4.5 4.5L19 7.5', label: <>75 <b>items</b></> },
    { cls: 'hc2', stroke: '#F2A900', width: 2.6, d: 'M5 12.5l4.5 4.5L19 7.5', label: <>5 <b>sections</b></> },
    { cls: 'hc3', stroke: '#0E7490', width: 2.6, d: 'M5 12.5l4.5 4.5L19 7.5', label: <>Every <b>6 months</b></> },
    { cls: 'hc4', stroke: '#C2410C', width: 2.4, d: 'M8 14L12 18L20 8', label: <>Score <b>&amp; act</b></> },
  ],
  ticker: ['Club Experience', 'Service & Socials', 'Members', 'Public Image', 'Business & Operations', '75 items', 'Every 6 months', 'SMART goals', 'Score & act'],
  insideSub: "The process first, then the five sections with sample checks you can tick live. The directory's official table carries 75 items (15 / 14 / 16 / 15 / 15 per section).",
  score: [
    { id: 'club-experience', label: 'Club Experience', max: 8, color: '#E11A6E' },
    { id: 'service-socials', label: 'Service & Socials', max: 8, color: '#F2A900' },
    { id: 'members', label: 'Members', max: 8, color: '#A80F52' },
    { id: 'public-image', label: 'Public Image', max: 8, color: '#0E7490' },
    { id: 'business-ops', label: 'Business & Ops', max: 8, color: '#1B1836' },
  ],
  sections: [
    {
      id: 'how-it-works', color: '#0E7490',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M8 21h8a2 2 0 002-2V7l-4-4H8a2 2 0 00-2 2v14a2 2 0 002 2z" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" /><path d="M14 3v4h4M8.5 13l2.5 2.5 4.5-5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>,
      title: 'How the checkup works',
      tagline: 'One review team, 1\u20132 hours, seven steps, twice a year',
      img: '/media/images/handbook-health.svg',
      alt: 'Illustration of the health checkup process',
      intro: 'The directory defines a simple, repeatable process, no consultants needed, just honest discussion.',
      steps: [
        { n: 1, title: 'Preparation', body: 'Form a review team: President, Secretary, Membership Chair, Public Image Chair, Service Project Chair, Treasurer, and at least 2 general members. Gather membership lists, attendance records, project reports, club goals (My Rotary & Rotaract 3292 Portal), financial statements, and social media or PR reports. Dedicate 1\u20132 hours in a club or board meeting.' },
        { n: 2, title: 'Self-assessment', body: 'Go through each section and discuss honestly. "Yes" if the statement was true for your club in the last 12 months.' },
        { n: 3, title: 'Scoring', body: 'Each yes = 1 point, each no = 0. Add up each section. More than 5 "no" answers in any section means improvement is needed there.' },
        { n: 4, title: 'Discussion', body: 'Review scores in a club or board meeting. Ask: "What do you like most about the club? What do you want improved?" Identify gaps and opportunities.' },
        { n: 5, title: 'Action plan', body: 'Choose 2\u20133 priority areas where the club is weakest, make SMART goals, assign responsible persons, and fix deadlines (3 months, 6 months).' },
        { n: 6, title: 'Implementation', body: 'Carry out the plan through committees, monitor progress at monthly board meetings, and record improvements in both portals.' },
        { n: 7, title: 'Review & repeat', body: 'Run the checkup every 6 months, celebrate successes, recognize contributors, and keep improving.' },
      ],
      table: {
        head: ['Section', 'Official items', 'What it measures'],
        rows: [
          ['Club Experience', '15', 'Meetings, engagement, inclusiveness, recognition, fellowship'],
          ['Service & Socials', '14', 'Service projects, community involvement, social events, leadership opportunities'],
          ['Members', '16', 'Growth, diversity, retention, induction, mentoring, alumni engagement'],
          ['Public Image', '15', 'Website, social media, media coverage, branding, community visibility'],
          ['Business & Operations', '15', 'Strategic plan, goals, leadership continuity, financial management, reporting'],
          ['Overall Health', '75', 'The full checkup, one point per yes'],
        ],
      },
      stat: <>More than <span>5 "no" answers in any section</span> means that section needs attention. That is the directory's own tripwire.</>,
      checklistLabel: 'Sample Checks',
      checklistHint: 'tap to tick; score updates above',
      checklist: [
        'Form the review team with at least 2 general members in it',
        'Gather all club data before the meeting: membership, attendance, projects, finances, PR',
        'Dedicate 1\u20132 hours in a club or board meeting, no more',
        'Agree on 2\u20133 priority areas and write SMART goals with owners and deadlines',
        'Put the next checkup in the calendar; every 6 months, without fail',
      ],
      links: [{ label: 'Official Rotary club health check', url: 'https://on.rotary.org/club-health-check', external: true }],
    },
    {
      id: 'club-experience', color: '#E11A6E',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8" r="3.4" stroke="#fff" strokeWidth="1.6" /><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6M16 5.5a3.4 3.4 0 010 6.4M17.5 14.2c2.3.6 4 2.7 4 5.8" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" /></svg>,
      title: 'Club Experience: 15 items',
      tagline: 'Meetings, engagement, inclusiveness, recognition, fellowship',
      img: '/media/images/handbook-health.svg',
      alt: 'Illustration of the club experience section',
      intro: "The first section asks whether being in your club feels good, because everything else follows from that. Sample checks from the directory's theme:",
      stat: <>Meeting quality is the <span>single most visible health signal</span>; visitors see it in the first five minutes.</>,
      checklistLabel: 'Sample Checks',
      checklistHint: 'tap to tick; score updates above',
      checklist: [
        'The club has a fixed meeting day, time and place that members can plan around',
        'A greeter or welcome officer receives members and guests at every meeting',
        'Meetings follow the standard agenda and generally start and end on time',
        'Members say they feel heard and included in decisions',
        'Member contributions and achievements are recognized publicly',
        'The club has at least one social or fellowship event per month',
        'Guests and visiting Rotaractors are introduced early in every meeting',
        'Members report enjoying meetings; attendance reflects it',
      ],
      links: [{ label: 'Meetings tutorial', url: '/tutorial/meetings', internal: true }],
    },
    {
      id: 'service-socials', color: '#F2A900',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3.5" y="5" width="17" height="15.5" rx="2" stroke="#fff" strokeWidth="1.6" /><path d="M8 3v4M16 3v4M3.5 10.5h17" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" /><path d="M8 15h8" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" /></svg>,
      title: 'Service & Socials: 14 items',
      tagline: 'Service projects, community involvement, social events, leadership',
      img: '/media/images/handbook-health.svg',
      alt: 'Illustration of the service and socials section',
      intro: "This section measures what the club does, in the community and for its own members. Sample checks from the directory's theme:",
      stat: <>Weak here? The <span>7 Areas of Focus chapter</span> has 42 ready project designs, starting at NPR 5,000.</>,
      checklistLabel: 'Sample Checks',
      checklistHint: 'tap to tick; score updates above',
      checklist: [
        'The club ran at least one community service project in the last 12 months',
        'Projects respond to a documented community need, not just convenience',
        "The club's projects are visible to the public (photos, posts, reports)",
        'Social events are on the calendar, not improvised',
        'Members get leadership opportunities through projects and committees',
        'The club collaborated with another club, a Rotary club or an organization this year',
        'The club has applied for a grant or district funding in the last 12 months',
        'Project reports are shared with the district on time',
      ],
      links: [
        { label: 'Projects: 7 Areas of Focus', url: '/handbook/projects', internal: true },
        { label: 'Grants chapter', url: '/handbook/grants', internal: true },
      ],
    },
    {
      id: 'members', color: '#A80F52',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="10" cy="8" r="3.4" stroke="#fff" strokeWidth="1.6" /><path d="M3.5 20c0-3.6 2.9-6 6.5-6 1.3 0 2.5.3 3.5.9M18.5 14v6M15.5 17h6" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" /></svg>,
      title: 'Members: 16 items',
      tagline: 'Growth, diversity, retention, induction, mentoring, alumni',
      img: '/media/images/handbook-health.svg',
      alt: 'Illustration of the members section',
      intro: "Membership is the club's engine room. The official section carries 16 items; these sample checks follow its themes.",
      stat: <>Retention beats recruitment: <span>a member who is mentored in year one</span> is overwhelmingly likely to stay past year three.</>,
      checklistLabel: 'Sample Checks',
      checklistHint: 'tap to tick; score updates above',
      checklist: [
        'Membership grew or held steady in the last 12 months',
        'The club inducts new members with a proper induction ceremony',
        "New members get a structured orientation within their first month",
        'Every new member is paired with a mentor or buddy',
        "The club's members reflect the diversity of its community",
        'Absent members receive personal follow-up after two consecutive misses',
        'Past presidents and alumni are still connected to the club',
        'The club has a clear path from member to officer',
      ],
      links: [],
    },
    {
      id: 'public-image', color: '#0E7490',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 8h3l2-2.5h6L17 8h3a1.5 1.5 0 011.5 1.5V18a1.5 1.5 0 01-1.5 1.5H4A1.5 1.5 0 012.5 18V9.5A1.5 1.5 0 014 8z" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" /><circle cx="12" cy="13" r="3.5" stroke="#fff" strokeWidth="1.6" /></svg>,
      title: 'Public Image: 15 items',
      tagline: 'Website, social media, media coverage, branding, visibility',
      img: '/media/images/handbook-health.svg',
      alt: 'Illustration of the public image section',
      intro: "If nobody knows what the club does, the club doesn't exist in the community's mind. The directory's themes, sampled:",
      stat: <>Posting <span>within 48 hours of every event</span> keeps the club's feed alive; a silent club reads as an inactive club.</>,
      checklistLabel: 'Sample Checks',
      checklistHint: 'tap to tick; score updates above',
      checklist: [
        'The club has a website or an official page that is up to date',
        'The club posts on social media at least weekly',
        'Photos and reports from events are published within days, not months',
        'The club uses consistent branding (logo, colors) across all channels',
        "Local media or community pages have covered the club's work this year",
        'The club is known by name in its community, not just its members',
        'Club projects are branded and visible at the venue itself',
        "Public image is someone's job, with a plan, not just an account",
      ],
      links: [{ label: 'Zone 7 Gallery', url: '/gallery', internal: true }],
    },
    {
      id: 'business-ops', color: '#1B1836',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>,
      title: 'Business & Operations: 15 items',
      tagline: 'Strategic plan, goals, continuity, finances, reporting',
      img: '/media/images/handbook-health.svg',
      alt: 'Illustration of the business and operations section',
      intro: "The least glamorous section, and the one whose failure silently kills clubs. Sample checks from the directory's theme:",
      stat: <>A club with <span>written goals and a named treasurer</span> survives leadership changes; one without them does not.</>,
      checklistLabel: 'Sample Checks',
      checklistHint: 'tap to tick; score updates above',
      checklist: [
        'The club has a written strategic or annual plan',
        'Club goals are recorded in My Rotary or the Rotaract 3292 Portal',
        'Finances are managed transparently with a named treasurer',
        'The club budget is reviewed at board meetings at least quarterly',
        "Financial records are kept on a shared drive, not one person's device",
        'Leadership continuity is planned; officers-in-waiting are identified early',
        'Board meetings happen monthly and their minutes are kept',
        'District reporting is submitted on time, every time',
      ],
      links: [
        { label: 'Club Admin: minutes & treasury', url: '/admin', internal: true },
        { label: 'Effective Planning Guide for Clubs', url: '/media/guides/Effective-Planning-Guide-to-Clubs.docx' },
      ],
    },
  ],
  watchSub: "Rotary's own introduction to the club health check. Press play inside the card.",
  videos: [
    { id: 'wzFC3Deg5H0', title: 'Rotary Membership Video Series: Club Health Check', desc: "Rotary's own introduction to the club health check: what it measures and why it matters." },
  ],
  keepSub: "A healthy club needs healthy meetings, and the handbook's other chapters cover the rules it runs on.",
  related: [
    { to: '/tutorial/meetings', img: '/media/images/tutorial-meeting.png', alt: 'Meetings tutorial', title: 'Running General Meetings', desc: 'Meeting quality is the first thing the checkup measures. Master the rhythm.', go: 'Open tutorial' },
    { to: '/handbook/grants', img: '/media/images/handbook-grants.svg', alt: 'Grants chapter', title: 'Grants: Funding Service', desc: 'Weak in Service & Socials? Funded projects are often the fix.', go: 'Open chapter' },
    { to: '/handbook', img: '/media/images/handbook-hub.svg', alt: 'Handbook hub', title: 'The Handbook', desc: 'Back to all five chapters: rules, checklists and videos in one place.', go: 'Open hub' },
  ],
  cta: {
    title: "That's the whole handbook.",
    text: 'Five chapters, one goal: clubs that fund well, twin well, start well, serve well and stay healthy.',
    btn: 'Back to the Handbook',
    to: '/handbook',
  },
  css: healthCss,
};

const NEWCLUB = {
  title: 'Handbook: New Clubs | Rotaract District 3292',
  chapter: '03',
  eyebrow: 'Handbook \u00b7 Chapter 03',
  crumb: 'Chapter 03',
  h1: 'Start a club the whole community feels.',
  sub: 'A new Rotaract club is a new group of young leaders in your community, and a fresh wave of energy for your Rotary club. The directory lays out nine steps from first idea to certified club, and then the ceremonial bookends: the charter presentation ceremony when the club is born, and the installation meeting every year after.',
  note: (
    <>
      The nine-step process below is the directory's own sequence for a Rotary club sponsoring a new Rotaract club. Forms and dues figures come from the <a href="/media/guides/Rotaract-Guidebook.pdf">Rotaract Guidebook</a> and official Rotary International guidance.
    </>
  ),
  img: '/media/images/handbook-newclub.svg',
  imgAlt: 'New club launch illustration',
  badges: [
    { cls: 'hc1', stroke: '#E11A6E', width: 2.6, d: 'M5 12.5l4.5 4.5L19 7.5', label: <>9 <b>steps</b></> },
    { cls: 'hc2', stroke: '#F2A900', width: 2.6, d: 'M5 12.5l4.5 4.5L19 7.5', label: <>Charter <b>ceremony</b></> },
    { cls: 'hc3', stroke: '#0E7490', width: 2.6, d: 'M5 12.5l4.5 4.5L19 7.5', label: <>Installation <b>yearly</b></> },
    { cls: 'hc4', stroke: '#C2410C', width: 2.4, d: 'M8 14L12 18L20 8', label: <>Dues <b>$5/$8</b></> },
  ],
  ticker: ['Learn', 'Gather a team', 'Know your audience', 'Strategize', 'Promote', 'Kickoff event', 'Follow up', 'Support first months', 'Certify', 'Charter ceremony', 'Installation'],
  insideSub: 'Five sections: the groundwork, the buzz, the launch, the charter ceremony, and the yearly installation rhythm.',
  sections: [
    {
      id: 'groundwork', color: '#F2A900',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M9 18h6M10 21h4M12 3a6 6 0 00-3.6 10.8c.8.6 1.1 1.4 1.1 2.2h5c0-.8.3-1.6 1.1-2.2A6 6 0 0012 3z" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" /></svg>,
      title: 'Before the first member',
      tagline: 'The groundwork a sponsor needs before step one',
      img: '/media/images/handbook-newclub.svg',
      alt: 'Illustration of a rocket and flag representing a club launch',
      intro: "Getting involved in Rotaract can be a fun, impactful and transformational experience for more than just young leaders in your community. It will inspire and engage your Rotary club members too. Three moves come before any promotion:",
      steps: [
        { n: 1, title: 'Familiarize yourself with all things Rotaract', body: 'A great place to start is the Rotaract Handbook. Then deepen your knowledge with the Policy Related to Rotaract.' },
        { n: 2, title: 'Gather a team', body: 'Bring together a group of Rotarians and community members committed to supporting the new Rotaract club.' },
        { n: 3, title: 'Know your audience', body: "Assess your community's makeup and decide: a university-based or a community-based Rotaract club? Rotary's Engaging Younger Professionals Toolkit helps you understand the demographic, create vibrant club culture and communicate value." },
      ],
      stat: <>A <span>committed sponsor team of Rotarians and community members</span> is what separates a club that launches from one that only talks about launching.</>,
      checklistLabel: 'Quick-Start Checklist',
      checklistHint: 'tap to tick',
      checklist: [
        'Read the Rotaract Handbook and the Policy Related to Rotaract',
        'Recruit your support team and name one champion',
        'Choose university-based or community-based before you promote anything',
        "Plan to attend the new club's meetings regularly and invite it into your activities",
        "Share the club's success with Rotary International at rotaract@rotary.org",
      ],
      links: [
        { label: 'Standard Rotaract Club Constitution', url: '/media/guides/Standard-Rotaract-Club-Constitution.docx' },
        { label: 'Recommended Club Bylaws', url: '/media/guides/662_rotaract_club_recommended_bylaws_en.docx' },
      ],
    },
    {
      id: 'buzz', color: '#C2410C',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 11v3l3 .5v-4L3 11zM6 14.5l10 4V6.5l-10 4" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" /><path d="M18.5 8.5a3.5 3.5 0 010 5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" /></svg>,
      title: 'Build the buzz',
      tagline: 'Strategy, promotion, and the kickoff event',
      img: '/media/images/handbook-newclub.svg',
      alt: 'Illustration of promotion for a new club',
      intro: 'Now the idea goes public. Four steps turn strategy into a room full of curious young people.',
      steps: [
        { n: 4, title: 'Strategize to attract your audience', body: 'Determine the target audience, identify locations and opportunities to promote the formation of the club, and schedule a kickoff event that appeals to them, like a happy hour, a service project, an info session, or your own creative invention.' },
        { n: 5, title: 'Create and share promotion materials', body: "Solidify your value proposition and clearly articulate the benefits of joining. Use Rotary's Brand Center for digital and print resources, and share Rotaract videos on social media." },
        { n: 6, title: 'Host your kickoff event', body: 'Engage every attendee: ask why they came and how they want to change their community or grow as a leader, and collect their contact information.' },
        { n: 7, title: 'Follow up with attendees', body: 'Personally invite them to the first pre-Rotaract meeting for preparation and orientation.' },
      ],
      stat: <>The kickoff event's job is not membership; it is <span>contact information</span>. Every follow-up starts with a name.</>,
      checklistLabel: 'Quick-Start Checklist',
      checklistHint: 'tap to tick',
      checklist: [
        'Pick a kickoff format your target audience actually enjoys',
        "Build promo materials with Rotary's Brand Center",
        'Get contact information from everyone who attends',
        'Send a personal invitation to the first orientation meeting within days',
      ],
      links: [],
    },
    {
      id: 'launch', color: '#1B1836',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 3c4 1.5 6.5 5 6.5 9.5L15 14l-1.5 6h-3L9 14l-3.5-1.5C5.5 8 8 4.5 12 3z" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" /><circle cx="12" cy="9.5" r="2" stroke="#fff" strokeWidth="1.6" /><path d="M4 21c1.5-2 4-2.5 6-2" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" /></svg>,
      title: 'Launch & certify',
      tagline: 'The first months, and the form that makes it official',
      img: '/media/images/handbook-newclub.svg',
      alt: 'Illustration of a club being launched and certified',
      intro: 'The ceremony comes later; first come the months of actual club life, then the paperwork.',
      steps: [
        { n: 8, title: 'Support the first few months of meetings', body: 'Help set up club administration: advise on adopting the Standard Rotaract Club Constitution and Recommended Bylaws, organize officer elections, select meeting locations, and arrange an initial service project.' },
        { n: 9, title: 'Certify the club', body: 'Submit the Rotaract certification form so Rotary International officially recognizes that your Rotary or Rotaract club sponsors a new Rotaract club.' },
        { n: 10, title: 'Plan for dues', body: 'Rotaract clubs pay dues to Rotary International, currently $5 per member per year for university-based clubs and $8 for community-based clubs.' },
      ],
      stat: <>An <span>initial service project in the first months</span> is not decoration. It is how the new club learns to be a club.</>,
      checklistLabel: 'Quick-Start Checklist',
      checklistHint: 'tap to tick',
      checklist: [
        'Adopt the Standard Constitution and Recommended Bylaws at the first meetings',
        'Hold officer elections early and cleanly',
        'Fix a regular meeting location and time',
        'Run an initial service project within the first three months',
        'Submit the Rotaract certification form to make sponsorship official',
        'Budget for Rotary International dues ($5 university / $8 community per member)',
      ],
      links: [
        { label: 'Rotaract Membership Form', url: '/media/guides/Rotaract_-Membership_Form.docx' },
        { label: 'Rotaract Guidebook', url: '/media/guides/Rotaract-Guidebook.pdf' },
        { label: 'Rotaract Clubs: Rotary International', url: 'https://www.rotary.org/en/get-involved/our-clubs/rotaract-clubs', external: true },
      ],
    },
    {
      id: 'charter', color: '#E11A6E',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="9" r="5.5" stroke="#fff" strokeWidth="1.6" /><path d="M9.5 13.5L8 21l4-2.5L16 21l-1.5-7.5" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" /></svg>,
      title: 'The charter presentation ceremony',
      tagline: 'The day the club is officially born',
      img: '/media/images/handbook-newclub.svg',
      alt: 'Illustration of a charter ceremony with awards',
      intro: "The district's ceremony procedure runs like this; adapt the optional items to your club. In the case of Rotaract sponsoring and self-sponsoring Rotaract clubs, district officials (DG, AG, DRR, ADRR and other district representatives) take on the roles normally played by the parent Rotary Club President, including collaring the charter president and handing over the charter certificate.",
      steps: [
        { n: 1, title: 'Registration & fellowship', body: 'Guests gather at the venue.' },
        { n: 2, title: 'Dignitaries to the dais', body: 'The MC calls the parent Rotary Club President, District Rotaract Committee Chair, Chartered Club President, Guest of Honour, Chartered Club Secretary and other guests.' },
        { n: 3, title: 'Call to order', body: 'The Rotary President calls the meeting to order, followed by the National Anthem.' },
        { n: 4, title: 'Oaths & handover', body: 'Rotaract Membership Oath to the Chartered President; Presidential Oath; the Rotary Club President collars the Charter President and hands over the Charter Certificate and gong gavel.' },
        { n: 5, title: 'Acceptance & board', body: 'The Charter President speaks, membership oaths follow for all members, the BOD is announced and takes its oath, lapel pins are presented, and the constitution, bylaws and statement of policy are handed over.' },
        { n: 6, title: 'Celebration', body: 'Group photo (optional), member performance (optional), addresses by dignitaries, cake cutting (optional), tokens of appreciation, toasts for Nepal and for the RI President, vote of thanks, Sergeant-at-Arms report, then adjournment and refreshments.' },
      ],
      stat: <>The moment that matters: <span>collaring the Charter President and handing over the certificate and gong gavel</span>. Everything else frames it.</>,
      checklistLabel: 'Quick-Start Checklist',
      checklistHint: 'tap to tick',
      checklist: [
        'Confirm who performs each role; for self-sponsoring clubs, district officials step in',
        'Print the charter certificate and prepare the collar, gong and gavel',
        'Rehearse the order of oaths with the MC beforehand',
        'Keep the ceremony under two hours; refreshments follow promptly',
      ],
      links: [{ label: 'Statement of Policy', url: '/media/guides/statement-of-policy.docx' }],
    },
    {
      id: 'installation', color: '#0E7490',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 15l8-8 4 4-8 8-4-4z" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" /><path d="M12 7l5.5-5.5 4 4L16 11M3 21h18" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>,
      title: 'The annual installation meeting',
      tagline: 'Every year after: old leadership hands over, new takes the gavel',
      img: '/media/images/handbook-newclub.svg',
      alt: 'Illustration of a gavel and ceremony',
      intro: 'Once chartered, the club repeats an installation rhythm every Rota Year. The directory\u2019s procedure covers the full arc:',
      steps: [
        { n: 1, title: 'Open the evening', body: 'The MC announces the beginning; dignitaries, including the outgoing president, chief guest (Rotary President or your choice), DRR or district officer, incoming president and guest of honour, come to the dais. Acknowledge district committee members and attending club presidents, felicitate the dignitaries, play the National Anthem.' },
        { n: 2, title: 'Review the year', body: 'The outgoing president or secretary presents the yearly club report and recognizes board members and special contributions.' },
        { n: 3, title: 'Hand over the office', body: 'The incoming president is introduced, takes the oath (administered by the Rotary President), gives an acceptance speech, and the outgoing president symbolically hands over the office, including the Charter Certificate, Collar, Gong and Gavel, as the two exchange places on the dais.' },
        { n: 4, title: 'Install the board', body: 'Installation meeting called to order, 15-second silent invocation, incoming board members take their oaths (administered by the new president), and club pins, ID cards and appointment letters are given out.' },
        { n: 5, title: 'Induct, recognize, close', body: 'New members are inducted by the DRR or ZRR; souvenirs or website releases are optional; remarks by the DRR, DRCC, Rotary President and Guest of Honour; introduction and remarks by the Chief Guest; tokens of love to guests; vote of thanks by the Vice-President; installation report by the Sergeant-at-Arms; toasts for Nepal and for the RI President; adjournment and refreshments.' },
      ],
      stat: <>The <span>symbolic handover of Charter Certificate, Collar, Gong and Gavel</span> is the single moment that tells the whole club the year has turned.</>,
      checklistLabel: 'Quick-Start Checklist',
      checklistHint: 'tap to tick',
      checklist: [
        'Set the installation date within August, before the new Rota Year picks up',
        "Book the chief guest early; the Rotary President's calendar fills fast",
        'Prepare the yearly club report and recognition list in advance',
        'Have the pins, ID cards and appointment letters ready before the ceremony',
      ],
      links: [],
    },
  ],
  watchSub: 'From the official Rotaract training series to a practical guide on starting clubs. Press play inside the card.',
  videos: [
    { id: 'vzuVOuoQzR8', title: "Starting a Rotary club or adding a Companion club? Here's how", desc: 'A practical, step-by-step conversation on starting clubs, from the Grow Rotary team.' },
    { id: 'UIImYGTkDAI', title: 'Rotaract Training Videos: Episode 1', desc: 'The first episode of the official Rotaract training series, covering club basics for new members and leaders.' },
  ],
  keepSub: 'A new club deserves a healthy start. The health checkup chapter shows how to keep it strong from month one.',
  related: [
    { to: '/handbook/health', img: '/media/images/handbook-health.svg', alt: 'Health checkup chapter', title: 'The Club Health Checkup', desc: 'Give your new club its first checkup within six months: 75 questions, one meeting.', go: 'Open chapter' },
    { to: '/handbook/twinship', img: '/media/images/handbook-twinship.svg', alt: 'Twinship chapter', title: 'Twinship & the MOU', desc: 'A new club that twins early builds its network twice as fast.', go: 'Open chapter' },
    { to: '/handbook', img: '/media/images/handbook-hub.svg', alt: 'Handbook hub', title: 'The Handbook', desc: 'Back to all five chapters. Rules, checklists and videos in one place.', go: 'Open hub' },
  ],
  cta: {
    title: 'New club, new projects.',
    text: 'The seven Areas of Focus chapter gives a fresh club its first project designs, with budgets from NPR 5,000.',
    btn: 'Next: 7 Areas of Focus',
    to: '/handbook/projects',
  },
  css: newclubCss,
};

const PROJECTS = {
  title: 'Handbook: Projects | Rotaract District 3292',
  chapter: '04',
  eyebrow: 'Handbook \u00b7 Chapter 04',
  crumb: 'Chapter 04',
  h1: 'Seven areas. Endless ways to serve.',
  sub: "Rotary concentrates its service on seven Areas of Focus, the causes every grant and most club projects align with. This chapter carries the directory's low-cost project designs: one featured project per area with a real budget and timeline, plus five more ideas that cost almost nothing but change a lot.",
  note: (
    <>
      Budgets, timelines and designs come from the <a href="/media/guides/RC. Dis. Dinesh Gaire BW 2082 Final District directory.pdf">District 3292 Directory</a> (Area of Focus section). Prices are indicative NPR budgets from the directory. Adjust to your community.
    </>
  ),
  img: '/media/images/handbook-projects.svg',
  imgAlt: 'Seven areas of focus illustration',
  badges: [
    { cls: 'hc1', stroke: '#E11A6E', width: 2.6, d: 'M5 12.5l4.5 4.5L19 7.5', label: <>7 <b>areas</b></> },
    { cls: 'hc2', stroke: '#F2A900', width: 2.6, d: 'M5 12.5l4.5 4.5L19 7.5', label: <>NPR 5,000 <b>start</b></> },
    { cls: 'hc3', stroke: '#0E7490', width: 2.6, d: 'M5 12.5l4.5 4.5L19 7.5', label: <>7 <b>featured</b></> },
    { cls: 'hc4', stroke: '#C2410C', width: 2.4, d: 'M8 14L12 18L20 8', label: <>35 <b>more ideas</b></> },
  ],
  ticker: ['Peacebuilding', 'Disease Prevention', 'WASH', 'Maternal & Child Health', 'Basic Education', 'Economic Development', 'Environment', 'NPR 5,000', '1 day to 3 months'],
  insideSub: 'Seven sections, one per Area of Focus. Open any area for the featured project design, the extra ideas, and a quick checklist.',
  sections: [
    {
      id: 'peace', color: '#E11A6E',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke="#fff" strokeWidth="1.7" /><path d="M12 4v16" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" /></svg>,
      title: 'Peacebuilding & Conflict Prevention',
      tagline: 'Dialogue, understanding and cooperation',
      img: '/media/images/handbook-projects.svg',
      alt: 'Illustration of the peace area of focus',
      intro: 'Promote dialogue, understanding and cooperation to prevent conflicts and foster peace, through peace education, mediation training and community reconciliation.',
      featured: <><span>Featured project: Peace Talks at Tea Time.</span> Host 3 monthly "Tea & Talk" gatherings with diverse community members, invite local leaders to share peaceful conflict resolution stories, and let youth volunteers act as dialogue facilitators. Budget NPR 10,000 \u00b7 Timeline 3 months.</>,
      stat: <>Peace projects often cost <span>NPR 5,000\u201315,000</span> and mostly need a room, tea and a willingness to listen.</>,
      checklistLabel: 'Five More Low-Cost Ideas',
      checklistHint: 'tap to tick',
      checklist: [
        'School Peace Clubs: student-led clubs promoting tolerance and anti-bullying',
        'Cultural Exchange Night: different ethnic communities share traditions',
        'Peer Mediation Training: youth leaders trained in conflict resolution',
        'Peace Mural Painting: public wall art promoting unity and harmony',
        'Community Dialogue Forum: open forums on community issues, peacefully',
      ],
      links: [],
    },
    {
      id: 'disease', color: '#C2410C',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 4.5v15M4.5 12h15" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" /><circle cx="12" cy="12" r="8" stroke="#fff" strokeWidth="1.6" /></svg>,
      title: 'Disease Prevention & Treatment',
      tagline: 'Vaccination, medical camps, awareness',
      img: '/media/images/handbook-projects.svg',
      alt: 'Illustration of the disease prevention area of focus',
      intro: 'Reduce the spread of diseases and strengthen healthcare systems, through vaccination programs, medical camps and health awareness campaigns.',
      featured: <><span>Featured project: Checkup in Your Pocket.</span> Partner with a local health post for BP, sugar and BMI screening; run a health talk on diet and exercise; distribute health tip leaflets. Reaches 200 people. Budget NPR 8,000 \u00b7 Timeline 1 day.</>,
      stat: <>A <span>one-day health camp with a local health post</span> is the highest-impact-per-rupee project in this chapter.</>,
      checklistLabel: 'Five More Low-Cost Ideas',
      checklistHint: 'tap to tick',
      checklist: [
        'Dental Hygiene Camp: free check-ups and brushing kits for children',
        'Blood Donation Drive: partner with the Red Cross for local collection',
        'First Aid Training: basic first aid for youth and community members',
        'Healthy Cooking Demo: a nutritionist teaches affordable recipes',
        'Anti-Tobacco Campaign: street drama or posters on tobacco risks',
      ],
      links: [{ label: 'Blood Donation tutorial', url: '/tutorial/blood', internal: true }],
    },
    {
      id: 'wash', color: '#0E7490',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 3.5c3.6 4.2 6 7.4 6 10.2a6 6 0 01-12 0c0-2.8 2.4-6 6-10.2z" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" /></svg>,
      title: 'Water, Sanitation & Hygiene (WASH)',
      tagline: 'Clean water, safe sanitation, hygiene education',
      img: '/media/images/handbook-projects.svg',
      alt: 'Illustration of the water and sanitation area of focus',
      intro: 'Provide clean water, safe sanitation and hygiene education to improve health and living conditions.',
      featured: <><span>Featured project: Soap & Smile.</span> Handwashing demonstrations in 3 schools, soap bars and posters for classrooms, and a school hygiene quiz competition. Reaches 300 schoolchildren. Budget NPR 15,000 \u00b7 Timeline 2 weeks.</>,
      stat: <>Handwashing education is <span>one of the cheapest life-saving projects</span> a club can run: soap, posters, and a quiz.</>,
      checklistLabel: 'Five More Low-Cost Ideas',
      checklistHint: 'tap to tick',
      checklist: [
        'Water Bottle Refill Station: a low-cost public refill point in a busy area',
        'School Toilet Renovation: volunteer-led painting and repairs of washrooms',
        'Hygiene Bookmark Campaign: bookmarks with hygiene tips for students',
        'Zero Plastic Day: schools and markets skip single-use plastics for one day',
        'Rainwater Harvesting Demo: showcase small home collection systems',
      ],
      links: [],
    },
    {
      id: 'maternal', color: '#A80F52',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 20s-7.5-4.5-7.5-10a4 4 0 017.5-2 4 4 0 017.5 2c0 5.5-7.5 10-7.5 10z" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" /></svg>,
      title: 'Maternal & Child Health',
      tagline: 'Medical care and nutrition for mothers and children',
      img: '/media/images/handbook-projects.svg',
      alt: 'Illustration of the maternal and child health area of focus',
      intro: 'Reduce maternal and child mortality by improving medical care and nutrition, through prenatal care programs, nutrition support and child immunizations.',
      featured: <><span>Featured project: Mother's Circle.</span> A local nurse gives a free maternal health talk, printed checklists guide safe pregnancy and newborn care, and basic hygiene kits (soap, sanitary pads) are distributed. Educates 30 pregnant women and mothers. Budget NPR 12,000 \u00b7 Timeline 1 month.</>,
      stat: <>One nurse, one room, one month. <span>30 mothers better informed</span> than their own mothers were.</>,
      checklistLabel: 'Five More Low-Cost Ideas',
      checklistHint: 'tap to tick',
      checklist: [
        'Baby Weighing Day: track infant growth and nutrition with health posts',
        'Breastfeeding Awareness Session: nurses speak to new mothers',
        'School Health Day: basic medical check-ups for students',
        'Immunization Promotion Drive: flyers encouraging parents to vaccinate',
        'Cloth Diaper Sewing Workshop: mothers make reusable baby diapers',
      ],
      links: [],
    },
    {
      id: 'education', color: '#F2A900',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 19V6a2 2 0 012-2h12a2 2 0 012 2v13l-3-2-3 2-3-2-3 2-3-2-3 2z" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" /></svg>,
      title: 'Basic Education & Literacy',
      tagline: 'Quality education and lower illiteracy',
      img: '/media/images/handbook-projects.svg',
      alt: 'Illustration of the basic education area of focus',
      intro: 'Support quality education and reduce illiteracy, through teacher training, school materials and adult literacy programs.',
      featured: <><span>Featured project: Reading Corner.</span> Collect used books from community donors, set up a small reading space in a school, and run weekly volunteer reading sessions. Budget NPR 5,000 \u00b7 Timeline ongoing after setup.</>,
      stat: <>The cheapest featured project in the directory: <span>NPR 5,000</span>, books people donated and time volunteers gave.</>,
      checklistLabel: 'Five More Low-Cost Ideas',
      checklistHint: 'tap to tick',
      checklist: [
        'Storytelling Hour: weekly volunteer storytelling in schools',
        'School Supplies Drive: stationery collected and distributed to underprivileged students',
        'Teacher Support Workshop: share new teaching tools and methods',
        'Adult Literacy Class: evening classes for parents and workers',
        'Exam Preparation Camp: free group study and coaching for Class 10 students',
      ],
      links: [],
    },
    {
      id: 'economy', color: '#1B1836',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="7.5" width="18" height="12" rx="2" stroke="#fff" strokeWidth="1.6" /><path d="M9 7.5v-1a2 2 0 012-2h2a2 2 0 012 2v1" stroke="#fff" strokeWidth="1.6" /><path d="M3 12.5h18" stroke="#fff" strokeWidth="1.6" /></svg>,
      title: 'Community Economic Development',
      tagline: 'Livelihoods, entrepreneurship, vocational training',
      img: '/media/images/handbook-projects.svg',
      alt: 'Illustration of the community economic development area of focus',
      intro: 'Create sustainable livelihoods and reduce poverty through entrepreneurship, vocational training and microfinance.',
      featured: <><span>Featured project: Skill in a Day.</span> Partner with a local tailor or trainer for a 1-day sewing or handicraft workshop, teach simple products like cloth bags or keychains, and link participants to local markets. Trains 20 women or youth. Budget NPR 15,000 \u00b7 Timeline 1 day.</>,
      stat: <>A <span>one-day skill that pays</span> beats a month of charity. Participants leave with a product and a market.</>,
      checklistLabel: 'Five More Low-Cost Ideas',
      checklistHint: 'tap to tick',
      checklist: [
        'Digital Skills Basics: computer and email use for job seekers',
        'Market Day for Local Women: a one-day fair for women entrepreneurs',
        'Microfinance Awareness Session: how small loans grow businesses',
        'Resume Writing Workshop: professional CVs for youth',
        'Second-Hand Business Drive: sell donated items to fund community projects',
      ],
      links: [],
    },
    {
      id: 'environment', color: '#3F8F5B',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4.5 19.5C5 11 11 5 20 4.5c.5 9-5 15-13 15-1 0-2-.5-2.5-1z" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" /><path d="M4.5 19.5c2-4 5-7.5 8.5-9.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" /></svg>,
      title: 'Protecting the Environment',
      tagline: 'Conservation, waste management, climate action',
      img: '/media/images/handbook-projects.svg',
      alt: 'Illustration of the environment area of focus',
      intro: 'Conserve natural resources and address climate change, through tree planting, waste management and renewable energy projects.',
      featured: <><span>Featured project: One Member, One Tree.</span> Every club member plants one tree in a community location, the municipality provides saplings, and a short awareness talk covers waste segregation. Budget NPR 5,000 \u00b7 Timeline 1 week.</>,
      stat: <><span>One member, one tree</span> turns every member into the project, and every tree into the club's logo in the community.</>,
      checklistLabel: 'Five More Low-Cost Ideas',
      checklistHint: 'tap to tick',
      checklist: [
        'Plastic-Free School Campaign: educate and reward schools that cut plastic',
        'Recycling Art Competition: students create art from waste materials',
        'Community Clean-Up Day: monthly riverbank or street cleaning',
        'Compost Making Workshop: kitchen waste into compost at home',
        'Eco-Brick Project: plastic waste into eco-bricks for small construction',
      ],
      links: [
        { label: 'Effective Planning Guide for Clubs', url: '/media/guides/Effective-Planning-Guide-to-Clubs.docx' },
        { label: 'Strategic Planning Guide', url: '/media/guides/Strategic-Planning-Guide.docx' },
      ],
    },
  ],
  watchSub: 'The story behind the seven areas, and what each one funds. Press play inside the card.',
  videos: [
    { id: 'npGRgr-mNYo', title: "Seven: the story of Rotary's areas of focus", desc: "Rotary International's own short film on the seven areas, why these causes and what they fund." },
    { id: 'cLiX2X9zV2Y', title: 'The Rotary Foundation: 7 Areas of Focus', desc: 'A clear introduction to each area and the projects they support around the world.' },
  ],
  keepSub: 'Great project ideas deserve funding and a healthy club to run them.',
  related: [
    { to: '/handbook/grants', img: '/media/images/handbook-grants.svg', alt: 'Grants chapter', title: 'Grants: Funding Service', desc: 'Take a design from this chapter and fund it with a District or Global Grant.', go: 'Open chapter' },
    { to: '/handbook/health', img: '/media/images/handbook-health.svg', alt: 'Health checkup chapter', title: 'The Club Health Checkup', desc: 'A strong club runs projects well. Measure how strong yours is.', go: 'Open chapter' },
    { to: '/handbook', img: '/media/images/handbook-hub.svg', alt: 'Handbook hub', title: 'The Handbook', desc: 'Back to all five chapters. Rules, checklists and videos in one place.', go: 'Open hub' },
  ],
  cta: {
    title: 'Projects only matter in healthy clubs.',
    text: 'The final chapter gives every club its 75-point health checkup: the score, the gaps, the plan.',
    btn: 'Next: Club Health Checkup',
    to: '/handbook/health',
  },
  css: projectsCss,
};

const TWINSHIP = {
  title: 'Handbook: Twinship | Rotaract District 3292',
  chapter: '02',
  eyebrow: 'Handbook \u00b7 Chapter 02',
  crumb: 'Chapter 02',
  h1: 'Two clubs. One friendship.',
  sub: "Twinship is Rotaract's oldest relationship: two clubs that choose each other, across the district or across the world, and commit to joint projects, exchanged ideas and mutual celebration. This chapter covers the two kinds of twinship, how to find the right partner, the Memorandum of Understanding that makes it official, and the goodwill visits that keep it warm.",
  note: (
    <>
      Sources: the directory's <a href="/media/guides/MOU-Document.doc">Twinship &amp; MOU sections</a> and the <a href="/media/guides/Rotaract-Guidebook.pdf">District Rotaract Guidebook</a>. The MOU template in the guides folder matches the directory's sample exactly.
    </>
  ),
  img: '/media/images/handbook-twinship.svg',
  imgAlt: 'Two twinned clubs illustration',
  badges: [
    { cls: 'hc1', stroke: '#E11A6E', width: 2.6, d: 'M5 12.5l4.5 4.5L19 7.5', label: <>Intra <b>&amp;</b> inter</> },
    { cls: 'hc2', stroke: '#F2A900', width: 2.6, d: 'M5 12.5l4.5 4.5L19 7.5', label: <>MOU <b>signed</b></> },
    { cls: 'hc3', stroke: '#0E7490', width: 2.6, d: 'M5 12.5l4.5 4.5L19 7.5', label: <>5 <b>members</b></> },
    { cls: 'hc4', stroke: '#C2410C', width: 2.4, d: 'M8 14L12 18L20 8', label: <>Renewal <b>yearly</b></> },
  ],
  ticker: ['Twinship', 'Intra-district', 'Inter-district', 'Memorandum of Understanding', 'Twin club agreement', 'Goodwill visit', 'Minimum 5 members', 'Joint projects', 'Souvenir exchange', 'Yearly renewal'],
  insideSub: 'Four sections: the idea, the partner hunt, the paperwork, and the relationship that keeps both clubs growing.',
  sections: [
    {
      id: 'what-is', color: '#A80F52',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M9.5 14.5l5-5M8 12l-2.8 2.8a3.5 3.5 0 005 5L14 16.5M16 12l2.8-2.8a3.5 3.5 0 00-5-5L10 9.5" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>,
      title: 'What is a Twinship?',
      tagline: 'A voluntary partnership between two Rotaract clubs',
      img: '/media/images/handbook-twinship.svg',
      alt: 'Illustration of two clubs linked by a chain',
      intro: "Twinship is a special relationship formed between two Rotaract clubs. Twinning is a voluntary partnership, typically between clubs from different countries or regions, that promotes international understanding, fosters friendship and encourages collaboration. In District 3292 it comes in two flavors.",
      table: {
        head: ['Type', 'Who', 'What it does'],
        rows: [
          ['Intra-district twinship', 'Two or more clubs in the same district', 'Collaborates, exchanges ideas and runs projects together, building closer relationships, shared resources and mutual support in service'],
          ['Inter-district twinship', 'Clubs from different districts', 'Shares ideas, experiences and best practices across borders, enabling cultural exchange, joint projects on common challenges and global citizenship'],
        ],
      },
      stat: <>Both kinds of twinship build <span>stronger relationships, knowledge exchange and global citizenship</span>, and stronger service initiatives in the process.</>,
      checklistLabel: 'Quick-Start Checklist',
      checklistHint: 'tap to tick',
      checklist: [
        "Decide which kind of twinship fits your club's goal: local collaboration or international connection",
        'Get board approval before committing to any relationship',
        "Tell your members what a twinship will mean for them: visits, projects, exchanges",
      ],
      links: [],
    },
    {
      id: 'finding-partner', color: '#0E7490',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="6.5" stroke="#fff" strokeWidth="1.6" /><path d="M16 16l4.5 4.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" /></svg>,
      title: 'Finding the right partner',
      tagline: "Start with your Rotary club's network, then go through the district",
      img: '/media/images/handbook-twinship.svg',
      alt: 'Illustration of searching for a twin club partner',
      intro: 'After deciding the type of club that would be an appropriate match, look for a club that meets your criteria. A few reliable routes from the directory:',
      steps: [
        { n: 1, title: 'Ask your sponsoring Rotary club', body: 'It may already have a twin club relationship with another Rotary club, a ready-made bridge to their Rotaract club.' },
        { n: 2, title: 'Contact the district', body: 'Your district Rotaract chair or representative can connect you to clubs looking for a twinship.' },
        { n: 3, title: 'Set expectations', body: 'Careful planning and clear communication are essential. Like any worthwhile project, a twin club relationship takes time and effort.' },
        { n: 4, title: 'Define roles', body: 'Make sure each club clearly understands its role and responsibilities in the partnership.' },
        { n: 5, title: 'Formalize it', body: 'Sign a simple letter of agreement or MOU that outlines the goals and length of the partnership.' },
      ],
      stat: <>Most Zone 7 twinships started with <span>one email to the district committee</span>; the rest is mutual effort.</>,
      checklistLabel: 'Quick-Start Checklist',
      checklistHint: 'tap to tick',
      checklist: [
        'List the qualities you want in a partner club before you start looking',
        'Ask your sponsoring Rotary club for its twinship network',
        'Write a simple letter of agreement outlining goals and length of the partnership',
        'Agree on communication rhythm from day one',
      ],
      links: [],
    },
    {
      id: 'mou', color: '#F2A900',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 20l1-4L16.5 4.5a2.1 2.1 0 013 3L8 19l-4 1z" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" /><path d="M14.5 6.5l3 3" stroke="#fff" strokeWidth="1.6" /></svg>,
      title: 'The MOU: making it official',
      tagline: 'One joint meeting and one joint service project every year',
      img: '/media/images/handbook-twinship.svg',
      alt: 'Illustration of a memorandum of understanding document',
      intro: "The district's sample Memorandum of Understanding is short, fair and adaptable. Clubs can define their own terms, but the sample is what most Zone 7 twinships sign. Its key commitments:",
      steps: [
        { n: 1, title: 'Form the relationship', body: 'Both clubs mutually agree to be twin clubs and to abide by Rotary International rules in good faith.' },
        { n: 2, title: 'Undertake joint projects', body: 'Both parties commit to joint projects and any other necessary effort to maintain the relationship.' },
        { n: 3, title: 'Meet and serve', body: 'At least one joint meeting and one community service project together in a Rota Year.' },
        { n: 4, title: 'Exchange ideas', body: 'Project and club program ideas flow both ways.' },
        { n: 5, title: "Put each other's name out", body: "Both clubs' names and emblems appear in all publications made by either club." },
        { n: 6, title: 'Renew yearly', body: 'The MOU runs from the effective date to June 30, renewable by mutual consent in good faith. Sign it in two copies in the presence of a District Committee Member.' },
      ],
      stat: <>One meeting and one project a year is the <span>minimum the MOU promises</span>; everything beyond that is where the friendship grows.</>,
      checklistLabel: 'Quick-Start Checklist',
      checklistHint: 'tap to tick',
      checklist: [
        "Open the MOU template from the guides folder and fill in both clubs' details",
        'Schedule the joint meeting and pick the joint service project before signing',
        'Sign in two copies with a District Committee Member present as observer',
        "Print both clubs' names and emblems on every publication during the twinship",
      ],
      links: [{ label: 'MOU Template (guides folder)', url: '/media/guides/MOU-Document.doc' }],
    },
    {
      id: 'alive', color: '#E11A6E',
      icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8" r="3.4" stroke="#fff" strokeWidth="1.6" /><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6M16 5.5a3.4 3.4 0 010 6.4M17.5 14.2c2.3.6 4 2.7 4 5.8" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" /></svg>,
      title: "Keeping it alive: joint projects & goodwill visits",
      tagline: 'A twinship is a relationship, not a certificate',
      img: '/media/images/handbook-twinship.svg',
      alt: 'Illustration of members from two clubs visiting each other',
      intro: "The directory is full of ideas for developing a strong relationship, and a clear protocol for the goodwill visit, the twinship's signature event. A goodwill visit typically involves a minimum of five members from one club visiting another club's meeting, ensuring enough people to really engage.",
      steps: [
        { n: 1, title: 'Establish a pen-pal / e-mail network', body: 'Regular correspondence between twin club members keeps the relationship alive between events.' },
        { n: 2, title: 'Undertake a joint project', body: 'Any international or community service project counts; do it together.' },
        { n: 3, title: 'Arrange visits', body: 'Friendship exchange visits let members meet in person and build real bonds.' },
        { n: 4, title: 'Celebrate together', body: 'Observe a mutual day or weekend for the partnership; exchange project ideas; hold physical or web-based meetings; exchange handicrafts and local products.' },
        { n: 5, title: 'Run the visit properly', body: "Attend the host club's meeting, exchange ideas, share upcoming projects, plan joint initiatives, handle logistics and communication, and finish with a souvenir exchange of pins, flags and small keepsakes. It is not compulsory, but it is a lovely symbol of friendship." },
      ],
      stat: <>A goodwill visit needs <span>at least five members</span>, enough to genuinely engage, contribute and take ideas home.</>,
      checklistLabel: 'Quick-Start Checklist',
      checklistHint: 'tap to tick',
      checklist: [
        'Send at least five members to every goodwill visit',
        'Arrange accommodation and transportation in advance; keep communication regular',
        'Share your upcoming projects so joint planning can start during the visit',
        'Exchange club pins, flags or souvenirs as a symbolic close',
        'Follow up with a thank-you and a written visit summary for both boards',
      ],
      links: [{ label: 'District Rotaract Guidebook', url: '/media/guides/Rotaract-Guidebook.pdf' }],
    },
  ],
  watchSub: 'Twinship is a worldwide habit. This is an international twin story, from Rotaract clubs in Beograd and Roma Est, to show what a real one looks like.',
  videos: [
    { id: 'TKkCu-FLwcQ', title: 'Our Twin Story: RAC Beograd & RAC Roma Est', desc: 'An international twinship example from Rotaract clubs in Serbia and Italy. It shows how two clubs build a lasting twin relationship, one exchange at a time.' },
  ],
  keepSub: 'A twin club is your best partner for joint service and joint grants. See what to build together next.',
  related: [
    { to: '/handbook/grants', img: '/media/images/handbook-grants.svg', alt: 'Grants chapter', title: 'Grants: Funding Service', desc: 'Two clubs working together make a far stronger grant application.', go: 'Open chapter' },
    { to: '/handbook/projects', img: '/media/images/handbook-projects.svg', alt: 'Areas of focus chapter', title: 'Projects: 7 Areas of Focus', desc: 'Ready-to-run project designs to plan jointly with your twin club.', go: 'Open chapter' },
    { to: '/handbook', img: '/media/images/handbook-hub.svg', alt: 'Handbook hub', title: 'The Handbook', desc: 'Back to all five chapters. Rules, checklists and videos in one place.', go: 'Open hub' },
  ],
  cta: {
    title: 'No twin club yet? No problem.',
    text: 'The next chapter covers the other way to grow: starting a brand-new club in your community.',
    btn: 'Next: Starting a New Club',
    to: '/handbook/newclub',
  },
  css: twinshipCss,
};

const PAGES = { grants: GRANTS, health: HEALTH, newclub: NEWCLUB, projects: PROJECTS, twinship: TWINSHIP };

function WordTitle({ text }) {
  const words = text.split(' ');
  return (
    <h1>
      {words.map((w, i) => (
        <span className="rword" key={i}><span>{w}</span></span>
      ))}
    </h1>
  );
}

function Hero({ children }) {
  const ref = useRef(null);
  const canParallax =
    typeof window !== 'undefined' &&
    window.matchMedia('(pointer:fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const onMouseMove = canParallax
    ? (e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const mx = (e.clientX - r.left) / r.width - 0.5;
        const my = (e.clientY - r.top) / r.height - 0.5;
        el.querySelectorAll('[data-parallax]').forEach((p) => {
          const d = parseFloat(p.dataset.parallax) || 1;
          p.style.translate = `${(mx * 26 * d).toFixed(1)}px ${(my * 18 * d).toFixed(1)}px`;
        });
      }
    : undefined;
  return (
    <header className="hero" ref={ref} onMouseMove={onMouseMove}>
      {children}
    </header>
  );
}

function VideoCard({ v }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="video-card">
      <div className="v-thumb" onClick={() => setPlaying(true)}>
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1`}
            title={v.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
          />
        ) : (
          <>
            <img src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`} alt={v.title} loading="lazy" />
            <div className="v-play"></div>
          </>
        )}
      </div>
      <div className="v-info"><h5>{v.title}</h5><p>{v.desc}</p></div>
    </div>
  );
}

function GuideBlock({ s, open, onToggle, ticked, onTick }) {
  return (
    <div className={`guide-block${open ? ' open' : ''}`} id={s.id}>
      <div className="guide-head" onClick={onToggle}>
        <div className="guide-head-left">
          <div className="guide-icon" style={{ background: s.color }}>{s.icon}</div>
          <div>
            <h3>{s.title}</h3>
            <p className="tagline">{s.tagline}</p>
          </div>
        </div>
        <div className="guide-chevron">{CHEVRON}</div>
      </div>
      <div className="guide-body">
        <div className="guide-body-inner">
          <div className="phase-img"><img src={s.img} alt={s.alt} loading="lazy" /></div>
          <p className="intro">{s.intro}</p>
          {s.steps && (
            <ol className="steps">
              {s.steps.map((st) => (
                <li key={st.n}>
                  <span className="num">{st.n}</span>
                  <h5>{st.title}</h5>
                  <p>{st.body}</p>
                </li>
              ))}
            </ol>
          )}
          {s.table && (
            <table className="type-table">
              <thead>
                <tr>{s.table.head.map((h) => <th key={h}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {s.table.rows.map((r, i) => (
                  <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>
                ))}
              </tbody>
            </table>
          )}
          {s.featured && (
            <div className="guide-stat"><div className="g-icon">{SPARK}</div><p>{s.featured}</p></div>
          )}
          {s.stat && (
            <div className="guide-stat"><div className="g-icon">{SPARK}</div><p>{s.stat}</p></div>
          )}
          <div className="checklist-label">
            {s.checklistLabel} <span style={{ fontWeight: 500, fontSize: '.74rem', color: 'rgba(27,24,54,.45)' }}>({s.checklistHint})</span>
          </div>
          <ul className="guide-checklist">
            {s.checklist.map((c, i) => (
              <li key={i} className={ticked[i] ? 'ticked' : ''} onClick={() => onTick(i)}>{c}</li>
            ))}
          </ul>
          {s.links.length > 0 && (
            <div className="guide-links">
              <div className="guide-links-label">Useful Link</div>
              {s.links.map((l, i) =>
                l.internal ? (
                  <Link key={i} className="guide-link" to={l.url}>{LINK_ICON} {l.label}</Link>
                ) : (
                  <a
                    key={i}
                    className="guide-link"
                    href={l.url}
                    target={l.external ? '_blank' : undefined}
                    rel={l.external ? 'noopener noreferrer' : undefined}
                  >
                    {LINK_ICON} {l.label}
                  </a>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PageBody({ page }) {
  const location = useLocation();
  const [open, setOpen] = useState(() => page.sections.map(() => false));
  const [ticked, setTicked] = useState(() => page.sections.map((s) => s.checklist.map(() => false)));

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.slice(1);
      const idx = page.sections.findIndex((s) => s.id === id);
      if (idx >= 0) setOpen((prev) => prev.map((o, i) => (i === idx ? true : o)));
    }
  }, [location.hash, page]);

  const toggleOpen = (i) => setOpen((prev) => prev.map((o, j) => (j === i ? !o : o)));
  const toggleTick = (i, k) =>
    setTicked((prev) => prev.map((arr, j) => (j === i ? arr.map((v, m) => (m === k ? !v : v)) : arr)));

  let total = 0;
  let maxTotal = 0;
  const sectionCounts = {};
  if (page.score) {
    page.score.forEach((s) => {
      const idx = page.sections.findIndex((sec) => sec.id === s.id);
      const count = idx >= 0 ? (ticked[idx] || []).filter(Boolean).length : 0;
      sectionCounts[s.id] = count;
      total += count;
      maxTotal += s.max;
    });
  }

  return (
    <SiteShell current="handbook" cta="join" title={page.title} css={page.css}>
      <div className="wrap">
        <div className="crumb"><Link to="/handbook">&larr; The Handbook</Link> &middot; {page.crumb}</div>
      </div>

      <Hero>
        <div className="aurora a1"></div>
        <div className="aurora a2"></div>
        <div className="aurora a3"></div>
        <div className="fshape shape-ring" data-parallax="1"></div>
        <div className="fshape shape-tri" data-parallax="-1"></div>
        <div className="fshape shape-dot" data-parallax="2"></div>
        <div className="fshape shape-dot2" data-parallax="-2"></div>
        <div className="fshape shape-sq" data-parallax="1.4"></div>
        <div className="wrap">
          <div className="eyebrow"><span className="dot"></span>{page.eyebrow}</div>
          <WordTitle text={page.h1} />
          <p className="sub">{page.sub}</p>
          <p className="note">{page.note}</p>
          <div className="hero-grid">
            <div></div>
            <div className="hero-char">
              <div className="char-ring"></div>
              <img src={page.img} alt={page.imgAlt} data-parallax="0.6" />
              {page.badges.map((b) => (
                <div className={`hc-badge ${b.cls}`} key={b.cls}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d={b.d} stroke={b.stroke} strokeWidth={b.width} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {b.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Hero>

      <div className="ticker">
        <div className="ticker-track">
          {[...page.ticker, ...page.ticker].map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      </div>

      <div className="wrap">
        {page.score && (
          <Reveal className="score-strip">
            <div className="score-head">
              <h3>Your club's health score <span style={{ fontWeight: 500, fontSize: '.78rem', color: 'rgba(27,24,54,.5)' }}>(tap the sample checks below to score live)</span></h3>
              <div className="score-total"><span>sample score</span> <span>{total} / {maxTotal}</span></div>
            </div>
            <div className="score-cells">
              {page.score.map((s) => (
                <div className="score-cell" key={s.id}>
                  <div className="s-label">{s.label}</div>
                  <div className="s-bar">
                    <div className="s-fill" style={{ background: s.color, width: `${Math.round((sectionCounts[s.id] / s.max) * 100)}%` }}></div>
                  </div>
                  <div className="s-num"><span>{sectionCounts[s.id]}</span> / {s.max}</div>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        <Reveal as="h2" className="section-title">Inside this chapter</Reveal>
        <Reveal as="p" className="section-sub">{page.insideSub}</Reveal>
        <div className="guide-list">
          {page.sections.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.05}>
              <GuideBlock
                s={s}
                open={open[i]}
                onToggle={() => toggleOpen(i)}
                ticked={ticked[i]}
                onTick={(k) => toggleTick(i, k)}
              />
            </Reveal>
          ))}
        </div>

        <Reveal className="video-section">
          <h2 className="section-title">Watch it in action</h2>
          <p className="section-sub">{page.watchSub}</p>
          <div className="video-grid">
            {page.videos.map((v) => <VideoCard key={v.id} v={v} />)}
          </div>
        </Reveal>

        <Reveal as="h2" className="section-title">Keep going</Reveal>
        <Reveal as="p" className="section-sub">{page.keepSub}</Reveal>
        <div className="related-grid">
          {page.related.map((r, i) => (
            <Reveal key={r.to} delay={i * 0.08}>
              <Link className="rel-card" to={r.to}>
                <img src={r.img} alt={r.alt} />
                <h5>{r.title}</h5>
                <p>{r.desc}</p>
                <span className="go">{r.go} &rarr;</span>
              </Link>
            </Reveal>
          ))}
        </div>

        <div className="cta-band">
          <div>
            <h3>{page.cta.title}</h3>
            <p>{page.cta.text}</p>
          </div>
          <Link className="btn" to={page.cta.to}>{page.cta.btn} &rarr;</Link>
        </div>
      </div>
    </SiteShell>
  );
}

export default function HandbookDetailPage() {
  const { slug } = useParams();
  const page = PAGES[slug];
  if (!page) {
    return (
      <SiteShell current="handbook" cta="join" title="Handbook | Rotaract District 3292">
        <div className="wrap" style={{ padding: '120px 24px', textAlign: 'center' }}>
          <h1>Chapter not found</h1>
          <p style={{ marginTop: 12 }}><Link to="/handbook">&larr; Back to the Handbook</Link></p>
        </div>
      </SiteShell>
    );
  }
  return <PageBody key={slug} page={page} />;
}
