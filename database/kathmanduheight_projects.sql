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
