insert into projects (id, club_slug, title, category, date, location, summary, body, cover, gallery, updated)
values
(
  'drr-visit-2026',
  'kathmanduwest',
  'DRR Visit',
  'Club Administration',
  '2026-06-12',
  'Apex College, Baneshwor',
  'District Rotaract Representative visit reviewing club governance, projects and leadership continuity.',
  'The official District Rotaract Representative (DRR) visit to the Rotaract Club of Kathmandu West was marked by meaningful interaction and valuable feedback. A closed session was held first, where DRR Rtr. Dinesh Gaire outlined the purpose and structure of the visit, emphasizing transparency and open dialogue between district leadership and club members. District Secretary Rtr. Sairas Adhikari then met with the PST to discuss administrative matters, club operations, and bylaws. In the open session, participating clubs -- including Kathmandu West, Tripureswor, Liberty College, Baneshwor, Balkumari, and Kathmandu Height -- presented their annual achievements, major projects, and club updates. The visit reviewed the club''s operational structure and documentation (bylaws, constitution, statement of policies, annual reports) for alignment with district standards, assessed performance across service, membership, professional development, public image, and finance, and offered guidance to current and incoming leaders. 32 Rotaractors attended over 4 hours, contributing 40 volunteering hours, with a total expense of NRs. 2,500. The session strengthened ties with district leadership and reinforced the club''s commitment to Rotaract''s core values.',
  '',
  '[]'::jsonb,
  1750000000000
),
(
  'swaccha-setu-2025',
  'kathmanduwest',
  'Swaccha Setu',
  'RNLM (TEACH)',
  '2025-08-20',
  'Ekal Vidhyalaya, Sankhamul',
  'Hygiene awareness program for students, run jointly with the Rotaract Club of People''s Dental College.',
  'The Rotaract Club of Kathmandu West joined hands with the Rotaract Club of People''s Dental College to conduct "Swachha Setu -- Hygiene for All" at Ekal Vidhyalaya, Sankhamul. The program aimed to raise awareness among children about personal hygiene and healthy living practices. Volunteers interacted with students and educated them on essential hygiene habits including regular bathing, proper tooth brushing, effective handwashing techniques, safe food and water practices, and maintaining clean surroundings, using practical demonstrations to help students understand and apply these habits in daily life. The interactive session encouraged students to adopt healthy habits themselves and share this knowledge with family and friends to help build a healthier community. 5 Rotaractors took part over 2 hours, contributing 90 total volunteering hours. The collaborative initiative successfully delivered an engaging awareness program that fostered health consciousness among young learners.',
  '',
  '[]'::jsonb,
  1750000000000
)
on conflict (id) do update set
  title = excluded.title,
  category = excluded.category,
  date = excluded.date,
  location = excluded.location,
  summary = excluded.summary,
  body = excluded.body,
  updated = excluded.updated;
