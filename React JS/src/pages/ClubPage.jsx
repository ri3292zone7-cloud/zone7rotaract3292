import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import SiteShell from '../components/layout/SiteShell';
import Reveal from '../components/ui/Reveal';
import { ZONE7_DB } from '../data/zone7-data';
import pageCss from './club.css?inline';

/* ------------------------------------------------------------------ *
 * Inline club profiles (from the original club.html dataset) — the
 * Supabase club_profiles row (when present) overrides board / about /
 * vision / goals on top of these.
 * ------------------------------------------------------------------ */
const CLUBS = {
  balkumari: {
    logo: "media/logos/balkumari.jpg", name: "Rotaract Club of Balkumari", ig: "rac_balkumari", email: "rotaractclubofbalkumari@gmail.com",
    loc: "Chyasal Marg, Lalitpur, Bagmati Province · Zone VII",
    founded: "18 Oct 2023", active: "15", inactive: "50", events: "7", reports: "144",
    sponsor: "Rotary Club of Butwal",
    twin: "Rotaract Club of Rudramati Babarmahal Kathmandu; Rotaract Club of KMC Duwakot",
    intlTwin: "Rotaract Club of University of Sri Jayewardenepura, RID 3220",
    interact: "N/A",
    meetingType: "Evening", meetingDay: "Saturday", meetingTime: "2:30 PM",
    vision: "Green Unity Advancement",
    about: "Chartered on 18th October 2023 and sponsored by the Rotary Club of Butwal, the Rotaract Club of Balkumari is one of Zone 7's newer clubs, based out of Chyasal Marg in Lalitpur. In a short span the club has built real momentum, running 7 recorded events and filing 144 reports, while pursuing its vision of \"Green Unity Advancement.\" The club meets on Saturday evenings at 2:30 PM and holds an international twinning partnership with the Rotaract Club of University of Sri Jayewardenepura in Sri Lanka (RID 3220), alongside domestic twin partnerships with the Rotaract Clubs of Rudramati Babarmahal Kathmandu and KMC Duwakot.",
    goals: [
      { t: "Harmonizing Sustainability for a Better Future", s: "completed" },
      { t: "Establish the Rotaract Club of Balkumari as a leading, vibrant force for community service and unity.", s: "completed" },
      { t: "Boost club performance and sustainability while attracting a diverse and committed membership.", s: "completed" },
      { t: "Enhance Rotary and Rotaract's image through impactful local partnerships.", s: "completed" },
      { t: "Drive innovative projects that address needs and promote sustainability.", s: "completed" },
      { t: "Foster leadership and use technology for unified and effective communication.", s: "completed" },
      { t: "Collaborate on community service initiatives", s: "completed" },
      { t: "Explore innovative digital out-reach strategies", s: "completed" },
      { t: "Raise awareness and advocate for social responsibility", s: "completed" },
      { t: "Showcase impactful projects and success stories", s: "completed" },
      { t: "Develop impactful and innovative projects", s: "completed" },
      { t: "Implement joint community impact projects", s: "completed" },
      { t: "Identify and implement high-impact community projects", s: "canceled" },
      { t: "Explore innovative digital out-reach strategies", s: "inprogress" },
      { t: "Conduct leadership workshops and seminars", s: "inprogress" },
      { t: "Organize educational workshops and awareness campaigns", s: "inprogress" },
      { t: "Promote sustainable practices within the club", s: "inprogress" },
      { t: "Execute community impact projects", s: "inprogress" }
    ]
  },
  baneshwor: {
    logo: "media/logos/baneshwor.jpg", name: "Rotaract Club of Baneshwor", ig: "racbaneshwor", email: "rcbaneshwor@gmail.com",
    loc: "Devkota Sadak, Kathmandu, Bagmati Province · Zone VII",
    founded: "13 Oct 2020", active: "20", inactive: "61", events: "31", reports: "326",
    sponsor: "Rotary Club of Baneshwor",
    twin: "Rotaract Club of Central Siyari; Rotaract Club of Itahari",
    intlTwin: "N/A",
    interact: "Interact Club of Chelsea International Academy",
    meetingType: "Morning", meetingDay: "Saturday", meetingTime: "10:00 AM",
    vision: "To become a trusted and inspiring Rotaract Club that creates meaningful community impact through small, consistent acts of service, empowers future leaders, and builds lasting fellowship.",
    about: "The Rotaract Club of Baneshwor is a club of enthusiastic youths committed to the welfare of society, sponsored by the Rotary Club of Baneshwor and chartered on 13th October 2020. Based on Devkota Sadak in Kathmandu, the club has been one of the zone's most active, logging 31 events and 326 reports to date. It meets Saturday mornings at 10:00 AM and works closely with its Interact partner, the Interact Club of Chelsea International Academy, alongside twin clubs in Central Siyari and Itahari. The club's vision centres on building meaningful community impact through small, consistent acts of service.",
    goals: [
      { t: "Community Impact Initiative", s: "inprogress" },
      { t: "Lead with Purpose; Build Future Leaders", s: "inprogress" },
      { t: "Together We Grow", s: "inprogress" },
      { t: "Strategic Partnerships & Collaboration", s: "inprogress" },
      { t: "Club Excellence", s: "inprogress" },
      { t: "Networking & Global Connections", s: "inprogress" }
    ]
  },
  liberty: {
    logo: "media/logos/liberty.jpg", name: "Rotaract Club of Liberty College", ig: "rotaractcluboflibertycollege", email: "raclibertycollege123@gmail.com",
    loc: "Liberty College, Shanti Binayak Marg, Pushpa Nagar, Buddha Nagar, Kathmandu-10, Bagmati Province · Zone VII",
    founded: "1 May 2012", active: "21", inactive: "140", events: "45", reports: "304",
    sponsor: "Rotary Club of Nagarjun",
    twin: "Rotaract Club of Central Lumbini",
    intlTwin: "N/A",
    interact: "N/A",
    meetingType: "Midday", meetingDay: "Tuesday", meetingTime: "12:00 PM",
    vision: "To realize the spirit of \"Empower to Impact\" by building an inclusive, innovative, and sustainable Rotaract Club where every member is empowered to lead with integrity, serve with purpose, and create lasting value for the community and future generations.",
    about: "A college-based club housed at Liberty College in Buddha Nagar, Kathmandu, the Rotaract Club of Liberty College is one of the longest-standing clubs in Zone 7, chartered on 1st May 2012 and sponsored by the Rotary Club of Nagarjun. Over more than a decade the club has run 45 events and filed 304 reports, and is twinned with the Rotaract Club of Central Lumbini. Members meet on Tuesdays around midday, and the club's guiding theme, \"Empower to Impact,\" runs through its seven active goals, from strengthening its Rotary partnership to building a recognizable club brand.",
    goals: [
      { t: "Build a stronger, more engaged, and sustainable club.", s: "inprogress" },
      { t: "Empower members with leadership, career, and entrepreneurial skills.", s: "inprogress" },
      { t: "Deliver sustainable projects that address genuine community needs.", s: "inprogress" },
      { t: "Expand global understanding through collaboration and cultural exchange.", s: "inprogress" },
      { t: "Create a thriving membership experience from recruitment to leadership.", s: "inprogress" },
      { t: "Strengthen the Rotary–Rotaract partnership through meaningful collaboration.", s: "inprogress" },
      { t: "Build a professional and recognizable club brand.", s: "inprogress" }
    ]
  },
  kathmanduwest: {
    logo: "media/logos/kathmanduwest.jpg", name: "Rotaract Club of Kathmandu West", ig: "kathmanduwest", email: "Kathmanduwest@rotaract3292.org",
    loc: "Kathmandu Model College, Narayan Bilash Marg, Bhotahity, Baghbazar, Kathmandu, Bagmati Province · Zone VII",
    founded: "10 Sep 2007", active: "24", inactive: "147", events: "16", reports: "455",
    sponsor: "Rotary Club of Kathmandu West",
    twin: "Rotaract Club of Mapusa; Rotaract Club of Madhyapur; Rotaract Club of Bharatpur; Rotaract Club of Pune Mideast",
    intlTwin: "N/A",
    interact: "N/A",
    meetingType: "Morning", meetingDay: "Saturday", meetingTime: "10:00 AM",
    vision: "To build a confident, capable and connected pool of young leaders whose service, learning and collaboration echo well beyond the RY 2026–27 term, strengthening the club's foundations, deepening ties with community and district, and leaving a sustainable legacy for the next generation of Rotaractors.",
    about: "Chartered on 10th September 2007 and sponsored by the Rotary Club of Kathmandu West, this club is now well into its second decade of \"Rotaractivity,\" guided by the motto: \"Our task is not to fix the blame for the past, but fix the course for the future.\" Based at Kathmandu Model College in Baghbazar, it is one of the most prolific clubs in the zone by reporting volume, with 455 reports and 16 events logged. The club holds four twin-club partnerships, with clubs in Mapusa, Madhyapur, Bharatpur, and Pune Mideast, and meets Saturday mornings at 10:00 AM.",
    goals: [
      { t: "Strengthen Member Engagement, Initiative and Retention", s: "inprogress" },
      { t: "Advance the Professional and Personal Development of Members", s: "inprogress" },
      { t: "Deepen the Club's External Relations and Participation", s: "inprogress" },
      { t: "Uphold Full Compliance with District Standards and Governance", s: "inprogress" },
      { t: "Uplift Community Impact Through Awareness and a Culture of Service", s: "inprogress" }
    ]
  },
  kathmanduheight: {
    logo: "media/logos/kathmanduheight.jpg", name: "Rotaract Club of Kathmandu Height", ig: "rackathmanduheight", email: "Kathmanduheight@rotaract3292.org",
    loc: "New Summit College, Basuki Marg, Baneshwar, Kathmandu-31, Bagmati Province · Zone VII",
    founded: "6 Jan 2026", active: "23", inactive: "0", events: "1", reports: "24",
    sponsor: "Rotary Club of Kathmandu Height",
    twin: "N/A", intlTwin: "N/A", interact: "N/A",
    meetingType: "Morning", meetingDay: "Saturday", meetingTime: "10:00 AM",
    vision: "Developing competent leaders for a brighter tomorrow.",
    about: "The newest club in Zone 7, the Rotaract Club of Kathmandu Height was chartered on 6th January 2026 and is sponsored by the Rotary Club of Kathmandu Height. Based at New Summit College in Baneshwar, the club launched strong with 23 active members and no inactive members yet, a sign of an engaged founding cohort. In its first months it has already filed 24 reports. The club meets Saturday mornings at 10:00 AM and is guided by its vision of \"developing competent leaders for a brighter tomorrow,\" with five founding goals spanning fellowship, leadership, community service, youth engagement and personal development.",
    goals: [
      { t: "Foster Fellowship and Lasting Connections", s: "inprogress" },
      { t: "Develop Competent Leaders", s: "inprogress" },
      { t: "Promote Meaningful Community Service", s: "inprogress" },
      { t: "Empower Youth Through Learning and Engagement", s: "inprogress" },
      { t: "Advance Professional and Personal Development", s: "inprogress" }
    ]
  },
  sankhu: {
    logo: "media/logos/sankhu.jpg", name: "Rotaract Club of Sankhu", ig: "racsankhu", email: "Rotaractclubofsankhu@gmail.com",
    loc: "Sankhu, Shankharapur-07, Shankharapur, Kathmandu, Bagmati Province · Zone VII",
    founded: "25 Jun 2020", active: "19", inactive: "25", events: "17", reports: "178",
    sponsor: "Rotary Club of Sankhu",
    twin: "Rotaract Club of Kathmandu Metro",
    intlTwin: "N/A",
    interact: "Interact Club of Evergreen School",
    meetingType: "Evening", meetingDay: "Wednesday", meetingTime: "5:00 PM",
    vision: "Literate Sankhu",
    about: "Chartered on 25th June 2020 and sponsored by the Rotary Club of Sankhu, this club serves the historic town of Sankhu in Shankharapur, Kathmandu. Guided by Rotary International's ethos to \"serve to change lives,\" the club focuses on enhancing members' knowledge and skills so they can tackle societal issues through sustainable projects. Its central vision, \"Literate Sankhu,\" reflects a strong focus on education in the local community, supported by its Interact partner, the Interact Club of Evergreen School, and twin club Rotaract Club of Kathmandu Metro. The club meets Wednesday evenings at 5:00 PM and has logged 17 events and 178 reports since chartering.",
    goals: [
      { t: "Support Literacy Mission", s: "inprogress" },
      { t: "Hellos Period", s: "inprogress", pct: "75%" },
      { t: "Membership Growth", s: "inprogress" }
    ]
  },
  newroadcity: {
    logo: "media/logos/newroadcity.jpg", name: "Rotaract Club of New Road City Kathmandu", ig: "racnewroadcity1", email: "racnewroadcitykathmandu@gmail.com",
    loc: "New Road, Makkhan Tol, Yetkha, Kathmandu, Bagmati Province · Zone VII",
    founded: "1 Sep 2004", active: "14", inactive: "180", events: "33", reports: "186",
    sponsor: "Rotary Club of New Road City",
    twin: "N/A", intlTwin: "N/A",
    interact: "Interact Club of New Road City",
    meetingType: "Morning", meetingDay: "Saturday", meetingTime: "10:30 AM",
    vision: "There is no active club vision on record.",
    about: "One of the most established clubs in Zone 7, the Rotaract Club of New Road City Kathmandu was chartered on 1st September 2004 and is sponsored by the Rotary Club of New Road City. Based in the historic New Road / Makkhan Tol area of Kathmandu, the club has built a long track record with 33 events and 186 reports over two decades, and works alongside its own Interact Club of New Road City. Members meet Saturday mornings at 10:30 AM. The club does not currently have an active vision statement or goals logged on record.",
    goals: []
  },
  sukedhara: {
    logo: "media/logos/sukedhara.jpg", name: "Rotaract Club of Sukedhara", ig: "rac_sukedhara", email: "s.sukedhara@rotaract3292.org",
    loc: "Kathmandu National School, Surya Bikram Gyawali Marga, Baneshwar, Kathmandu-31, Bagmati Province · Zone VII",
    founded: "1 Jul 2019", active: "20", inactive: "68", events: "21", reports: "309",
    sponsor: "Rotary Club of Nagarjun",
    twin: "Rotaract Club of Damak; Rotaract Club of United Birgunj",
    intlTwin: "N/A", interact: "N/A",
    meetingType: "Morning", meetingDay: "Saturday", meetingTime: "10:00 AM",
    vision: "To be a dynamic and impactful Rotaract Club that inspires positive change, develops compassionate leaders, and creates sustainable solutions that make a meaningful difference in our communities.",
    about: "Chartered on 1st July 2019 and sponsored by the Rotary Club of Nagarjun, the Rotaract Club of Sukedhara meets at Kathmandu National School in Baneshwar. The club has grown steadily since chartering, logging 21 events and 309 reports, and holds twin-club partnerships with the Rotaract Clubs of Damak and United Birgunj. Meeting Saturday mornings at 10:00 AM, the club pursues a vision of inspiring positive change and developing compassionate leaders, structured around four active goals covering member engagement, partnerships, governance and leadership.",
    goals: [
      { t: "Member Engagement", s: "inprogress" },
      { t: "Strategic Partnerships", s: "inprogress" },
      { t: "Good Governance", s: "inprogress" },
      { t: "Purposeful Leadership", s: "inprogress" }
    ]
  },
  tripureswor: {
    logo: "media/logos/tripureswor.jpg", name: "Rotaract Club of Tripureswor", ig: "ractripureswor", email: "tripureshwor@rotaract3292.org",
    loc: "Apex College, Devkota Sadak, Srijana Tole, Baneshwar, Kathmandu, Bagmati Province · Zone VII",
    founded: "24 Nov 2003", active: "25", inactive: "219", events: "17", reports: "316",
    sponsor: "Rotary Club of Tripureswor",
    twin: "Rotaract Club of Tinau City; Rotaract Club of Tulsipur; Rotaract Club of Banepa",
    intlTwin: "N/A",
    interact: "Interact Club of Tripureswor",
    meetingType: "Morning", meetingDay: "1st & 3rd Saturday", meetingTime: "11:00 AM",
    vision: "To be a dynamic and inclusive Rotaract Club recognized for empowering youth, driving community transformation, and advancing global goodwill through service and leadership.",
    about: "Chartered on 24th November 2003, the Rotaract Club of Tripureswor is one of Zone 7's oldest and largest clubs, meeting on the 1st and 3rd Saturday of every month at 11:00 AM at Apex College. Sponsored by the Rotary Club of Tripureswor, the club runs projects spanning club service, community activities, international service and professional development, and works alongside the Interact Club of Tripureswor. It maintains three twin-club partnerships, with clubs in Tinau City, Tulsipur, and Banepa, and has amassed 316 reports and 17 events over more than two decades of activity.",
    goals: [
      { t: "Community Service Goal", s: "inprogress", pct: "50%" },
      { t: "Professional Development Goal", s: "inprogress", pct: "50%" },
      { t: "Club Membership Growth & Retention Goal", s: "inprogress", pct: "50%" },
      { t: "Public Image and Branding Goal", s: "inprogress", pct: "25%" },
      { t: "International Service and TRF Support Goal", s: "completed" }
    ]
  }
};

