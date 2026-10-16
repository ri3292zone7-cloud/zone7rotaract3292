"""Parse district report-detail HTML pages (server-rendered, no XHR)."""
import re
import html as _html


def _text_lines(page_html):
    text = re.sub(r'<script.*?</script>', ' ', page_html, flags=re.S)
    text = re.sub(r'<style.*?</style>', ' ', text, flags=re.S)
    text = re.sub(r'<[^>]+>', '\n', text)
    lines = []
    for raw in text.split('\n'):
        cleaned = _html.unescape(raw).replace('\xa0', ' ').strip()
        if cleaned:
            lines.append(cleaned)
    return lines


LABELS = {
    'start_date': 'Start Date:',
    'end_date': 'End Date:',
    'avenue': 'Avenue:',
    'category': 'Project Category:',
    'venue': 'Project Venue:',
    'duration': 'Project Duration:',
    'volunteering_hours': 'Total Volunteering Hours:',
    'expense_nrs': 'Total Expense Amount (NRs.):',
    'benefit_note': 'Project Benefit Note:',
    'rotaractors': 'Rotaractors',
    'rotarians': 'Rotarians',
    'visitors': 'Other Visitors',
    'organized_by': 'Organized By',
    'other_orgs': 'Other Organizations',
}


def _section(lines, start, stop_markers):
    try:
        i = lines.index(start) + 1
    except ValueError:
        return []
    out = []
    while i < len(lines) and lines[i] not in stop_markers:
        out.append(lines[i])
        i += 1
    return out


DETAIL_STOPS = ('Project Details', 'List of Club Members Present',
                'List of Project Coordinators',
                'SDG (Sustainable Development Goals)', 'Report Images')


def parse_report_detail(page_html, report_id):
    """Return dict of report fields from a detail-page HTML string."""
    lines = _text_lines(page_html)
    out = {'id': report_id}
    for key, label in LABELS.items():
        try:
            i = lines.index(label)
        except ValueError:
            out[key] = None
        else:
            out[key] = lines[i + 1] if i + 1 < len(lines) else None
    try:
        rp = lines.index('Report Profile')
    except ValueError:
        rp = -5
    header = lines[rp + 1:rp + 6]
    out['title'] = header[1] if len(header) > 1 else None
    out['club'] = header[2] if len(header) > 2 else None
    out['project_type'] = header[3] if len(header) > 3 else None
    out['reporter'] = header[4] if len(header) > 4 else None
    out['objectives'] = [l for l in _section(lines, 'Project Objectives', DETAIL_STOPS)
                         if l != '●']
    out['details'] = '\n\n'.join(
        _section(lines, 'Project Details', DETAIL_STOPS))
    out['members_present'] = _section(
        lines, 'List of Club Members Present', DETAIL_STOPS)
    out['coordinators'] = _section(
        lines, 'List of Project Coordinators', DETAIL_STOPS)
    out['sdgs'] = _section(
        lines, 'SDG (Sustainable Development Goals)', DETAIL_STOPS)
    out['images'] = re.findall(
        r'<img[^>]*class="report-image"[^>]*src="([^"]+)"', page_html)
    return out
