import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROTA_KB } from '../../data/rota-gpt-data';

const SUGGESTIONS = [
  'Which clubs are in Zone 7?',
  'How do I apply for a Global Grant?',
  'What is a twinship?',
  'How do I start a new club?',
  'How does the Club Health Check work?',
  'Where can I download documents?'
];

const CSS = [
  '#rgpt-launcher{position:fixed;right:22px;bottom:22px;z-index:9990;display:flex;align-items:center;gap:10px;background:#1B1836;color:#fff;border:none;border-radius:100px;padding:13px 20px 13px 14px;cursor:pointer;font-family:"Inter",sans-serif;font-weight:700;font-size:.9rem;box-shadow:0 14px 34px rgba(27,24,54,.35);transition:transform .2s,background .2s}',
  '#rgpt-launcher:hover{transform:translateY(-3px);background:#A80F52}',
  '#rgpt-launcher .rgpt-gear{width:30px;height:30px;border-radius:50%;background:rgba(255,255,255,.14);display:flex;align-items:center;justify-content:center;flex-shrink:0}',
  '#rgpt-launcher .rgpt-gear svg{width:18px;height:18px;animation:rgptSpin 10s linear infinite}',
  '@keyframes rgptSpin{to{transform:rotate(360deg)}}',
  '#rgpt-panel{position:fixed;right:22px;bottom:22px;z-index:9991;width:min(400px,calc(100vw - 32px));height:min(580px,calc(100vh - 100px));background:#FFFDF9;border:1px solid rgba(27,24,54,.12);border-radius:22px;box-shadow:0 30px 70px rgba(27,24,54,.28);display:none;flex-direction:column;overflow:hidden;font-family:"Inter",sans-serif}',
  '#rgpt-panel.open{display:flex}',
  '#rgpt-head{background:linear-gradient(120deg,#1B1836,#A80F52);color:#fff;padding:16px 18px;display:flex;align-items:center;gap:12px}',
  '#rgpt-head .rgpt-avatar{width:38px;height:38px;border-radius:12px;background:rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;flex-shrink:0}',
  '#rgpt-head .rgpt-avatar svg{width:22px;height:22px;animation:rgptSpin 8s linear infinite}',
  '#rgpt-head h3{font-family:"Poppins",sans-serif;font-size:1rem;font-weight:800;margin:0}',
  '#rgpt-head p{font-size:.74rem;opacity:.85;margin:1px 0 0}',
  '#rgpt-head .rgpt-dot{width:8px;height:8px;border-radius:50%;background:#4ADE80;margin-right:6px;display:inline-block;vertical-align:middle}',
  '#rgpt-close{margin-left:auto;background:rgba(255,255,255,.12);border:none;color:#fff;width:30px;height:30px;border-radius:50%;cursor:pointer;font-size:1rem;line-height:1}',
  '#rgpt-msgs{flex:1;overflow-y:auto;padding:18px 16px;display:flex;flex-direction:column;gap:12px;background:linear-gradient(180deg,#FFF8EF,#FFFDF9)}',
  '.rgpt-msg{max-width:88%;padding:11px 14px;border-radius:16px;font-size:.9rem;line-height:1.6;word-wrap:break-word}',
  '.rgpt-msg.user{align-self:flex-end;background:#E11A6E;color:#fff;border-bottom-right-radius:4px}',
  '.rgpt-msg.bot{align-self:flex-start;background:#fff;border:1px solid rgba(27,24,54,.1);border-bottom-left-radius:4px;color:#1B1836;box-shadow:0 4px 14px rgba(27,24,54,.05)}',
  '.rgpt-msg.bot b{color:#A80F52}',
  '.rgpt-msg.bot ul{margin:8px 0 2px;padding-left:20px}',
  '.rgpt-msg.bot li{margin:4px 0}',
  '.rgpt-msg .rgpt-links{margin-top:10px;display:flex;flex-wrap:wrap;gap:6px}',
  '.rgpt-msg .rgpt-links a{display:inline-flex;align-items:center;gap:5px;background:rgba(225,26,110,.08);color:#A80F52;font-size:.78rem;font-weight:700;padding:6px 12px;border-radius:100px;text-decoration:none;cursor:pointer}',
  '.rgpt-msg .rgpt-links a:hover{background:rgba(225,26,110,.16)}',
  '.rgpt-msg .rgpt-src{font-size:.68rem;color:rgba(27,24,54,.45);margin-top:8px}',
  '.rgpt-typing{display:flex;gap:4px;padding:12px 14px}',
  '.rgpt-typing span{width:7px;height:7px;border-radius:50%;background:#E11A6E;animation:rgptBlink 1.2s infinite}',
  '.rgpt-typing span:nth-child(2){animation-delay:.2s}.rgpt-typing span:nth-child(3){animation-delay:.4s}',
  '@keyframes rgptBlink{0%,80%,100%{opacity:.25}40%{opacity:1}}',
  '#rgpt-sugg{display:flex;gap:8px;padding:10px 14px 0;flex-wrap:wrap}',
  '#rgpt-sugg button{font-size:.74rem;font-weight:600;color:#A80F52;background:rgba(225,26,110,.08);border:1px solid rgba(225,26,110,.18);border-radius:100px;padding:6px 12px;cursor:pointer;transition:background .15s}',
  '#rgpt-sugg button:hover{background:rgba(225,26,110,.16)}',
  '#rgpt-inputrow{display:flex;gap:8px;padding:12px 14px 14px;border-top:1px solid rgba(27,24,54,.08);background:#FFFDF9}',
  '#rgpt-input{flex:1;border:1.5px solid rgba(27,24,54,.14);border-radius:100px;padding:11px 16px;font-family:"Inter",sans-serif;font-size:.9rem;outline:none;background:#fff;color:#1B1836}',
  '#rgpt-input:focus{border-color:#E11A6E}',
  '#rgpt-send{width:44px;height:44px;border-radius:50%;border:none;background:#E11A6E;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:transform .15s,background .15s}',
  '#rgpt-send:hover{transform:scale(1.06);background:#A80F52}',
  '@media (max-width:520px){#rgpt-launcher{right:14px;bottom:14px;padding:12px 16px 12px 12px;font-size:.8rem}#rgpt-panel{right:10px;bottom:10px;width:calc(100vw - 20px);height:calc(100vh - 90px)}}'
].join('\n');

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function linkify(text) {
  return esc(text)
    .replace(/\[\[([^\]]+)\]\]/g, (_m, label) => {
      const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      return `<a href="/#${slug}" style="color:#A80F52;font-weight:700">${esc(label)}</a>`;
    })
    .replace(/(\b(?:https?:\/\/)?[a-z0-9-]+\.(?:rotary\.org|vercel\.app)[^\s]*)/g, (m) => {
      const u = m.indexOf('http') === 0 ? m : `https://${m}`;
      return `<a href="${u}" target="_blank" rel="noopener" style="color:#A80F52;font-weight:700">${esc(m)}</a>`;
    });
}

