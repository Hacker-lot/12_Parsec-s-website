"""One-off: synthesize 4 local radio loops + their sleeves (pure stdlib)."""
import math
import random
import struct
import wave
from PIL import Image, ImageDraw, ImageFilter, ImageFont

SR = 22050
OUT = "src/assets/audio"

F_TITLE = ImageFont.truetype("C:/Windows/Fonts/impact.ttf", 170)
F_MONO = ImageFont.truetype("C:/Windows/Fonts/courbd.ttf", 26)
F_MONO_S = ImageFont.truetype("C:/Windows/Fonts/courbd.ttf", 18)
GREEN = (0, 255, 102)
PAPER = (255, 248, 231)
INK = (13, 13, 13)

# ---------------- synth primitives ----------------

def env_exp(length, decay):
    return [math.exp(-decay * i / length) for i in range(length)]

def kick(dur=0.22):
    n = int(SR * dur)
    e = env_exp(n, 5.0)
    out = []
    phase = 0.0
    for i in range(n):
        t = i / SR
        f = 150 - 100 * (i / n)  # pitch drop
        phase += 2 * math.pi * f / SR
        out.append(math.sin(phase) * e[i])
    return out

def hat(dur=0.05, decay=18.0):
    rnd = random.Random(7)
    n = int(SR * dur)
    e = env_exp(n, decay)
    return [rnd.uniform(-1, 1) * e[i] for i in range(n)]

def snare(dur=0.16):
    rnd = random.Random(11)
    n = int(SR * dur)
    e = env_exp(n, 7.0)
    return [(rnd.uniform(-0.7, 0.7) + 0.5 * math.sin(2 * math.pi * 190 * i / SR)) * e[i] for i in range(n)]

def tone(freq, dur, shape="saw", vol=0.5, detune=0.0):
    n = int(SR * dur)
    out = []
    for i in range(n):
        t = i / SR
        f = freq * (1 + detune * math.sin(2 * math.pi * 0.7 * t))
        ph = (t * f) % 1.0
        if shape == "saw":
            v = 2 * ph - 1
        elif shape == "square":
            v = 1.0 if ph < 0.5 else -1.0
        elif shape == "tri":
            v = 4 * abs(ph - 0.5) - 1
        else:
            v = math.sin(2 * math.pi * ph)
        out.append(v * vol)
    return out

def pad(freq, dur, vol=0.24):
    n = int(SR * dur)
    attack = int(n * 0.3)
    out = [0.0] * n
    for det in (-0.004, 0.0, 0.004):
        s = tone(freq * (1 + det), dur, "sine", vol)
        out = [a + b for a, b in zip(out, s)]
    for i in range(n):
        a = i / attack if i < attack else 1.0
        r = 1.0 - max(0.0, (i - (n - attack)) / attack) if i > n - attack else 1.0
        out[i] *= min(a, r)
    return out

def mix_into(track, sig, at_sample, vol=1.0):
    end = min(len(track), at_sample + len(sig))
    for i in range(at_sample, end):
        track[i] += sig[i - at_sample] * vol

