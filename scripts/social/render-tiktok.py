"""Render the Talus Field TikTok spot: 1080x1920, 30fps, ~17s.

Slow pans over the site's own Unsplash-licensed Yosemite photographs, one
caption per shot, and an end card with the URL. Pure Pillow frames piped into
the ffmpeg binary that ships with imageio-ffmpeg, so nothing is needed beyond:

    pip install pillow numpy imageio-ffmpeg fonttools brotli
    python3 scripts/social/render-tiktok.py

Output: docs/social/talus-field-tiktok.mp4 (docs/ is excluded from the asset
upload by .assetsignore, so the file never deploys to the site).

Text stays inside TikTok's safe zone: clear of the top ~160px (tabs), the
bottom ~420px (caption and sound bar) and the right ~140px (action rail).
"""

import io
import os
import subprocess
import tempfile

import imageio_ffmpeg
from fontTools.ttLib import TTFont
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
OUT = os.path.join(ROOT, "docs", "social", "talus-field-tiktok.mp4")
W, H, FPS = 1080, 1920, 30
XFADE = 0.45  # seconds of crossfade between shots

PAPER = (244, 238, 224)
RUST = (214, 120, 72)

# Each shot: photo, seconds, pan start/end as (center x, center y, zoom) in
# normalized image coordinates, eyebrow, caption.
SHOTS = [
    ("tunnel-view-autumn-aniket-deole", 3.4, (0.18, 0.5, 1.0), (0.62, 0.48, 1.06),
     "SAVE THIS FOR YOUR TRIP", "Yosemite,\nplanned right."),
    ("half-dome-sunset-glacier-point-joshua-earle", 2.9, (0.5, 0.30, 1.0), (0.5, 0.55, 1.08),
     "GLACIER POINT", "Last light over\nHalf Dome."),
    ("nevada-fall-liberty-cap-ryan-oconnor", 2.9, (0.5, 0.72, 1.08), (0.5, 0.42, 1.0),
     "THE MIST TRAIL", "Nevada Fall and\nLiberty Cap."),
    ("half-dome-meadow-deer-johannes-andersson", 2.9, (0.5, 0.62, 1.12), (0.5, 0.52, 1.0),
     "THE VALLEY FLOOR", "Meadows, deer,\nand granite."),
    ("half-dome-alpenglow-madhu-shesharam", 2.9, (0.42, 0.5, 1.0), (0.60, 0.5, 1.07),
     "ALPENGLOW", "Half Dome\nat dusk."),
    ("valley-view-sunset-rodrigo-soares", 4.6, (0.34, 0.5, 1.0), (0.46, 0.5, 1.06),
     None, None),
]


def ttf(name):
    """woff2 -> in-memory TTF so Pillow can read the site's own fonts."""
    f = TTFont(os.path.join(ROOT, "fonts", name + ".woff2"))
    f.flavor = None
    buf = io.BytesIO()
    f.save(buf)
    return buf.getvalue()


FONT_BYTES = {n: ttf(n) for n in ("inter", "eb-garamond", "eb-garamond-italic")}


def font(name, size, weight=None):
    ft = ImageFont.truetype(io.BytesIO(FONT_BYTES[name]), size)
    if weight is not None:
        try:
            ft.set_variation_by_axes([weight])
        except Exception:
            pass
    return ft


SERIF = font("eb-garamond", 112, 500)
SERIF_END = font("eb-garamond", 96, 500)
ITALIC = font("eb-garamond-italic", 58, 400)
SANS = font("inter", 34, 600)
SANS_SM = font("inter", 38, 500)
SANS_URL = font("inter", 50, 700)


def ease(t):
    return t * t * (3 - 2 * t)


def load(name):
    im = Image.open(os.path.join(ROOT, "img", name + ".jpg")).convert("RGB")
    # Pre-scale once so the frame crop at zoom 1.0 covers the full 1080x1920
    # with a 1.15x margin for the pan; per-frame work is then a crop+resize.
    s = max(W * 1.15 / im.width, H * 1.15 / im.height)
    if s < 1 or im.width * s < 5000:
        im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    return im


def camera(im, t, start, end):
    k = ease(t)
    cx = start[0] + (end[0] - start[0]) * k
    cy = start[1] + (end[1] - start[1]) * k
    z = start[2] + (end[2] - start[2]) * k
    # Largest 9:16 box that fits the image, divided by zoom.
    bh = min(im.height, im.width * H / W) / z
    bw = bh * W / H
    x = min(max(cx * im.width - bw / 2, 0), im.width - bw)
    y = min(max(cy * im.height - bh / 2, 0), im.height - bh)
    return im.resize((W, H), Image.BICUBIC, box=(x, y, x + bw, y + bh))


def shade(top, bottom):
    """Vertical darkening band so white type reads on any sky."""
    g = Image.new("L", (1, H))
    for yy in range(H):
        a = 0
        if yy < top[1]:
            a = top[0] * (1 - yy / top[1])
        if yy > H - bottom[1]:
            a = max(a, bottom[0] * (yy - (H - bottom[1])) / bottom[1])
        g.putpixel((0, yy), int(a))
    return g.resize((W, H))


SHADE = shade((150, 900), (170, 900))
SHADE_END = shade((120, 700), (225, 1400))