function tokens(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
}

function scoreEntry(e, qWords, qText) {
  const hay = e.k.join(' ').toLowerCase();
  let score = 0;
  if (hay.indexOf(qText) !== -1) score += 60;
  qWords.forEach((w) => {
    if (hay.indexOf(w) !== -1) score += 3;
    if (w.length > 3 && hay.indexOf(w.slice(0, -1)) !== -1) score += 1;
  });
  return score;
}

function localAnswer(KB, q) {
  const qText = q.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const qWords = tokens(q);
  const best = KB.map((e) => ({ e, s: scoreEntry(e, qWords, qText) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s);
  if (!best.length) {
    return {
      text: "I couldn't find that in the zone's documents, but I can help with club info, grants, twinship, meetings, tutorials and the district rules. Try one of the suggestions below.",
      links: [{ label: 'Tutorials', url: '/tutorials' }, { label: 'Handbook', url: '/handbook' }, { label: 'Guides for Clubs', url: '/club-guides' }],
      src: 'Site knowledge base'
    };
  }
  const top = best[0].e;
  let extra = '';
  if (best.length > 1 && best[1].s >= best[0].s * 0.5) {
    const alt = best[1].e;
    extra = ` Also related: <b>${esc(alt.k[0])}</b> – ${alt.a}`;
  }
  return {
    text: top.a + extra,
    links: top.links || [],
    src: 'Site knowledge base'
  };
}

function topContext(KB, q) {
  const qWords = tokens(q);
  const qText = q.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  return (
    KB.slice()
      .map((e) => ({ e, s: scoreEntry(e, qWords, qText) }))
      .sort((a, b) => b.s - a.s)
      .slice(0, 3)
      .map((x) => `- ${x.e.a}`)
      .join('\n') || 'No matching knowledge base entries.'
  );
}

function buildSystem(ctx) {
  return (
    'You are RotaGPT, a friendly assistant for the Zone 7 Rotaract website (Rotaract District 3292, Nepal-Bhutan). ' +
    'Answer from the knowledge base context below. Be warm, brief and specific. Use short paragraphs and simple lists when useful. ' +
    'If the context does not cover the question, say you are not sure and suggest the website sections. ' +
    'Never invent club names, amounts or rules. Only Zone 7 clubs exist: Balkumari, Baneshwor, Liberty, Kathmandu West, ' +
    'Kathmandu Heights, Sankhu, New Road City, Sukedhara, Tripureswor.\n\nKnowledge base:\n' +
    String(ctx || '').slice(0, 6000)
  );
}

function parseOpenAI(json) {
  const m = json && json.choices && json.choices[0] && json.choices[0].message && json.choices[0].message.content;
  return m ? m.trim() : null;
}

function fetchJson(url, options, ms) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms || 20000);
  return fetch(url, Object.assign({}, options, { signal: ctrl.signal }))
    .then((r) => r.json())
    .finally(() => clearTimeout(t));
}

