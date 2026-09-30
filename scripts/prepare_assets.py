"""Fetch and prepare the company-owned source images used by the remaster.

Sources are the public uploads of https://ccoverath.de/ (read-only). The script is
idempotent: downloads are cached in .asset-cache/ and outputs are overwritten.

Outputs
- src/assets/images/*      originals for astro:assets (AVIF/WebP + srcset at build time)
- src/assets/logos/*       brand/partner logos (transparent PNG/WebP)
- public/tour/*.jpg        360° panoramas, downscaled to 4096x2048 (mobile GPU limit)
- public/tour/thumbs/*.jpg small scene previews
- public/favicon-*.png, public/apple-touch-icon.png, public/og-default.jpg
"""

from __future__ import annotations

import concurrent.futures as cf
import os
import sys
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
CACHE = ROOT / ".asset-cache"
UPLOADS = "https://ccoverath.de/wp-content/uploads/"
UA = {"User-Agent": "Mozilla/5.0 (Campingcenter Overath remaster asset prep)"}

IMAGES = {
    "hero-sunset.webp": "2025/04/wohnmobil-verkauf-gebraucht.webp",
    "hero-sunset-alt.jpg": "2021/01/eyecatcher_sunset.jpg",
    "challenger-bridge.webp": "2023/11/cco_home_eyecatcher.webp",
    "road-landscape.jpg": "2021/02/werkstatt_header-scaled.jpg",
    "lake-motorhomes.webp": "2025/01/anschlussversicherung2.webp",
    "showroom-used.webp": "2025/04/gebrauchte_wohnmobile_ausstellung.webp",
    "team.jpg": "2021/06/Teambild.jpg",
    "team-wide.jpg": "2021/04/cco_teamfoto_1920x1080.jpg",
    "panorama-yard.jpg": "2021/04/reisemobile_header_3.jpg",
    "tour-header.jpg": "2021/04/360grad_header.jpg",
    "handshake.jpg": "2020/11/partner_cco_web.jpg",
    "forest-relax.png": "2020/11/cco_angebote.png",
    "ankauf-owner.webp": "2025/05/header_wohnmobil_ankauf.webp",
    "ankauf-couple.webp": "2025/05/wohnmobil_ankauf.webp",
    "australia-route.webp": "2023/11/australien_route.webp",
    "rental-header.webp": "2026/04/vermietung_header-5.webp",
    "rental-advisor.webp": "2024/06/lisa.webp",
    "sales-advisor.webp": "2024/06/timm-wulff.webp",
    "rental-fleet.jpg": "2021/02/vermietung_mietfahrzeuge_ccoverath.jpg",
    "bike-rack.jpg": "2021/02/werkstatt_gepaecktraeger.jpg",
    "workshop-interior.jpg": "2021/02/werkstatt_kundendienst-innenausbau-1.jpg",
    "workshop-check-1.jpg": "2021/02/werkstatt_kundendienst_sicherheitscheck-1.jpg",
    "workshop-check-2.jpg": "2021/02/werkstatt_kundendienst_sicherheitscheck-2.jpg",
    "wash-result.webp": "2026/08/Vorher_Nachher.webp",
    "panama-orange.webp": "2024/03/panama06-scaled.webp",
    "panama-wide.webp": "2024/02/panama_van_fhd-scaled.webp",
    "panama-sea.webp": "2024/02/panama_meer.webp",
    "panama-lifestyle-1.webp": "2024/03/panama02.webp",
    "panama-lifestyle-2.webp": "2024/03/panama03.webp",
    "panama-lifestyle-3.webp": "2024/03/panama05.webp",
    "panama-lifestyle-4.webp": "2024/03/panama07.webp",
    "panama-lifestyle-5.webp": "2024/02/lachen_fhd.webp",
    "panama-peak-1.webp": "2024/03/peak01.webp",
    "panama-peak-2.webp": "2024/03/peak02.webp",
    "panama-peak-3.webp": "2024/03/peak01-1.webp",
    "panama-urban-1.webp": "2024/03/urban01.webp",
    "panama-urban-2.webp": "2024/03/urban02.webp",
    "panama-urban-3.webp": "2024/03/urban03.webp",
    "type-alkoven.webp": "2024/11/reisemopbile_alkoven_2.webp",
    "type-teilintegriert.webp": "2024/11/reisemopbile_teilintegriert.webp",
    "type-vollintegriert.webp": "2024/11/reisemopbile_vollintegriert.webp",
    "type-kastenwagen.webp": "2024/11/reisemopbile_kastenwagen.webp",
    "type-van.webp": "2024/11/reisemopbile_van.webp",
}

