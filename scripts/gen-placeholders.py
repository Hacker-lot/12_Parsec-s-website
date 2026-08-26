"""One-off: generate 8 storm placeholder photos + techno album cover."""
import math
import random
from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H = 900, 675
GREEN = (0, 255, 102)
PAPER = (255, 248, 231)
INK = (13, 13, 13)

F_TITLE = ImageFont.truetype("C:/Windows/Fonts/impact.ttf", 210)
F_MONO = ImageFont.truetype("C:/Windows/Fonts/courbd.ttf", 26)
F_MONO_S = ImageFont.truetype("C:/Windows/Fonts/courbd.ttf", 18)


def grain(img, amount=14, seed=0):
    rnd = random.Random(seed)
    px = img.load()
    w, h = img.size
    for y in range(0, h, 1):
        for x in range(0, w, 1):
            n = rnd.randint(-amount, amount)
            r, g, b = px[x, y][:3]
            px[x, y] = (max(0, min(255, r + n)), max(0, min(255, g + n)), max(0, min(255, b + n)))
    return img


def vignette(img, strength=0.55):
    w, h = img.size
    mask = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(mask)
    d.ellipse([-w * 0.35, -h * 0.35, w * 1.35, h * 1.35], fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(120))
    black = Image.new("RGB", (w, h), (0, 0, 0))
    return Image.composite(img, black, mask.point(lambda v: 255 - int((255 - v) * strength)))


def scanlines(img, gap=4, alpha=22):
    w, h = img.size
    overlay = Image.new("RGB", (w, h), (0, 0, 0))
    d = ImageDraw.Draw(overlay)
    for y in range(0, h, gap):
        d.line([(0, y), (w, y)], fill=(0, 0, 0))
    return Image.blend(img, overlay, alpha / 255.0)


def sky_gradient(top, bottom):
    img = Image.new("RGB", (W, H))
    d = ImageDraw.Draw(img)
    for y in range(H):
        t = y / H
        c = tuple(int(top[i] + (bottom[i] - top[i]) * t) for i in range(3))
        d.line([(0, y), (W, y)], fill=c)
    return img


def mountains(d, horizon, color, seed, rough=40):
    rnd = random.Random(seed)
    pts = [(0, H)]
    x = 0
    while x <= W:
        pts.append((x, horizon + rnd.randint(-rough, rough)))
        x += rnd.randint(30, 90)
    pts.append((W, H))
    d.polygon(pts, fill=color)


def photo(i):
    rnd = random.Random(1000 + i)
    style = i % 4
    if style == 0:  # green night horizon + moon
        img = sky_gradient((2, 12, 6), (10, 60, 30))
        d = ImageDraw.Draw(img)
        mx, mr = rnd.randint(200, 700), rnd.randint(50, 90)
        my = rnd.randint(120, 240)
        d.ellipse([mx - mr, my - mr, mx + mr, my + mr], fill=(190, 255, 210))
        d.ellipse([mx - mr + 14, my - mr - 8, mx + mr - 10, my + mr - 20], fill=(150, 230, 180))
        mountains(d, rnd.randint(380, 460), (4, 22, 11), seed=i)
        mountains(d, rnd.randint(470, 540), (1, 8, 4), seed=i + 50)
    elif style == 1:  # paper desert / negative dunes
        img = sky_gradient((232, 226, 205), (168, 163, 140))
        d = ImageDraw.Draw(img)
        sx, sr = rnd.randint(150, 750), rnd.randint(40, 70)
        sy = rnd.randint(110, 200)
        d.ellipse([sx - sr, sy - sr, sx + sr, sy + sr], outline=INK, width=6)
        mountains(d, rnd.randint(360, 430), (60, 60, 55), seed=i, rough=26)
        mountains(d, rnd.randint(450, 520), (20, 22, 18), seed=i + 70, rough=34)
    elif style == 2:  # city blocks at night
        img = sky_gradient((3, 6, 10), (16, 30, 22))
        d = ImageDraw.Draw(img)
        x = -10
        while x < W:
            bw = rnd.randint(50, 130)
            bh = rnd.randint(160, 480)
            d.rectangle([x, H - bh, x + bw, H], fill=(5, 10, 7), outline=(20, 40, 26))
            for wy in range(H - bh + 18, H - 14, 26):
                for wx in range(x + 10, x + bw - 12, 22):
                    if rnd.random() < 0.32:
                        col = GREEN if rnd.random() < 0.6 else PAPER
                        d.rectangle([wx, wy, wx + 8, wy + 10], fill=col)
            x += bw + rnd.randint(6, 26)
    else:  # light beams on black
        img = Image.new("RGB", (W, H), (4, 6, 5))
        d = ImageDraw.Draw(img)
        for b in range(rnd.randint(4, 7)):
            bx = rnd.randint(-100, W)
            col = GREEN if b % 2 == 0 else PAPER
            d.polygon([(bx, H), (bx + rnd.randint(140, 320), 0), (bx + rnd.randint(340, 520), 0), (bx + rnd.randint(60, 160), H)], fill=col)
        img = img.filter(ImageFilter.GaussianBlur(6))
        d = ImageDraw.Draw(img)
        d.ellipse([W * 0.42, H * 0.34, W * 0.58, H * 0.62], outline=PAPER, width=4)
    img = scanlines(img, gap=4, alpha=18)
    img = vignette(img)
    img = grain(img, amount=12, seed=i * 7)
    return img


def cover():
    S = 1200
    img = Image.new("RGB", (S, S), INK)
    d = ImageDraw.Draw(img)
    rnd = random.Random(66)

    # off-center concentric rings
    cx, cy = int(S * 0.64), int(S * 0.38)
    for r in range(80, 900, 46):
        wdt = 10 if r % 138 < 46 else 3
        d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(0, 140 + rnd.randint(0, 90), 60), width=wdt)

    # waveform bars across the middle
    base = int(S * 0.60)
    x = 60
    while x < S - 60:
        amp = rnd.randint(24, 210)
        wdt = rnd.choice([6, 10, 14])
        d.rectangle([x, base - amp, x + wdt, base + amp], fill=GREEN if rnd.random() < 0.82 else PAPER)
        x += wdt + rnd.randint(6, 14)

    # type
    d.rectangle([56, 56, 560, 116], outline=PAPER, width=3)
    d.text((76, 70), "12_PARSEC STUDIO", font=F_MONO, fill=PAPER)
    d.text((52, S - 420), "THEME", font=F_TITLE, fill=PAPER)
    d.text((60, S - 190), "SIDE A // 66 4210", font=F_MONO, fill=GREEN)
    d.text((60, S - 150), "TECHNO FROM THE EYE OF THE STORM", font=F_MONO_S, fill=(120, 120, 120))
    d.rectangle([S - 236, S - 150, S - 60, S - 60], outline=GREEN, width=3)
    d.text((S - 214, S - 128), "33⅓", font=F_MONO, fill=GREEN)

    img = scanlines(img.resize((S, S)), gap=5, alpha=16)
    img = grain(img, amount=10, seed=66)
    return img


if __name__ == "__main__":
    for i in range(17, 25):
        photo(i).save(f"src/assets/images/photo-{i}.jpg", quality=88)
        print(f"photo-{i}.jpg")
    cover().save("src/assets/covers/theme-cover.jpg", quality=88)
    print("theme-cover.jpg")
