insert into projects (id, club_slug, title, category, date, location, summary, body, cover, gallery, updated)
values
(
  'mental-health-awareness-2026',
  'newroadcity',
  'Mental Health Awareness Program',
  'Counseling',
  '2026-04-25',
  'Liberty College',
  'Joint session on understanding mental health and wellbeing, with Rotaract Clubs of Liberty College and Bagmati.',
  'Mental health is an essential part of overall wellbeing. Mankaa Kura conducted a session on Understanding Mental Health and Wellbeing with the Rotaract Club of New Road City, alongside the Rotaract Clubs of Liberty College and Bagmati, creating a space for open conversation and learning. Through interactive discussions, participants explored ways to understand their emotions, manage stress, and build healthier coping strategies in daily life -- because taking care of our minds is just as important as taking care of our bodies. 12 Rotaractors and 2 other visitors attended over 2 hours, contributing 10 volunteering hours, with a total expense of NRs. 2,000.',
  '',
  '[]'::jsonb,
  1750000000000
),
(
  'christmas-carnival-2025',
  'newroadcity',
  'Christmas Carnival',
  'Fund Raising',
  '2025-12-13',
  'Swad Garden',
  'Christmas-themed fellowship program run in collaboration with several Rotaract and Leo clubs.',
  'The Rotaract Club of New Road City Kathmandu held a Christmas-themed fellowship program in collaboration with the Rotaract Club of Himalayan Patan, Rotaract Club of Bagmati, and Leo Club of Bagmati at Swad Garden. The event focused on fellowship, member engagement, and networking among participating clubs. 50 Rotaractors and 15 other visitors took part over 6 hours, contributing 64 volunteering hours, with a total expense of NRs. 5,000.',
  '',
  '[]'::jsonb,
  1750000000000
),
(
  'tree-plantation-2025',
  'newroadcity',
  'Tree Plantation',
  'Tree Plantation',
  '2025-07-29',
  'Tarkeshwor',
  '200 trees planted in collaboration with the Rotary Club of New Road City at Tarkeshwor Nagarpalika.',
  'As a signature project of its parent club, the Rotaract Club of New Road City Kathmandu participated in and collaborated on a tree plantation drive at Tarkeshwor Nagarpalika, Kathmandu, alongside the Rotary Club of New Road City. The initiative aimed to promote sustainability through afforestation and contribute to combating climate change. 200 trees were planted with 35 Rotarians and 9 other visitors taking part over 6 hours, contributing 6 volunteering hours.',
  '',
  '[]'::jsonb,
  1750000000000
),
(
  'goodwill-visit-letterhead-2026',
  'newroadcity',
  'Goodwill Visit and Letterhead Exchange',
  'Letterhead Exchange',
  '2026-06-06',
  'Lincoln College',
  'Goodwill visit and letterhead exchange with the Rotaract Club of Bagmati during a General Meeting.',
  'On June 6th, the Rotaract Club of New Road City Kathmandu''s General Meeting was made even more special with a goodwill visit from the Rotaract Club of Bagmati. It was a pleasure hosting fellow Rotaractors, exchanging ideas, sharing updates, and strengthening the bond between the clubs. 5 Rotaractors took part over 1 hour, contributing 8 volunteering hours, with a total expense of NRs. 1,000.',
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