LOGOS = {
    "eura-mobil.png": "2020/11/eura_mobil.png",
    "knaus.png": "2020/11/knaus-logo.png",
    "la-strada.png": "2020/11/la_strada_reisemobile.png",
    "panama.png": "2023/05/Logo-Panama-300.png",
    "challenger.webp": "2024/09/challenger.webp",
    "rmv.png": "2021/02/RMV-Logo.png",
    "buettner.png": "2020/11/buettner_logo.png",
    "reich.png": "2020/11/reich_logo.png",
    "alden.png": "2020/11/alden_logo.png",
    "cco-logo.png": "2020/11/Logo_End_CCO.png",
}

# Mitred tent stroke in a 100x100 box (same geometry as src/components/brand/Emblem.astro).
TENT_POLYGON = [(3.4, 120), (47.5, 23), (98.9, 120), (87.4, 120), (47.5, 47), (16.1, 120)]

PANOS = ["0005", "0006", "0009", "0012", "0014", "0017", "0018", "0020", "0022", "0024", "0026", "0028", "0031"]


def fetch(rel: str) -> Path:
    dst = CACHE / rel.replace("/", "_")
    if dst.exists() and dst.stat().st_size > 0:
        return dst
    dst.parent.mkdir(parents=True, exist_ok=True)
    with urllib.request.urlopen(urllib.request.Request(UPLOADS + rel, headers=UA), timeout=90) as r:
        dst.write_bytes(r.read())
    return dst


# Poster frames of the company's own YouTube videos, self-hosted so that nothing is
# requested from Google before the visitor consents to external media.
YOUTUBE = ["eTog12HJsE0", "MQLUVc4_rEw", "I_xTKmybkWY"]


def fetch_youtube_poster(video_id: str) -> Path:
    dst = CACHE / f"yt-{video_id}.jpg"
    if dst.exists() and dst.stat().st_size > 0:
        return dst
    for name in ("maxresdefault.jpg", "sddefault.jpg", "hqdefault.jpg"):
        try:
            req = urllib.request.Request(f"https://i.ytimg.com/vi/{video_id}/{name}", headers=UA)
            with urllib.request.urlopen(req, timeout=60) as r:
                dst.write_bytes(r.read())
            return dst
        except Exception:  # noqa: BLE001 - try next resolution
            continue
    raise RuntimeError(f"no poster for {video_id}")


def trim(path: Path, pad: int = 6) -> None:
    """Crop uniform white/transparent margins so logos can be sized consistently."""
    im = Image.open(path)
    rgba = im.convert("RGBA")
    bg = Image.new("RGBA", rgba.size, (255, 255, 255, 255))
    flat = Image.alpha_composite(bg, rgba).convert("L")
    mask = flat.point(lambda p: 255 if p < 245 else 0)
    box = mask.getbbox()
    if not box:
        return
    l, t, r, b = box
    box = (max(0, l - pad), max(0, t - pad), min(im.width, r + pad), min(im.height, b + pad))
    cropped = im.crop(box)
    if path.suffix.lower() == ".webp":
        cropped.save(path, quality=90, method=6)
    else:
        cropped.save(path, optimize=True)


def copy_to(src: Path, dst: Path, max_w: int = 2560) -> None:
    dst.parent.mkdir(parents=True, exist_ok=True)
    im = Image.open(src)
    if im.mode == "P":
        im = im.convert("RGBA")
    if im.width > max_w:
        im = im.resize((max_w, round(im.height * max_w / im.width)), Image.LANCZOS)
    ext = dst.suffix.lower()
    if ext in (".jpg", ".jpeg"):
        im.convert("RGB").save(dst, quality=90, optimize=True, progressive=True)
    elif ext == ".webp":
        im.save(dst, quality=90, method=6)
    else:
        im.save(dst, optimize=True)


def emblem(size: int, bg: tuple[int, int, int, int] | None) -> Image.Image:
    """Render the CCO emblem (orange disc, white tent stroke, white sun) at any size."""
    s = size * 4
    im = Image.new("RGBA", (s, s), bg or (0, 0, 0, 0))
    disc = Image.new("L", (s, s), 0)
    ImageDraw.Draw(disc).ellipse((0, 0, s - 1, s - 1), fill=255)
    layer = Image.new("RGBA", (s, s), (208, 129, 21, 255))
    d = ImageDraw.Draw(layer)
    u = s / 100
    d.polygon([(p[0] * u, p[1] * u) for p in TENT_POLYGON], fill="white")
    d.ellipse(((78 - 8.5) * u, (30 - 8.5) * u, (78 + 8.5) * u, (30 + 8.5) * u), fill="white")
    im.paste(layer, (0, 0), disc)
    return im.resize((size, size), Image.LANCZOS)


