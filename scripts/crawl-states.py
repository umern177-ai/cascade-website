"""Phase 1: crawl live state pages -> data/all-cities.json + reports/url-map.csv additions.
Read-only: fetches https://www.cascadecharterbus.com state pages and extracts city cards.
"""
import json, re, sys, time, csv
from pathlib import Path
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parent.parent
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0 Safari/537.36"

STATE_AREAS = [
    "al","ak","az","ar","ca","co","ct","de","dc","fl","ga","hi","id","il","in","ia",
    "ks","ky","la","me","md","ma","mi","mn","ms","mo","mt","ne","nv","nh","nj","nm",
    "ny","nc","nd","oh","ok","or","pa","ri","sc","sd","tn","tx","ut","vt","va","wa",
    "wv","wi","wy",
]

def fetch(url):
    req = Request(url, headers={"User-Agent": UA, "Accept": "text/html,*/*"})
    with urlopen(req, timeout=60) as r:
        return r.status, r.read().decode("utf-8", "replace")

def extract_cities(html, st):
    pat = re.compile(
        r'<a[^>]*href="/locations/%s/([a-z0-9-]+)/">.*?<h6[^>]*>(.*?)</h6>' % st,
        re.DOTALL,
    )
    seen, out = set(), []
    for slug, name in pat.findall(html):
        name = re.sub(r"\s+", " ", name).strip()
        if slug not in seen:
            seen.add(slug)
            out.append({"city": name, "slug": slug})
    return out

def main():
    all_cities = {}
    state_status = {}
    for st in STATE_AREAS:
        url = f"https://www.cascadecharterbus.com/locations/{st}/"
        for attempt in range(3):
            try:
                code, html = fetch(url)
                break
            except Exception as e:  # noqa: BLE001
                print(f"{st}: retry {attempt} {e}", file=sys.stderr)
                time.sleep(3)
        else:
            code, html = 0, ""
        state_status[st] = code
        if code != 200:
            print(f"{st}: HTTP {code}")
            continue
        cities = extract_cities(html, st)
        all_cities[st] = cities
        # keep the raw page for the theme work
        out = ROOT / "capture" / "live-html" / f"state-{st}.html"
        out.write_text(html, encoding="utf-8")
        print(f"{st}: {len(cities)} cities", flush=True)
        time.sleep(1.5)

    (ROOT / "data" / "all-cities.json").write_text(
        json.dumps(all_cities, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    (ROOT / "capture" / "state-status.json").write_text(
        json.dumps(state_status, indent=2), encoding="utf-8"
    )
    total = sum(len(v) for v in all_cities.values())
    print(f"DONE states={len(all_cities)} total_cities={total}")

if __name__ == "__main__":
    main()
