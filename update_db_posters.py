import requests

SUPABASE_URL = "https://pdlolyghlgztjrpxwytl.supabase.co"
ANON_KEY = "sb_publishable_MNRC6w2H8lZ9OANmmntZaQ__OBFwqCj"
HEADERS = {
    "apikey": ANON_KEY,
    "Authorization": f"Bearer {ANON_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

# Data extracted from posters (read via vision)
updates = {
    "seed-aavash-neupane": {
        "last_seen_area": "Upper Trisuli - 1, Doosan Enerbility",
        "reporter_phone": "9863483244",
        "details": "Status: Out of contact following the recent floods. Last Seen: Upper Trisuli - 1, Doosan Enerbility. Contact: 9863483244",
    },
    "seed-anutam-shrestha": {
        "last_seen_area": "Rasuwa Timure",
        "reporter_phone": "9815243908",
        "details": "Status: Out of contact following the recent floods. Last Seen: Rasuwa Timure. Contacts: 9815243908 / 9845229012",
    },
    "seed-chessang-tamang": {
        "last_seen_area": "Syafrubesi Bazar",
        "reporter_phone": "9813227218",
        "details": "Status: Out of contact following the recent floods. Location: Syafrubesi Bazar. Contact: 9813227218",
    },
    "seed-dhirendra-bisht": {
        "last_seen_area": "Kalikot",
        "reporter_phone": "9868380975",
        "details": "Status: Out of contact following the recent floods. Location: Kalikot. Note: Rasuwa Upper Hydropower Project, Dam Site - Doosan Enerbility Engineer. Contact: 9868380975. Residence: Kalikot. Note in Nepali: रसुवास्थित UPPER HYDROPOWER PROJECT, DAM SITE मा DOOSAN ENERBILITY का ENGINEER",
    },
    "seed-guru-datta-pandey": {
        "last_seen_area": "Kerung Border",
        "reporter_phone": "9847178122",
        "details": "Status: Out of contact following the recent floods. Location: Kerung Border. Contacts: 9847178122 | 9809442397 | 9860611062. Note: Went with tourist group for Kailash Mansarovar Yatra - गुरु दत्त पाण्डे कैलाश मानसरोवर यात्राका लागि पर्यटकहरूको समूहसँग जानुभएको हो",
    },
    "seed-ishwori-prasad-dahal": {
        "last_seen_area": "Sankhuwasabha, Madi Changrin",
        "reporter_phone": "9849259911",
        "details": "Status: Out of contact following the recent floods. Company: Fewa Construction Hydropower 3B. Residence: Sankhuwasabha District Madi Changrin. Contacts: 9849259911, 9763238516",
    },
    "seed-krishna-shrestha": {
        "last_seen_area": "Trishuli-3A Hydropower Project",
        "reporter_phone": "9851196303",
        "details": "Status: Out of contact following the recent floods. Company: Engineer working at the Trishuli-3A Hydropower Project. Contacts: 9851196303, 9851210197",
    },
    "seed-pratik-gautam": {
        "last_seen_area": "Upper Trishuli-1 Hydropower Plant (Doosan/Korean Company)",
        "reporter_phone": "9869188290",
        "details": "Status: Out of contact following the recent floods. Company: 216 MW Upper Trishuli-1 Hydropower Plant (Doosan Company, Korean Company). Contacts: 9869188290, 9810013255, 9701278333",
    },
    "seed-rajesh-shrestha": {
        "last_seen_area": "Rasuwa, Ghatte Khola",
        "reporter_phone": "9761721457",
        "details": "Status: Out of contact following the recent floods. Residence: Rasuwa, Ghatte Khola. Contact: 9761721457",
    },
    "seed-shanta-lama": {
        "last_seen_area": "Rasuwagadi, Ghatteykhola",
        "reporter_phone": "9808750804",
        "details": "Status: Out of contact following the recent floods. Residence: Rasuwagadi, Ghatteykhola. Contact: 9808750804",
    },
    "seed-shital-chetan-chohan": {
        "last_seen_area": "Pasang Laahamu, Nepal (Flood affected area) - 25th August 2026",
        "reporter_phone": "9820769239",
        "details": "Status: Out of contact following the recent floods. Last Seen: 25th August 2026 At Pasang Laahamu, Nepal (Flood affected area) Exact time not known. Description: Female, Wearing glasses, Height Approx. 5 ft 2 in, Build Medium, Language English, Hindi, Gujarati. From USA. Contact Family: Vikrama Kuvavala 9820769239",
    },
}

for id, data in updates.items():
    payload = {
        "last_seen_area": data["last_seen_area"],
        "reporter_phone": data["reporter_phone"],
        "details": data["details"],
        "updated_at": 0  # will be set by trigger? We use int time
    }
    import time
    payload["updated_at"] = int(time.time()*1000)
    # Use PATCH
    url = f"{SUPABASE_URL}/rest/v1/flood_missing_persons?id=eq.{id}"
    resp = requests.patch(url, headers=HEADERS, json=payload)
    print(f"{id}: {resp.status_code} {resp.text[:300]}")
    # Also try to verify
    if resp.status_code not in (200, 204):
        print(f"  Failed for {id}")

# Verify
import time as t2
r = requests.get(f"{SUPABASE_URL}/rest/v1/flood_missing_persons?select=id,name,last_seen_area,reporter_phone,details&order=created_at.desc&limit=15", headers={"apikey": ANON_KEY, "Authorization": f"Bearer {ANON_KEY}"})
print(f"\nVerify GET: {r.status_code}")
if r.status_code == 200:
    for row in r.json():
        print(f"{row['id']}: {row['name']} | {row['last_seen_area']} | {row['reporter_phone']} | {row['details'][:60]}")