def build_icons(out: Path) -> None:
    ivory = (247, 243, 236, 255)
    emblem(32, None).save(out / "favicon-32.png")
    emblem(192, None).save(out / "icon-192.png")
    emblem(512, None).save(out / "icon-512.png")
    icon = Image.new("RGBA", (180, 180), ivory)
    icon.alpha_composite(emblem(150, None), (15, 15))
    icon.convert("RGB").save(out / "apple-touch-icon.png")


def build_og(out: Path, hero: Path) -> None:
    W, H = 1200, 630
    im = Image.open(hero).convert("RGB")
    scale = max(W / im.width, H / im.height)
    im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
    left = (im.width - W) // 2
    top = (im.height - H) // 2
    im = im.crop((left, top, left + W, top + H)).convert("RGBA")
    shade = Image.new("L", (W, H))
    sd = ImageDraw.Draw(shade)
    for x in range(W):
        sd.line([(x, 0), (x, H)], fill=int(200 * max(0, 1 - x / (W * 0.85))))
    dark = Image.new("RGBA", (W, H), (20, 23, 26, 255))
    im = Image.composite(dark, im, shade.filter(ImageFilter.GaussianBlur(4)))
    im.alpha_composite(emblem(96, None), (72, 72))

    def font(name: str, size: int) -> ImageFont.FreeTypeFont:
        for cand in [name, "C:/Windows/Fonts/segoeuib.ttf", "C:/Windows/Fonts/arialbd.ttf", "DejaVuSans-Bold.ttf"]:
            try:
                return ImageFont.truetype(cand, size)
            except OSError:
                continue
        return ImageFont.load_default()

    d = ImageDraw.Draw(im)
    d.text((72, 300), "Dein Abenteuer", font=font("C:/Windows/Fonts/georgiab.ttf", 72), fill="white")
    d.text((72, 382), "beginnt hier.", font=font("C:/Windows/Fonts/georgiab.ttf", 72), fill="white")
    d.text((72, 492), "Campingcenter Overath · Kaufen · Mieten · Werkstatt", font=font("C:/Windows/Fonts/segoeui.ttf", 30), fill=(233, 225, 211))
    im.convert("RGB").save(out / "og-default.jpg", quality=86, optimize=True, progressive=True)


def main() -> int:
    CACHE.mkdir(exist_ok=True)
    jobs = list(IMAGES.values()) + list(LOGOS.values()) + [f"360grad/cco_r001{n}.jpg" for n in PANOS]
    with cf.ThreadPoolExecutor(8) as ex:
        list(ex.map(fetch, jobs))

    for name, rel in IMAGES.items():
        copy_to(fetch(rel), ROOT / "src/assets/images" / name)
    for name, rel in LOGOS.items():
        dst = ROOT / "src/assets/logos" / name
        copy_to(fetch(rel), dst, max_w=1200)
        trim(dst)
    for vid in YOUTUBE:
        copy_to(fetch_youtube_poster(vid), ROOT / "src/assets/images" / f"yt-{vid}.jpg", max_w=1280)

    tour = ROOT / "public/tour"
    (tour / "thumbs").mkdir(parents=True, exist_ok=True)
    for n in PANOS:
        im = Image.open(fetch(f"360grad/cco_r001{n}.jpg")).convert("RGB")
        full = im.resize((4096, 2048), Image.LANCZOS) if im.width > 4096 else im
        full.save(tour / f"scene-{n}.jpg", quality=78, optimize=True, progressive=True)
        w, h = im.size
        thumb = im.crop((int(w * 0.30), int(h * 0.30), int(w * 0.70), int(h * 0.62))).resize((480, 270), Image.LANCZOS)
        thumb.save(tour / "thumbs" / f"scene-{n}.jpg", quality=72, optimize=True, progressive=True)

    build_icons(ROOT / "public")
    build_og(ROOT / "public", fetch(IMAGES["hero-sunset.webp"]))
    print("assets ready")
    return 0


if __name__ == "__main__":
    sys.exit(main())
