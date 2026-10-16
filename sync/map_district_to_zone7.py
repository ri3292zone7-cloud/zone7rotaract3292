"""Map parsed district reports to ZONE7_DB.saveProject rows (pure)."""
import re
from datetime import date

RY_START = date(2026, 7, 1)
RY_END = date(2027, 6, 30)
SOURCE = 'https://my.rotaract3292.org/software/project-reports'


def slugify(title):
    slug = re.sub(r'[^a-z0-9]+', '-', (title or '').lower().strip())
    return slug.strip('-') or 'project'


def _int_or_none(value):
    try:
        return int(str(value).replace(',', '').strip())
    except (ValueError, AttributeError, TypeError):
        return None


def to_project(parsed, strict_ry=True):
    """Return saveProject-shaped dict.

    strict_ry=True (default) raises ValueError for start_dates outside RY
    2026-27 — the original one-shot import behavior. strict_ry=False
    accepts any parseable date so older Rotary Years can backfill the
    Archive (RY is derived from `date` on the frontend).
    """
    start_raw = (parsed.get('_list') or {}).get('start_date') or ''
    m = re.match(r'(\d{4})-(\d{2})-(\d{2})', start_raw)
    if not m:
        raise ValueError(f'unparseable start_date {start_raw!r}')
    day = date(int(m.group(1)), int(m.group(2)), int(m.group(3)))
    if strict_ry and not (RY_START <= day <= RY_END):
        raise ValueError(f'start_date {day} outside RY 2026-27')
    counts = [_int_or_none(parsed.get(k))
              for k in ('rotaractors', 'rotarians', 'visitors')]
    nums = [c for c in counts if c is not None]
    body_parts = [parsed.get('details') or '']
    if parsed.get('objectives'):
        body_parts.append('Objectives:\n- ' + '\n- '.join(parsed['objectives']))
    people = []
    if parsed.get('members_present'):
        people.append('Members present: ' + ', '.join(parsed['members_present']))
    if parsed.get('coordinators'):
        people.append('Coordinators: ' + ', '.join(parsed['coordinators']))
    if parsed.get('reporter'):
        people.append('Reported by: ' + parsed['reporter'])
    if people:
        body_parts.append('\n'.join(people))
    body_parts.append(f'Source: district report {SOURCE}/{parsed["id"]}')
    title = parsed.get('title') or 'Untitled'
    return {
        'id': f'{slugify(title)}-d3292-{parsed["id"]}',
        'club_slug': parsed['_slug'],
        'title': title,
        'category': parsed.get('category') or parsed.get('avenue') or '',
        'date': day.isoformat(),
        'location': parsed.get('venue') or '',
        'summary': parsed.get('benefit_note') or '',
        'body': '\n\n'.join(p for p in body_parts if p),
        'cover': '',
        'gallery': [],
        'attendees': sum(nums) if nums else None,
        'volunteer_hours': _int_or_none(parsed.get('volunteering_hours')),
        'duration': parsed.get('duration') or '',
        'jointly_with': parsed.get('other_orgs')
        if parsed.get('other_orgs') not in (None, '', 'N/A') else '',
        'host_status': parsed.get('project_type') or '',
        'project_code': '',
    }
