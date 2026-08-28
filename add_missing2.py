import pathlib

p = pathlib.Path(r"D:\6) Obsidian\Rotaract Zone 7\Website\zone7rotaract3292-main\zone7rotaract3292-main\flood-help.html")
t = p.read_text(encoding="utf-8")

new_people = [
    ("Aavash Neupane", "Aavash Neupane.png"),
    ("Anutam Shrestha", "Anutam Shrestha.png"),
    ("Ishwori Prasad Dahal", "Ishwori Prasad Dahal.png"),
    ("Krishna Shrestha", "Krishna Shrestha.png"),
    ("Pratik Gautam", "Pratik Gautam.png"),
    ("Rajesh Shrestha", "Rajesh Shrestha.png"),
    ("Shanta Lama", "Shanta Lama.png"),
    ("Shital Chetan Chohan", "Shital Chetan Chohan.png"),
]

cards = ""
for name, fname in new_people:
    slug = name.lower().replace(" ", "-")
    data_name = name.lower()
    encoded = fname.replace(" ", "%20")
    src = f"media/Flood%20Risk/{encoded}"
    cards += f"""
          <div class="missing-card" data-name="{data_name}" data-area="flood risk" data-status="missing">
            <img class="missing-photo" src="{src}" alt="{name}" loading="lazy">
            <div class="missing-main">
              <div class="missing-name"><b>{name}</b> <span class="pill missing">Missing</span></div>
              <div class="missing-meta"><span>Flood-affected area</span><span class="sep"></span><span>Photo on record</span></div>
            </div>
            <div class="missing-actions">
              <div class="row"><button class="icon-btn" onclick="sharePerson('{slug}')">Share</button><button class="icon-btn" onclick="posterPerson('{slug}')">Poster</button></div>
              <span style="font-size:0.72rem; color:rgba(27,24,54,0.44);">Via Zone 7 desk</span>
            </div>
          </div>"""

# Insert before the closing of missing-grid: find the last occurrence of the notice that follows the grid
# The grid ends with "        </div>\n    </div>\n    <div class=\"notice\""
marker = "        </div>\n    </div>\n    <div class=\"notice\""
if marker in t:
    # Insert cards before the final </div> of the grid (which is the first </div> in marker)
    # Actually marker starts with 8 spaces + </div> which is the grid's closing
    # We want to insert cards before that
    t = t.replace(marker, cards + "\n" + marker, 1)
    print("Inserted 8 cards before notice")
else:
    print("Marker not found")
    # fallback: find the Guru card and insert after
    import re
    print("Fallback")

# Update counts - do simple replaces, avoid unicode in code
replacements = [
    ("5 missing", "13 missing"),
    ("5 verified", "13 verified"),
    ("5 people shown", "13 people shown"),
    ('Cross-check Zone 7', "Cross-check Zone 7"),
    # Update the select options for found modal - add 8 new options
]

for old, new in replacements:
    if old in t:
        # For the simple count ones, we want to replace all occurrences that are exactly the count display, but avoid over-replacing
        # For "5 missing" there are multiple places: flood-alert, section-tag, etc. Replace all
        t = t.replace(old, new)
        print(f"Replaced {old} -> {new}")

# Add options to found select: find the Guru option and append after it
old_opt = '<option value="guru-datta-pandey">Guru Datta Pandey</option>'
new_opt = old_opt + '\n      <option value="aavash-neupane">Aavash Neupane</option>\n      <option value="anutam-shrestha">Anutam Shrestha</option>\n      <option value="ishwori-prasad-dahal">Ishwori Prasad Dahal</option>\n      <option value="krishna-shrestha">Krishna Shrestha</option>\n      <option value="pratik-gautam">Pratik Gautam</option>\n      <option value="rajesh-shrestha">Rajesh Shrestha</option>\n      <option value="shanta-lama">Shanta Lama</option>\n      <option value="shital-chetan-chohan">Shital Chetan Chohan</option>'
if old_opt in t:
    t = t.replace(old_opt, new_opt)
    print("Added 8 options to found select")

p.write_text(t, encoding="utf-8")
print("Done write")
