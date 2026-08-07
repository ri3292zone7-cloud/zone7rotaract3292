-- =====================================================================
-- Zone 7 Rotaract — Migration 1: Scalability (Phase A)
-- Run this in Supabase Dashboard → SQL Editor. Safe to run more than once.
-- =====================================================================

-- 1) Indexes so the 1,000-row pagination queries stay fast at scale
CREATE INDEX IF NOT EXISTS idx_projects_club_slug_updated
  ON projects (club_slug, updated DESC);

CREATE INDEX IF NOT EXISTS idx_projects_updated
  ON projects (updated DESC);

CREATE INDEX IF NOT EXISTS idx_events_event_date
  ON events (event_date);

CREATE INDEX IF NOT EXISTS idx_guides_updated
  ON guides (updated DESC);

-- 2) guides.file_url — new guide uploads store the file in Storage and
--    keep only the public URL here (old rows keep file_data base64 and
--    still work via the guides.html fallback)
ALTER TABLE guides ADD COLUMN IF NOT EXISTS file_url text;

-- 3) Unique (club_slug, project_code) — project codes are now derived
--    from the max existing code instead of a count, so duplicates can
--    only happen via a race; this constraint makes that fail loudly
--    instead of silently creating two projects with the same code.
DO $$
DECLARE
  dup_count int;
BEGIN
  SELECT count(*) INTO dup_count FROM (
    SELECT club_slug, project_code
    FROM projects
    WHERE project_code IS NOT NULL AND project_code <> ''
    GROUP BY club_slug, project_code
    HAVING count(*) > 1
  ) d;

  IF dup_count = 0 THEN
    ALTER TABLE projects
      ADD CONSTRAINT projects_club_slug_project_code_key
      UNIQUE (club_slug, project_code);
    RAISE NOTICE 'Unique constraint added (no duplicates found).';
  ELSE
    RAISE NOTICE 'Skipped unique constraint: % duplicate (club_slug, project_code) pairs exist. Fix them first, e.g.:';
    RAISE NOTICE '  UPDATE projects SET project_code = project_code || ''-'' || id WHERE ...';
  END IF;
END $$;