function serverlessAnswer(ctx, history) {
  return fetchJson(
    'api/rota-gpt',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history.slice(-8), kb: ctx })
    },
    8000
  )
    .then((j) => (j && j.engine === 'llm' && j.answer ? j.answer : null))
    .catch(() => null);
}

function directAnswer(sys, history) {
  return fetchJson(
    'https://gen.pollinations.ai/v1/chat/completions',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'openai',
        messages: [{ role: 'system', content: sys }].concat(history.slice(-8)),
        max_tokens: 400
      })
    },
    30000
  )
    .then(parseOpenAI)
    .catch(() => null);
}

const GEAR_SVG = (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 8.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z" stroke="#fff" strokeWidth="1.6" />
    <path d="M12 2.8v2.2M12 19v2.2M2.8 12H5M19 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" />
  </svg>
);

function renderAnswerHtml(ans) {
  const links = (ans.links || [])
    .map((l) => `<a href="${esc(l.url)}">${l.url.indexOf('http') === 0 ? '↗ ' : '→ '}${esc(l.label)}</a>`)
    .join('');
  return (
    linkify(ans.text) +
    (links ? `<div class="rgpt-links">${links}</div>` : '') +
    `<div class="rgpt-src">Answer from the ${esc(ans.src || 'Zone 7 knowledge base')}</div>`
  );
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const msgsRef = useRef(null);
  const inputRef = useRef(null);
  const turnSeq = useRef(0);
  const history = useRef([]);
  const navigate = useNavigate();

  const KB = useRef((ROTA_KB || []).slice());

  useEffect(() => {
    const el = document.createElement('style');
    el.setAttribute('data-rgpt-css', 'true');
    el.textContent = CSS;
    document.head.appendChild(el);
    return () => el.remove();
  }, []);

  useEffect(() => {
    if (open && msgsRef.current) {
      msgsRef.current.scrollTo({ top: msgsRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, open, typing]);

  useEffect(() => {
    if (open) {
      if (!messages.length) {
        setMessages([
          {
            who: 'bot',
            html:
              "Namaste! I'm <b>RotaGPT</b>, the Zone 7 guide. Ask me anything about the clubs, grants, twinship, meetings, projects or the district rules. I answer straight from the site and the 2025-26 district directory."
          }
        ]);
      }
      setTimeout(() => inputRef.current && inputRef.current.focus(), 50);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const onMsgClick = (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href');
    if (href && href.startsWith('/') && !href.startsWith('//') && !href.startsWith('/assets')) {
      e.preventDefault();
      navigate(href);
    }
  };

  const send = (q) => {
    q = (q || '').trim();
    if (!q) return;
    setInput('');
    setMessages((m) => [...m, { who: 'user', html: esc(q) }]);
    history.current.push({ role: 'user', content: q });
    const seq = ++turnSeq.current;

    const local = localAnswer(KB.current, q);
    const html = renderAnswerHtml(local);
    setMessages((m) => [...m, { who: 'bot', html }]);
    setTyping(true);

    const upgrade = (text) => {
      if (!text || turnSeq.current !== seq) return;
      setTyping(false);
      setMessages((m) => {
        const next = [...m];
        next[next.length - 1] = { who: 'bot', html: renderAnswerHtml({ text, links: [], src: 'RotaGPT AI' }) };
        return next;
      });
    };

    const ctx = topContext(KB.current, q);
    const sys = buildSystem(ctx);
    serverlessAnswer(ctx, history.current).then((up) => {
      if (up) {
        upgrade(up);
        return;
      }
      directAnswer(sys, history.current).then(upgrade);
    });
  };

  const onKey = (e) => {
    if (e.key === 'Enter') send(input);
  };

  return (
    <>
      <button
        id="rgpt-launcher"
        type="button"
        aria-label="Open RotaGPT chat"
        style={{ display: open ? 'none' : 'flex' }}
        onClick={() => setOpen(true)}
      >
        <span className="rgpt-gear">{GEAR_SVG}</span>
        <span>RotaGPT</span>
      </button>
      <div id="rgpt-panel" role="dialog" aria-label="RotaGPT chat" className={open ? 'open' : ''}>
        <div id="rgpt-head">
          <div className="rgpt-avatar">{GEAR_SVG}</div>
          <div>
            <h3>RotaGPT</h3>
            <p>
              <span className="rgpt-dot"></span>Zone 7 guide · answers from the district directory
            </p>
          </div>
          <button id="rgpt-close" type="button" aria-label="Close chat" onClick={() => setOpen(false)}>
            ✕
          </button>
        </div>
        <div id="rgpt-msgs" ref={msgsRef} onClick={onMsgClick}>
          {messages.map((m, i) => (
            <div key={i} className={`rgpt-msg ${m.who}`} dangerouslySetInnerHTML={{ __html: m.html }} />
          ))}
          {typing && (
            <div className="rgpt-msg bot rgpt-typing">
              <span></span><span></span><span></span>
            </div>
          )}
        </div>
        <div id="rgpt-sugg">
          {SUGGESTIONS.map((s) => (
            <button key={s} type="button" onClick={() => send(s)}>
              {s}
            </button>
          ))}
        </div>
        <div id="rgpt-inputrow">
          <input
            id="rgpt-input"
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            placeholder="Ask about grants, meetings, clubs..."
            autoComplete="off"
          />
          <button id="rgpt-send" type="button" aria-label="Send" onClick={() => send(input)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M3 11l18-8-8 18-2.5-7.5L3 11z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
