import pathlib
p = pathlib.Path(r"D:\6) Obsidian\Rotaract Zone 7\Website\zone7rotaract3292-main\zone7rotaract3292-main\flood-help.html")
t = p.read_text(encoding="utf-8")
# Find the Notice after missing grid
idx = t.find('<div class="notice"')
print("Notice idx", idx)
print(repr(t[idx-500:idx+100]))
# Find Guru card
gidx = t.find('guru datta pandey')
print("Guru idx", gidx)
print(repr(t[gidx-200:gidx+800]))
# Find the closing of missing-grid: look for the pattern after Guru
# Find the next occurrence of '        </div>\n    </div>' after Guru
import re
pattern = re.compile(r'\s+</div>\s+</div>\s+<div class="notice"')
m = pattern.search(t, gidx)
if m:
    print("Found pattern at", m.start())
    print(repr(m.group(0)[:200]))
else:
    print("Pattern not found with regex")
    # try simpler
    snippet = t[gidx:gidx+1500]
    print(snippet[500:1000])
