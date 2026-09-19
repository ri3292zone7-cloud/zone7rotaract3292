-- Zone 7 projects library: all 8 club report seeds in ONE file.
-- Run this whole file once in the Supabase SQL editor (project pdlolyghlgztjrpxwytl).
-- 35 new project inserts (upsert-safe) + 6 cover-only updates to pre-existing rows.
-- Re-running is safe: inserts use on conflict (id) do update; updates are idempotent.

-- ============================================================
-- SOURCE: sankhu_projects.sql
-- ============================================================
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

-- ============================================================
-- SOURCE: balkumari_projects.sql
-- ============================================================
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

-- ============================================================
-- SOURCE: liberty_projects.sql
-- ============================================================
insert into projects (id, club_slug, title, category, date, location, summary, body, cover, gallery, updated)
values
(
  'know-your-teeth-2026',
  'liberty',
  '"Know Your Teeth" — Dental Health Education Session',
  'Dental Camp',
  '2026-03-15',
  'Google Meet (Virtual)',
  'Online dental health session with Reliance and Kantipur Dental Rotaract clubs for World Rotaract Week.',
  'On 15 March 2026, the Rotaract Club of Liberty College co-hosted the online health awareness session "Know Your Teeth" via Google Meet as part of World Rotaract Week celebrations, in collaboration with the Rotaract Club of Reliance College, the Rotaract Club of Kantipur Dental College, and several co-host clubs. Dental health experts Rtr. Dr. Suman Waiba (General Dental Surgeon, Sathi Dental) and Rtr. Dr. Arzoo Gupta (General Dental Surgeon, Padma Dental & Community Hospital) shared professional insights on oral hygiene, preventive care, correct brushing techniques, common dental problems, and long-term oral health, followed by an interactive Q&A. Coordinated by Rtr. Riona Dhungel with 11 club members present, the 1.5-hour session contributed 28 volunteering hours, aligned with SDG 3: Good Health and Well-Being.',
  'media/liberty/dental-session.jpg',
  '["media/liberty/dental-session.jpg"]'::jsonb,
  1750000000000
),
(
  'nepal-japan-dialogue-2026',
  'liberty',
  'High-Level Dialogue on Nepal-Japan Strategic Partnership',
  'Fellowship',
  '2026-04-25',
  'Hotel Radisson',
  'Participation in the Rotary Club of Nagarjun''s strategic Nepal-Japan dialogue with diplomats and MPs.',
  'On 25 April 2026, the Rotaract Club of Liberty College participated in the prestigious High-Level Dialogue on "Strategic Nepal-Japan Partnership in Natural Resources, Innovation, and Economic Development", organized by its parent club, the Rotary Club of Nagarjun, at Hotel Radisson. The program brought together leaders including representatives of Nepal''s National Assembly, Members of the Japanese Parliament and the Japan-Nepal Friendship League, the Ambassador of Japan to Nepal, FNCCI business leaders, and district Rotaract leadership. Sessions covered strengthening bilateral relations, strategic cooperation in natural resources and innovation, technology transfer and economic development, the youth role in international partnerships, and sustainable development through cross-border collaboration. Coordinated by Rtr. Samjhana Sherchan with 3 club members present, the 3-hour dialogue contributed 9 volunteering hours at a total expense of NRs. 770, aligned with SDG 9 and SDG 17.',
  'media/liberty/dental-session.jpg',
  '["media/liberty/dental-session.jpg"]'::jsonb,
  1750000000000
),
(
  'road-safety-symposium-2025',
  'liberty',
  'Rotary Regional Road Safety Symposium',
  'Road Safety',
  '2025-11-08',
  'Nepal House Restaurant, Hattisar, Kathmandu',
  'Regional symposium on road safety policy and youth advocacy with Rotary leaders, WHO Nepal, and experts.',
  'On 8 November 2025, members of the Rotaract Club of Liberty College participated in the Rotary Regional Road Safety Symposium (RID 3292 -- Nepal & Bhutan, Region 1-3) at Nepal House Restaurant, Hattisar, Naxal, Kathmandu. The symposium brought together Rotary International and District 3292 leaders, government authorities, health professionals, and road safety experts -- including the National Road Safety Council and WHO Nepal -- to address road traffic injuries and public safety through dialogue, policy discussion, and knowledge-sharing on road safety policies, emergency response systems, and youth engagement. Panel discussions explored collaborative advocacy involving Rotary, Rotaract, Interact, and community stakeholders. Coordinated by Rtr. Bhawana Kumari Bhatta with 2 club members present, the 3-hour symposium contributed 6 volunteering hours at a total expense of NRs. 250, aligned with SDG 3 and SDG 11.',
  'media/liberty/road-safety-1.jpg',
  '["media/liberty/road-safety-1.jpg", "media/liberty/road-safety-2.jpg", "media/liberty/road-safety-3.jpg"]'::jsonb,
  1750000000000
),
(
  'digital-empowerment-young-minds-2026',
  'liberty',
  'Digital Empowerment for Young Minds',
  'RNLM (TEACH)',
  '2026-03-11',
  'Shree Manohora Lower Secondary School, Duwakot, Bhaktapur',
  'Digital literacy and cyber safety session for 45 students of Grades 6-7 with the Rotaract Club of Sukedhara.',
  'On 11 March 2026, the Rotaract Club of Liberty College, in collaboration with the Rotaract Club of Sukedhara, organized "Digital Empowerment for Young Minds" at Shree Manohora Lower Secondary School, Duwakot-1, Bhaktapur -- a digital literacy session for 45 students of Grades 6 and 7. Facilitated by Rtr. Sushovan Shakya (Sukedhara) and Rtr. Peshal Basnet (Liberty College), the session covered responsible social media use, cyber safety and online protection, identifying misinformation and fake news, and productive use of digital tools, through interactive presentations, quizzes, games, and scenario-based questions, plus a dialogue with school teachers on fostering digital responsibility in classrooms. Directly benefiting 45 students and indirectly reaching 100+ teachers and parents, and coordinated by Rtr. Binda Dahal with 5 club members present, the 1.5-hour session contributed 16 volunteering hours at a total expense of NRs. 1,500, aligned with SDG 4: Quality Education.',
  'media/liberty/digital-1.jpg',
  '["media/liberty/digital-1.jpg", "media/liberty/digital-2.jpg", "media/liberty/digital-3.jpg", "media/liberty/digital-4.jpg", "media/liberty/digital-5.jpg"]'::jsonb,
  1750000000000
),
(
  'leftism-feminism-genz-2026',
  'liberty',
  'Understanding Leftism and Feminism in Gen Z',
  'Women Empowerment',
  '2026-05-16',
  'Liberty College',
  'Speaker session with Georgetown scholar Bimba Panthi on ideology, feminism, and Gen Z digital culture.',
  'On 16 May 2026, the Rotaract Club of Liberty College organized the speaker session "Understanding Leftism and Feminism in Gen Z" at Liberty College premises, jointly with the Rotaract Club of New Road City Kathmandu. Facilitated by distinguished global affairs scholar Mr. Bimba Panthi (BSc in Foreign Service, Georgetown University; writer for Lungri), the session moved beyond social media stereotypes into the structural histories of leftist thought and feminist waves, how Gen Z adopts and reshapes these frameworks, digital platforms as catalysts of youth activism, ideological polarization and echo chambers, and how memes translate serious ideologies for mass consumption. An extended interactive Q&A let students debate polarization, cultural impacts, and political identity, with discussions continuing in small groups long after adjournment. Coordinated by Rtr. Bhawana Kumari Bhatta with 12 members present, the 1.5-hour session contributed 12 volunteering hours at a total expense of NRs. 69.99, aligned with SDG 5.',
  'media/liberty/leftism-feminism.jpg',
  '["media/liberty/leftism-feminism.jpg"]'::jsonb,
  1750000000000
),
(
  'community-cleanup-dashain-tihar-2025',
  'liberty',
  'Community Clean-Up Drive — Dashain & Tihar Season',
  'Cleaning Campaign',
  '2025-09-25',
  'Sachet Marga Tole (Bhaktapur), Global Park (Okhaldhunga), Ghordaura (Dang)',
  'Decentralized festive-season cleanliness drives across three home localities in Bhaktapur, Okhaldhunga, and Dang.',
  'During the Dashain and Tihar festival season of 2025, the Rotaract Club of Liberty College ran a decentralized Local Cleanliness Initiative -- members used their festival holidays in their home villages and localities to lead cleanliness drives in their own neighborhoods. The multi-day campaign covered three locations: Sachet Marga Tole, Kaushaltar, Bhaktapur; Global Park, Okhaldhunga; and Ghordaura, Dang -- spanning urban, hilly, and plains regions of Nepal. Drives focused on streets, lanes, and public spaces, with local residents spontaneously joining at several locations. Coordinated by Rtr. Binda Dahal, Rtr. Bisesh Jung Nepali, and Rtr. Archana Jaiswal, with 4 Rotaractors and 6 other visitors over 15 days, the campaign contributed 15 volunteering hours at a total expense of NRs. 1,640.',
  'media/liberty/cleanup-1.jpg',
  '["media/liberty/cleanup-1.jpg", "media/liberty/cleanup-2.jpg", "media/liberty/cleanup-3.jpg", "media/liberty/cleanup-4.jpg"]'::jsonb,
  1750000000000
),
(
  'bonds-beyond-service-2026',
  'liberty',
  'Bonds Beyond Service — Sharing Love 5.0 Conclusion Gathering',
  'Felicitation / Recognition',
  '2026-04-04',
  'Greenhouse Restaurant',
  'Appreciation gathering closing Sharing Love 5.0 with six partner clubs and tokens of love.',
  'On 4 April 2026, the Rotaract Club of Liberty College organized "Bonds Beyond Service", a special Conclusion and Appreciation Gathering at Greenhouse Restaurant to formally close Sharing Love 5.0, celebrating the collective efforts behind the project and its Beats of Warmth collaboration. Representatives from all collaborating clubs -- RAC New Road City Kathmandu, RAC Reliance College, RAC Kathmandu North East, RAC Bhadgaon, RAC Kathmandu Metropolis, RAC Balkumari, and RAC Liberty College -- reflected on the journey, expressed gratitude, and strengthened fellowship, with each club presented a token of love symbolizing unity and collective service. Coordinated by Rtr. Rahul Khatiwada with 5 club members and 7 Rotaractors present, the one-hour gathering contributed 26 volunteering hours at a total expense of NRs. 2,400.',
  'media/liberty/bonds-1.jpg',
  '["media/liberty/bonds-1.jpg", "media/liberty/bonds-2.jpg", "media/liberty/bonds-3.jpg", "media/liberty/bonds-4.jpg"]'::jsonb,
  1750000000000
),
(
  'traffic-office-equipment-handover-2026',
  'liberty',
  'Equipment Handover to Kathmandu Valley Traffic Office',
  'Collaboration / Partnership / Volunteering',
  '2026-01-30',
  'Everest Hotel, Kathmandu',
  'Computer and printer donated to the Traffic Office with Rotary Nagarjun and Nepal Traffic Police.',
  'On 30 January 2026, on the occasion of the 22nd Charter Day of the Rotary Club of Nagarjun, a computer and printer were officially donated to the Kathmandu Valley Traffic Office to replace equipment damaged during recent public unrest, restoring operational efficiency and public service delivery. The handover at Everest Hotel, Kathmandu, was carried out in collaboration with the Nepal Traffic Police and the Rotaract Club of Liberty College, in the presence of District Governor Rtn. Binod Koirala, district officials, and Rotary members. Coordinated by Rtr. Riona Dhungel with 3 club members and 5 Rotaractors present, the 2-hour program contributed 72 volunteering hours at a total expense of NRs. 349.96, aligned with SDG 11 and SDG 16.',
  'media/liberty/dental-session.jpg',
  '["media/liberty/dental-session.jpg"]'::jsonb,
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

-- ============================================================
-- SOURCE: kathmanduheight_projects.sql
-- ============================================================
insert into projects (id, club_slug, title, category, date, location, summary, body, cover, gallery, updated)
values
(
  'rotary-haat-bazaar-2026',
  'kathmanduheight',
  'Rotary Haat Bazaar',
  'Collaboration / Partnership / Volunteering',
  '2026-01-24',
  'Rotary Hall, Thapathali',
  'Nepal''s first Rotary Haat Bazaar promoting local entrepreneurship; Rtr. Abhipsa Sharma donated jewelry-sale proceeds to the club fund.',
  'Members of the Rotaract Club of Kathmandu Height participated in Nepal''s first-ever Rotary Haat Bazaar on 24-25 January 2026 at Rotary Hall, Thapathali -- a unique initiative promoting local entrepreneurship, creativity, and community-based businesses, with the Rotary President action group. The event brought together entrepreneurs, artisans, and small business owners displaying locally produced goods and handmade products; members explored stalls, interacted with vendors, and learned about sustainable entrepreneurship and economic empowerment. A highlight was Rtr. Abhipsa Sharma presenting her handmade jewelry and donating the proceeds to the Rotaract Club of Kathmandu Height Fund for community service initiatives. Coordinated by Abhipsa Sharma with 8 club members and 4 other visitors present, the 2-day event contributed 100 volunteering hours at a total expense of NRs. 1,000.',
  'media/kathmanduheight/haat-bazaar-1.jpg',
  '["media/kathmanduheight/haat-bazaar-1.jpg", "media/kathmanduheight/haat-bazaar-2.jpg", "media/kathmanduheight/haat-bazaar-3.jpg"]'::jsonb,
  1750000000000
),
(
  'words-matter-communication-2026',
  'kathmanduheight',
  'Words Matter: Mastering Communication Etiquette',
  'Public Speaking',
  '2026-03-14',
  'Apex College, Mid-Baneshwor',
  'World Rotaract Week co-hosted session on professional communication with Tripureswor, Baneswor, Sukedhara, and Matribhumi Baluwatar.',
  'The Rotaract Club of Kathmandu Height proudly co-hosted "Words Matter: Mastering Communication Etiquette" on 14 March 2026 at Apex College, Mid-Baneshwor, in observance of World Rotaract Week. Organized by the Rotaract Club of Tripureswor and co-hosted with the Rotaract Clubs of Baneswor, Sukedhara, and Matribhumi Baluwatar, the 3-hour session was facilitated by Mr. Ankush Adhikari, an expert in professional communication and leadership development. Participants explored principles of professional etiquette, communication in leadership -- tone, word choice, body language -- speaking with impact, and personal branding through discussions and interactive activities. As a newly chartered club (6 January 2026), Kathmandu Height supported collaborative organization, logistics, and participant engagement, with 5 members attending alongside 20 fellow Rotaractors and 1 visitor. Coordinated by Rtr. Rishav Thapa, the session contributed 15 volunteering hours.',
  'media/kathmanduheight/words-matter-1.jpg',
  '["media/kathmanduheight/words-matter-1.jpg", "media/kathmanduheight/words-matter-2.jpg", "media/kathmanduheight/words-matter-3.jpg", "media/kathmanduheight/words-matter-4.jpg"]'::jsonb,
  1750000000000
),
(
  'food-donation-maghe-sankranti-2026',
  'kathmanduheight',
  'Food Donation Program — Maghe Sankranti 2026',
  'Special Area Projects',
  '2026-01-16',
  'Nisaya Sewa Sadan, Shantinagar, Kathmandu',
  'Inaugural service project: festive foods and companionship for 55 elderly residents, ten days after charter.',
  'On the auspicious occasion of Maghe Sankranti, the Rotaract Club of Kathmandu Height undertook its inaugural service project on 16 January 2026 -- just ten days after receiving its charter. Nine Rotaractors traveled to Nisaya Sewa Sadan, Shantinagar, spending quality time with 55 elderly residents and distributing traditional festive foods such as Bhuja ko Laddu, Til ko Laddu, and Chaku. Beyond food, the team offered presence, conversation, and genuine human connection -- fostering care, inclusion, intergenerational bonding, and cultural celebration. Coordinated by Parash Bista and Rtr. Mandip Chaudhary with 9 club members and 1 guest present, the 4.5-hour program contributed 50 volunteering hours at a total expense of NRs. 4,004.98, aligned with SDG 2 (Zero Hunger) and SDG 3 (Good Health).',
  'media/kathmanduheight/food-donation-1.jpg',
  '["media/kathmanduheight/food-donation-1.jpg", "media/kathmanduheight/food-donation-2.jpg", "media/kathmanduheight/food-donation-3.jpg", "media/kathmanduheight/food-donation-4.jpg", "media/kathmanduheight/food-donation-5.jpg", "media/kathmanduheight/food-donation-6.jpg"]'::jsonb,
  1750000000000
),
(
  'gift-of-warmth-kavre-2026',
  'kathmanduheight',
  'Nepal School Support Initiative: Gift of Warmth — Warm Clothes Distribution 2026',
  'Special Area Projects',
  '2026-02-06',
  'Janajagriti Basic School and Mathura Pati High School, Kavre',
  'Two-day distribution of warm clothes, stationery, and sports materials to 1,000 students across two Kavre schools.',
  'On 6-7 February 2026, the Rotaract Club of Kathmandu Height ran the "Gift of Warmth" warm clothes distribution program across Janajagriti Basic School and Mathura Pati High School in Kavre, with the Rotary Club of Kathmandu Height and Sanskriti Farms and Research Center. Over two days, warm clothes, stationery kits, and sports materials reached 1,000 students -- addressing comfort, learning, and play in a single coordinated effort -- closing with a fellowship night at Phoolbari Homestay hosted by the parent club. Led by Rtr. Abhipsa Sharma (International Services Co-Chair), honored by Janajagriti Basic School for her dedication, with 1 Rotaractor, 4 Rotarians, and 4 visitors present, the program contributed 32 volunteering hours at a total expense of NRs. 1,500, aligned with SDG 3 and SDG 4.',
  'media/kathmanduheight/gift-warmth-1.jpg',
  '["media/kathmanduheight/gift-warmth-1.jpg", "media/kathmanduheight/gift-warmth-2.jpg", "media/kathmanduheight/gift-warmth-3.jpg", "media/kathmanduheight/gift-warmth-4.jpg", "media/kathmanduheight/gift-warmth-poster.png"]'::jsonb,
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

-- ============================================================
-- SOURCE: baneshwor_projects.sql
-- ============================================================
insert into projects (id, club_slug, title, category, date, location, summary, body, cover, gallery, updated)
values
(
  'classroom-to-career-2026',
  'baneshwor',
  'From Classroom to Career — Preparing for the Professional World',
  'Collaboration / Partnership / Volunteering',
  '2026-02-21',
  'Google Meet (Virtual)',
  'Career-readiness session on communication, resumes, and interviews with RAC People''s Campus and RAC Itahari.',
  'The Rotaract Club of Itahari, jointly with the Rotaract Club of People''s Campus, organized the professional development session "From Classroom to Career: Preparing for the Professional World" on 21 February 2026 via Google Meet, with the Rotaract Club of Baneshwor proudly participating as co-host. Two facilitators led the session: Rtr. Jenisha Suman, public speaker and communicator from NIRN Nepal, on confidence, communication skills, body language, and interview readiness; and Bijisha Parsain, People and Culture Officer at ARKBO Technologies Pvt. Ltd., with hands-on guidance on resume building, cover letters, recruiter perspectives, and mock-based interview scenarios. Coordinated by Amit Maharjan with 5 club members present, 40 Rotaractors took part over 2 hours, contributing 12 volunteering hours.',
  'media/baneshwor/career-1.jpg',
  '["media/baneshwor/career-1.jpg", "media/baneshwor/career-2.jpg", "media/baneshwor/career-3.png", "media/baneshwor/career-4.png", "media/baneshwor/career-5.png", "media/baneshwor/career-6.png"]'::jsonb,
  1750000000000
),
(
  'personal-finance-orientation-2026',
  'baneshwor',
  'An Orientation on Personal Finance',
  'Financial Literacy',
  '2026-02-14',
  'Google Meet (Virtual)',
  'Personal finance session with CFA Kaustubh Agashe, co-hosted with RAC Bengaluru HSR (RID 3191), reaching 140+ participants.',
  'The Rotaract Club of Bengaluru HSR (RID 3191) organized the online session "An Orientation on Personal Finance" on 14 February 2026, with the Rotaract Club of Baneshwor as co-host. Featuring Mr. Kaustubh Agashe (CFA) -- IIMA alumnus, SEBI Registered Investment Adviser, and finance mentor -- the session equipped participants with essentials of managing personal finances: why to start early, fundamental financial terms, the financialization of the Indian economy, the speaker''s personal investment approach, the Rule of 72, interest rates, compounding, and common investing misconceptions, with real-life examples and motivational insights. Planned for Zoom but smoothly shifted to Google Meet, the event drew an impressive 140+ participants. Coordinated by Amit Maharjan with 5 club members and 142 Rotaractors present, the one-hour session contributed 6 volunteering hours.',
  'media/baneshwor/finance-1.png',
  '["media/baneshwor/finance-1.png", "media/baneshwor/finance-2.png", "media/baneshwor/finance-3.png", "media/baneshwor/finance-4.png", "media/baneshwor/finance-5.png", "media/baneshwor/finance-6.jpg"]'::jsonb,
  1750000000000
),
(
  'free-drinking-water-pashupatinath-2026',
  'baneshwor',
  'Free Drinking Water Distribution at Pashupatinath',
  'Donation',
  '2026-02-19',
  'Pashupatinath Temple',
  '10 cases of safe drinking water distributed to devotees and visitors at Pashupatinath Temple.',
  'The Rotaract Club of Baneshwor conducted a Free Drinking Water Distribution Service at Pashupatinath Temple on 19 February 2026, distributing 10 cases of water to temple visitors and devotees. Considering the large daily footfall at the temple, the initiative ensured easy access to safe drinking water while promoting public welfare, compassion, and social responsibility. Coordinated by Pushkal Rijal with 7 club members present, the 2-hour service contributed 16 volunteering hours at a total expense of NRs. 1,500, aligned with SDG 3: Good Health and Well-Being.',
  'media/baneshwor/water-1.jpg',
  '["media/baneshwor/water-1.jpg", "media/baneshwor/water-2.jpg", "media/baneshwor/water-3.jpg", "media/baneshwor/water-4.jpg"]'::jsonb,
  1750000000000
),
(
  'excel-essentials-2025',
  'baneshwor',
  'Excel Essentials: Mastering the Basics',
  'Training / Workshops',
  '2025-11-28',
  'Google Meet (Virtual)',
  'Excel training by CA Sunil Timalsina with 14 co-host clubs and 45 Rotaractors.',
  'The Rotaract Club of Baneshwor hosted the online training session "Excel Essentials: Mastering the Basics" on 28 November 2025 via Google Meet, bringing together members from 14 co-host clubs -- RAC Jawalakhel Manjushree, RAC Itahari, RAC Himalaya Patan, RAC Patan, RAC Rudramati, RAC Butwal South, RAC Birat Medical College Fusion, RAC Sankhu, RAC Gyaneswor CiST, RAC Tribhuvan University, RAC Tinkune Kathmandu, RAC Sukedhara, RAC Lumbini Stars -- plus the Interact Club of Chelsea International Academy. Facilitated by CA Sunil Timalsina (Chartered Accountancy, ICAI; experienced in internal and statutory auditing, payroll, tax audit, and financial statements), the session covered formulas, formatting, shortcuts, data organization, and real-world applications, with participants practicing along and raising professional use cases. Coordinated by Rashmi Timalsina and Prashanna Gautam with 10 club members present, 45 Rotaractors took part over 1 hour 15 minutes, contributing 14 volunteering hours.',
  'media/baneshwor/excel-1.jpg',
  '["media/baneshwor/excel-1.jpg", "media/baneshwor/excel-2.jpg", "media/baneshwor/excel-3.jpg", "media/baneshwor/excel-4.jpg"]'::jsonb,
  1750000000000
),
(
  'birthday-of-compassion-2025',
  'baneshwor',
  'Birthday of Compassion',
  'Donation',
  '2025-09-07',
  'Nisahaya Sewa Sadan (Jestha Nagarik Awash Griha), Shantinagar',
  'Remembrance of Late Ramanand Prasad Pandit turned into celebration with elderly residents: T-shirts, shawls, and cake.',
  'The Rotaract Club of Baneshwor organized "Birthday of Compassion" on 7 September 2025 at Nisahaya Sewa Sadan (Jestha Nagarik Awash Griha), Shantinagar, honoring the memory of Late Ramanand Prasad Pandit, father of fellow Rotaractor Rtr. Srijana Pandit, by spreading love and joy among elderly residents. T-shirts, shawls, and cakes were distributed -- the cake generously sponsored by De Cake Paradise -- and the day was spent interacting with residents, listening to their stories, and sharing warm conversations. Coordinated by Srijana Pandit and Amit Maharjan with 10 club members and 2 other visitors present, the 1.5-hour event contributed 21 volunteering hours at a total expense of NRs. 16,000, aligned with SDG 3.',
  'media/baneshwor/birthday-1.png',
  '["media/baneshwor/birthday-1.png", "media/baneshwor/birthday-2.png", "media/baneshwor/birthday-3.png", "media/baneshwor/birthday-4.png", "media/baneshwor/birthday-5.png", "media/baneshwor/birthday-6.png"]'::jsonb,
  1750000000000
),
(
  'feed-the-fur-3-2025',
  'baneshwor',
  'Feed the Fur 3.0 — Pamper the Paws',
  'Signature Project',
  '2025-08-16',
  'Pashupatinath Temple and Kamalpokhari, Kathmandu',
  'Signature animal-welfare project feeding street dogs, pigeons, monkeys, and fish with 8 clubs across two districts.',
  'The Rotaract Club of Baneshwor (RID 3292) and the Rotaract Club of Kolhapur Midtown Phoenix (RID 3170), in collaboration with six other clubs -- RAC Itahari, RAC Sankhu, RAC Itabhatta Municipal, RAC Mechinagar, and RAC Tribhuvan University -- organized "Feed the Fur 3.0; Pamper the Paws" on 16 August 2025, near Shree Krishna Janmashtami. At Pashupatinath Temple, food was distributed to dogs, pigeons, and monkeys; at Kamalpokhari, participants fed fishes -- extending love and compassion to street and neglected animals while spreading awareness on protecting all living beings. Coordinated by Amit Maharjan with 8 club members, 13 Rotaractors, and 1 other visitor present, the 3-hour signature project contributed 66 volunteering hours at a total expense of NRs. 1,630, aligned with SDG 2.',
  'media/baneshwor/feedfur-1.png',
  '["media/baneshwor/feedfur-1.png", "media/baneshwor/feedfur-2.jpg", "media/baneshwor/feedfur-3.jpg", "media/baneshwor/feedfur-4.jpg", "media/baneshwor/feedfur-5.jpg", "media/baneshwor/feedfur-6.jpg"]'::jsonb,
  1750000000000
),
(
  'honoring-wisdom-fathers-day-2025',
  'baneshwor',
  'Honoring Wisdom: Father''s Day',
  'Donation',
  '2025-08-23',
  'Nisahaya Sewa Sadan (Jestha Nagarik Awash Griha), Shantinagar',
  'Father''s Day celebration with elderly residents: tika, juices, rice, sugar, and spices with heartfelt interaction.',
  'The Rotaract Club of Baneshwor organized "Honoring Wisdom: Father''s Day" on 23 August 2025 at Nisahaya Sewa Sadan (Jestha Nagarik Awash Griha), Shantinagar, celebrating Father''s Day with elderly residents. The program included heartfelt conversations, putting tika, sharing juices, and handing over rice, sugar, and spices -- creating a warm, family-like atmosphere that reduced loneliness and honored the wisdom of elders. Coordinated by Amit Maharjan and Yatra Kalakheti with 4 club members present, the one-hour celebration contributed 4 volunteering hours at a total expense of NRs. 5,130, aligned with SDG 3.',
  'media/baneshwor/fathersday-1.png',
  '["media/baneshwor/fathersday-1.png", "media/baneshwor/fathersday-2.png", "media/baneshwor/fathersday-3.png", "media/baneshwor/fathersday-4.png", "media/baneshwor/fathersday-5.png", "media/baneshwor/fathersday-6.jpg"]'::jsonb,
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

-- ============================================================
-- SOURCE: sukedhara_projects.sql
-- ============================================================
insert into projects (id, club_slug, title, category, date, location, summary, body, cover, gallery, updated)
values
(
  'eye-camp-balkumari-school-2025',
  'sukedhara',
  'Free Eye Camp at Shree Balkumari School',
  'Health Camp',
  '2025-05-30',
  'Shree Balkumari School',
  '350 students screened and 13 treated with RAC Liberty College, RAC Damak, RC Nagarjun, and Everest Eye Care Center.',
  'The Rotaract Club of Sukedhara hosted a Free Eye Camp at Shree Balkumari School on 30 May 2025, in collaboration with RAC Liberty College and RAC Damak, with support from RC Nagarjun. Led by Everest Eye Care Center with Dr. Prabin Chhetri, the camp provided free eye screenings and diagnoses: 350 students screened, of which 13 were diagnosed with various eye deficiencies and treated accordingly, with a team of five volunteers and one medical staff. The initiative also opened discussions on further healthcare collaborations and long-term sustainability of similar programs. Coordinated by Rtr. Rajay Bajracharya with 3 club members and 2 Rotaractors present, the 4-hour camp contributed 3 volunteering hours at a total expense of NRs. 10,000, aligned with SDG 3.',
  'media/sukedhara/eyecamp-1.jpg',
  '["media/sukedhara/eyecamp-1.jpg", "media/sukedhara/eyecamp-2.jpg", "media/sukedhara/eyecamp-3.jpg", "media/sukedhara/eyecamp-4.jpg", "media/sukedhara/eyecamp-5.jpg", "media/sukedhara/eyecamp-6.jpg"]'::jsonb,
  1750000000000
),
(
  'teach-feel-deal-heal-2025',
  'sukedhara',
  'Project TEACH: Feel It, Deal It, Heal It — Adolescents and Emotions',
  'RNLM (TEACH)',
  '2025-05-19',
  'Trikon Public Secondary School',
  'Zone-7-wide emotional intelligence session for adolescents led by Rtn. Osha Shrestha with role-play and emotion cards.',
  'The Rotaract Club of Sukedhara hosted Project TEACH "Feel It, Deal It, Heal It -- Adolescents and Emotions" on 19 May 2025 at Trikon Public Secondary School, jointly with all Zone 7 clubs: RAC Kathmandu West, RAC New Road City Kathmandu, RAC Tripureswor, RAC Liberty College, RAC Sankhu, RAC Baneshwor, and RAC Balkumari. Rtn. Osha Shrestha guided students through an interactive session on understanding, managing, and healing emotions -- with breathing exercises, real-life storytelling, fun role-playing, emotion cards, and safe sharing spaces -- while volunteers ensured each child received personalized attention. Coordinated by Prasanna Shakya, with 10 Rotaractors across the joint clubs, the 2-hour session contributed 20 volunteering hours at a total expense of NRs. 95.98.',
  'media/sukedhara/teach-1.jpg',
  '["media/sukedhara/teach-1.jpg", "media/sukedhara/teach-2.jpg", "media/sukedhara/teach-3.jpg", "media/sukedhara/teach-4.jpg", "media/sukedhara/teach-5.jpg", "media/sukedhara/teach-chart.png"]'::jsonb,
  1750000000000
),
(
  'club-cots-2025',
  'sukedhara',
  'Club COTS',
  'Training / Workshops',
  '2025-05-06',
  'Google Meet (Virtual)',
  'Club Officer Training Seminar on roles, governance, and public speaking with ADLT Rtr. Ruchin Khadka.',
  'The Rotaract Club of Sukedhara conducted a virtual Club COTS (Club Officer Training Seminar) session on 6 May 2025 via Google Meet, facilitated by Rtr. Ruchin Khadka, Assistant District Leadership Trainer from the Rotaract Club of Kathmandu Metro, and hosted by Rtr. Mohit Muni Bajracharya as Master of Ceremony. New members and incoming-year designees learned the roles and responsibilities of a Rotaractor and club director, club governance and what not to do while representing as a Rotaractor, while building rapport and practicing public speaking -- with thought-provoking questions from Rtr. Sushovan Shakya and Rtr. Rajay Bajracharya. A virtual certificate of appreciation honored the facilitator. With 11 Sukedhara members and 1 Metro guest (12 Rotaractors), the 1.25-hour session contributed 16 volunteering hours.',
  'media/sukedhara/cots-1.png',
  '["media/sukedhara/cots-1.png", "media/sukedhara/cots-2.png", "media/sukedhara/cots-3.png", "media/sukedhara/cots-4.png", "media/sukedhara/cots-5.png"]'::jsonb,
  1750000000000
),
(
  'library-setup-nakkhu-2025',
  'sukedhara',
  'Library Set-Up at The Orphans Home, Nakkhu',
  'Donation',
  '2025-03-02',
  'The Orphans Home, Nakkhu, Lalitpur',
  '300 books worth Rs. 30,000+ donated with Balkumari, Liberty College, and Pashupati Law Campus.',
  'The Rotaract Club of Sukedhara, jointly with RAC Balkumari, RAC Liberty College, and RAC Pashupati Nepal Law Campus, set up a library at The Orphans Home, Nakkhu, Lalitpur, on 2 March 2025. With generous support from fellow Rotaractors, 300 books valued over Rs. 30,000 were collected and donated, giving children access to educational resources and recreational reading -- received with joy and excitement, alongside a fellowship with the children. Coordinated by Rtr. Rajay Bajracharya with Rtr. Mohit Muni Bajracharya and Praman Shrestha and 13 Rotaractors present, the 1 hour 45 minute program contributed 29 volunteering hours, aligned with SDG 4.',
  'media/sukedhara/library.jpg',
  '["media/sukedhara/library.jpg"]'::jsonb,
  1750000000000
),
(
  'digital-privacy-security-2025',
  'sukedhara',
  'Digital Privacy Security Awareness Session',
  'Training / Workshops',
  '2025-02-23',
  'Google Meet (Virtual)',
  'Cybersecurity session on passwords, 2FA, encryption, and digital rights with 8 co-host clubs and 75 Rotaractors.',
  'The Rotaract Club of Sukedhara and the Rotaract Club of Liberty College hosted the Digital Privacy Security Awareness Session on 23 February 2025 via Google Meet, co-hosted by RAC Reliance College, RAC Balaju, RAC Kathmandu Metropolis, RAC Kathmandu North East, RAC Bhadgaon, RAC Thames, and RAC Kathmandu West. Facilitated by Mr. Sushovan Shakya, the session covered digital threats (hacking, phishing, data breaches), secure password management, two-factor authentication, data encryption, safe browsing, cybersecurity laws, digital rights, and ethical online conduct. Coordinated by Sushovan Shakya with 8 club members present, 75 Rotaractors took part over 2 hours, contributing 21 volunteering hours.',
  'media/sukedhara/privacy-1.jpg',
  '["media/sukedhara/privacy-1.jpg", "media/sukedhara/privacy-2.jpg", "media/sukedhara/privacy-3.jpg", "media/sukedhara/privacy-4.jpg", "media/sukedhara/privacy-5.jpg", "media/sukedhara/privacy-6.jpg"]'::jsonb,
  1750000000000
),
(
  'gift-of-hope-2-2024',
  'sukedhara',
  'Gift of Hope 2.0 — Stationery Donation at Shree Hira Devi School, Melamchi',
  'Signature Project',
  '2024-08-23',
  'Shree Hira Devi School, Melamchi',
  'District-grant signature project: 32 bags, 96 copies, 64 pens for students with Rotary Nagarjun and Asha Foundation.',
  'The Rotaract Club of Sukedhara and the Rotary Club of Nagarjun, under Rotary District 3292 district grant DG 2023/24-108, organized "Gift of Hope 2.0" on 23 August 2024 at Shree Hira Devi School, Melamchi. Led by President Rtr. Rajay Bajracharya with the Asha Foundation, 32 bags, 96 copies, and 64 pens were donated to students -- supplying essential resources, fostering a positive learning environment, and bridging educational gaps for underprivileged children. Coordinated by Prabhu Ram Sapkota with 5 club members and 32 other visitors present, the 3-hour signature project contributed 78 volunteering hours at a total expense of NRs. 18,800, aligned with SDG 4.',
  'media/sukedhara/gifthope-1.jpg',
  '["media/sukedhara/gifthope-1.jpg", "media/sukedhara/gifthope-2.jpg", "media/sukedhara/gifthope-3.jpg"]'::jsonb,
  1750000000000
),
(
  'reusable-menstrual-pad-melamchi-2025',
  'sukedhara',
  'Making and Distribution of Reusable Menstrual Pads',
  'District Event',
  '2025-04-05',
  'Shree Sitaldevi Secondary School, Sindhupalchok / Melamchi',
  '3-day MHM training for 32 schoolgirls: orientation, kits, and pad-making, backed by District Grant and Rotary Nagarjun.',
  'The Rotaract Club of Sukedhara, supported by the Rotary Club of Nagarjun and a District Grant (NPR 2,33,000 total support), ran a 3-day menstrual hygiene management program on 5-7 April 2025 (filed with fieldwork at Shree Hira Devi Basic School and Shree Sitaldevi Secondary School, Sindhupalchok/Melamchi). Day-wise: orientation on menstruation biology and womanhood (31 students), hygiene education and myth-busting (32 students), and hands-on reusable pad-making training (32 students). Ms. Prajita Subedhi led the WASH and MHM orientation; Mr. Chandra Bhakta Adhikari covered oral hygiene; teachers and parents were oriented on MHM importance and the Chhaupadi ban; MHM kits (4 holders, 3 napkins, antibacterial soap, 2 undergarments, 2 ziplock bags, school bag) were distributed to 32 girls of classes 8-10 with a knowledge survey. Trainer Mr. Prabhu Ram Sapkota led pad-making in Melamchi Municipality with Ward 10 Chair Mr. Amrit Khanal attending. Coordinated by Rtr. Chandra Bhakta Adhikari and Prabhu Ram Sapkota with 5 members and 12 visitors over 3 days, the program contributed 245 volunteering hours at a total expense of NRs. 290,000, aligned with SDG 3 and SDG 4.',
  'media/sukedhara/mhm-1.jpg',
  '["media/sukedhara/mhm-1.jpg", "media/sukedhara/mhm-2.jpg", "media/sukedhara/mhm-3.jpg", "media/sukedhara/mhm-4.jpg", "media/sukedhara/mhm-topics.png", "media/sukedhara/mhm-focus.png"]'::jsonb,
  1750000000000
),
(
  'changing-narrative-suicide-2024',
  'sukedhara',
  'Changing the Narrative on Suicide',
  'International Online Exchange',
  '2024-09-10',
  'Google Meet (Virtual)',
  'World Suicide Prevention Day webinar with psychiatrist Dr. Purshotam Singh and letterhead exchange across clubs.',
  'On World Suicide Prevention Day, 10 September 2024, the Rotaract Club of Sukedhara hosted the virtual session "Changing the Narrative on Suicide" via Google Meet, jointly with RAC United Birgunj and RAC Sunsari. Chief speaker Dr. Purshotam Singh, psychiatrist from India, delivered a 30-minute presentation on what suicide is, why and how it happens, identification and prevention, and global statistics; engaging questions from Rtr. Rajay Bajracharya and Rtr. Mohit Muni Bajracharya enriched the dialogue. A virtual token of love honored Dr. Singh, and letterheads were exchanged among participating clubs for continued collaboration on mental health awareness. Coordinated by Mohit Muni Bajracharya with 7 club members and 55 Rotaractors present, the one-hour session contributed 55 volunteering hours, aligned with SDG 3.',
  'media/sukedhara/suicide-1.png',
  '["media/sukedhara/suicide-1.png", "media/sukedhara/suicide-2.png", "media/sukedhara/suicide-3.png", "media/sukedhara/suicide-4.png", "media/sukedhara/suicide-5.png", "media/sukedhara/suicide-6.png"]'::jsonb,
  1750000000000
),
(
  'esrag-wash-balkumari-school-2025',
  'sukedhara',
  'ESRAG Grant Project — Waste Segregation & WASH at Balkumari School',
  'Sanitation',
  '2025-06-29',
  'Shree Balkumari School, Sunakothi-27, Lalitpur',
  'US$500 ESRAG grant: waste segregation and WASH training for Classes 3-5 plus 32 bins with Lalitpur Metro support.',
  'The Rotaract Club of Sukedhara conducted the Waste Segregation and WASH Awareness Program on 29 June 2025 at Shree Balkumari Secondary School, Sunakothi-27, Lalitpur, supported by the ESRAG Global Board (US $500 grant) with the school administration and Lalitpur Metropolitan City. Targeting Classes 3, 4, and 5 after a needs assessment, activities included orientation on segregating biodegradable, recyclable, and non-recyclable waste and WASH principles; practical training by Er. Rahul Ranabhat (civil engineer, MSc Environmental Engineering) with relatable examples on disposal, composting, and personal hygiene; engagement with teachers and parents; and distribution of 12 large (green/red) and 20 small blue bins for sustained segregation. Coordinated by Sushovan Shakya with 6 club members, 5 Rotaractors, and 18 other visitors over 8 hours, the grant project contributed 19.97 volunteering hours at a total expense of NRs. 66,000, aligned with SDG 17 and Rotary''s environment focus.',
  'media/sukedhara/esrag-1.jpg',
  '["media/sukedhara/esrag-1.jpg", "media/sukedhara/esrag-2.jpg", "media/sukedhara/esrag-3.jpg", "media/sukedhara/esrag-4.jpg", "media/sukedhara/esrag-5.jpg"]'::jsonb,
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

-- ============================================================
-- SOURCE: newroadcity_reports_2025_26.sql
-- ============================================================
-- New Road City: cover/gallery backfills from club report images (2025-26).
-- Cover-only updates: existing rows (titles, dates, summaries, bodies) are left
-- untouched; only cover, gallery, and updated are set.
update projects set
  cover = 'media/newroadcity/mental-health.jpg',
  gallery = '["media/newroadcity/mental-health.jpg"]'::jsonb,
  updated = 1750000000000
where id = 'mental-health-awareness-2026';

update projects set
  cover = 'media/newroadcity/christmas-carnival.png',
  gallery = '["media/newroadcity/christmas-carnival.png"]'::jsonb,
  updated = 1750000000000
where id = 'christmas-carnival-2025';

update projects set
  cover = 'media/newroadcity/tree-1.jpg',
  gallery = '["media/newroadcity/tree-1.jpg", "media/newroadcity/tree-2.jpg", "media/newroadcity/tree-3.jpg", "media/newroadcity/tree-4.jpg", "media/newroadcity/tree-5.jpg", "media/newroadcity/tree-6.jpg"]'::jsonb,
  updated = 1750000000000
where id = 'tree-plantation-2025';

update projects set
  cover = 'media/newroadcity/goodwill-1.jpg',
  gallery = '["media/newroadcity/goodwill-1.jpg", "media/newroadcity/goodwill-2.jpg"]'::jsonb,
  updated = 1750000000000
where id = 'goodwill-visit-letterhead-2026';

-- ============================================================
-- SOURCE: kathmanduwest_reports_2025_26.sql
-- ============================================================
-- Kathmandu West: cover/gallery backfills from club report images.
-- Cover-only updates: existing rows (titles, dates, summaries, bodies) are left
-- untouched; only cover, gallery, and updated are set.
-- NOTE: this report file also contained filings from non-Zone-7 clubs
-- (Reliance College, Kathmandu, Bhadrapur, KIST Medical College) -- those
-- belong in their own club libraries and are intentionally excluded here.
update projects set
  cover = 'media/kathmanduwest/drr-visit.jpg',
  gallery = '["media/kathmanduwest/drr-visit.jpg"]'::jsonb,
  updated = 1750000000000
where id = 'drr-visit-2026';

update projects set
  cover = 'media/kathmanduwest/swaccha-setu.jpg',
  gallery = '["media/kathmanduwest/swaccha-setu.jpg"]'::jsonb,
  updated = 1750000000000
where id = 'swaccha-setu-2025';
