import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SiteShell from '../components/layout/SiteShell';
import pageCss from './club-guides.css?inline';

const REDUCED = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

const PLAY_SVG = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 4l13 8-13 8V4z" fill="currentColor" /></svg>
);
const LINK_SVG = (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M6 4H4a1 1 0 00-1 1v7a1 1 0 001 1h7a1 1 0 001-1v-2M9 3h4v4M13 3L7 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

const GENRES = {
  leadership: 'Officer Season', projects: 'Action', finance: 'Drama', publicimage: 'Publicity',
  profdev: 'Learning', international: 'Adventure', recognition: 'Feel-Good', sponsor: 'Partnership',
  digital: 'Sci-Tech', wellbeing: 'Slice of Life', makeup: 'Procedural'
};

const POSTER_ART = {
  leadership: `<svg viewBox="0 0 160 110" fill="none"><circle cx="46" cy="42" r="9" stroke="#fff" stroke-width="3"/><path d="M32 92c3-17 7-27 14-27s11 10 14 27" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/><circle cx="114" cy="42" r="9" stroke="#fff" stroke-width="3"/><path d="M100 92c3-17 7-27 14-27s11 10 14 27" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/><path d="M64 48l14-22M58 48l20-14" stroke="#F2A900" stroke-width="4" stroke-linecap="round"/></svg>`,
  projects: `<svg viewBox="0 0 160 110" fill="none"><path d="M80 6c11 15 20 28 20 43 0 17-9 30-20 30S60 66 60 49c0-15 9-28 20-43z" stroke="#fff" stroke-width="3.5" stroke-linejoin="round"/><circle cx="80" cy="48" r="5.5" stroke="#fff" stroke-width="3"/><path d="M80 76v14M72 90h16" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/><path d="M58 20c-13 4-20 13-20 26M102 20c13 4 20 13 20 26" stroke="#F2A900" stroke-width="3" stroke-linecap="round"/><path d="M70 30l16 18M86 30L70 48" stroke="#F2A900" stroke-width="3" stroke-linecap="round"/></svg>`,
  finance: `<svg viewBox="0 0 160 110" fill="none"><ellipse cx="58" cy="66" rx="26" ry="9" stroke="#fff" stroke-width="3.5"/><ellipse cx="58" cy="42" rx="26" ry="9" stroke="#fff" stroke-width="3.5"/><path d="M58 33v66M48 44h13a5.5 5.5 0 010 11M48 66h13a5.5 5.5 0 010 11" stroke="#fff" stroke-width="3.2" stroke-linecap="round"/><path d="M112 86V44M98 60l14-16 14 16" stroke="#F2A900" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  publicimage: `<svg viewBox="0 0 160 110" fill="none"><path d="M26 62v16a4 4 0 004 4h10l24 17V41L40 58H30a4 4 0 00-4 4z" stroke="#fff" stroke-width="3.5" stroke-linejoin="round"/><path d="M84 52a26 26 0 010 22M98 42a40 40 0 010 42" stroke="#fff" stroke-width="3" stroke-linecap="round"/><circle cx="102" cy="26" r="4" fill="#F2A900"/><circle cx="116" cy="17" r="2.6" fill="#F2A900"/><circle cx="121" cy="33" r="2.6" fill="#F2A900"/></svg>`,
  profdev: `<svg viewBox="0 0 160 110" fill="none"><path d="M46 52l68-20 68 20-68 20-68-20z" stroke="#fff" stroke-width="3.5" stroke-linejoin="round"/><path d="M76 64v26c0 11 22 18 40 18s40-7 40-18V64" stroke="#fff" stroke-width="3.5" stroke-linejoin="round"/><path d="M76 90v-22M96 66v-8" stroke="#F2A900" stroke-width="3.5" stroke-linecap="round"/><circle cx="122" cy="18" r="3" fill="#F2A900"/><circle cx="134" cy="12" r="2" fill="#F2A900"/></svg>`,
  international: `<svg viewBox="0 0 160 110" fill="none"><circle cx="74" cy="54" r="30" stroke="#fff" stroke-width="3.5"/><ellipse cx="74" cy="54" rx="12" ry="30" stroke="#fff" stroke-width="3"/><path d="M44 54h60" stroke="#fff" stroke-width="3"/><path d="M18 92c18-16 32-22 46-22M128 92c-18-16-32-22-46-22" stroke="#F2A900" stroke-width="3" stroke-linecap="round" stroke-dasharray="1 7"/><path d="M126 34l12 6-12 6v-12z" fill="#F2A900"/></svg>`,
  recognition: `<svg viewBox="0 0 160 110" fill="none"><path d="M54 26h52v30a26 26 0 01-52 0z" stroke="#fff" stroke-width="3.5" stroke-linejoin="round"/><path d="M54 32H40a13 13 0 0013 15M106 32h14a13 13 0 01-13 15" stroke="#fff" stroke-width="3.5" stroke-linejoin="round"/><path d="M80 82v18M66 100h28" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/><path d="M80 52c6-7 13-5 17-2M80 52c-6-7-13-5-17-2" stroke="#F2A900" stroke-width="3.5" stroke-linecap="round"/></svg>`,
  sponsor: `<svg viewBox="0 0 160 110" fill="none"><path d="M80 24l10 11 14-2-6 13 8 12-13 3-5 13-8-10-8 10-5-13-13-3 8-12-6-13 14 2z" stroke="#fff" stroke-width="3" stroke-linejoin="round"/><path d="M80 96l10-16 10 16M90 80l6-8 8 3" stroke="#F2A900" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  digital: `<svg viewBox="0 0 160 110" fill="none"><rect x="34" y="26" width="92" height="56" rx="7" stroke="#fff" stroke-width="3.5"/><path d="M24 96h112M46 96l8-14h52l8 14" stroke="#fff" stroke-width="3.5" stroke-linejoin="round"/><path d="M108 58h20a11 11 0 000-22c-2-9-13-13-21-8a13 13 0 00-24 4c-8 2-12 11-9 18" stroke="#F2A900" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  wellbeing: `<svg viewBox="0 0 160 110" fill="none"><path d="M14 58h30l12-24 16 48 12-24h30" stroke="#F2A900" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M80 104c-10-7-18-12-18-20a9.5 9.5 0 0117-6 9.5 9.5 0 0117 6c0 8-8 13-18 20z" stroke="#fff" stroke-width="3.5" stroke-linejoin="round"/></svg>`,
  makeup: `<svg viewBox="0 0 160 110" fill="none"><rect x="46" y="18" width="68" height="46" rx="5" stroke="#fff" stroke-width="3.5"/><path d="M56 30h48M56 40h48M56 50h30" stroke="#fff" stroke-width="3" stroke-linecap="round"/><rect x="96" y="52" width="38" height="38" rx="7" stroke="#F2A900" stroke-width="3.5" transform="rotate(12 115 71)"/><path d="M107 71l7 8 12-15" stroke="#F2A900" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" transform="rotate(12 115 71)"/></svg>`
};

const SLIDE_ART = {
  leadership: [
    `<svg viewBox="0 0 320 180" fill="none"><path d="M88 46h64" stroke="#fff" stroke-width="6" stroke-linecap="round"/><rect x="68" y="38" width="106" height="16" rx="8" stroke="#fff" stroke-width="6"/><rect x="64" y="56" width="116" height="92" rx="10" stroke="#fff" stroke-width="6"/><path d="M82 78h48M82 102h70M82 126h58" stroke="#F2A900" stroke-width="6" stroke-linecap="round"/><path d="M236 44a18 20 0 0132 0" stroke="#fff" stroke-width="6" stroke-linecap="round"/><rect x="234" y="42" width="42" height="54" rx="9" stroke="#fff" stroke-width="6"/><circle cx="255" cy="66" r="6" fill="#F2A900"/><path d="M249 88h18" stroke="#F2A900" stroke-width="6" stroke-linecap="round"/></svg>`,
    `<svg viewBox="0 0 320 180" fill="none"><rect x="52" y="74" width="116" height="58" rx="10" stroke="#fff" stroke-width="6"/><path d="M68 92h84M68 106h56" stroke="#F2A900" stroke-width="6" stroke-linecap="round"/><path d="M108 135v24M94 135h46" stroke="#fff" stroke-width="6" stroke-linecap="round"/><path d="M218 46l20-13 20 13-20 13z" stroke="#F2A900" stroke-width="6" stroke-linejoin="round"/><path d="M238 33v14M238 47v6" stroke="#F2A900" stroke-width="6" stroke-linecap="round"/><path d="M230 66v8M238 66v8" stroke="#F2A900" stroke-width="6" stroke-linecap="round"/><circle cx="234" cy="78" r="3.5" fill="#F2A900"/></svg>`
  ],
  projects: [
    `<svg viewBox="0 0 320 180" fill="none"><circle cx="128" cy="90" r="52" stroke="#fff" stroke-width="6"/><circle cx="128" cy="90" r="34" stroke="#fff" stroke-width="6"/><circle cx="128" cy="90" r="16" fill="#F2A900"/><path d="M212 44h40" stroke="#fff" stroke-width="6" stroke-linecap="round"/><rect x="212" y="58" width="40" height="84" rx="8" stroke="#fff" stroke-width="6"/><path d="M224 78l8 10 12-17M224 102l8 10 12-17" stroke="#F2A900" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    `<svg viewBox="0 0 320 180" fill="none"><circle cx="96" cy="78" r="22" stroke="#fff" stroke-width="6"/><path d="M70 128c2-26 14-40 26-40s24 14 26 40" stroke="#fff" stroke-width="7" stroke-linecap="round"/><circle cx="224" cy="78" r="22" stroke="#fff" stroke-width="6"/><path d="M198 128c2-26 14-40 26-40s24 14 26 40" stroke="#fff" stroke-width="7" stroke-linecap="round"/><path d="M128 70h64M128 90h64" stroke="#F2A900" stroke-width="6" stroke-linecap="round"/><rect x="140" y="120" width="40" height="22" rx="6" stroke="#F2A900" stroke-width="6"/><path d="M150 130l8 6 12-14" stroke="#F2A900" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  ],
  finance: [
    `<svg viewBox="0 0 320 180" fill="none"><circle cx="130" cy="92" r="52" stroke="#fff" stroke-width="6"/><circle cx="130" cy="92" r="36" stroke="#fff" stroke-width="5"/><path d="M110 70l10 9 16-18" stroke="#F2A900" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><path d="M218 62c-8 10-10 18-6 26" stroke="#F2A900" stroke-width="7" stroke-linecap="round"/><path d="M224 52l-14 44" stroke="#F2A900" stroke-width="7" stroke-linecap="round"/><path d="M236 28l-8 18" stroke="#fff" stroke-width="7" stroke-linecap="round"/><path d="M258 34c-6 8-8 14-6 20" stroke="#fff" stroke-width="7" stroke-linecap="round"/><path d="M248 26l-10 40" stroke="#fff" stroke-width="7" stroke-linecap="round"/></svg>`,
    `<svg viewBox="0 0 320 180" fill="none"><path d="M92 142h140" stroke="#fff" stroke-width="6" stroke-linecap="round"/><rect x="106" y="104" width="30" height="38" rx="5" stroke="#fff" stroke-width="6"/><rect x="152" y="88" width="30" height="54" rx="5" stroke="#fff" stroke-width="6"/><rect x="198" y="68" width="30" height="74" rx="5" stroke="#F2A900" stroke-width="6"/><path d="M222 54l14 0" stroke="#F2A900" stroke-width="6" stroke-linecap="round"/><path d="M216 48l20 6-20 22" stroke="#F2A900" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="60" cy="54" r="15" stroke="#fff" stroke-width="6"/><path d="M60 48v12M54 54h12" stroke="#F2A900" stroke-width="5" stroke-linecap="round"/></svg>`
  ],
  publicimage: [
    `<svg viewBox="0 0 320 180" fill="none"><rect x="40" y="46" width="106" height="76" rx="12" stroke="#fff" stroke-width="6"/><rect x="70" y="34" width="38" height="20" rx="6" stroke="#fff" stroke-width="6"/><circle cx="96" cy="86" r="26" stroke="#fff" stroke-width="6"/><circle cx="96" cy="86" r="9" stroke="#F2A900" stroke-width="6"/><rect x="190" y="40" width="78" height="30" rx="8" stroke="#fff" stroke-width="6"/><rect x="190" y="76" width="78" height="30" rx="8" stroke="#F2A900" stroke-width="6"/><rect x="190" y="112" width="78" height="30" rx="8" stroke="#fff" stroke-width="6"/><path d="M204 72l16 6 10 8" stroke="#F2A900" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    `<svg viewBox="0 0 320 180" fill="none"><rect x="46" y="56" width="72" height="80" rx="10" stroke="#fff" stroke-width="6"/><circle cx="82" cy="82" r="9" stroke="#fff" stroke-width="6"/><path d="M82 95l6 8 10-14" stroke="#F2A900" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><rect x="138" y="56" width="72" height="80" rx="10" stroke="#fff" stroke-width="6"/><path d="M154 72h32M154 92h32M154 112h22" stroke="#F2A900" stroke-width="6" stroke-linecap="round"/><rect x="230" y="56" width="72" height="80" rx="10" stroke="#fff" stroke-width="6"/><path d="M240 86l12 16 20-26" stroke="#F2A900" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><path d="M118 96h22" stroke="#fff" stroke-width="6" stroke-linecap="round"/><path d="M126 88l8 8-8 8" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  ],
  profdev: [
    `<svg viewBox="0 0 320 180" fill="none"><rect x="46" y="52" width="120" height="92" rx="12" stroke="#fff" stroke-width="6"/><path d="M64 72h84M64 96h52M64 120h70" stroke="#F2A900" stroke-width="6" stroke-linecap="round"/><path d="M186 80h20l-6 12 6 12h88" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><path d="M254 52v22M246 52h16M246 74h16" stroke="#F2A900" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="238" cy="126" r="14" fill="#F2A900"/></svg>`,
    `<svg viewBox="0 0 320 180" fill="none"><circle cx="96" cy="76" r="24" stroke="#fff" stroke-width="6"/><circle cx="224" cy="76" r="24" stroke="#fff" stroke-width="6"/><path d="M120 70h80" stroke="#F2A900" stroke-width="6" stroke-dasharray="10 8" stroke-linecap="round"/><path d="M154 108l18-6" stroke="#F2A900" stroke-width="6" stroke-linecap="round"/><path d="M184 92l20 12" stroke="#F2A900" stroke-width="6" stroke-linecap="round"/><path d="M160 30c-22 0-34 12-38 28" stroke="#F2A900" stroke-width="6" stroke-linecap="round"/><path d="M120 48l-6-12 12 6z" fill="#F2A900"/><path d="M96 56c-12 0-20 8-24 20" stroke="#fff" stroke-width="5" stroke-linecap="round"/></svg>`
  ],
  international: [
    `<svg viewBox="0 0 320 180" fill="none"><rect x="60" y="36" width="140" height="94" rx="10" stroke="#fff" stroke-width="6"/><path d="M76 58h108M76 78h108" stroke="#F2A900" stroke-width="6" stroke-linecap="round"/><path d="M76 100h60" stroke="#fff" stroke-width="5" stroke-linecap="round"/><path d="M168 114l10 10 16-18" stroke="#F2A900" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="246" cy="56" r="22" stroke="#fff" stroke-width="6"/><ellipse cx="246" cy="56" rx="9" ry="22" stroke="#fff" stroke-width="5"/><path d="M228 94c6-14 12-19 22-22" stroke="#F2A900" stroke-width="6" stroke-linecap="round"/><path d="M58 126c6-8 12-12 18-12" stroke="#F2A900" stroke-width="6" stroke-linecap="round"/></svg>`,
    `<svg viewBox="0 0 320 180" fill="none"><circle cx="84" cy="56" r="18" stroke="#fff" stroke-width="6"/><path d="M84 74l-12 26M84 74l12 26M96 100h-24" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><circle cx="236" cy="56" r="18" stroke="#fff" stroke-width="6"/><path d="M236 74l-12 26M236 74l12 26M248 100h-24" stroke="#F2A900" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><path d="M104 88h44" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-dasharray="9 9"/><path d="M200 76l14 12-14 12" stroke="#F2A900" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>`
  ],
  recognition: [
    `<svg viewBox="0 0 320 180" fill="none"><rect x="52" y="40" width="110" height="62" rx="9" stroke="#fff" stroke-width="6"/><rect x="52" y="62" width="110" height="6" stroke="#fff" stroke-width="5"/><path d="M68 30v22M92 30v22M116 30v22M140 30v22" stroke="#F2A900" stroke-width="6" stroke-linecap="round"/><circle cx="143" cy="100" r="15" fill="#F2A900"/><path d="M248 40l9 18 20 3-14 14 3 20-8-6-2 16-8-6-16 8 6-16-18 4 6-14-14-8 16 2z" stroke="#fff" stroke-width="6" stroke-linejoin="round"/></svg>`,
    `<svg viewBox="0 0 320 180" fill="none"><path d="M56 62c0-16 14-28 34-28M264 62c0-16-14-28-34-28" stroke="#fff" stroke-width="6" stroke-linecap="round"/><path d="M88 34v60" stroke="#fff" stroke-width="6" stroke-linecap="round"/><path d="M232 34v60" stroke="#fff" stroke-width="6" stroke-linecap="round"/><path d="M160 112v-20" stroke="#fff" stroke-width="6" stroke-linecap="round"/><path d="M140 74h40a20 20 0 010 40h-40a20 20 0 010-40z" stroke="#F2A900" stroke-width="6" stroke-linejoin="round"/><path d="M150 70h20" stroke="#F2A900" stroke-width="6" stroke-linecap="round"/><path d="M118 148h84" stroke="#fff" stroke-width="6" stroke-linecap="round"/><path d="M120 168h8M164 168h8M188 168h8" stroke="#F2A900" stroke-width="5" stroke-linecap="round"/><path d="M96 168h16M196 168h16" stroke="#fff" stroke-width="5" stroke-linecap="round"/></svg>`
  ],
  sponsor: [
    `<svg viewBox="0 0 320 180" fill="none"><circle cx="84" cy="72" r="20" stroke="#fff" stroke-width="6"/><circle cx="236" cy="72" r="20" stroke="#fff" stroke-width="6"/><path d="M60 116c8-10 12-16 24-16h76c12 0 16 6 24 16" stroke="#fff" stroke-width="6" stroke-linecap="round"/><path d="M104 132c-6 0-10-4-10-10s4-10 10-10 10 4 10 10-4 10-10 10z" fill="#F2A900"/><path d="M216 132c-6 0-10-4-10-10s4-10 10-10 10 4 10 10-4 10-10 10z" fill="#F2A900"/></svg>`,
    `<svg viewBox="0 0 320 180" fill="none"><path d="M84 58h64a8 8 0 018 8v12a8 8 0 01-8 8H84" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><rect x="84" y="34" width="12" height="44" rx="6" stroke="#fff" stroke-width="6"/><path d="M148 64l26-6v40l-26-6" stroke="#F2A900" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><path d="M174 58v40l28 12 22-4" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><path d="M236 90c10-16 22-20 32-14" stroke="#F2A900" stroke-width="6" stroke-linecap="round"/><path d="M238 76c6-4 14-4 18 2" stroke="#F2A900" stroke-width="6" stroke-linecap="round"/></svg>`
  ],
  digital: [
    `<svg viewBox="0 0 320 180" fill="none"><ellipse cx="160" cy="70" rx="96" ry="24" stroke="#fff" stroke-width="6"/><path d="M64 70v52a96 24 0 001 0 96 24 0 01191 0V70M163 27c14 10 0 20-6 24" stroke="#fff" stroke-width="6" stroke-linecap="round"/><path d="M70 118c40 14 140 14 180 0" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".45"/><circle cx="160" cy="96" r="18" stroke="#F2A900" stroke-width="6"/><path d="M150 96l8 8 14-14" stroke="#F2A900" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    `<svg viewBox="0 0 320 180" fill="none"><rect x="40" y="52" width="92" height="82" rx="10" stroke="#fff" stroke-width="6"/><path d="M56 74h60M56 96h60" stroke="#F2A900" stroke-width="6" stroke-linecap="round"/><path d="M184 44v118" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-dasharray="8 8"/><path d="M200 58h64a10 10 0 0110 10v72a10 10 0 01-10 8h-20l-8 8-4-8h-32c-6 0-10-4-10-10V68c0-6 4-10 10-10z" stroke="#F2A900" stroke-width="6" stroke-linejoin="round"/><path d="M216 84h30M216 108h30" stroke="#fff" stroke-width="5" stroke-linecap="round"/></svg>`
  ],
  wellbeing: [
    `<svg viewBox="0 0 320 180" fill="none"><circle cx="160" cy="60" r="17" fill="#F2A900"/><circle cx="84" cy="118" r="17" stroke="#fff" stroke-width="6"/><circle cx="160" cy="136" r="17" stroke="#fff" stroke-width="6"/><circle cx="236" cy="118" r="17" stroke="#fff" stroke-width="6"/><path d="M118 52l24 6M154 52v40M202 52l-24 6" stroke="#F2A900" stroke-width="6" stroke-linecap="round"/><path d="M96 114l-8 8M174 122l8 8M226 112l2 12" stroke="#F2A900" stroke-width="6" stroke-linecap="round"/></svg>`,
    `<svg viewBox="0 0 320 180" fill="none"><path d="M48 146h36" stroke="#fff" stroke-width="6" stroke-linecap="round"/><path d="M64 146c-8-8-12-16-6-26 6 4 6 10 2 14z" fill="#F2A900"/><path d="M160 132c12 0 22 10 22 22" stroke="#fff" stroke-width="6" stroke-linecap="round"/><path d="M160 132l10 18" stroke="#F2A900" stroke-width="6" stroke-linecap="round"/><path d="M248 46l26 6-16 12 6 24-22-8-22 8 6-24-16-12 26-6z" fill="#F2A900"/><path d="M104 40l20-10 20 16-4 22-18-8-18 8z" stroke="#fff" stroke-width="6" stroke-linejoin="round"/><path d="M86 42l4-18 18 4z" fill="#F2A900"/><path d="M84 78l14 4M72 70l14 2" stroke="#fff" stroke-width="6" stroke-linecap="round"/></svg>`
  ],
  makeup: [
    `<svg viewBox="0 0 320 180" fill="none"><rect x="34" y="30" width="150" height="30" rx="8" stroke="#fff" stroke-width="6"/><path d="M34 60v58a10 10 0 0010 10h28v18" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><rect x="54" y="52" width="150" height="94" rx="10" stroke="#fff" stroke-width="6"/><path d="M206 44h70" stroke="#fff" stroke-width="6" stroke-linecap="round"/><path d="M212 74h10M212 74v0z" stroke="#F2A900" stroke-width="5" stroke-linecap="round"/><circle cx="278" cy="120" r="22" fill="#F2A900"/><path d="M268 120l8 10 14-18" stroke="#1B1836" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    `<svg viewBox="0 0 320 180" fill="none"><rect x="66" y="40" width="104" height="92" rx="10" stroke="#fff" stroke-width="6"/><path d="M82 58h72M82 78h72M82 98h46" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".5"/><path d="M94 60l8 8 12-14" stroke="#F2A900" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><path d="M94 80l8 8 12-14" stroke="#F2A900" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><path d="M208 132h-14l-6 18 26-10" stroke="#F2A900" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><rect x="200" y="118" width="52" height="40" rx="6" stroke="#F2A900" stroke-width="6" transform="rotate(-8 226 138)"/><path d="M216 132l8 8 14-16" stroke="#F2A900" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" transform="rotate(-8 226 138)"/><path d="M52 152c14-8 42-12 66-12" stroke="#fff" stroke-width="6" stroke-linecap="round"/></svg>`
  ]
};

const GUIDES = [
  {
    id: 'leadership', poster: 'leadership', genre: GENRES.leadership, runtime: '4 min',
    title: 'Leadership & Officer Transition',
    tagline: 'Handoffs, training and keeping the story going',
    synopsis: 'Every Rotaract year lives or dies in the first two weeks of July. A real handoff, not a hallway chat, is what keeps the club running.',
    slides: [
      { cap: 'One board out, one board in. The story has to survive the change.' },
      { art: 'leadership0', cap: "July: the new board inherits logins, records and a one-page 'state of the club' brief." },
      { art: 'leadership1', cap: 'Train before you take office. DLTS and COTS make the first month painless.' }
    ],
    body: `<p class="intro">Every Rotaract year lives or dies in the first two weeks of July. That's when a brand-new board either inherits a running club or inherits a mystery. The single biggest cause of a slow start is a new officer getting the title but not the context. Fix it with a real handoff, not a hallway chat the week before installation.</p>`,
    stat: { icon: '⏱️', text: `Clubs that do a <span>formal handoff meeting</span> before installation consistently hit the ground running by August. The ones that don't often spend their first two months just figuring out where things are.` },
    checklist: [
      'Schedule a formal handoff meeting between outgoing and incoming officers before the new Rotary year starts',
      "Pass on login credentials, shared drives, financial records and ongoing project files as a package, not piecemeal",
      "Write a one-page 'state of the club' brief: what's working, what's stuck, who the key contacts are",
      'Have new officers attend District Leadership Training (DLTS) and Certificate of Training Seminars (COTS) before taking office',
      "Keep the President and VP working as a team through the transition. Succession works best when the VP has been shadowing all year"
    ],
    links: [
      { label: 'Rotary Learning Center (rotary.org/learn)', url: 'https://my.rotary.org/en/learning-reference' },
      { label: 'Rotaract South Asia MDIO Library (DRR/officer workbooks)', url: 'https://library.rsamdio.org/' }
    ]
  },
  {
    id: 'projects', poster: 'projects', genre: GENRES.projects, runtime: '5 min',
    title: 'Service Project Execution',
    tagline: 'Turning a good idea into one that actually lasts',
    synopsis: "A proposal form tells you what a club plans to do. This story is about the how. Needs assessment, buy-in, and measuring whether anything changed.",
    slides: [
      { cap: 'Every great project starts with a real problem. Ask the community first.' },
      { art: 'projects0', cap: 'Plan 2–3 measurable outcomes before the banner goes up.' },
      { art: 'projects1', cap: 'Partner early, document as you go. Sustainability beats a photo-op.' }
    ],
    body: `<p class="intro">A project proposal form tells you <em>what</em> a club plans to do. It doesn't tell you <em>how</em> to make sure it works, or whether it sticks around after the banner comes down. That's a separate skill: needs assessment, community buy-in, and actually measuring whether anything changed. RI has literally built two frameworks for this, and they're gold even outside a grant application.</p>`,
    stat: { icon: '🎯', text: `Projects built around <span>2-3 measurable outcomes</span> set before the event, not just an activity count, are far easier to report on, fund again, and be proud of a year later.` },
    checklist: [
      'Start with a real needs assessment. Talk to the community before deciding on the solution',
      "Use RI's Six Steps to Sustainability to check a project will create lasting change, not a one-off photo-op",
      'Partner early with a Rotary club, another Rotaract club, or a local organization for capacity and credibility',
      "Define 2-3 measurable outcomes before you start (e.g. '40 trees planted', not just 'we did a tree-planting event')",
      "Document as you go, with photos, numbers and quotes, so reporting and storytelling aren't a scramble afterward"
    ],
    links: [
      { label: 'Six Steps to Sustainability & Project Lifecycle Kit (rotary.org)', url: 'https://www.rotary.org/en/get-involved/rotaract-clubs/details' }
    ]
  },
  {
    id: 'finance', poster: 'finance', genre: GENRES.finance, runtime: '4 min',
    title: 'Finance & Fundraising',
    tagline: 'Running the money side without the drama',
    synopsis: "Most club finance problems aren't fraud. They're messy handoffs and a budget nobody checks. A boring system everyone uses beats a fancy one nobody follows.",
    slides: [
      { cap: 'A boring system beats a fancy one. Agree a budget first.' },
      { art: 'finance0', cap: 'Two signatures on every big spend keep everyone honest.' },
      { art: 'finance1', cap: 'An income/expense summary at every board meeting catches problems in weeks, not June.' }
    ],
    body: `<p class="intro">Most club finance problems aren't fraud. They're just messy handoffs and a budget nobody actually checks. A boring system that everyone uses beats a fancy one nobody follows. This is home-grown Zone 7 wisdom, since there's no single RI manual for day-to-day club treasury life.</p>`,
    stat: { icon: '💸', text: `Clubs that share a simple <span>income/expense summary at every board meeting</span>, not just at year-end, catch problems in weeks instead of finding out in June.` },
    checklist: [
      'Set an annual budget at the start of the year, split by category (projects, events, admin, contingency)',
      'Require two signatories or approvals for any spending above a set threshold your club agrees on',
      'Reconcile and share a simple income/expense summary at every board meeting, not just at year-end',
      'Separate project-specific fundraising (earmarked) from general club dues in your records',
      "Build a one-page sponsorship pitch template so members aren't reinventing the ask every time"
    ],
    original: true,
    links: []
  },
  {
    id: 'publicimage', poster: 'publicimage', genre: GENRES.publicimage, runtime: '4 min',
    title: 'Public Image & Communications',
    tagline: 'Making your work visible, credible and on-brand',
    synopsis: "A great project nobody hears about doesn't grow your club, attract members, or convince a sponsor. Public image is how one project becomes a reputation.",
    slides: [
      { cap: "If nobody hears about it, it didn't happen." },
      { art: 'publicimage0', cap: 'Document before, during and after, not just the group photo.' },
      { art: 'publicimage1', cap: 'Turn every project into a story: problem, action, outcome.' }
    ],
    body: `<p class="intro">A great project nobody hears about doesn't grow your club, attract members, or convince a sponsor to fund the next one. Public image isn't vanity. For a youth-led org competing for attention, it's literally how one project becomes a reputation.</p>`,
    stat: { icon: '📸', text: `Clubs that post <span>consistently, not just after big events</span>, feel far more "alive" to prospective members scrolling their page for the first time.` },
    checklist: [
      'Photograph and document every event. Capture before, during, and the people impacted, not just the group photo',
      'Post consistently rather than only after big events; small updates keep a page feeling alive',
      "Use RI's official Rotaract/Rotary logo and brand assets rather than freehand versions",
      'Turn each project into a short story. Problem, action, outcome, rather than just an announcement',
      'Tag your sponsoring Rotary club and district in posts to reinforce the partnership publicly'
    ],
    links: [
      { label: 'Rotaract overview & brand context (rotary.org)', url: 'https://www.rotary.org/en/get-involved/rotaract-clubs' }
    ]
  },
  {
    id: 'profdev', poster: 'profdev', genre: GENRES.profdev, runtime: '4 min',
    title: 'Professional Development',
    tagline: 'The other reason people join: building real skills',
    synopsis: 'Members join for service and fellowship, but skills-building is what keeps early-career members coming back year after year. And it\'s free to run.',
    slides: [
      { cap: 'Skills are the second reason people join, and stay.' },
      { art: 'profdev0', cap: '600+ free courses in the Rotary Learning Center. A ready-made workshop every month.' },
      { art: 'profdev1', cap: 'Pair members with Rotarian mentors; rotate who leads each session.' }
    ],
    body: `<p class="intro">Rotaract's fourth Avenue of Service is Professional Development, and it's often the most slept-on. Members join for service and fellowship, but skills-building is what keeps early-career members coming back year after year. The nice part: it's free to run if you use what RI already built for you.</p>`,
    stat: { icon: '🎓', text: `Rotary's Learning Center has <span>600+ free courses</span>. Enough ready-made workshop content to run one every month without writing a single slide yourself.` },
    checklist: [
      'Run at least one skills workshop per quarter. Try public speaking, resume/interview prep, negotiation, or project management',
      'Pair newer members with a Rotarian mentor from your sponsoring club for career guidance',
      "Use Rotary's Learning Center courses as ready-made workshop content instead of building from scratch",
      'Rotate who leads each session so facilitation skills spread across the club, not just the VP',
      'Track attendance at development sessions the same way you track service hours. It signals that it matters'
    ],
    links: [
      { label: 'Rotary Learning Center: 600+ courses (rotary.org/learn)', url: 'https://my.rotary.org/en/learning-reference' }
    ]
  },
  {
    id: 'international', poster: 'international', genre: GENRES.international, runtime: '4 min',
    title: 'International & Inter-club Relations',
    tagline: 'Twin clubs, MDIOs, and life beyond your own city',
    synopsis: 'Some Zone 7 clubs already hold twin-club partnerships abroad. They only stay alive if someone actively tends the relationship after the charter photo.',
    slides: [
      { cap: 'Twinships are doors. Someone has to hold them open.' },
      { art: 'international0', cap: 'A signed MOU makes it official: one joint meeting and one joint project a year.' },
      { art: 'international1', cap: 'Inter-club visits are the cheapest way to build and keep the bond.' }
    ],
    body: `<p class="intro">Some Zone 7 clubs already hold twin-club partnerships abroad. They're doors to joint projects, cultural exchange and international service credit. But only if someone actively tends the relationship instead of letting it go quiet right after the charter photo.</p>`,
    stat: { icon: '🌏', text: `One <span>joint project a year</span> with your twin club, even a small one, keeps an international partnership genuinely alive instead of being a name on a certificate.` },
    checklist: [
      'Assign one board member to own each twin-club relationship. Regular contact, not just an annual message',
      'Look for a joint project each year, even a small one, to keep the partnership active and mutually useful',
      'Connect with your MDIO (multidistrict information organization) for regional idea-sharing and networking',
      'Consider dual Rotary-Rotaract membership pathways for members transitioning between organizations',
      "Use inter-club visits (attending another club's meeting) as a low-cost way to build the relationship"
    ],
    links: [
      { label: 'Rotaract South Asia MDIO Library', url: 'https://library.rsamdio.org/' }
    ]
  },
  {
    id: 'recognition', poster: 'recognition', genre: GENRES.recognition, runtime: '4 min',
    title: 'Recognition & Events',
    tagline: 'Celebrating the year, and making members feel seen',
    synopsis: "Recognition isn't a nice-to-have. It's basically a retention hack. Members who feel their work is actually seen stick around longer.",
    slides: [
      { cap: 'Members who feel seen stay.' },
      { art: 'recognition0', cap: 'World Rotaract Week in March. One signature activity every year.' },
      { art: 'recognition1', cap: "Close the year with a President's Night, not a fade-out." }
    ],
    body: `<p class="intro">Recognition isn't just a nice-to-have. It's basically a retention hack. Members who feel their work is actually seen stick around longer. RI backs a couple of official recognition moments worth anchoring your calendar around.</p>`,
    stat: { icon: '🏆', text: `Clubs that run a <span>proper year-end celebration</span> instead of just fading out in June report noticeably higher member return rates the following year.` },
    checklist: [
      'Mark World Rotaract Week each March with at least one signature club activity',
      "Use RI's official Certificate of Recognition to formally acknowledge outstanding projects or members",
      "Run a President's Night or year-end celebration to close the Rotary year with intention, not a fade-out",
      'Recognize the small stuff too. Attendance streaks, first-time project leads, not only the big wins',
      'Nominate standout projects for district or RI-level awards; the application itself is a great reflection exercise'
    ],
    links: [
      { label: 'World Rotaract Week & Certificate of Recognition (rotary.org)', url: 'https://www.rotary.org/en/get-involved/rotaract-clubs/details' }
    ]
  },
  {
    id: 'sponsor', poster: 'sponsor', genre: GENRES.sponsor, runtime: '4 min',
    title: 'Sponsor Relationship Management',
    tagline: 'Getting the most out of your Rotary sponsor club',
    synopsis: 'A well-run sponsor relationship is one of the most underrated resources a club has. Funding help, mentorship, credibility, institutional memory.',
    slides: [
      { cap: 'A sponsor club is a resource, not a formality.' },
      { art: 'sponsor0', cap: 'Set mutual expectations early: how often you talk, what support looks like.' },
      { art: 'sponsor1', cap: 'A quick public thank-you is the cheapest retention tool you own.' }
    ],
    body: `<p class="intro">Since 2020, Rotaract clubs can technically stand alone. But most Zone 7 clubs still have a Rotary sponsor, and a well-run one is one of the most underrated resources a club has: funding help, mentorship, credibility, institutional memory. Home-grown Zone 7 guidance here, since every sponsor relationship looks a little different.</p>`,
    stat: { icon: '🤝', text: `A quick <span>public thank-you</span> after a joint project costs nothing and is often the single biggest reason a sponsor club stays engaged year after year.` },
    checklist: [
      'Invite your Rotary advisor to attend meetings regularly, not just for ceremonial events',
      "Set clear, mutual expectations early: how often you'll communicate, and what support looks like",
      'Loop your sponsor in on major decisions and project plans before they\'re finalized, not after',
      'Encourage informal mentoring between individual Rotarians and Rotaractors, not just club-to-club contact',
      'Say thank-you publicly. Sponsor clubs that feel valued stay invested for longer'
    ],
    original: true,
    links: []
  },
  {
    id: 'digital', poster: 'digital', genre: GENRES.digital, runtime: '4 min',
    title: 'Digital Tools & Tech',
    tagline: 'Staying organized without 6 confusing WhatsApp groups',
    synopsis: 'Most club knowledge quietly dies in old WhatsApp threads and a personal Google Drive nobody else can access. A little structure saves enormous pain.',
    slides: [
      { cap: 'One shared drive = the single source of truth.' },
      { art: 'digital0', cap: 'Separate the channels: official business vs. casual chat.' },
      { art: 'digital1', cap: 'Back everything up somewhere no single person controls.' }
    ],
    body: `<p class="intro">Most club knowledge quietly dies in old WhatsApp threads, or in a personal Google Drive that nobody else can access. A little structure early on saves enormous pain at every handoff. This is general good practice, not an official RI standard. Take what fits your club's size.</p>`,
    stat: { icon: '💾', text: `One <span>shared drive as the single source of truth</span> saves more headaches at officer handoff than any other single habit on this page.` },
    checklist: [
      'Keep one shared drive as the single source of truth for constitution, financials, and project records',
      'Separate communication channels: one for official business, one for social/casual chat',
      'Use a shared calendar for meetings, deadlines and events that every member can see',
      'Standardize file naming (e.g. date + project name) so nothing gets lost between officer terms',
      "Back up financial and membership records outside of any one person's personal device"
    ],
    original: true,
    links: []
  },
  {
    id: 'wellbeing', poster: 'wellbeing', genre: GENRES.wellbeing, runtime: '4 min',
    title: 'Wellbeing & Culture',
    tagline: 'Keeping the club a place people actually want to show up to',
    synopsis: 'Burnout is the quiet reason clubs lose good members. Not lack of interest. Just too much ask with too little balance.',
    slides: [
      { cap: 'Burnout loses members quietly. Balance is the vaccine.' },
      { art: 'wellbeing0', cap: "Spread ownership so the same three people aren't running everything." },
      { art: 'wellbeing1', cap: 'Celebrate small wins regularly. Morale compounds.' }
    ],
    body: `<p class="intro">Burnout is the quiet reason clubs lose good members. Not lack of interest. Just too much ask with too little balance. A club's culture gets built on purpose, the same way its projects do. Zone 7 original guidance, drawn from common patterns across youth-led organizations everywhere.</p>`,
    stat: { icon: '💛', text: `Clubs that keep the same <span>3 people running everything</span> lose them to burnout fastest. Spreading ownership around is the single best insurance policy against it.` },
    checklist: [
      'Balance the calendar. Not every meeting needs to be a project planning session. Leave room for pure fellowship',
      "Watch for over-reliance on a small core group; spread ownership so the same people aren't running everything",
      'Address conflict directly and early rather than letting it fester into silent disengagement',
      'Respect that most members are also students or early-career professionals. Build in flexibility, not guilt',
      'Celebrate small wins regularly; morale compounds the same way burnout does'
    ],
    original: true,
    links: []
  },
  {
    id: 'makeup', poster: 'makeup', genre: GENRES.makeup, runtime: '4 min',
    title: 'Attendance & Make-up',
    tagline: 'Missing a meeting without missing a beat',
    synopsis: "Missed your club's meeting? Many clubs let you make it up by attending another club's. The make-up card is how you prove it. Print, attend, stamp, submit.",
    slides: [
      { cap: 'Missed a meeting? Many clubs let you make it up at another club.' },
      { art: 'makeup0', cap: 'Pick a meeting, attend as a guest, take part. Then get it logged.' },
      { art: 'makeup1', cap: "Host secretary signs or stamps the card; your club secretary records it." }
    ],
    body: `<p class="intro">Life happens. Exams, travel, work. Most clubs have a make-up system so one missed meeting doesn't break your attendance record. You attend <em>another</em> Rotaract (or Rotary) club's meeting instead, and a make-up card, signed or stamped by the host club's secretary, is the proof your club secretary logs against your record. This is home-grown Zone 7 guidance. The district's own directory checks that clubs maintain attendance records, and this is the cleanest way to do it.</p>`,
    stat: { icon: '🎟️', text: `One <span>signed make-up card</span> turns a missed meeting into a logged visit. It also doubles as your ticket to explore other clubs in the zone.` },
    checklist: [
      'Ask your club secretary how make-ups are recorded in your club before you travel',
      "Pick the meeting you'll attend. Another Rotaract club's meeting (the homepage club grid lists all nine), an inter-club visit, or a sponsoring Rotary club's meeting",
      'Attend as a guest and take part. Introduce yourself and note the meeting topic and date',
      "At the end, ask the host club's secretary to fill in and sign the make-up card, or stamp it with the club seal",
      'Hand the completed card to your club secretary so the attendance gets logged against your record'
    ],
    original: true,
    links: [
      { label: 'Goodwill visits & twinship chapter', url: '/handbook/twinship' },
      { label: 'How meetings work (tutorials)', url: '/tutorials' }
    ],
    printable: true
  }
];

const doneKey = id => 'z7cg-' + id;

function loadDone() {
  const out = {};
  GUIDES.forEach(g => {
    try { out[g.id] = JSON.parse(localStorage.getItem(doneKey(g.id)) || '[]'); } catch (e) { console.warn('z7cg progress read failed', e); out[g.id] = []; }
  });
  return out;
}

function slideArt(g, i) {
  const s = g.slides[i];
  if (!s.art) return POSTER_ART[g.poster];
  const m = s.art.match(/^(\D+)(\d+)$/);
  if (!m) return POSTER_ART[g.poster];
  return SLIDE_ART[m[1]][+m[2]];
}

function slideSVG(g, i, cls) {
  const art = slideArt(g, i);
  if (!cls) return art;
  return art.replace(/^<svg/, `<svg class="${cls}"`);
}

function grad1(g) {
  const p = g.poster;
  return p === 'leadership' ? '#E11A6E' : p === 'projects' ? '#2563EB' : p === 'finance' ? '#A80F52' : p === 'publicimage' ? '#D97706' : p === 'profdev' ? '#7C3AED' : p === 'international' ? '#1c8a4d' : p === 'recognition' ? '#059669' : p === 'sponsor' ? '#8a6300' : p === 'digital' ? '#1B1836' : p === 'wellbeing' ? '#E11A6E' : '#3E3A6E';
}
function grad2() { return '#1B1836'; }

function stripTags(html) {
  return html.replace(/<[^>]*>/g, ' ');
}

function Poster({ g, big, cycle }) {
  return (
    <div className={`${big ? 'np-poster' : 'film-poster'}${cycle ? ' cycle' : ''}`} style={{ '--g1': grad1(g), '--g2': grad2(g) }}>
      <span className="reel-tag">REEL {String(GUIDES.indexOf(g) + 1).padStart(2, '0')}</span>
      {g.slides.map((s, i) => (
        <div className="slide" key={i}>
          <div className="slide-inner" dangerouslySetInnerHTML={{ __html: slideSVG(g, i) }} />
        </div>
      ))}
      <span className="genre-chip">{g.genre}</span>
    </div>
  );
}

export default function ClubGuidesPage() {
  const [query, setQuery] = useState('');
  const [done, setDone] = useState(() => loadDone());
  const [theaterId, setTheaterId] = useState(null);
  const [playerIdx, setPlayerIdx] = useState(0);
  const [playerAuto, setPlayerAuto] = useState(true);
  const readBarRef = useRef(null);

  const g = theaterId ? GUIDES.find(x => x.id === theaterId) : null;

  const pct = (guide) => {
    const arr = done[guide.id] || [];
    return Math.round((arr.length / guide.checklist.length) * 100);
  };

  const spotlight = useMemo(() => [...GUIDES].sort((a, b) => pct(a) - pct(b))[0], [done]); // eslint-disable-line react-hooks/exhaustive-deps

  const visible = useMemo(() => {
    const q = query.toLowerCase();
    return GUIDES.filter(gid => !q || (
      gid.title + ' ' + gid.tagline + ' ' + gid.synopsis + ' ' + gid.checklist.join(' ') + ' ' +
      stripTags(gid.body) + ' ' + gid.slides.map(s => s.cap).join(' ')
    ).toLowerCase().includes(q));
  }, [query]);

  useEffect(() => {
    const el = readBarRef.current;
    if (!el) return;
    let ticking = false;
    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      el.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => { window.removeEventListener('scroll', onScroll); };
  }, []);

  useEffect(() => {
    if (!theaterId) return;
    const onKey = e => { if (e.key === 'Escape') closeTheater(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [theaterId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (theaterId) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [theaterId]);

  useEffect(() => {
    if (!g || !playerAuto || REDUCED) return;
    const t = setInterval(() => setPlayerIdx(i => (i + 1) % g.slides.length), 6000);
    return () => clearInterval(t);
  }, [g, playerAuto]);

  useEffect(() => {
    if (!window.location.hash) return;
    const id = window.location.hash.slice(1);
    if (GUIDES.some(x => x.id === id)) {
      const t = setTimeout(() => openTheater(id), 250);
      return () => clearTimeout(t);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const openTheater = (id) => {
    setTheaterId(id);
    setPlayerIdx(0);
    setPlayerAuto(true);
  };

  const closeTheater = () => {
    setTheaterId(null);
  };

  const toggleStep = (guide, idx) => {
    setDone(prev => {
      const arr = [...(prev[guide.id] || [])];
      const pos = arr.indexOf(idx);
      if (pos === -1) arr.push(idx); else arr.splice(pos, 1);
      localStorage.setItem(doneKey(guide.id), JSON.stringify(arr));
      return { ...prev, [guide.id]: arr };
    });
  };

  const resetProgress = () => {
    if (!window.confirm('Reset all checklist progress on this page?')) return;
    GUIDES.forEach(x => localStorage.removeItem(doneKey(x.id)));
    setDone(loadDone());
  };

  const bulbs = Array.from({ length: 22 }, (_, i) => ({
    on: (i % 3 !== 0) && (i % 7 !== 0),
    delay: `${(i * 0.17) % 2.4}s`
  }));

  const spotlightDone = (done[spotlight.id] || []).length;

  return (
    <SiteShell current="guides" cta="join" title="Guides for Clubs, The Playbook | Zone 7 Rotaract 3292" css={pageCss}>
      <div id="readBar" ref={readBarRef}></div>

      <header className="cinema-hero wrap">
        <div className="marquee" id="marquee">
          {bulbs.map((b, i) => (
            <span key={i} className={`bulb${b.on ? ' on' : ''}`} style={{ animationDelay: b.delay }}></span>
          ))}
        </div>
        <div className="eyebrow"><span className="dot"></span>ZONE 7 PICTURES PRESENTS</div>
        <h1>The <em>Playbook</em>.</h1>
        <p className="sub">Eleven illustrated storyboards for running a great Rotaract club year. Leadership handoffs, service projects, finance, public image, attendance make-up, and more. Every guide opens with a picture-story slideshow, so you can see the idea before you do it. Where <Link to="/guides">Rotaract Resources</Link> holds the official documents, this is the how-to.</p>
        <p className="note">Each guide mixes Zone 7's own advice with pointers to Rotary International's official material, clearly labelled. Tap any step to tick it off. Your progress is saved on this device. Slides advance automatically, and you can pause them any time.</p>
        <div className="toolrow">
          <input type="text" id="topicSearch" placeholder="Search the lineup, e.g. finance, sponsor, handoff..." aria-label="Search the guides" value={query} onChange={e => setQuery(e.target.value)} />
          <button id="resetProgress" type="button" onClick={resetProgress}>Reset my progress</button>
        </div>
      </header>

      <section className="now-playing wrap">
        <div className="np-label">Now Playing</div>
        <div className="np-card" id="npCard">
          <Poster g={spotlight} big cycle />
          <div className="np-info">
            <span className="np-genre">Now screening · {spotlight.genre}</span>
            <h2>{spotlight.title}</h2>
            <p className="np-tagline">{spotlight.tagline}</p>
            <p className="np-syn">{spotlight.synopsis}</p>
            <div className="np-meta">
              <span>⏱ {spotlight.runtime}</span>
              <span>{spotlight.slides.length} slides</span>
              <span>{spotlight.checklist.length} steps · {spotlightDone} done</span>
            </div>
            <div className="np-bar"><i style={{ width: `${pct(spotlight)}%` }}></i></div>
            <button className="play-btn" type="button" onClick={() => openTheater(spotlight.id)}>{PLAY_SVG} Play the story</button>
          </div>
        </div>
      </section>

      <section className="film-section wrap">
        <h2>The lineup.</h2>
        <p className="fs-sub">Every guide, ready to screen. Poster images flip over on their own. Tap play for the full story.</p>
        <div className="film-grid" id="filmGrid">
          {visible.map(v => {
            const doneCount = (done[v.id] || []).length;
            const p = pct(v);
            return (
              <article className="film-card" key={v.id}>
                <Poster g={v} cycle />
                <div className="film-info">
                  <h3>{v.title}</h3>
                  <p className="logline">{v.tagline}</p>
                  <div className="film-meta">
                    <span className="f-chip">⏱ {v.runtime} · {v.slides.length} slides</span>
                    <span className={`f-chip f-prog${p >= 100 ? ' is-done' : ''}`}>{doneCount}/{v.checklist.length} done</span>
                  </div>
                  <div className="film-bar"><i style={{ width: `${p}%` }}></i></div>
                  <button className="film-play" type="button" onClick={() => openTheater(v.id)}>{PLAY_SVG} Play the story</button>
                </div>
              </article>
            );
          })}
        </div>
        {!visible.length && <p className="empty-note" id="emptyNote">Nothing in the lineup matches your search.</p>}
      </section>

      <div className="wrap">
        <div className="cta-band">
          <div>
            <h3>Rules over advice?</h3>
            <p>The Handbook turns the district directory's actual rules into five chapters: grants, twinship, new clubs, projects and the health check.</p>
          </div>
          <Link className="btn" to="/handbook">Open the Handbook →</Link>
        </div>
      </div>

      <div className={`theater${g ? ' open' : ''}`} id="theater" aria-hidden={g ? 'false' : 'true'}>
        <div className="theater-backdrop" id="theaterBackdrop" onClick={closeTheater}></div>
        <div className="theater-stage" role="dialog" aria-modal="true" aria-label="Guide player">
          <div className="theater-curtain"></div>
          <button className="theater-close" id="theaterClose" aria-label="Close guide" onClick={closeTheater}>✕</button>
          {g && (
            <div className="theater-body" id="theaterBody">
              <div className="player p-stage" id="pStage" style={{ '--g1': grad1(g), '--g2': grad2(g) }}>
                <div className="p-progress"><i key={playerIdx + (playerAuto && !REDUCED ? '-run' : '-pause')} className={playerAuto && !REDUCED ? 'run' : ''}></i></div>
                <span className="p-count" id="pCount">{playerIdx + 1} / {g.slides.length}</span>
                {g.slides.map((s, i) => (
                  <div className={`p-slide${i === playerIdx ? ' active' : ''}`} data-i={i} key={i}>
                    <div className="slide-inner" dangerouslySetInnerHTML={{ __html: slideSVG(g, i, 'ken') }} />
                  </div>
                ))}
                <button className="p-nav p-prev" id="pPrev" aria-label="Previous slide" onClick={() => setPlayerIdx((playerIdx - 1 + g.slides.length) % g.slides.length)}>‹</button>
                <button className="p-nav p-next" id="pNext" aria-label="Next slide" onClick={() => setPlayerIdx((playerIdx + 1) % g.slides.length)}>›</button>
                <div className="p-dots" id="pDots">
                  {g.slides.map((s, i) => (
                    <button key={i} className={`p-dot${i === playerIdx ? ' active' : ''}`} data-i={i} aria-label={`Slide ${i + 1}`} onClick={() => setPlayerIdx(i)}></button>
                  ))}
                </div>
              </div>
              <p className="p-caption" id="pCaption">{g.slides[playerIdx].cap}</p>
              <div className="p-actions">
                <button className="p-auto-btn" id="pAuto" type="button" onClick={() => setPlayerAuto(a => !a)}>{playerAuto ? '⏸ Pause slideshow' : '▶ Resume slideshow'}</button>
              </div>
              <div className="t-head">
                <span className="t-genre">{g.genre}</span>
                <span className="t-reel">GUIDE {String(GUIDES.indexOf(g) + 1).padStart(2, '0')} · {g.runtime} · {g.slides.length} slides · {g.checklist.length} steps</span>
              </div>
              <h2>{g.title}</h2>
              <p className="t-tagline">{g.tagline}</p>
              {g.original
                ? <div className="t-orig zone">✏️ Zone 7 original guidance</div>
                : <div className="t-orig official">© Official Rotary International material, with cited sources</div>}
              <div dangerouslySetInnerHTML={{ __html: g.body }} />
              <div className="t-stat"><div className="g-icon">{g.stat.icon}</div><p dangerouslySetInnerHTML={{ __html: g.stat.text }} /></div>
              <div className="t-scenes-label">Your steps. Tap to tick</div>
              <ul className="scene-list">
                {g.checklist.map((c, i) => (
                  <li key={i} className={(done[g.id] || []).includes(i) ? 'done' : ''} onClick={() => toggleStep(g, i)}>
                    <span className="scene-num">STEP {String(i + 1).padStart(2, '0')}</span>
                    {c}
                  </li>
                ))}
              </ul>
              {g.links.length ? (
                <>
                  <div className="t-credits-label">Official sources</div>
                  <div className="t-credits">
                    {g.links.map((l, i) => (
                      l.url.startsWith('/')
                        ? <Link key={i} className="credit-link" to={l.url}>{LINK_SVG} {l.label}</Link>
                        : <a key={i} className="credit-link" href={l.url} target="_blank" rel="noopener noreferrer">{LINK_SVG} {l.label}</a>
                    ))}
                  </div>
                </>
              ) : null}
              {g.printable && (
                <div className="mu-block">
                  <button className="print-btn" type="button" onClick={() => window.print()}>🖨 Print the make-up card</button>
                  <div className="mu-card" id="makeupCard">
                    <div className="mu-top">
                      <div className="mu-logo">7</div>
                      <div className="mu-brand"><b>ZONE 7 ROTARACT</b><span>Rotaract District 3292 · Nepal &amp; Bhutan</span></div>
                      <div className="mu-stamp">MAKE-UP</div>
                    </div>
                    <div className="mu-title">ATTENDANCE MAKE-UP CARD</div>
                    <div className="mu-sub">For the member who attended another club's meeting</div>
                    <div className="mu-fields">
                      <div className="mu-field">Member name<span className="mu-line"></span></div>
                      <div className="mu-field">Home club<span className="mu-line"></span></div>
                      <div className="mu-field">Host club attended<span className="mu-line"></span></div>
                      <div className="mu-field">Date of meeting<span className="mu-line"></span></div>
                    </div>
                    <p className="mu-note">This card confirms the member above attended a Rotaract / Rotary club meeting on the date shown, in place of their home club meeting.</p>
                    <div className="mu-sign">
                      <div><span className="mu-line"></span><span className="sig-label">Host club secretary</span></div>
                      <div className="mu-stamp-circle">CLUB<br />STAMP</div>
                      <div><span className="mu-line"></span><span className="sig-label">Home club secretary</span></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </SiteShell>
  );
}
