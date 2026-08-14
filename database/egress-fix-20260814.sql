-- ============================================================================
-- Egress fix — run in Supabase Dashboard → SQL Editor (project ri3292zone7-cloud)
-- Date: 2026-08-14
-- Why: the Free Plan counts UNcached egress (5 GB/cycle). Storage objects were
-- served with no Cache-Control, so every image view = uncached egress, and the
-- /guides page pulled legacy embedded file_data (multi-MB base64) on every load.
-- This file (1) caches storage responses so repeat views count as *cached*
-- egress (5 GB free, separate pool, currently ~0 used), and (2) purges the
-- legacy embedded guide blobs now that guides are served from media/guides.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Cache existing storage objects for 30 days.
--    Repeat loads then hit the CDN (cached egress) instead of uncached.
-- ---------------------------------------------------------------------------
UPDATE storage.objects
SET cache_control = 'max-age=2592000'
WHERE bucket_id = 'project-images';

-- 2. Set the bucket default so future uploads inherit the same cache header.
UPDATE storage.buckets
SET cache_control = 'max-age=2592000'
WHERE id = 'project-images';

-- ---------------------------------------------------------------------------
-- 3. Legacy embedded guide files (file_data column = base64 blobs, MBs each).
--    The site no longer fetches file_data (code change deployed alongside this).
--    First CHECK how much legacy data still exists, then purge.
-- ---------------------------------------------------------------------------

-- Diagnostic: how many rows still carry embedded data, and how big is it?
SELECT count(*)                                                       AS rows_with_embedded_data,
       count(*) FILTER (WHERE file_url IS NOT NULL)                   AS also_have_file_url,
       pg_size_pretty(sum(octet_length(file_data)))                   AS total_embedded_size
FROM guides
WHERE file_data IS NOT NULL;

-- Diagnostic: rows that would LOSE their file if we purge (no file_url).
-- If this returns any rows, migrate them to Storage/vercel first (re-upload).
SELECT id, title, file_name
FROM guides
WHERE file_data IS NOT NULL
  AND file_url IS NULL;

-- Purge (only safe once the query above returns 0 rows):
-- UPDATE guides
-- SET file_data = NULL
-- WHERE file_url IS NOT NULL;

-- ---------------------------------------------------------------------------
-- 4. Optional: shrink the database size now that projects fetch is lean.
--    Run VACUUM after purging to reclaim space (keeps the 0.5 GB/DB quota low).
-- ---------------------------------------------------------------------------
-- VACUUM (ANALYZE) guides;