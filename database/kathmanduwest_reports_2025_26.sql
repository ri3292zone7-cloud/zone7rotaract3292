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
