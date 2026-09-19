insert into projects (id, club_slug, title, category, date, location, summary, body, cover, gallery, updated)
values
(
  'rota-cheers-cricket-chiyaa-2026',
  'balkumari',
  'Rota Cheers: Cricket and Chiyaa',
  'Fund Raising',
  '2026-02-17',
  'Chiya Sutta, Chyasal, Lalitpur',
  'Live Nepal vs Scotland screening fundraiser for orphanages, with jersey giveaway, wicket bingo, and chiyaa.',
  'The Rotaract Club of Balkumari organized "Rota Cheers: Cricket and Chiyaa" on 17 February 2026 at Chiya Sutta, Chyasal, Lalitpur -- an engaging live screening and fundraising event celebrating the cricket match between Nepal and Scotland. The evening combined entertainment, fan engagement, and social responsibility: a tech-powered live screening of Nepal vs Scotland, a Grand Jersey Giveaway of an official Nepal Cricket Jersey through a live lucky draw, a Wicket Bingo game with gift prizes, complimentary hot tea and snacks, and exclusive swags throughout. Funds raised support children residing in orphanages. Held with venue partner Chiyaa Sutta and technical partner Engineering Vlogs, and coordinated by Rtr. Gagan Pradhan, Rtr. Manoj Khati, and Rtr. Satyam Chaudhary, the 5-hour event drew 37 Rotaractors and 5 other visitors, contributing 72 volunteering hours at a total expense of NRs. 10,000.',
  'media/balkumari/rota-cheers-1.jpg',
  '["media/balkumari/rota-cheers-1.jpg", "media/balkumari/rota-cheers-2.jpg", "media/balkumari/rota-cheers-3.jpg", "media/balkumari/rota-cheers-poster.png"]'::jsonb,
  1750000000000
),
(
  'leaders-of-change-sdg-2026',
  'balkumari',
  'Leaders of Change: Recognizing the Role of Youth in Achieving the SDGs',
  'Club Special Event',
  '2026-03-31',
  'Zoom (Virtual)',
  'International webinar with G17 Global on youth leadership for the SDGs, with 170+ participants worldwide.',
  'The Rotaract Club of Balkumari proudly partnered with G17 Global to organize the international webinar "Leaders of Change: Recognizing the Role of Youth in Achieving the SDGs" on 31 March 2026 via Zoom, jointly with RAC Rudramati Babarmahal-Kathmandu and RAC Kathmandu Medical College-Duwakot, plus global partners including Aspire Institute, Barathum Cultural Club, SDG Youth Community, PUP Global Ambassador, and the I.B. Taylor-Kamara Foundation. The session brought together over 170 participants from around the world and featured distinguished speakers: Naphtali Akudung (CEO & Founder of Climrenew) on innovative approaches to climate action; Patrick Paul Walsh (Vice President of Education, UN SDSN; Director of the SDG Academy; Professor at University College Dublin) on youth leadership in advancing the SDGs; Girlie P. Sevilla (Adviser, G17 Philippines) on empowering communities; and Ashan Perera (Founder of The Road to Rights) on building networks for change. Interactive discussions highlighted youth as agents of change across climate action, social inclusion, education, and community empowerment. Coordinated by Rtr. Anamika Sharma and Rtr. Manoj Khati, the 3-hour webinar drew 30 Rotaractors and 130 other visitors, contributing 22 volunteering hours.',
  'media/balkumari/leaders-change-1.jpg',
  '["media/balkumari/leaders-change-1.jpg", "media/balkumari/leaders-change-2.jpg", "media/balkumari/leaders-change-3.jpg", "media/balkumari/leaders-change-4.jpg", "media/balkumari/leaders-change-5.jpg", "media/balkumari/leaders-change-6.jpg"]'::jsonb,
  1750000000000
),
(
  'healthy-me-psychological-first-aid-2026',
  'balkumari',
  'Healthy Me, Healthy Community — "Manko Kura Garau" Psychological First Aid',
  'Disaster Relief & Emergency Response',
  '2026-01-23',
  'Google Meet (Virtual)',
  'National-level Psychological First Aid session under Healthy Me, Healthy Community with District 3292 and NHEICC.',
  'On 23 January 2026, the Rotaract Club of Balkumari participated in the national-level initiative "Manko Kura Garau", a Psychological First Aid (PFA) session conducted under the webinar series Healthy Me, Healthy Community -- Phase II: Mental Health Awareness, organized by Rotaract District 3292 Nepal and Bhutan with the Government of Nepal Ministry of Health and Population''s National Health Education, Information and Communication Center (NHEICC), held virtually via Google Meet. The session focused on the PFA action model of the 3 Ls -- Look, Listen, and Link -- covering stress and crisis responses, dos and don''ts of supporting people in distress, ethical considerations, empathy and confidentiality, plus grounding and calming techniques, supportive communication skills, and self-care for helpers. Coordinated by Rtr. Utsab Pathak, the 1.5-hour session drew 35 Rotaractors and 1 other visitor, contributing 4 volunteering hours.',
  'media/balkumari/healthy-me-1.jpg',
  '["media/balkumari/healthy-me-1.jpg", "media/balkumari/healthy-me-2.jpg", "media/balkumari/healthy-me-3.jpg", "media/balkumari/healthy-me-4.jpg"]'::jsonb,
  1750000000000
),
(
  'sangam-of-cultures-2025',
  'balkumari',
  'Sangam of Cultures',
  'International Online Exchange',
  '2025-07-07',
  'Google Meet (Virtual)',
  'International cultural exchange connecting Rotaractors across countries toward twin-club partnerships.',
  'The Rotaract Club of Balkumari organized "Sangam of Cultures" on 7 July 2025 via Google Meet -- an International Cultural Exchange Program fostering global understanding, friendship, and collaboration among Rotaractors from different parts of the world. Through virtual cultural sessions, interactive discussions, and video presentations, participating clubs showcased their country''s culture, food, music, attire, festivals, and Rotaract journey. The initiative promotes intercultural learning and appreciation of global diversity while opening doors to long-term twinship opportunities, future international collaborations, and joint service projects contributing to global Rotaract unity and peacebuilding. Coordinated by Rtr. Gagan Pradhan with 7 club members present, 50 Rotaractors took part over 2 hours, contributing 2 volunteering hours.',
  'media/balkumari/sangam-cultures.jpg',
  '["media/balkumari/sangam-cultures.jpg"]'::jsonb,
  1750000000000
)
on conflict (id) do update set
  title = excluded.title,
  category = excluded.category,
  date = excluded.date,
  location = excluded.location,
  summary = excluded.summary,
  body = excluded.body,
  cover = excluded.cover,
  gallery = excluded.gallery,
  updated = excluded.updated;
