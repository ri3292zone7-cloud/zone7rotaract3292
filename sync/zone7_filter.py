"""Zone 7 RY 2026-27 keep/drop rules for district list rows."""
RY = '2026-27'

CLUB_TO_SLUG = {
    'RAC Balkumari': 'balkumari',
    'RAC Baneshwor': 'baneshwor',
    'RAC Liberty College': 'liberty',
    'RAC Kathmandu West': 'kathmanduwest',
    'RAC Kathmandu Height': 'kathmanduheight',
    'RAC Sankhu': 'sankhu',
    'RAC New Road City Kathmandu': 'newroadcity',
    'RAC Sukedhara': 'sukedhara',
    'RAC Tripureswor': 'tripureswor',
}

QUARANTINE = {'RAC Baneshwor (OLD)': 'quarantine-baneshwor-old'}


def keep_row(row):
    """Return (kept, slug, reason) for one district list row."""
    if row.get('current_rota_year_id') != RY:
        return False, None, 'wrong-ry'
    club = (row.get('clubs') or '').strip()
    if club in QUARANTINE:
        return False, None, QUARANTINE[club]
    slug = CLUB_TO_SLUG.get(club)
    if slug is None:
        return False, None, 'out-of-scope-club'
    return True, slug, 'kept'


def keep_row_any_ry(row):
    """Keep any in-scope Zone 7 club regardless of RY label.

    Used by the full-history backfill + ongoing sync so older Rotary Years
    land in the Archive instead of being dropped as 'wrong-ry'.
    """
    club = (row.get('clubs') or '').strip()
    if club in QUARANTINE:
        return False, None, QUARANTINE[club]
    slug = CLUB_TO_SLUG.get(club)
    if slug is None:
        return False, None, 'out-of-scope-club'
    return True, slug, 'kept'


def should_stop(recent_kept_counts, need=3):
    """Stop paginating after `need` consecutive pages with zero kept rows."""
    return len(recent_kept_counts) >= need and all(
        c == 0 for c in recent_kept_counts[-need:])
