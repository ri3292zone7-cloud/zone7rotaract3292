import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SiteShell from '../components/layout/SiteShell';
import { ZONE7_DB, CLUB_DIRECTORY } from '../data/zone7-data';
import pageCss from './ne-about.css?inline';

function initials(name) {
  return String(name || '').replace(/^Rtr\.\s*/, '').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

const BIO_TEXT = {
  current: "हालै जोन ७ को रोटरेक्ट प्रतिनिधि को रूपमा सेवा गर्दैछन्, जोन ७ का नौवटा क्लबहरूलाई यस वर्षका लक्ष्य र घटनाहरूबाट मार्गदर्शन गर्दछ।",
  past: "जोन ७ को रोटरेक्ट प्रतिनिधि को रूपमा सेवा गरे, जोन ७ का क्लबहरूलाई त्यो रोटरी वर्षबाट मार्गदर्शन गरे।"
};

export default function NeAboutPage() {
  const [zrrs, setZrrs] = useState([]);
  const [leaders, setLeaders] = useState([]);
  const rootRef = useRef(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [z, l] = await Promise.all([
        ZONE7_DB.getZRRs().catch(() => []),
        ZONE7_DB.getLeadership().catch(() => [])
      ]);
      if (!alive) return;
      setZrrs(z || []);
      setLeaders(l || []);
    })();
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray([
        '.hero-grid', '.hero-photo',
        '.rot-explain .wrap', '.pullquote-card',
        '.do-grid', '.interact-band .wrap',
        '.purpose-grid', '.journey-head', '.journey-track',
        '.clubs-grid', '.join-card'
      ]).forEach((el) => {
        gsap.from(el, {
          y: 30, opacity: 0, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 90%' }
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <SiteShell
      current="about"
      cta="join"
      title="जोन ७ को बारेमा | रोटरेक्ट डिस्ट्रिक्ट ३२९२ नेपाल-भुटान"
      css={pageCss}
    >
      <div ref={rootRef}>
        <header className="hero">
          <div className="wrap">
            <div className="hero-grid">
              <div>
                <div className="eyebrow"><span className="dot"></span>रोटरेक्ट डिस्ट्रिच ३२९२ · नेपाल-भुटान</div>
                <h1>एउटा घाँस, एक व्यवसाय, एक उद्देश्य:<br /><span className="hl">सेवा।</span></h1>
                <p className="lead">जोन ७ भनेको काठमाडौं घाँसमा अवस्थित रोटरेक्ट क्लबहरूको ज़ोनल आधारशिला हो। १८ देखि ३० वर्ष उमेरका युवा नेताहरूले आफ्ना क्लबहरू आयोजना गर्छन्, आफ्नै आयोजनाहरू सञ्चालन गर्छन् र समुदायका लागि उपस्थित रहन्छन्।</p>
                <div className="hero-stats">
                  <div className="stat"><b>९</b><span>जोन ७ का क्लबहरू</span></div>
                  <div className="stat"><b>१८०+</b><span>डिस्ट्रिचभर क्लबहरू</span></div>
                  <div className="stat"><b>५,५००+</b><span>रोटरेक्टर, डिस्ट्रिच ३२९२</span></div>
                  <div className="stat"><b>६</b><span>२०२१-२२ देखि जेदार</span></div>
                </div>
                <div className="hero-links">
                  <Link className="hlink primary" to="/join">सदस्य बन्नुहोस् →</Link>
                  <Link className="hlink ghost" to="/ne-about#allclubs">नौवटा क्लबहरू हेर्नुहोस्</Link>
                </div>
              </div>
              <div className="hero-team-card">
                <span className="hero-team-label">आर्य २०२६-२७</span>
                <h4>यो वर्षको जोन ७ टीम</h4>
                <div className="hero-team-list">
                  {leaders.length
                    ? leaders.map((p, i) => (
                        <Link key={p.id || i} className="hero-team-row" to="/#leadership">
                          <div className="hero-team-avatar">
                            {p.photo
                              ? <img src={`/${p.photo}`} alt={p.name} loading="lazy" />
                              : initials(p.name)}
                          </div>
                          <div className="hero-team-info">
                            <h5>{p.name}</h5>
                            <div className="role">{p.role} · {p.role_full || ''}</div>
                            {p.club ? <div className="club">{p.club}</div> : null}
                          </div>
                        </Link>
                      ))
                    : <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>टोली जानकारी थपिएपछि यहाँ देखा पर्छ।</div>}
                </div>
                <div className="hero-team-foot">यो वर्षको नौवटा क्लबहरूलाई समेट्ने।</div>
              </div>
            </div>
          </div>
        </header>

        <div className="hero-photo">
          <div className="frame">
            <img src="/zone7_cover.jpg" alt="जोन ७ का क्लबहरूका रोटरेक्टहरू" width="1180" height="560" fetchPriority="high" />
            <span className="hp-chip hp1">🩸 रक्तदान अभियान</span>
            <span className="hp-chip hp2">🌳 रूख लगाउने काम</span>
            <span className="hp-chip hp3">🤝 सामेलजुस्ती</span>
          </div>
        </div>

        <section className="section rot-explain">
          <div className="wrap">
            <span className="section-tag">मूलभूत जानकारी</span>
            <h2>रोटरेक्ट भनेको के हो।</h2>
            <div className="rot-grid">
              <div className="rot-copy">
                <p>रोटरेक्ट भनेको स्थानीय रोटरी क्लबद्वारा आयोजना गरिएको युवा व्यक्तिहरूको क्लब हो। तर सदस्यहरूले आफ्नै योजना बनाउँछन्, आफ्नै बजेट बनाउँछन् र आफ्नै काम चलाउँछन्। कसैले रोटरेक्ट क्लबलाई तालिका हात पुर्याउँदैन।</p>
                <p>यसैले २१ वर्षका एक विद्यार्थीले डिस्ट्रिच-मान्यता प्राप्त रक्तदान अभियान चलाउन सक्छ, र सधिलै नौकरी शुरु गरेका रोटरेक्टले क्लबको वार्षिक बजेट व्यवस्थापन गर्न सक्छ। यो एक नेतृत्व प्रशिक्षण क्षेत्र हो जुन वास्तविक सामुदायिक सेवामा आधारित छ।</p>
                <div className="rot-chips">
                  <span className="rot-chip c1">🎂 उमेर १८–३०</span>
                  <span className="rot-chip c2">🚀 स्व-चलित, स्व-वित्तीय</span>
                  <span className="rot-chip c3">🔓 २०२० देखि स्वतन्त्र</span>
                </div>
              </div>
              <div className="pillars">
                <div className="pillar p1"><span className="num">01</span>
                  <div className="ico">🤝</div>
                  <div><h4>सदस्यहरूका लागि, सदस्यहरूद्वारा</h4><p>अध्यक्षदेखि सचिवदेखि खातेदेखि, सबै अधिकारीहरू एक वर्षको कार्यकालका लागि क्लबद्वारा निर्वाचित रोटरेक्टर हुन्छन्।</p></div>
                </div>
                <div className="pillar p2"><span className="num">02</span>
                  <div className="ico">🎓</div>
                  <div><h4>सेवा <em>र</em> कौशल विकास</h4><p>परियोजनाहरूले नेतृत्व अभ्यासको रूपमा काम गर्छन्। बजेट व्यवस्थापन, सार्वजनिक भाषण, वार्ता, घटना सञ्चालन। सबै कुरा कदरेरै सिकिन्छ।</p></div>
                </div>
                <div className="pillar p3"><span className="num">03</span>
                  <div className="ico">🌏</div>
                  <div><h4>स्थानीय रूपमा मूल, वैश्विक रूपमा जडान</h4><p>प्रत्येक क्लबले एउटा रोटरी डिस्ट्रिच र विश्वव्यापी जडान गरिएको क्लबहरूको जालसँग जोडिएको छ।</p></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pullquote wrap">
          <div className="pullquote-card">
            <p>"दृष्टि स्पष्ट छ। मिशन हाम्रो छ। भविष्य सँगै छ।"</p>
            <span>रोटरेक्ट डिस्ट्रिच ३२९२ · नेपाल र भुटान, आर्य २०२६-२७</span>
          </div>
        </section>

        <section className="section" id="whatwedo">
          <div className="wrap">
            <span className="section-tag">जोन ७ के गर्छ</span>
            <h2>वास्तविक परियोजनाहरू, वास्तविक क्लबहरूले, वर्षको हरेक हप्तामा।</h2>
            <p className="sub">जोन ७ का नौवटा क्लबहरूमा, सेवा कामले धेरै प्रकारका कारणहरूमा फैलिएको छ। प्रत्येक घटनालाई दस्तावेज गरिने, रिपोर्ट गरिने र डिस्ट्रिच ३२९२ को आधिकारिक क्लब-उत्कृष्टता बरोमिटरमा गणना गरिने छ। यही हो जोन ७ को रिटर्याक्ट वर्षको भूमि।</p>
            <div className="do-grid">
              <div className="do-card"><span className="ico">🩸</span><h4>स्वास्थ्य र रक्तदान</h4><p>नेपाल रेड क्रस सोसायटीसँग मिलेर रक्तदान अभियान, स्वास्थ्य शिविर, र स्कूलका बच्चाहरूका लागि स्वास्थ्य जागरूकता सत्रहरू।</p></div>
              <div className="do-card"><span className="ico">📚</span><h4>शिक्षा र साक्षरता</h4><p>साक्षरता अभियान, विद्यालयहरूमा कार्यशाला, र मेन्टरशिप कार्यक्रमहरू रोटरेक्टको मूलभूत शिक्षा र साक्षरता क्षेत्रमा।</p></div>
              <div className="do-card"><span className="ico">🌳</span><h4>पर्यावरण</h4><p>रोटरी सँग मिलेर रूख लगाउने काम, टार्केश्वर नगरपालिकादेखि नदी र स्थानीय क्लबहरूको सफाइसम्म।</p></div>
              <div className="do-card"><span className="ico">🎓</span><h4>पेशागत विकास</h4><p>क्यायर टक, उद्यमिता बुटक्याम्प, र कौशल कार्यशाला। यो रोटरेक्टको चौथो सेवा मार्ग हो, र सबैभन्दा मूल्यवान्।</p></div>
              <div className="do-card"><span className="ico">🌍</span><h4>अन्तर्राष्ट्रिय सेवा</h4><p>जुड़ी क्लबहरूका साझेदारी र विदेशका क्लबहरूसँगको संयुक्त अनलाइन सत्रहरू। अन्तर्राष्ट्रिय मार्गदर्शनले मित्रतामा आधारित छ।</p></div>
              <div className="do-card"><span className="ico">🤝</span><h4>सामेलजुस्ती र संग्रह</h4><p>स्थापना समारम्भ, क्लबहरूबीचको विश्राम भ्रमण, र सामुदायिक कारणका लागि क्यारिभल र कमेडी रात्रि जस्ता सार्वजनिक संग्रहहरू।</p></div>
              <div className="do-card"><span className="ico">🏛️</span><h4>क्लब प्रशासन</h4><p>डीआरआर भ्रमण, क्लब सभा, र डिस्ट्रिच ३२९२ को मानकहरू पालन गर्ने गरीव्यवस्थापन काम।</p></div>
              <div className="do-card"><span className="ico">📣</span><h4>सार्वजनिक चित्रण</h4><p>प्रत्येक परियोजनालाई दस्तावेज गरी राख्ने र साझा गर्ने ताकि कामले कमेटाको बाहिरसम्म पुग्छ। सामाजिक सञ्जाल, फोटोग्राफी, कथाकथन।</p></div>
            </div>
          </div>
        </section>

        <section className="interact-band">
          <div className="wrap">
            <div className="interact-card">
              <div className="interact-copy">
                <span className="section-tag" style={{ color: 'var(--gold)' }}>इन्टर्याक्ट · उमेर १२-१८</span>
                <h2>सेवा युवा हुन्छ।</h2>
                <p>इन्टर्याक्ट भनेको विद्यालयको आधारमा रोटरीको कार्यक्रम हो जसलाई १२ देखि १८ वर्ष उमेरका विद्यार्थीले लिन्छन्, र रोटरेक्ट क्लबहरू प्राकृतिक रूपमा मेन्टर गर्छन्। उनीहरूले समान परियोजना साझा गर्छन्, विद्यार्थी बोर्डलाई सल्लाह दिन्छन् र स्कूलका क्लबहरूसँग संयुक्त रूपमा कार्यक्रम चलाउँछन्, यसरी अर्को पुस्ता सेवा नेताहरू पहिले नै बढ्दै गएका छन्।</p>
                <p className="interact-how">के तपाईंको विद्यालयले इन्टर्याक्ट क्लब सुरु गर्न चाहन्छ? <a href="mailto:ri3292zone7@gmail.com">ri3292zone7@gmail.com</a> मा ईमेल गर्नुहोस् र जोन ७ ले तपाईंलाई एउटा समर्थन गर्न सक्ने रोटरेक्ट क्लबसँग जोड्छ।</p>
              </div>
              <div className="interact-badge">
                <img src="/images/interact-logo.png" alt="इन्टर्याक्ट इन एकेशन लोगो" className="interact-logo" />
                <p>इन्टर्याक्टइनएक्सन</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section purpose">
          <div className="wrap">
            <span className="section-tag">हामी किन छौं</span>
            <h2 style={{ marginBottom: 0 }}>जोन ७ किन अस्तित्वमा छ।</h2>
            <div className="purpose-grid" style={{ marginTop: 44 }}>
              <div className="purpose-copy">
                <p>डिस्ट्रिच ३२९२ नेपाल र भुटानलाई समेटेको छ र क्लबहरूलाई काम गर्न सक्ने स्केलमा समर्थन गर्नका लागि ज़ोनमा विभाजन गरिएको छ। नजिकै पुग्न सकिने गरी ज़ोनल रोटरेक्ट प्रतिनिधि (ZRR) ले हरेक क्लब अध्यक्षलाई नामसँगै जान्छ। यस्तै सानो क्लबहरू एक साथ हुन सक्छन्। तर जडान गरिएको छ कि १८०+ क्लबहरू र ५,५००+ रोटरेक्टर डिस्ट्रिचभर।</p>
                <p><b>जोन ७ भनेको काठमाडौं घाँसको लागि त्यही तह हो।</b> यसका तीन वटा काम गर्नुपर्छ: नौवटा स्वतन्त्र रूपमा चल्ने क्लबहरूलाई समन्वय गर्ने, डिस्ट्रिचका मानक र अवसरहरूलाई क्लब स्तरमा लैजाने, र क्लबका उपलब्धिहरूलाई माथि उठाएर मानिन सकिने बनाउने।</p>
                <div className="purpose-list">
                  <div className="purpose-item"><span className="n">01</span><div><h5>समन्वय गर्ने, निर्देशित गर्ने छैन</h5><p>प्रत्येक क्लबले आफ्नै लक्ष्य तयार पार्छ र आफ्नै परियोजना चलाउँछ। जोन ७ को काम गर्नु पर्छ उनीहरूलाई जोड्ने, निर्देशित गर्ने होइन।</p></div></div>
                  <div className="purpose-item"><span className="n">02</span><div><h5>मानक सुधार्ने</h5><p>साझा तालिम (COTS), साझा घटनाहरू, र साझा बरोमिटरले यहाँसम्म पुर्याउँछ कि सबैभन्दा नयाँ क्लबले पनि डिस्ट्रिचका मानकहरू पाइपन सक्छ।</p></div></div>
                  <div className="purpose-item"><span className="n">03</span><div><h5>कामलाई दृश्य बनाउने</h5><p>यस वेबसाइटको परियोजना म्योजेक देखि DRR भ्रमण रिपोर्टसम्म, जोन ७ ले यो निश्चित गर्छ कि क्लबहरूले गरेको वास्तविक काम अदृश्य नरहोस्।</p></div></div>
                </div>
              </div>
              <div className="purpose-card">
                <span className="k">आर्य २०२६-२७ डिस्ट्रिच विषय</span>
                <h3>एउटा डिस्ट्रिचका लागि १० रणनीतिहरू</h3>
                <p>डिस्ट्रिच ३२९२ को वर्ष १० वटा लक्ष्यमा चल्छ: पारदर्शिता राम्रो बनाउने, क्लब-केन्द्रित शासन अपनाउने, सदस्य वृद्धि गर्ने, अन्तर्राष्ट्रिय ज्ञान बढाउने। प्रत्येक जोन ७ क्लबको बरोमिटर स्कोर यही सूचीसँग सम्बन्धित छ। यसैले बालकुमारीमा दर्ताभएको परियोजना र साँखुमा दर्ताभएको परियोजनाले एकै विश्वव्यापी चित्रणको काम गर्छन्।</p>
              </div>
            </div>
          </div>
        </section>

        <section className="journey wrap" id="journey">
          <div className="journey-head">
            <span className="section-tag">नेतृत्वको रेखा</span>
            <h2>जोन ७ को यात्रा, आफ्ना ZRRहरू मार्फत।</h2>
            <p className="sub" style={{ margin: '0 auto' }}>प्रत्येक रोटरी वर्षमा, एक रोटरेक्टरले ज़ोनल रोटरेक्ट प्रतिनिधि (ZRR) को भूमिका लिन्छन्। ती व्यक्ति वर्षभरि जोन ७ का नौवटा क्लबहरूलाई बाँध्छन्। यी नै भनेको उनीहरूले सहयोग गरेको छन्।</p>
          </div>
          <div className="journey-track">
            {zrrs.length
              ? zrrs.map((z, i) => (
                  <Link key={z.id || i} className={`journey-item${z.is_current ? ' current' : ''}`} to="/#leadership">
                    <div className="journey-avatar">
                      {z.photo
                        ? <img src={`/${z.photo}`} alt={z.name} loading="lazy" />
                        : initials(z.name)}
                    </div>
                    <div className="journey-body">
                      <div className="journey-meta">
                        <span className="journey-years">आर्य २०{String(z.years || '').replace('-', '–२०')}</span>
                        {z.is_current ? <span className="journey-tag">हालको ZRR</span> : null}
                      </div>
                      <h4>रोटरेक्ट. {z.name}</h4>
                      {z.club ? <div className="journey-club">{z.club}</div> : null}
                      <p className="bio">{z.bio || (z.is_current ? BIO_TEXT.current : BIO_TEXT.past)}</p>
                    </div>
                  </Link>
                ))
              : <div style={{ textAlign: 'center', color: 'rgba(27,24,54,0.4)', fontSize: '0.9rem', padding: '30px 0' }}>जोन ७ को नेतृत्व इतिहास थपिएपछि यहाँ देखा पर्छ।</div>}
          </div>
        </section>

        <section className="section" id="allclubs">
          <div className="wrap">
            <span className="section-tag">नौवटा</span>
            <h2>जोन ७ बनाउने सबै क्लबहरू।</h2>
            <p className="sub">प्रत्येक एक स्वतन्त्र रूपमा चल्ने, प्रत्येकले फरक वर्षमा चार्टर गरिएको, सबै नौवटा एउटै ज़ोनमा रिपोर्ट गर्छन्। कुनै पनि क्लबलाई आफ्नो पूरा प्रोफाइल र परियोजना इतिहास हेर्न चिर्नुहोस्।</p>
            <div className="clubs-grid">
              {Object.entries(CLUB_DIRECTORY).map(([slug, c]) => (
                <Link key={slug} className="club-card" to={`/club/${encodeURIComponent(slug)}`}>
                  <div className="club-mark"><img src={`/${c.logo}`} alt={`${c.name} logo`} loading="lazy" width="500" height="500" /></div>
                  <div><h4>{c.name.replace('Rotaract Club of ', '')}</h4><p>@{c.ig}</p></div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="join-cta wrap">
          <div className="join-card">
            <h2>अर्को अध्यायको हिस्सा बन्न चाहनुहुन्छ?</h2>
            <p>सदस्यत्व १८–३० वर्षका काठमाडौं घाँसका व्यक्तिहरूका लागि खुला छ। एउटै छोटो फर्म राख्नुहोस् र जोन ७ को एउटा क्लबले तपाईंलाई स्वागत गर्छ।</p>
            <Link to="/join" className="btn btn-primary">फर्म भर्नुहोस् →</Link>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