/* Each club gets its own accent palette + hero motif (from club.html). */
const CLUB_THEMES = {
  balkumari: {
    icon: "🌿", identity: "The Sustainability Club",
    c1: "#1c8a4d", c2: "#12633a", gold: "#9ecb4a",
    blob1: "radial-gradient(circle, rgba(28,138,77,.4), transparent 68%)",
    blob2: "radial-gradient(circle, rgba(158,203,74,.24), transparent 65%)",
    pattern: "repeating-radial-gradient(circle at 10% 10%, rgba(158,203,74,.16) 0, rgba(158,203,74,.16) 2px, transparent 3px, transparent 42px)"
  },
  baneshwor: {
    icon: "🌅", identity: "The Steady-Impact Club",
    c1: "#d9822b", c2: "#a8531a", gold: "#f2c94c",
    blob1: "radial-gradient(circle, rgba(217,130,43,.38), transparent 68%)",
    blob2: "radial-gradient(circle, rgba(242,201,76,.22), transparent 65%)",
    pattern: "radial-gradient(rgba(242,201,76,.16) 1.6px, transparent 1.6px)", bgSize: "26px 26px"
  },
  liberty: {
    icon: "⚡", identity: "The Empowerment Club",
    c1: "#5b4fd1", c2: "#382c9e", gold: "#7fd8ff",
    blob1: "radial-gradient(circle, rgba(91,79,209,.42), transparent 68%)",
    blob2: "radial-gradient(circle, rgba(127,216,255,.22), transparent 65%)",
    pattern: "repeating-linear-gradient(115deg, rgba(127,216,255,.14) 0 2px, transparent 2px 34px)"
  },
  kathmanduwest: {
    icon: "🧭", identity: "The Legacy Club",
    c1: "#8a6300", c2: "#5c4300", gold: "#d4af37",
    blob1: "radial-gradient(circle, rgba(138,99,0,.4), transparent 68%)",
    blob2: "radial-gradient(circle, rgba(212,175,55,.24), transparent 65%)",
    pattern: "repeating-radial-gradient(circle at 82% 18%, rgba(212,175,55,.14) 0, rgba(212,175,55,.14) 1px, transparent 2px, transparent 30px)"
  },
  kathmanduheight: {
    icon: "⛰️", identity: "The Rising Club",
    c1: "#1c8fa0", c2: "#0f5c68", gold: "#6fe7c4",
    blob1: "radial-gradient(circle, rgba(28,143,160,.4), transparent 68%)",
    blob2: "radial-gradient(circle, rgba(111,231,196,.24), transparent 65%)",
    pattern: "repeating-linear-gradient(62deg, rgba(111,231,196,.14) 0 2px, transparent 2px 36px)"
  },
  sankhu: {
    icon: "📖", identity: "The Literacy Club",
    c1: "#b5651d", c2: "#7a3e0f", gold: "#e0a72e",
    blob1: "radial-gradient(circle, rgba(181,101,29,.4), transparent 68%)",
    blob2: "radial-gradient(circle, rgba(224,167,46,.22), transparent 65%)",
    pattern: "repeating-linear-gradient(0deg, rgba(224,167,46,.13) 0 1px, transparent 1px 18px)"
  },
  newroadcity: {
    icon: "🏮", identity: "The Heritage Club",
    c1: "#8a1538", c2: "#5c0d24", gold: "#cba135",
    blob1: "radial-gradient(circle, rgba(138,21,56,.42), transparent 68%)",
    blob2: "radial-gradient(circle, rgba(203,161,53,.22), transparent 65%)",
    pattern: "repeating-linear-gradient(45deg, rgba(203,161,53,.10) 0 1px, transparent 1px 24px), repeating-linear-gradient(-45deg, rgba(203,161,53,.10) 0 1px, transparent 1px 24px)"
  },
  sukedhara: {
    icon: "🫂", identity: "The Compassion Club",
    c1: "#e0475f", c2: "#a82f43", gold: "#ffb86b",
    blob1: "radial-gradient(circle, rgba(224,71,95,.4), transparent 68%)",
    blob2: "radial-gradient(circle, rgba(255,184,107,.24), transparent 65%)",
    pattern: "radial-gradient(circle at 75% 30%, rgba(255,184,107,.2), transparent 55%), radial-gradient(circle at 20% 80%, rgba(224,71,95,.14), transparent 50%)"
  },
  tripureswor: {
    icon: "🌐", identity: "The Flagship Club",
    c1: "#6a3fa0", c2: "#452869", gold: "#d4af37",
    blob1: "radial-gradient(circle, rgba(106,63,160,.42), transparent 68%)",
    blob2: "radial-gradient(circle, rgba(212,175,55,.22), transparent 65%)",
    pattern: "repeating-linear-gradient(0deg, rgba(212,175,55,.09) 0 1px, transparent 1px 40px), repeating-linear-gradient(90deg, rgba(212,175,55,.09) 0 1px, transparent 1px 40px)"
  }
};