def save_wav(name, samples):
    peak = max(1e-6, max(abs(s) for s in samples))
    gain = 0.82 / peak
    with wave.open(f"{OUT}/{name}", "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(b"".join(struct.pack("<h", int(max(-1, min(1, s * gain)) * 32767)) for s in samples))
    print(name, f"{len(samples) / SR:.1f}s")

NOTE = lambda semis_from_a2: 110.0 * 2 ** (semis_from_a2 / 12)  # A2 = 110Hz

# ---------------- track 1: motorik techno, 128 BPM, E minor ----------------

def motorik():
    bpm = 128
    beat = 60 / bpm
    bars = 16
    total = int(SR * beat * 4 * bars)
    t = [0.0] * total
    riff = [0, 0, 3, 0, 5, 0, -2, 0, 0, 0, 3, 5, 7, 5, 3, -2]  # 16ths, semis vs E2
    k, h = kick(), hat()
    for bar in range(bars):
        base = int(bar * 4 * beat * SR)
        for b in range(4):  # four on the floor
            mix_into(t, k, base + int(b * beat * SR), 0.95)
            mix_into(t, h, base + int((b + 0.5) * beat * SR), 0.35)
        for s in range(16):  # driving 16th bass
            f = NOTE(-12 + riff[s]) * 0.5  # E1 register
            seg = tone(f, beat / 4, "saw", 0.22)
            mix_into(t, seg, base + int(s * beat / 4 * SR), 0.8)
    return t

# ---------------- track 2: ambient pads, Cmaj9 ----------------

def static_lullaby():
    dur = 40
    total = int(SR * dur)
    t = [0.0] * total
    chords = [
        [130.8, 164.8, 196.0, 293.7, 493.9],  # Cmaj9
        [110.0, 164.8, 220.0, 261.6, 392.0],  # Am9-ish
        [87.3, 130.8, 174.6, 261.6, 349.2],   # Fmaj7-ish
        [98.0, 146.8, 196.0, 246.9, 392.0],   # G add
    ]
    seg = dur / len(chords)
    for ci, chord in enumerate(chords):
        for f in chord:
            mix_into(t, pad(f, seg + 1.5, 0.16), int(ci * seg * SR), 1.0)
    # slow noise swell
    rnd = random.Random(3)
    n = int(SR * 8)
    e = env_exp(n, 2.2)
    swell = [rnd.uniform(-0.4, 0.4) * e[i] for i in range(n)]
    for pos in (4, 18, 30):
        mix_into(t, swell, int(pos * SR), 0.12)
    return t

# ---------------- track 3: chiptune, 140 BPM, A minor ----------------

def pixel_rodeo():
    bpm = 140
    beat = 60 / bpm
    bars = 16
    total = int(SR * beat * 4 * bars)
    t = [0.0] * total
    melody = [12, 15, 19, 24, 22, 19, 15, 17, 12, 15, 19, 22, 20, 19, 15, 12]  # 8ths, semis vs A3
    bassline = [0, -4, 3, -5]  # roots per bar vs A2
    h = hat(0.04, 22.0)
    for bar in range(bars):
        base = int(bar * 4 * beat * SR)
        for s in range(8):  # 8th-note square lead
            f = NOTE(melody[(bar * 8 + s) % len(melody)] + 12)
            seg = tone(f, beat / 2, "square", 0.16)
            mix_into(t, seg, base + int(s * beat / 2 * SR), 0.9)
        f = NOTE(bassline[bar % 4] - 12)
        mix_into(t, tone(f, beat * 3.6, "tri", 0.3), base, 1.0)
        for b in range(4):
            mix_into(t, h, base + int((b + 0.5) * beat * SR), 0.3)
    return t

# ---------------- track 4: synthwave, 110 BPM, D minor ----------------

def night_drive():
    bpm = 110
    beat = 60 / bpm
    bars = 16
    total = int(SR * beat * 4 * bars)
    t = [0.0] * total
    k, h, s = kick(), hat(), snare()
    bass_notes = [-2, -2, 1, -4]  # per bar vs D2
    for bar in range(bars):
        base = int(bar * 4 * beat * SR)
        for b in range(4):
            mix_into(t, k, base + int(b * beat * SR), 0.9)
            mix_into(t, h, base + int((b + 0.5) * beat * SR), 0.3)
        mix_into(t, s, base + int(1 * beat * SR), 0.5)
        mix_into(t, s, base + int(3 * beat * SR), 0.5)
        for e in range(8):  # 8th-note saw bass
            f = NOTE(bass_notes[bar % 4] - 24) * 2
            seg = tone(f, beat / 2, "saw", 0.2)
            mix_into(t, seg, base + int(e * beat / 2 * SR), 0.85)
        if bar % 2 == 0:  # pad stab on the downbeat
            for f in (146.8, 174.6, 220.0):
                mix_into(t, pad(f, beat * 1.6, 0.1), base, 0.9)
    return t

# ---------------- sleeves ----------------

def grain(img, amount=10, seed=0):
    rnd = random.Random(seed)
    px = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            n = rnd.randint(-amount, amount)
            r, g, b = px[x, y][:3]
            px[x, y] = (max(0, min(255, r + n)), max(0, min(255, g + n)), max(0, min(255, b + n)))
    return img

def sleeve(title, genre, motif, seed):
    S = 1200
    img = Image.new("RGB", (S, S), INK)
    d = ImageDraw.Draw(img)
    rnd = random.Random(seed)
    if motif == "speed":  # horizontal speed lines + ring
        for _ in range(90):
            y = rnd.randint(0, S)
            ln = rnd.randint(60, 500)
            x = rnd.randint(-50, S)
            d.line([(x, y), (x + ln, y)], fill=(0, rnd.randint(90, 255), 60), width=rnd.choice([2, 3, 6]))
        d.ellipse([S * 0.3, S * 0.24, S * 0.74, S * 0.6], outline=PAPER, width=10)
    elif motif == "stars":  # sparse stars + soft moon
        for _ in range(240):
            x, y = rnd.randint(0, S), rnd.randint(0, S)
            r = rnd.choice([1, 1, 2, 3])
            d.ellipse([x - r, y - r, x + r, y + r], fill=(120, 200, 150) if rnd.random() < 0.6 else PAPER)
        d.ellipse([S * 0.55, S * 0.16, S * 0.85, S * 0.41], fill=(30, 60, 40), outline=GREEN, width=6)
    elif motif == "pixels":  # chunky pixel blocks
        cell = 60
        for gy in range(0, S // cell):
            for gx in range(0, S // cell):
                if rnd.random() < 0.16:
                    col = GREEN if rnd.random() < 0.7 else PAPER
                    d.rectangle([gx * cell, gy * cell, gx * cell + cell - 8, gy * cell + cell - 8], fill=col)
    else:  # horizon grid
        hz = int(S * 0.55)
        for i in range(14):  # perspective lines
            x = S / 2 + (i - 7) * 60
            d.line([(x, hz), (S / 2 + (i - 7) * 320, S)], fill=(0, 160, 70), width=3)
        y = hz
        step = 10
        while y < S:
            d.line([(0, y), (S, y)], fill=(0, 160, 70), width=2)
            y += step
            step = int(step * 1.5)
        d.ellipse([S * 0.36, hz - 190, S * 0.64, hz + 90], fill=(0, 90, 40), outline=GREEN, width=6)
    d.rectangle([56, 56, 620, 116], outline=PAPER, width=3)
    d.text((76, 70), "12_PARSEC RADIO", font=F_MONO, fill=PAPER)
    d.text((52, S - 400), title, font=F_TITLE, fill=PAPER)
    d.text((60, S - 190), genre, font=F_MONO, fill=GREEN)
    d.text((60, S - 150), "LOCAL SIGNAL // SYNTHESIZED ON AIR", font=F_MONO_S, fill=(120, 120, 120))
    img = grain(img, seed=seed)
    img.save(f"src/assets/covers/radio-{motif}.jpg", quality=88)
    print(f"radio-{motif}.jpg")

# sleeves for the embed rotation (NetEase outchain playback)
EMBED_SLEEVES = [
    ("dramamine", "DRAMAMINE", "FLAWED MANGOES", "GUITAR AMBIENT", "stars", 501),
    ("lobster", "LOBSTER 2.0", "RJ PASIN & WESGHOST", "GUITAR BEATS", "speed", 502),
    ("ricefields", "RICE FIELDS", "CORN WAVE", "POST-PUNK", "pixels", 503),
    ("evening", "EVENING", "CORN WAVE", "POST-PUNK", "grid", 504),
    ("wind", "WIND IN HER HAIR", "MOTORAMA", "POST-PUNK", "speed", 505),
    ("sudno", "SUDNO", "MOLCHAT DOMA", "COLDWAVE", "stars", 506),
    ("wonderwall", "WONDERWALL", "OASIS", "BRITPOP", "grid", 507),
    ("anger", "DON'T LOOK BACK IN ANGER", "OASIS", "BRITPOP", "pixels", 508),
    ("friday", "FRIDAY I'M IN LOVE", "THE CURE", "POP", "speed", 509),
    ("creep", "CREEP", "RADIOHEAD", "ALT ROCK", "stars", 510),
    ("karma", "KARMA POLICE", "RADIOHEAD", "ALT ROCK", "grid", 511),
    ("cars", "CHASING CARS", "SNOW PATROL", "ALT ROCK", "pixels", 512),
    ("imagine", "IMAGINE", "JOHN LENNON", "ROCK", "stars", 513),
    ("stairway", "STAIRWAY TO HEAVEN", "LED ZEPPELIN", "ROCK", "grid", 514),
    ("immigrant", "IMMIGRANT SONG", "LED ZEPPELIN", "ROCK", "speed", 515),
    ("otherside", "OTHERSIDE", "RED HOT CHILI PEPPERS", "ROCK", "pixels", 516),
    ("snow", "SNOW (HEY OH)", "RED HOT CHILI PEPPERS", "ROCK", "stars", 517),
]

def embed_sleeve(slug, title, artist, genre, motif, seed):
    S = 1200
    img = Image.new("RGB", (S, S), INK)
    d = ImageDraw.Draw(img)
    rnd = random.Random(seed)
    if motif == "speed":
        for _ in range(90):
            y = rnd.randint(0, S)
            ln = rnd.randint(60, 500)
            x = rnd.randint(-50, S)
            d.line([(x, y), (x + ln, y)], fill=(0, rnd.randint(90, 255), 60), width=rnd.choice([2, 3, 6]))
        d.ellipse([S * 0.3, S * 0.24, S * 0.74, S * 0.6], outline=PAPER, width=10)
    elif motif == "stars":
        for _ in range(240):
            x, y = rnd.randint(0, S), rnd.randint(0, S)
            r = rnd.choice([1, 1, 2, 3])
            d.ellipse([x - r, y - r, x + r, y + r], fill=(120, 200, 150) if rnd.random() < 0.6 else PAPER)
        d.ellipse([S * 0.55, S * 0.16, S * 0.85, S * 0.41], fill=(30, 60, 40), outline=GREEN, width=6)
    elif motif == "pixels":
        cell = 60
        for gy in range(0, S // cell):
            for gx in range(0, S // cell):
                if rnd.random() < 0.16:
                    col = GREEN if rnd.random() < 0.7 else PAPER
                    d.rectangle([gx * cell, gy * cell, gx * cell + cell - 8, gy * cell + cell - 8], fill=col)
    else:
        hz = int(S * 0.55)
        for i in range(14):
            x = S / 2 + (i - 7) * 60
            d.line([(x, hz), (S / 2 + (i - 7) * 320, S)], fill=(0, 160, 70), width=3)
        y = hz
        step = 10
        while y < S:
            d.line([(0, y), (S, y)], fill=(0, 160, 70), width=2)
            y += step
            step = int(step * 1.5)
        d.ellipse([S * 0.36, hz - 190, S * 0.64, hz + 90], fill=(0, 90, 40), outline=GREEN, width=6)
    d.rectangle([56, 56, 620, 116], outline=PAPER, width=3)
    d.text((76, 70), "12_PARSEC RADIO", font=F_MONO, fill=PAPER)
    # shrink the title until it fits one line
    size = 170
    font = F_TITLE
    while d.textlength(title, font=font) > S - 120 and size > 60:
        size -= 10
        font = ImageFont.truetype("C:/Windows/Fonts/impact.ttf", size)
    d.text((52, S - 420), title, font=font, fill=PAPER)
    d.text((60, S - 210), artist, font=F_MONO, fill=GREEN)
    d.text((60, S - 170), genre + " // NETEASE BROADCAST", font=F_MONO_S, fill=(120, 120, 120))
    img = grain(img, seed=seed)
    img.save(f"src/assets/covers/emb-{slug}.jpg", quality=88)
    print(f"emb-{slug}.jpg")

if __name__ == "__main__":
    import sys
    if "--sleeves-only" in sys.argv:
        for args in EMBED_SLEEVES:
            embed_sleeve(*args)
    else:
        save_wav("radio-motorik.wav", motorik())
        save_wav("radio-lullaby.wav", static_lullaby())
        save_wav("pixel-rodeo.wav", pixel_rodeo())
        save_wav("night-drive.wav", night_drive())
        sleeve("MOTORIK TRANSMISSION", "MOTORIK // 128 BPM", "speed", 101)
        sleeve("STATIC LULLABY", "AMBIENT // DRIFT", "stars", 202)
        sleeve("PIXEL RODEO", "CHIPTUNE // 140 BPM", "pixels", 303)
        sleeve("NIGHT DRIVE RADIO", "SYNTHWAVE // 110 BPM", "grid", 404)
        for args in EMBED_SLEEVES:
            embed_sleeve(*args)
