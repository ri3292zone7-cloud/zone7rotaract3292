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