const TABS = [
  { k: 'about', label: 'About' },
  { k: 'board', label: 'Board' },
  { k: 'goals', label: 'Goals' },
  { k: 'projects', label: 'Projects' },
  { k: 'join', label: 'Join' }
];

function abs(src) {
  if (!src) return '';
  if (/^data:/i.test(src) || /^https?:\/\//i.test(src) || src.startsWith('/')) return src;
  return '/' + src;
}

function clubInitials(name) {
  return String(name || '').replace(/Rotaract Club of /i, '').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

function personInitials(name) {
  return String(name || '').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() || '—';
}

/* Animated counter — the stat strip numbers count up when scrolled into view. */
function AnimatedCount({ value }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(() => {
    const target = String(value);
    return /^\d+/.test(target) ? '0' : target;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      obs.disconnect();
      const target = String(value);
      if (!/^\d+/.test(target)) { setDisplay(target); return; }
      const num = parseInt(target, 10);
      const rest = target.replace(/^\d+/, '');
      let cur = 0;
      const step = Math.max(1, Math.ceil(num / 40));
      const t = setInterval(() => {
        cur += step;
        if (cur >= num) { cur = num; clearInterval(t); }
        setDisplay(cur + rest);
      }, 25);
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);

  return <b ref={ref}>{display}</b>;
}

const pctFor = (g) => (g.s === 'completed' ? '100%' : g.s === 'canceled' ? '100%' : (g.pct || '0%'));

function GoalRow({ g }) {
  const fillRef = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = fillRef.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className={`goal-row ${g.s}`}>
      <div className="g-ic">{g.s === 'completed' ? '✓' : g.s === 'canceled' ? '✕' : '◐'}</div>
      <div className="g-text">{g.t}</div>
      {g.s === 'inprogress' ? (
        <div className="g-progress">
          <div className="g-bar-track"><div className="g-bar-fill" ref={fillRef} style={{ width: inView ? pctFor(g) : '0%' }}></div></div>
          <span className="g-pct">{g.pct ? g.pct : '—'}</span>
        </div>
      ) : null}
      <span className="g-status">{g.s === 'inprogress' ? 'In Progress' : g.s}</span>
    </div>
  );
}

function BoardCard({ m, i }) {
  return (
    <div className={`board-card${i === 0 ? ' featured' : ''}`}>
      <div className="board-photo">
        {m.photo ? <img src={abs(m.photo)} alt={m.name} loading="lazy" /> : <span className="board-initials">{personInitials(m.name)}</span>}
        {i === 0 ? <span className="board-crown">👑 {m.role}</span> : null}
      </div>
      <div className="board-info"><h5>{m.name}</h5><span>{m.role}</span></div>
    </div>
  );
}

export default function ClubPage() {
  const { slug } = useParams();
  const club = CLUBS[slug] || null;
  const theme = CLUB_THEMES[slug] || null;

  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState(null);
  const [activeTab, setActiveTab] = useState('about');

  /* Merge editable club-profile overrides (board / about / vision / goals). */
  useEffect(() => {
    if (!slug) return;
    let alive = true;
    ZONE7_DB.getClubProfile(slug)
      .then((p) => { if (alive && p) setProfile(p); })
      .catch(() => {});
    return () => { alive = false; };
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    let alive = true;
    setProjects(null);
    ZONE7_DB.getProjects(slug, { limit: 60 })
      .then((rows) => { if (alive) setProjects(rows || []); })
      .catch(() => { if (alive) setProjects([]); });
    return () => { alive = false; };
  }, [slug]);

  /* Re-skin the page's accent palette to this club's identity (as club.html did). */
  useEffect(() => {
    if (!theme) return;
    const root = document.documentElement;
    const prev = {};
    [['--magenta', theme.c1], ['--magenta-deep', theme.c2], ['--gold', theme.gold]].forEach(([prop, val]) => {
      prev[prop] = root.style.getPropertyValue(prop);
      root.style.setProperty(prop, val);
    });
    return () => {
      Object.entries(prev).forEach(([prop, val]) => {
        if (val) root.style.setProperty(prop, val);
        else root.style.removeProperty(prop);
      });
    };
  }, [theme]);

  if (!club) {
    return (
      <SiteShell current="clubs" cta="join" title="Club not found | Zone 7 Rotaract 3292" css={pageCss}>
        <div className="empty-state">
          <h2>Club not found</h2>
          <p style={{ color: 'rgba(27,24,54,.6)', marginTop: 10 }}>Go back and select a club from the homepage.</p>
        </div>
      </SiteShell>
    );
  }

  const board = (profile && profile.board && profile.board.length) ? profile.board : null;
  const about = (profile && profile.about) ? profile.about : club.about;
  const vision = (profile && profile.vision) ? profile.vision : club.vision;
  const goals = (profile && profile.goals && profile.goals.length) ? profile.goals : (club.goals || []);
  const shortName = club.name.replace('Rotaract Club of ', '');
  const hasVision = vision && vision !== 'There is no active club vision on record.';
  const initials = clubInitials(club.name);
  const doneCount = goals.filter((g) => g.s === 'completed').length;
  const donePct = goals.length ? Math.round((doneCount / goals.length) * 100) : 0;

  const facts = [
    ['Sponsoring Rotary Club', club.sponsor],
    ['Meeting Schedule', `${club.meetingDay} · ${club.meetingTime} (${club.meetingType})`],
    ['Interact Club', club.interact || 'N/A'],
    ['International Twin', club.intlTwin || 'N/A'],
    ['Inactive Members on Record', club.inactive],
    ['Contact Email', club.email],
    ['Zone', 'Zone VII, District 3292'],
    ['Charter Date', club.founded]
  ];

  return (
    <SiteShell
      current="clubs"
      cta="join"
      title={`${club.name} | Zone 7 Rotaract 3292`}
      css={pageCss}
    >
      <header className="chero">
        <div className="chero-blob1" style={theme ? { background: theme.blob1 } : undefined}></div>
        <div className="chero-blob2" style={theme ? { background: theme.blob2 } : undefined}></div>
        <div className="chero-pattern" style={theme ? { backgroundImage: theme.pattern, backgroundSize: theme.bgSize || undefined } : undefined}></div>
        <div className="chero-7" style={theme ? { fontSize: '13rem' } : undefined}>{theme ? theme.icon : '7'}</div>
        <div className="wrap">
          <div className="chero-top">
            <div className="chero-mark">{club.logo ? <img src={abs(club.logo)} alt={`${club.name} logo`} /> : initials}</div>
            <span className="chero-eyebrow">Zone VII · District 3292 · Chartered {club.founded}</span>
          </div>
          <h1>{club.name}</h1>
          <div className="loc">📍 {club.loc}</div>
          {theme ? <div className="chero-identity"><span className="ic">{theme.icon}</span>{theme.identity}</div> : null}
          {hasVision ? <div className="chero-vision">"{vision}"</div> : null}
          <div className="chero-actions">
            {club.ig ? <a className="btn btn-primary" href={`https://www.instagram.com/${club.ig}/`} target="_blank" rel="noopener noreferrer">Follow @{club.ig} →</a> : null}
            <a className="btn btn-ghost-dark" href={`mailto:${club.email}`}>Email the Club</a>
            <Link className="btn btn-ghost-dark" to="/join">Join This Club</Link>
          </div>
          <div className="stat-strip">
            <div className="s"><AnimatedCount value={club.active} /><span>Active Members</span></div>
            <div className="s"><AnimatedCount value={club.events} /><span>Events Logged</span></div>
            <div className="s"><AnimatedCount value={club.reports} /><span>Reports Filed</span></div>
            <div className="s"><AnimatedCount value={String(club.founded.split(' ').pop())} /><span>Chartered</span></div>
          </div>
        </div>
      </header>

      <div className="club-tabs" role="tablist" aria-label="Club profile sections">
        {TABS.map((t) => (
          <button
            key={t.k}
            type="button"
            role="tab"
            aria-selected={activeTab === t.k}
            className={activeTab === t.k ? 'active' : ''}
            onClick={() => setActiveTab(t.k)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'about' && (
        <section className="csec wrap" id="about">
          <Reveal as="span" className="csec-tag">The Club</Reveal>
          <Reveal as="h2">About {shortName}.</Reveal>
          <div className="about-grid">
            <Reveal>
              <p>{about}</p>
              {(club.twin && club.twin !== 'N/A') ? (
                <div className="link-strip">
                  {club.twin.split(';').map((t, i) => <span key={i} className="link-chip">🔗 {t.trim()}</span>)}
                </div>
              ) : null}
            </Reveal>
            <Reveal className="quickfacts" id="facts">
              {facts.map(([k, v]) => (
                <div key={k} className="qf"><span className="k">{k}</span><span className="v">{v}</span></div>
              ))}
            </Reveal>
          </div>
        </section>
      )}

      {activeTab === 'board' && (
        <section className="csec board-sec wrap" id="board">
          <div className="board-head">
            <div>
              <Reveal as="span" className="csec-tag">Leadership</Reveal>
              <Reveal as="h2">Meet the club's board.</Reveal>
            </div>
          </div>
          {board ? (
            <Reveal className="board-track">
              {board.map((m, i) => <BoardCard key={m.id || i} m={m} i={i} />)}
            </Reveal>
          ) : (
            <Reveal className="board-empty">This club hasn't added its board lineup yet. <b>Club officers</b> can add photos and roles for the President and team via the Club Admin panel.</Reveal>
          )}
        </section>
      )}

      {activeTab === 'goals' && (
        <section className="csec goals-sec" id="goals">
          <div className="wrap">
            <div className="goals-head-row">
              <div>
                <Reveal as="span" className="csec-tag">Focus &amp; Direction</Reveal>
                <Reveal as="h2" style={{ marginBottom: 0 }}>Goals {shortName} is working toward.</Reveal>
              </div>
              {goals.length ? (
                <Reveal className="goals-summary">
                  <div className="gs-ring" style={{ '--pct': donePct }}><span>{donePct}%</span></div>
                  <div className="gs-text"><b>{doneCount}</b> of <b>{goals.length}</b> goals<br />completed this term</div>
                </Reveal>
              ) : null}
            </div>
            {goals.length ? (
              <Reveal className="goals-list">
                {goals.slice(0, 8).map((g, i) => <GoalRow key={i} g={g} />)}
              </Reveal>
            ) : (
              <Reveal as="p" className="no-goals">No active club goals on record yet.</Reveal>
            )}
          </div>
        </section>
      )}

      {activeTab === 'projects' && (
        <section className="csec wrap" id="projects">
          <Reveal as="span" className="csec-tag">In Action</Reveal>
          <Reveal as="h2">Projects run by this club.</Reveal>
          <div className="pmasonry" id="pmasonry">
            {projects === null ? <p style={{ color: 'rgba(27,24,54,.5)' }}>Loading projects…</p> : null}
            {Array.isArray(projects) && projects.length ? projects.map((p) => (
              <Link
                key={p.id}
                className="pcard"
                style={{ display: 'block' }}
                to={`/project?club=${encodeURIComponent(slug)}&id=${encodeURIComponent(p.id)}`}
              >
                <img src={p.cover || 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600'} alt={p.title} loading="lazy" />
                <div className="pcard-cap"><b>{p.title}</b><span>{p.category || 'Project'} · {p.date || ''}</span></div>
              </Link>
            )) : null}
            {Array.isArray(projects) && !projects.length ? (
              <div className="no-projects-note">This club hasn't published any projects yet. Club officers can add projects from the <Link to="/admin" style={{ color: 'var(--magenta-deep)', fontWeight: 700 }}>Club Admin panel</Link>.</div>
            ) : null}
          </div>
        </section>
      )}

      {activeTab === 'join' && (
        <section className="join-cta wrap">
          <Reveal className="join-card">
            <h2>Want to join {club.name}?</h2>
            <p>Membership is open to anyone aged 18–30. Fill out one short form and this club will welcome you in.</p>
            <div className="join-actions">
              <Link className="btn btn-primary" to="/join">Fill the Join Form →</Link>
              <Link className="btn btn-ghost-dark" style={{ borderColor: 'rgba(255,255,255,.5)' }} to="/#clubs">Explore Other Clubs</Link>
            </div>
          </Reveal>
        </section>
      )}
    </SiteShell>
  );
}
