import requests, json, time

SUPABASE_URL = "https://pdlolyghlgztjrpxwytl.supabase.co"
ANON_KEY = "sb_publishable_MNRC6w2H8lZ9OANmmntZaQ__OBFwqCj"
HEADERS = {
    "apikey": ANON_KEY,
    "Authorization": f"Bearer {ANON_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

# 13 static persons
seed = [
    {"name": "Hemanta Joshi", "last_seen_area": "Trishuli B", "reporter_name": "Sujan", "reporter_phone": "9843807960", "reporter_relation": "Family", "photo_url": "", "details": "Bajhang • Civil Engineer, Chilime Hydropower. If you've seen him, please call, even a small detail helps.", "consent": True},
    {"name": "Rohit Maharjan", "last_seen_area": "Dipulekh, Rasuwa", "reporter_name": "Kristina", "reporter_phone": "9702659268", "reporter_relation": "Family", "photo_url": "", "details": "Was returning from Dipulekh (Rasuwa Mathi), contactless since.", "consent": True},
    {"name": "Chessang Tamang", "last_seen_area": "Flood-affected area", "reporter_name": "Zone 7 desk", "reporter_phone": "", "reporter_relation": "Club", "photo_url": "media/Flood%20Risk/Chessang%20Tamang.jpg", "details": "Photo on record", "consent": True},
    {"name": "Dhirendra Bisht", "last_seen_area": "Flood-affected area", "reporter_name": "Zone 7 desk", "reporter_phone": "", "reporter_relation": "Club", "photo_url": "media/Flood%20Risk/Dhirendra%20Bisht.jpg", "details": "Photo on record", "consent": True},
    {"name": "Guru Datta Pandey", "last_seen_area": "Flood-affected area", "reporter_name": "Zone 7 desk", "reporter_phone": "", "reporter_relation": "Club", "photo_url": "media/Flood%20Risk/Guru%20Datta%20Pandey.jpg", "details": "Photo on record", "consent": True},
    {"name": "Aavash Neupane", "last_seen_area": "Flood-affected area", "reporter_name": "Zone 7 desk", "reporter_phone": "", "reporter_relation": "Club", "photo_url": "media/Flood%20Risk/Aavash%20Neupane.png", "details": "Photo on record", "consent": True},
    {"name": "Anutam Shrestha", "last_seen_area": "Flood-affected area", "reporter_name": "Zone 7 desk", "reporter_phone": "", "reporter_relation": "Club", "photo_url": "media/Flood%20Risk/Anutam%20Shrestha.png", "details": "Photo on record", "consent": True},
    {"name": "Ishwori Prasad Dahal", "last_seen_area": "Flood-affected area", "reporter_name": "Zone 7 desk", "reporter_phone": "", "reporter_relation": "Club", "photo_url": "media/Flood%20Risk/Ishwori%20Prasad%20Dahal.png", "details": "Photo on record", "consent": True},
    {"name": "Krishna Shrestha", "last_seen_area": "Flood-affected area", "reporter_name": "Zone 7 desk", "reporter_phone": "", "reporter_relation": "Club", "photo_url": "media/Flood%20Risk/Krishna%20Shrestha.png", "details": "Photo on record", "consent": True},
    {"name": "Pratik Gautam", "last_seen_area": "Flood-affected area", "reporter_name": "Zone 7 desk", "reporter_phone": "", "reporter_relation": "Club", "photo_url": "media/Flood%20Risk/Pratik%20Gautam.png", "details": "Photo on record", "consent": True},
    {"name": "Rajesh Shrestha", "last_seen_area": "Flood-affected area", "reporter_name": "Zone 7 desk", "reporter_phone": "", "reporter_relation": "Club", "photo_url": "media/Flood%20Risk/Rajesh%20Shrestha.png", "details": "Photo on record", "consent": True},
    {"name": "Shanta Lama", "last_seen_area": "Flood-affected area", "reporter_name": "Zone 7 desk", "reporter_phone": "", "reporter_relation": "Club", "photo_url": "media/Flood%20Risk/Shanta%20Lama.png", "details": "Photo on record", "consent": True},
    {"name": "Shital Chetan Chohan", "last_seen_area": "Flood-affected area", "reporter_name": "Zone 7 desk", "reporter_phone": "", "reporter_relation": "Club", "photo_url": "media/Flood%20Risk/Shital%20Chetan%20Chohan.png", "details": "Photo on record", "consent": True},
]

# Check existing
r = requests.get(f"{SUPABASE_URL}/rest/v1/flood_missing_persons?select=name", headers={"apikey": ANON_KEY, "Authorization": f"Bearer {ANON_KEY}"})
existing = set()
if r.status_code == 200:
    try:
        existing = set(x["name"].lower().strip() for x in r.json())
        print(f"Existing names in DB: {existing}")
    except: pass

for person in seed:
    if person["name"].lower() in existing:
        print(f"Skipping {person['name']} - already exists")
        continue
    payload = {
        "id": f"seed-{person['name'].lower().replace(' ', '-')}",
        "name": person["name"],
        "last_seen_area": person["last_seen_area"],
        "reporter_name": person["reporter_name"],
        "reporter_phone": person["reporter_phone"],
        "reporter_relation": person["reporter_relation"],
        "photo_url": person["photo_url"],
        "details": person["details"],
        "consent": person["consent"],
        "status": "missing",
        "created_at": int(time.time()*1000),
        "updated_at": int(time.time()*1000)
    }
    resp = requests.post(f"{SUPABASE_URL}/rest/v1/flood_missing_persons", headers=HEADERS, json=payload)
    print(f"Insert {person['name']}: {resp.status_code} {resp.text[:200]}")
    time.sleep(0.2)

# Verify count
r2 = requests.get(f"{SUPABASE_URL}/rest/v1/flood_missing_persons?select=id,name&order=created_at.desc", headers={"apikey": ANON_KEY, "Authorization": f"Bearer {ANON_KEY}"})
print(f"Total rows after seed: {len(r2.json()) if r2.status_code==200 else 'err '+str(r2.status_code)}")
if r2.status_code==200:
    for row in r2.json()[:15]:
        print(f" - {row['id']} | {row['name']}")