def text_layer(draw_fn):
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw_fn(ImageDraw.Draw(layer))
    # Soft drop shadow built from the alpha of the type itself.
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    shadow.putalpha(layer.getchannel("A").point(lambda a: a * 0.55))
    shadow = shadow.filter(ImageFilter.GaussianBlur(10))
    return Image.alpha_composite(shadow, layer)


def fade_in(layer, t, delay, dur=0.35, rise=40):
    """Fade and lift a text layer in, starting `delay` seconds into the shot."""
    p = min(max((t - delay) / dur, 0), 1)
    if p <= 0:
        return None
    p = ease(p)
    out = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    out.paste(layer, (0, int(rise * (1 - p))))
    out.putalpha(out.getchannel("A").point(lambda a: int(a * p)))
    return out


def caption(eyebrow, line):
    def draw(d):
        x, y = 84, 250
        d.rectangle((x, y + 8, x + 56, y + 13), fill=RUST)
        d.text((x + 76, y - 8), eyebrow, font=SANS, fill=PAPER)
        d.multiline_text((x - 4, y + 60), line, font=SERIF, fill=(255, 255, 255), spacing=6)
    return text_layer(draw)


def brand_bug():
    def draw(d):
        d.text((84, 1400), "THE TALUS FIELD", font=SANS, fill=(255, 255, 255, 230))
    return text_layer(draw)


def end_card():
    def draw(d):
        x = 84
        d.rectangle((x, 268, x + 56, 273), fill=RUST)
        d.text((x + 76, 252), "THE TALUS FIELD", font=SANS, fill=PAPER)
        d.multiline_text((x - 4, 320), "Plan your\nYosemite trip.", font=SERIF_END,
                         fill=(255, 255, 255), spacing=4)
        d.text((x, 560), "Before the gate, not at it.", font=ITALIC, fill=PAPER)
        lines = ["Trip-planner map", "Live gate waits and road status",
                 "Field Guide for your phone"]
        for i, s in enumerate(lines):
            yy = 1080 + i * 64
            d.ellipse((x, yy + 16, x + 12, yy + 28), fill=RUST)
            d.text((x + 32, yy), s, font=SANS_SM, fill=(255, 255, 255))
    return text_layer(draw)


def url_plate():
    def draw(d):
        label = "thetalusfieldjournal.com"
        w = d.textlength(label, font=SANS_URL)
        x, y = 84, 1300
        d.rounded_rectangle((x, y, x + w + 72, y + 104), radius=52, fill=PAPER)
        d.text((x + 36, y + 22), label, font=SANS_URL, fill=(28, 52, 40))
    return text_layer(draw)


def main():
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    photos = [load(s[0]) for s in SHOTS]
    caps = [caption(s[4], s[5]) if s[4] else None for s in SHOTS]
    bug, card, url = brand_bug(), end_card(), url_plate()

    starts, t = [], 0.0
    for s in SHOTS:
        starts.append(t)
        t += s[1] - XFADE
    total = t + XFADE
    nframes = int(total * FPS)

    def shot_frame(i, gt):
        name, dur, a, b, _, _ = SHOTS[i]
        lt = gt - starts[i]
        frame = camera(photos[i], lt / dur, a, b).convert("RGBA")
        last = i == len(SHOTS) - 1
        black = Image.new("RGBA", (W, H), (0, 0, 0, 255))
        frame = Image.composite(black, frame, SHADE_END if last else SHADE)
        layers = []
        if caps[i]:
            layers.append(fade_in(caps[i], lt, 0.15 if i else 0.0, 0.3 if i else 0.01))
        if last:
            layers += [fade_in(card, lt, 0.35), fade_in(url, lt, 1.0, 0.4, 24)]
        elif i:
            layers.append(fade_in(bug, lt, 0.25))
        for layer in layers:
            if layer is not None:
                frame = Image.alpha_composite(frame, layer)
        return frame

    ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    tmp = tempfile.NamedTemporaryFile(suffix=".mp4", delete=False).name
    proc = subprocess.Popen([
        ffmpeg, "-y", "-loglevel", "error",
        "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-",
        # Silent stereo track: TikTok handles a video with audio more reliably,
        # and the trending sound is added in the app.
        "-f", "lavfi", "-i", "anullsrc=channel_layout=stereo:sample_rate=44100",
        "-shortest", "-c:v", "libx264", "-preset", "slow", "-crf", "18",
        "-pix_fmt", "yuv420p", "-profile:v", "high", "-c:a", "aac", "-b:a", "128k",
        "-movflags", "+faststart", tmp,
    ], stdin=subprocess.PIPE)

    for f in range(nframes):
        gt = f / FPS
        active = [i for i in range(len(SHOTS)) if starts[i] <= gt < starts[i] + SHOTS[i][1]]
        frame = shot_frame(active[-1], gt)
        if len(active) > 1:
            prev = shot_frame(active[0], gt)
            k = ease((gt - starts[active[-1]]) / XFADE)
            frame = Image.blend(prev, frame, min(k, 1))
        proc.stdin.write(frame.convert("RGB").tobytes())
    proc.stdin.close()
    proc.wait()
    os.replace(tmp, OUT)
    print(f"wrote {OUT} ({total:.1f}s, {nframes} frames)")


if __name__ == "__main__":
    main()
