import pathlib, re
p = pathlib.Path(r"D:\6) Obsidian\Rotaract Zone 7\Website\zone7rotaract3292-main\zone7rotaract3292-main\flood-help.html")
t = p.read_text(encoding="utf-8")
names = re.findall(r'data-name="([^"]+)"', t)
print(names)
print("total", len(names))
# filter missing cards only (in missingBody section, but just list all)
missing_cards = [n for n in names if n in ["hemanta joshi","rohit maharjan","chessang tamang","dhirendra bisht","guru datta pandey","aavash neupane","anutam shrestha","ishwori prasad dahal","krishna shrestha","pratik gautam","rajesh shrestha","shanta lama","shital chetan chohan"] or "flood risk" in n]
print(missing_cards)
others = [n for n in names if n not in ["hemanta joshi","rohit maharjan","chessang tamang","dhirendra bisht","guru datta pandey"]]
print("others not in original 5:", others)
