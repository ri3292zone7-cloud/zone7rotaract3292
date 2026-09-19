insert into projects (id, club_slug, title, category, date, location, summary, body, cover, gallery, updated)
values
(
  'aama-ko-chhaya-2026',
  'sankhu',
  'Aama Ko Chhaya — Maternal Health & Menstrual Sanitation Session',
  'Sanitation',
  '2026-07-31',
  'Bhagyodaya School',
  'Session for 50 Class 10 students on maternal and infant health and menstrual hygiene, led by Dr. Yuja.',
  'The Rotaract Club of Sankhu organized "Aama Ko Chhaya" on 31 July 2026 at Bhagyodaya School, a service project on maternal and infant health and menstrual sanitation. Around 50 students of Class 10 attended the session, led by Dr. Yuja, who spoke on maternal and infant health as well as the menstrual cycle and hygiene practices. The project aimed to help students understand these topics and maintain proper menstrual sanitation in daily life. Coordinated by Lipee Shrestha with 6 club members present and 2 Rotarians, the one-hour session contributed 6 volunteering hours at a total expense of NRs. 1,000.',
  'media/sankhu/aama-chhaya.jpg',
  '["media/sankhu/aama-chhaya.jpg"]'::jsonb,
  1750000000000
),
(
  'sitting-bench-distribution-2026',
  'sankhu',
  'Sitting Bench Distribution at Mahadevsthan',
  'Donation',
  '2026-04-10',
  'Mahadevsthan',
  'Durable public benches installed for the community, sponsored by the Rotary Club of Sankhu.',
  'The Rotaract Club of Sankhu, in collaboration with the Rotary Club of Sankhu and International Rotary (RI District 3292), carried out a sitting bench distribution program on 10 April 2026 at Mahadevsthan. The project installed durable, weather-resistant benches in public areas to provide accessible resting places for the community -- especially senior citizens and weary travelers -- encouraging social interaction and improving quality of life in shared spaces. Locations were selected based on community needs and foot traffic for maximum public benefit. Coordinated by Dharma Bhakta Malla with 5 club members and 10 Rotarians present, the two-hour program contributed 5 volunteering hours, fully sponsored by Rotary.',
  'media/sankhu/bench-1.jpg',
  '["media/sankhu/bench-1.jpg", "media/sankhu/bench-2.jpg", "media/sankhu/bench-3.jpg"]'::jsonb,
  1750000000000
),
(
  'ai-agentic-ai-workshop-2025',
  'sankhu',
  'AI and Agentic AI Workshop',
  'Training / Workshops',
  '2025-11-11',
  'Sakwo Campus',
  'Hands-on workshop on building autonomous AI agents, sponsored by the Rotary Club of Sankhu.',
  'The Rotaract Club of Sankhu organized a hands-on AI and Agentic AI Workshop on 11 November 2025 at Sakwo Campus, in collaboration with the Rotary Club of Sankhu and Rotaract (RI District 3292). Participants explored core Artificial Intelligence concepts before diving into Agentic AI -- systems that move beyond passive responses to actively plan, use tools, and make decisions independently. Through practical coding sessions and real-world use cases, the workshop equipped developers and innovators with the skills to design self-directing AI workflows that solve complex automation challenges. Coordinated by Pramesh Shrestha with 5 club members and 6 Rotarians present, the one-hour workshop contributed 5 volunteering hours, sponsored by the Rotary Club of Sankhu.',
  'media/sankhu/ai-workshop.jpg',
  '["media/sankhu/ai-workshop.jpg"]'::jsonb,
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
