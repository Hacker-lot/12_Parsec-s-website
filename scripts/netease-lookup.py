import json
import urllib.parse
import urllib.request

QUERIES = [
    "flawed mangoes dramamine",
    "rj pasin lobster",
    "corn wave mango entertainment",
    "motorama wind in her hair",
    "molchat doma судно",
    "oasis wonderwall",
    "oasis don't look back in anger",
    "the cure friday i'm in love",
    "radiohead creep",
    "radiohead karma police",
    "snow patrol chasing cars",
    "john lennon imagine",
    "led zeppelin stairway to heaven",
    "led zeppelin immigrant song",
    "red hot chili peppers snow hey oh",
    "red hot chili peppers otherside",
]

def search(q):
    url = "https://music.163.com/api/search/get/web"
    data = urllib.parse.urlencode({"s": q, "type": 1, "limit": 3, "offset": 0}).encode()
    req = urllib.request.Request(url, data=data, headers={"User-Agent": "Mozilla/5.0", "Referer": "https://music.163.com"})
    with urllib.request.urlopen(req, timeout=15) as r:
        return json.load(r)

def outchain_ok(song_id):
    url = f"https://music.163.com/outchain/player?type=2&id={song_id}&auto=0&height=66"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            body = r.read().decode("utf-8", "ignore")
        blocked = "无法" in body or "版权" in body
        return "BLOCKED" if blocked else "ok"
    except Exception as e:
        return f"ERR {e}"

for q in QUERIES:
    try:
        res = search(q)
        songs = res.get("result", {}).get("songs", [])
        if not songs:
            print(f"{q}\n  NO RESULT\n")
            continue
        s = songs[0]
        artists = "/".join(a["name"] for a in s["artists"])
        dur = s.get("duration", 0) // 1000
        print(f"{q}\n  id={s['id']} | {s['name']} — {artists} | {dur//60}:{dur%60:02d} | {outchain_ok(s['id'])}\n")
    except Exception as e:
        print(f"{q}\n  SEARCH ERR {e}\n")
